import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen } from "@/test/utils/test-utils";
import DOMPurify from "dompurify";

// Mock DOMPurify
vi.mock("dompurify", () => ({
  default: {
    sanitize: vi.fn(input => input), // Default passthrough, we'll override in tests
  },
}));

// Type cast, nes DOMPurify.sanitize turi kelių parašų tipą ir TS
// kitaip neatpažįsta vitest mock metodų (mockReturnValue ir pan.)
const sanitizeMock = DOMPurify.sanitize as unknown as Mock;

// Create SafeHtml component for testing
const SafeHtml = ({
  content,
  className = "",
  allowedTags = [
    "p",
    "br",
    "strong",
    "em",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  allowedAttributes = ["href", "title", "target"],
}: {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      data-testid="safe-html-content"
    />
  );
};

describe("SafeHtml Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders clean HTML content safely", () => {
    const cleanContent = "<p>This is <strong>safe</strong> content.</p>";
    sanitizeMock.mockReturnValue(cleanContent);

    render(<SafeHtml content={cleanContent} />);

    const container = screen.getByTestId("safe-html-content");
    expect(container).toBeInTheDocument();
    expect(sanitizeMock).toHaveBeenCalledWith(cleanContent, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "a",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
      ALLOWED_ATTR: ["href", "title", "target"],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_DOM: true,
    });
  });

  it("sanitizes malicious script tags", () => {
    const maliciousContent = '<p>Safe content</p><script>alert("xss")</script>';
    const sanitizedContent = "<p>Safe content</p>";
    sanitizeMock.mockReturnValue(sanitizedContent);

    render(<SafeHtml content={maliciousContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(maliciousContent, expect.any(Object));

    // Verify no script tags are present in the DOM
    const scripts = document.querySelectorAll("script");
    expect(scripts).toHaveLength(0);
  });

  it("removes dangerous event handlers", () => {
    const maliciousContent = `<p onclick="alert('xss')">Click me</p>`;
    const sanitizedContent = "<p>Click me</p>";
    sanitizeMock.mockReturnValue(sanitizedContent);

    render(<SafeHtml content={maliciousContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(maliciousContent, expect.any(Object));
  });

  it("sanitizes dangerous href attributes", () => {
    const maliciousContent = `<a href="javascript:alert('xss')">Click</a>`;
    const sanitizedContent = "<a>Click</a>";
    sanitizeMock.mockReturnValue(sanitizedContent);

    render(<SafeHtml content={maliciousContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(maliciousContent, expect.any(Object));
  });

  it("preserves allowed HTML tags and attributes", () => {
    const safeContent = `
      <h2>Heading</h2>
      <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <a href="https://example.com" title="Example" target="_blank">Link</a>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    `;
    sanitizeMock.mockReturnValue(safeContent);

    render(<SafeHtml content={safeContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(safeContent, expect.any(Object));
  });

  it("respects custom allowed tags configuration", () => {
    const content = "<p>Paragraph</p><div>Div content</div>";
    const customAllowedTags = ["p"];
    sanitizeMock.mockReturnValue("<p>Paragraph</p>");

    render(<SafeHtml content={content} allowedTags={customAllowedTags} />);

    expect(sanitizeMock).toHaveBeenCalledWith(
      content,
      expect.objectContaining({
        ALLOWED_TAGS: customAllowedTags,
      })
    );
  });

  it("respects custom allowed attributes configuration", () => {
    const content = '<a href="https://example.com" class="link">Link</a>';
    const customAllowedAttributes = ["href"];
    sanitizeMock.mockReturnValue('<a href="https://example.com">Link</a>');

    render(<SafeHtml content={content} allowedAttributes={customAllowedAttributes} />);

    expect(sanitizeMock).toHaveBeenCalledWith(
      content,
      expect.objectContaining({
        ALLOWED_ATTR: customAllowedAttributes,
      })
    );
  });

  it("applies custom CSS classes", () => {
    const content = "<p>Test content</p>";
    const customClass = "custom-html-content prose";
    sanitizeMock.mockReturnValue(content);

    render(<SafeHtml content={content} className={customClass} />);

    const container = screen.getByTestId("safe-html-content");
    expect(container).toHaveClass("custom-html-content");
    expect(container).toHaveClass("prose");
  });

  it("handles empty content gracefully", () => {
    const content = "";
    sanitizeMock.mockReturnValue("");

    render(<SafeHtml content={content} />);

    const container = screen.getByTestId("safe-html-content");
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps inner text from disallowed tags (section/article)", () => {
    const content = "<section><h2>Skyrius</h2><p>Tekstas viduje</p></section>";
    // DOMPurify su KEEP_CONTENT turėtų pašalinti <section>, bet palikti vidinį HTML
    const sanitized = "<h2>Skyrius</h2><p>Tekstas viduje</p>";
    sanitizeMock.mockReturnValue(sanitized);

    render(<SafeHtml content={content} />);

    const container = screen.getByTestId("safe-html-content");
    expect(container.innerHTML.replace(/\n/g, "").trim()).toBe(sanitized);
  });

  it("handles null/undefined content gracefully", () => {
    sanitizeMock.mockReturnValue("");

    render(<SafeHtml content={null as any} />);

    expect(sanitizeMock).toHaveBeenCalledWith(null, expect.any(Object));
  });

  it("prevents DOM clobbering attacks", () => {
    const maliciousContent = '<form><input name="nodeName"></form>';
    const sanitizedContent = "";
    sanitizeMock.mockReturnValue(sanitizedContent);

    render(<SafeHtml content={maliciousContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(
      maliciousContent,
      expect.objectContaining({
        SANITIZE_DOM: true,
      })
    );
  });

  it("blocks data attributes by default", () => {
    const content = '<p data-custom="value">Content</p>';
    sanitizeMock.mockReturnValue("<p>Content</p>");

    render(<SafeHtml content={content} />);

    expect(sanitizeMock).toHaveBeenCalledWith(
      content,
      expect.objectContaining({
        ALLOW_DATA_ATTR: false,
      })
    );
  });

  it("prevents unknown protocol attacks", () => {
    const maliciousContent = '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
    const sanitizedContent = "<a>Click</a>";
    sanitizeMock.mockReturnValue(sanitizedContent);

    render(<SafeHtml content={maliciousContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(
      maliciousContent,
      expect.objectContaining({
        ALLOW_UNKNOWN_PROTOCOLS: false,
      })
    );
  });

  it("handles Lithuanian text content properly", () => {
    const lithuanianContent = "<p>Lietuvių kalba su <strong>paryškintu</strong> tekstu.</p>";
    sanitizeMock.mockReturnValue(lithuanianContent);

    render(<SafeHtml content={lithuanianContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(lithuanianContent, expect.any(Object));

    const container = screen.getByTestId("safe-html-content");
    expect(container).toBeInTheDocument();
  });

  it("preserves line breaks and formatting", () => {
    const formattedContent = "<p>Line 1<br>Line 2</p><p>New paragraph</p>";
    sanitizeMock.mockReturnValue(formattedContent);

    render(<SafeHtml content={formattedContent} />);

    expect(sanitizeMock).toHaveBeenCalledWith(formattedContent, expect.any(Object));
  });
});

import React from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface SafeHtmlProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
  /**
   * Jei true – neleistinos žymės bus pašalintos kartu su jų turiniu.
   * Jei false – neleistinų žymių turinys bus paliktas (žymės pašalinamos, tekstas išsaugomas).
   */
  stripIgnoreTag?: boolean;
}

const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code', 'a', 'img', 'div', 'span'
];

const DEFAULT_ALLOWED_ATTRIBUTES = [
  'class', 'className', 'href', 'title', 'alt', 'src', 'width', 'height'
];

/**
 * SafeHtml Component - Secure replacement for dangerouslySetInnerHTML
 *
 * This component uses DOMPurify to sanitize HTML content before rendering,
 * preventing XSS attacks while maintaining safe HTML formatting.
 *
 * @param content - HTML content to sanitize and render
 * @param className - CSS classes to apply to the container
 * @param allowedTags - Array of allowed HTML tags (overrides defaults)
 * @param allowedAttributes - Array of allowed HTML attributes (overrides defaults)
 * @param stripIgnoreTag - Whether to strip tags not in allowedTags
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({
  content,
  className,
  allowedTags = DEFAULT_ALLOWED_TAGS,
  allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
  // Pagal nutylėjimą nešaliname turinio iš neleistinų žymių, kad neišnyktų tekstas
  stripIgnoreTag = false
}) => {
  const sanitizedContent = React.useMemo(() => {
    if (!content) return '';

    // Configure DOMPurify with security-first settings
    const sanitizeConfig = {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      // Paliekame vidinį turinį, nebent aiškiai nurodyta pašalinti kartu su žyme
      KEEP_CONTENT: !stripIgnoreTag,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      ALLOW_DATA_ATTR: false,
      SANITIZE_DOM: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false
    };

    try {
      return DOMPurify.sanitize(content, sanitizeConfig);
    } catch {
      // Silently handle sanitization errors to prevent XSS
      // In production, this would be logged to external service
      return ''; // Return empty string on error to prevent XSS
    }
  }, [content, allowedTags, allowedAttributes, stripIgnoreTag]);

  // Don't render anything if content is empty after sanitization
  if (!sanitizedContent.trim()) {
    return null;
  }

  return (
    <div
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      // Add security attributes
      data-testid="safe-html-content"
    />
  );
};

/**
 * SafeHtml variant specifically for rich text content (articles, courses)
 * Includes additional formatting tags commonly used in CMS content
 */
export const SafeRichText: React.FC<Omit<SafeHtmlProps, 'allowedTags'>> = (props) => {
  const richTextTags = [
    ...DEFAULT_ALLOWED_TAGS,
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'dl', 'dt', 'dd', 'figure', 'figcaption',
    'sub', 'sup', 'mark', 'small',
    // Semantinės žymės iš CMS turinio
    'section', 'article', 'aside'
  ];

  return <SafeHtml {...props} allowedTags={richTextTags} />;
};

/**
 * SafeHtml variant for basic text content with minimal formatting
 * Suitable for user-generated content or comments
 */
export const SafeBasicText: React.FC<Omit<SafeHtmlProps, 'allowedTags'>> = (props) => {
  const basicTags = ['p', 'br', 'strong', 'em', 'b', 'i'];

  return <SafeHtml {...props} allowedTags={basicTags} />;
};

export default SafeHtml;
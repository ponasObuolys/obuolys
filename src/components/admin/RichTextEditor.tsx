import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Underline,
  Youtube,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import FileUpload from "./FileUpload";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Įveskite turinį...",
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Sync the editor content with the value prop
  useEffect(() => {
    if (editorRef.current) {
      // Sanitize incoming value to prevent XSS attacks
      const sanitizedValue = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'ul', 'ol', 'li',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
          'a', 'img', 'div', 'span', 'iframe'
        ],
        ALLOWED_ATTR: [
          'href', 'target', 'rel', 'src', 'alt', 'class', 'width', 'height',
          'frameborder', 'allow', 'allowfullscreen', 'loading'
        ],
        ALLOW_DATA_ATTR: false,
      });

      if (sanitizedValue !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = sanitizedValue;
      }
    }
  }, [value]);

  // Update the value when the editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      // Sanitize output to prevent XSS attacks
      const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'ul', 'ol', 'li',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
          'a', 'img', 'div', 'span', 'iframe'
        ],
        ALLOWED_ATTR: [
          'href', 'target', 'rel', 'src', 'alt', 'class', 'width', 'height',
          'frameborder', 'allow', 'allowfullscreen', 'loading'
        ],
        ALLOW_DATA_ATTR: false,
      });
      onChange(sanitizedContent);
    }
  };

  // Helper to save selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range) {
        setSavedRange(range.cloneRange());
      }
    }
  };

  // Helper to restore selection
  const restoreSelection = () => {
    if (savedRange && window.getSelection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange);
      editorRef.current?.focus();
    }
  };

  // Format actions
  const execCommand = (command: string, value: string | null = null) => {
    // Restore selection if we have a saved range
    if (savedRange) {
      restoreSelection();
    } else {
      editorRef.current?.focus();
    }
    
    document.execCommand(command, false, value || undefined);
    handleEditorChange();
    
    // Clear saved range after use
    setSavedRange(null);
  };

  // Check if format is currently active
  const isFormatActive = (format: string) => {
    return document.queryCommandState(format);
  };

  // Check if block format is currently active
  const isBlockFormatActive = (blockType: string) => {
    const currentBlock = document.queryCommandValue("formatBlock").toLowerCase();
    // Remove < > from blockType for comparison
    const cleanBlockType = blockType.replace(/[<>]/g, "").toLowerCase();
    return currentBlock === cleanBlockType;
  };

  const toggleFormat = (format: string) => {
    editorRef.current?.focus();
    execCommand(format);
  };

  const insertHeading = (level: number) => {
    editorRef.current?.focus();
    
    // Check if heading is already applied, if so, remove it
    const currentBlock = document.queryCommandValue("formatBlock");
    if (currentBlock.toLowerCase() === `h${level}`) {
      execCommand("formatBlock", "<p>");
    } else {
      execCommand("formatBlock", `<h${level}>`);
    }
  };

  const toggleBlockFormat = (blockTag: string) => {
    editorRef.current?.focus();
    
    // Remove < > from blockTag for comparison
    const cleanTag = blockTag.replace(/[<>]/g, "").toLowerCase();
    const currentBlock = document.queryCommandValue("formatBlock").toLowerCase();
    
    // Special handling for paragraph - it should toggle between p and div
    if (cleanTag === "p") {
      if (currentBlock === "p" || currentBlock === "") {
        // If already p or empty, convert to div (removes paragraph)
        execCommand("formatBlock", "<div>");
      } else {
        // Convert to paragraph
        execCommand("formatBlock", "<p>");
      }
    } else {
      // For other formats (blockquote, pre, etc.)
      if (currentBlock === cleanTag) {
        // If already applied, convert to paragraph
        execCommand("formatBlock", "<p>");
      } else {
        // Apply the block format
        execCommand("formatBlock", blockTag);
      }
    }
  };

  const toggleList = (listType: "insertUnorderedList" | "insertOrderedList") => {
    editorRef.current?.focus();
    execCommand(listType);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    execCommand("insertHTML", linkHtml);
    
    setLinkUrl("");
    setLinkText("");
    setLinkDialogOpen(false);
  };

  const handleInsertImage = (uploadedUrl: string, altText = "") => {
    if (!uploadedUrl.trim()) return;
    
    const imgHtml = `<img src="${uploadedUrl}" alt="${altText}" class="my-4 rounded max-w-full h-auto" loading="lazy" />`;
    execCommand("insertHTML", imgHtml);
    
    setImageDialogOpen(false);
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    
    let videoId = "";
    const ytRegex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = videoUrl.match(ytRegex);
    let embedHtml = "";
    
    if (match && match[1]) {
      videoId = match[1];
      embedHtml = `<div class="video-container my-4"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } else {
      embedHtml = `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${videoUrl}</a>`;
    }
    
    execCommand("insertHTML", embedHtml);
    setVideoUrl("");
    setVideoDialogOpen(false);
  };

  return (
    <div className="border rounded-md overflow-hidden flex flex-col">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1 sticky top-0 z-10">
        <Button
          type="button"
          variant={isFormatActive("bold") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleFormat("bold");
          }}
          title="Paryškintas"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isFormatActive("italic") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleFormat("italic");
          }}
          title="Kursyvas"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isFormatActive("underline") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleFormat("underline");
          }}
          title="Pabrauktas"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button
          type="button"
          variant={isBlockFormatActive("h1") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertHeading(1);
          }}
          title="Antraštė 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isBlockFormatActive("h2") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertHeading(2);
          }}
          title="Antraštė 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isBlockFormatActive("p") || isBlockFormatActive("div") ? "default" : "secondary"}
          size="sm"
          title="Pastraipa (normalus tekstas)"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockFormat("<p>");
          }}
        >
          <Pilcrow className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleList("insertUnorderedList");
          }}
          title="Sąrašas"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleList("insertOrderedList");
          }}
          title="Numeruotas sąrašas"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isBlockFormatActive("blockquote") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockFormat("<blockquote>");
          }}
          title="Citata"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isBlockFormatActive("pre") ? "default" : "secondary"}
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockFormat("<pre>");
          }}
          title="Kodas"
        >
          <Code className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>

        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              title="Įterpti nuorodą"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Įterpti nuorodą</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="linkUrl">Nuorodos URL</label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="linkText">Nuorodos tekstas</label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={e => setLinkText(e.target.value)}
                  placeholder="Nuorodos tekstas (neprivalomas)"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Atšaukti
                </Button>
              </DialogClose>
              <Button type="button" onClick={insertLink}>
                Įterpti nuorodą
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              title="Įterpti paveikslėlį"
            >
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Įkelti ir įterpti paveikslėlį</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <FileUpload
                bucket="site-images"
                folder="articles/content"
                onUploadComplete={url => {
                  handleInsertImage(url, "Paveikslėlis");
                }}
                acceptedFileTypes="image/jpeg, image/png, image/gif, image/webp"
                maxFileSizeMB={5}
                buttonText="Įkelti paveikslėlį"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Uždaryti
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Video Dialog */}
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              title="Įterpti vaizdo įrašą"
            >
              <Youtube className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Įterpti vaizdo įrašą</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="videoUrl">YouTube vaizdo įrašo URL</label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Atšaukti
                </Button>
              </DialogClose>
              <Button type="button" onClick={insertVideo}>
                Įterpti vaizdo įrašą
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div
        ref={editorRef}
        contentEditable={true}
        className="bg-background p-4 min-h-[300px] focus:outline-none prose dark:prose-invert max-w-none rich-text-editor-content flex-grow overflow-y-auto"
        style={{ direction: "ltr", textAlign: "left" }}
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        .rich-text-editor-content[contentEditable=true]:empty::before {
          content: attr(data-placeholder);
          color: #a1a1aa;
          position: absolute;
          pointer-events: none;
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
          overflow: hidden;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

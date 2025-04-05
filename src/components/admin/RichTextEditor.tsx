import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import FileUpload from './FileUpload';
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Youtube,
  Pilcrow
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = 'Įveskite turinį...' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Sync the editor content with the value prop
  useEffect(() => {
    if (editorRef.current) {
      if (value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Update the value when the editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Helper to save selection
  const saveSelection = () => {
    if (window.getSelection && window.getSelection()?.rangeCount > 0) {
      setSavedRange(window.getSelection()?.getRangeAt(0) || null);
    }
  };

  // Helper to restore selection
  const restoreSelection = () => {
    if (savedRange && window.getSelection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange);
      setSavedRange(null); // Clear saved range after restoring
    }
  };

  // Format actions
  const execCommand = (command: string, value: string | null = null) => {
    editorRef.current?.focus(); // Ensure focus before command
    if (command === 'insertHTML') {
        restoreSelection(); // Restore selection specifically for insertHTML
    }
    document.execCommand(command, false, value);
    handleEditorChange();
    // No need to refocus here usually, focus should remain
  };

  const formatText = (format: string) => {
    execCommand(format);
  };

  const insertHeading = (level: number) => {
    // First make sure we have a selection or cursor positioned
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;
    // Use formatBlock command which is generally more reliable for headings
    execCommand('formatBlock', `<h${level}>`);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    execCommand('insertHTML', linkHtml);
    setLinkUrl('');
    setLinkText('');
    setLinkDialogOpen(false);
  };

  const handleInsertImage = (uploadedUrl: string, altText: string = '') => {
    if (!uploadedUrl.trim()) return;
    const imgHtml = `<img src="${uploadedUrl}" alt="${altText}" class="my-4 rounded max-w-full h-auto" loading="lazy" />`;
    execCommand('insertHTML', imgHtml);
    setImageDialogOpen(false);
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    let videoId = '';
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = videoUrl.match(ytRegex);
    let embedHtml = '';
    if (match && match[1]) {
      videoId = match[1];
      embedHtml = `<div class="video-container my-4"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } else {
      embedHtml = `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${videoUrl}</a>`;
    }
    execCommand('insertHTML', embedHtml);
    setVideoUrl('');
    setVideoDialogOpen(false);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
        <Button type="button" variant="secondary" size="sm" onClick={() => formatText('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => formatText('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => formatText('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button type="button" variant="secondary" size="sm" onClick={() => insertHeading(1)}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => insertHeading(2)}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" title="Pastraipa" onClick={() => execCommand('formatBlock', '<p>')}>
          <Pilcrow className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button type="button" variant="secondary" size="sm" onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => execCommand('formatBlock', '<blockquote>')}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => execCommand('formatBlock', '<pre>')}>
          <Code className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        
        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="secondary" size="sm" onClick={saveSelection}>
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
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="linkText">Nuorodos tekstas</label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Nuorodos tekstas (neprivalomas)"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Atšaukti</Button>
              </DialogClose>
              <Button type="button" onClick={insertLink}>Įterpti nuorodą</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Image Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="secondary" size="sm" onClick={saveSelection}>
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
                onUploadComplete={(url) => {
                  handleInsertImage(url, 'Paveikslėlis');
                }}
                acceptedFileTypes="image/jpeg, image/png, image/gif, image/webp"
                maxFileSizeMB={5}
                buttonText="Įkelti paveikslėlį"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Uždaryti</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Video Dialog */}
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="secondary" size="sm" onClick={saveSelection}>
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
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Atšaukti</Button>
              </DialogClose>
              <Button type="button" onClick={insertVideo}>Įterpti vaizdo įrašą</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div
        ref={editorRef}
        contentEditable={true}
        className="bg-background p-4 min-h-[300px] focus:outline-none prose dark:prose-invert max-w-none rich-text-editor-content"
        style={{ direction: 'ltr', textAlign: 'left' }}
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

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Youtube
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
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

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

  // Format actions
  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    handleEditorChange();
    editorRef.current?.focus();
  };

  const formatText = (format: string) => {
    execCommand(format);
  };

  const insertHeading = (level: number) => {
    // First make sure we have a selection or cursor positioned
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;
    
    // Get the current line/paragraph
    const range = selection.getRangeAt(0);
    const currentBlock = range.startContainer.parentElement;
    
    // Create new heading element
    const heading = document.createElement(`h${level}`);
    
    // If we have a block element selected, replace it with heading
    if (currentBlock && editorRef.current.contains(currentBlock)) {
      heading.innerHTML = currentBlock.innerHTML;
      currentBlock.parentNode?.replaceChild(heading, currentBlock);
    } else {
      // Otherwise just insert at current position
      execCommand('formatBlock', `<h${level}>`);
    }
    
    handleEditorChange();
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    execCommand('insertHTML', linkHtml);
    
    setLinkUrl('');
    setLinkText('');
    setLinkDialogOpen(false);
  };

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    
    const imgHtml = `<img src="${imageUrl}" alt="${imageAlt}" class="my-4 rounded max-w-full h-auto" />`;
    execCommand('insertHTML', imgHtml);
    
    setImageUrl('');
    setImageAlt('');
    setImageDialogOpen(false);
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    
    // Extract YouTube video ID if it's a YouTube URL
    let videoId = '';
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = videoUrl.match(ytRegex);
    
    if (match && match[1]) {
      videoId = match[1];
      const embedHtml = `<div class="video-container my-4"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      execCommand('insertHTML', embedHtml);
    } else {
      // If not a YouTube URL, just insert as a link
      const linkHtml = `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${videoUrl}</a>`;
      execCommand('insertHTML', linkHtml);
    }
    
    setVideoUrl('');
    setVideoDialogOpen(false);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(1)}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(2)}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<blockquote>')}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('formatBlock', '<pre>')}>
          <Code className="h-4 w-4" />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        
        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Link className="h-4 w-4" />
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
            <Button type="button" variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Įterpti paveikslėlį</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="imageUrl">Paveikslėlio URL</label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="imageAlt">Alternatyvus tekstas</label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Paveikslėlio aprašymas"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Atšaukti</Button>
              </DialogClose>
              <Button type="button" onClick={insertImage}>Įterpti paveikslėlį</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Video Dialog */}
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
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
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none"
        onInput={handleEditorChange}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
      
      <style>{`
        [contenteditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          display: block;
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

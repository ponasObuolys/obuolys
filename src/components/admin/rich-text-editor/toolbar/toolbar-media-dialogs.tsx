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
import { Image, Link as LinkIcon, Youtube } from "lucide-react";
import { useState } from "react";
import FileUpload from "../../FileUpload";

interface ToolbarMediaDialogsProps {
  execCommand: (command: string, value: string | null) => void;
  saveSelection: () => void;
}

export const ToolbarMediaDialogs = ({ execCommand, saveSelection }: ToolbarMediaDialogsProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    execCommand("insertHTML", linkHtml);
    setLinkUrl("");
    setLinkText("");
    setLinkDialogOpen(false);
  };

  const handleInsertImage = (uploadedUrl: string) => {
    if (!uploadedUrl.trim()) return;
    const imgHtml = `<img src="${uploadedUrl}" alt="Paveikslėlis" class="my-4 rounded max-w-full h-auto" loading="lazy" />`;
    execCommand("insertHTML", imgHtml);
    setImageDialogOpen(false);
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    const ytRegex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = videoUrl.match(ytRegex);
    let embedHtml = "";

    if (match && match[1]) {
      const videoId = match[1];
      embedHtml = `<div class="video-container my-4"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } else {
      embedHtml = `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${videoUrl}</a>`;
    }

    execCommand("insertHTML", embedHtml);
    setVideoUrl("");
    setVideoDialogOpen(false);
  };

  return (
    <>
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
              onUploadComplete={handleInsertImage}
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
    </>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialShareProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
  showCopyLink?: boolean;
}

export function SocialShare({
  url,
  title = "",
  description = "",
  className = "",
  showCopyLink = true
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const getFacebookShareUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  };

  const shareTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      'twitter-share-dialog',
      'width=626,height=436'
    );
  };

  const shareLinkedin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      'linkedin-share-dialog',
      'width=626,height=436'
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        {/* Copy Link Button - Now First */}
        {showCopyLink && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={copyToClipboard}
                className="bg-gray-800 text-white hover:bg-gray-700"
                size="icon"
                aria-label="Kopijuoti nuorodą"
              >
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Nukopijuota!" : "Kopijuoti nuorodą"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Facebook Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={getFacebookShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#1877F2] text-white hover:bg-[#1877F2]/90 h-9 w-9 p-0"
              aria-label="Dalintis Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dalintis Facebook</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={shareTwitter}
              className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
              size="icon"
              aria-label="Dalintis Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dalintis Twitter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={shareLinkedin}
              className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
              size="icon"
              aria-label="Dalintis LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dalintis LinkedIn</p>
          </TooltipContent>
        </Tooltip>


      </TooltipProvider>
    </div>
  );
}

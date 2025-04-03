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

  const shareFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Try the standard Facebook sharer
      const shareWindow = window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        'facebook-share-dialog',
        'width=626,height=436'
      );
      
      // Check if popup was blocked or failed to open
      if (!shareWindow || shareWindow.closed || typeof shareWindow.closed === 'undefined') {
        console.log("Facebook share window may have been blocked. Trying alternative method...");
        // Fallback to direct navigation
        window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      }
    } catch (error) {
      console.error("Error sharing to Facebook:", error);
      // Last resort fallback
      window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={shareFacebook}
              className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
              size="icon"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={shareTwitter}
              className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
              size="icon"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={shareLinkedin}
              className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
              size="icon"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>

        {showCopyLink && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={copyToClipboard}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                size="icon"
                aria-label="Copy link"
              >
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

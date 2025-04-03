import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { shareToFacebook, initFacebookSDK } from "@/utils/facebookShare";

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
  const [fbInitialized, setFbInitialized] = useState(false);

  // Initialize Facebook SDK when component mounts
  useEffect(() => {
    initFacebookSDK()
      .then(() => setFbInitialized(true))
      .catch(error => console.error("Failed to initialize Facebook SDK:", error));
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Use our utility function that handles all the Facebook sharing logic
    shareToFacebook({
      url,
      title,
      description,
      quote: title ? `${title} - ${description}` : description
    }).catch(error => {
      console.error("All Facebook sharing methods failed:", error);
    });
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
              data-href={url}
              data-layout="button"
              data-size="large"
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

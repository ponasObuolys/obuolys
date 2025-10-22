import { useState } from "react";
import { Share2, Facebook, Send, Mail, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useShare, type ShareData } from "@/hooks/useShare";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export const ShareButton = ({
  title,
  description,
  url,
  imageUrl,
  className,
  variant = "outline",
  size = "default",
  showLabel = true,
}: ShareButtonProps) => {
  const { share, shareToPlatform, canUseWebShare } = useShare();
  const [isOpen, setIsOpen] = useState(false);

  const shareData: ShareData = {
    title,
    description,
    url,
    imageUrl,
  };

  // Jei mobile ir palaiko Web Share - naudojame native share
  const handleShare = async () => {
    if (canUseWebShare) {
      await share(shareData);
    } else {
      // Desktop - parodome dropdown
      setIsOpen(!isOpen);
    }
  };

  // Desktop share options
  const shareOptions = [
    {
      label: "Facebook",
      icon: Facebook,
      action: () => shareToPlatform("facebook", shareData),
      color: "text-[#1877F2]",
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      action: () => shareToPlatform("whatsapp", shareData),
      color: "text-[#25D366]",
    },
    {
      label: "Reddit",
      icon: Send,
      action: () => shareToPlatform("reddit", shareData),
      color: "text-[#FF4500]",
    },
    {
      label: "El. paštas",
      icon: Mail,
      action: () => shareToPlatform("email", shareData),
      color: "text-primary",
    },
    {
      label: "Kopijuoti nuorodą",
      icon: LinkIcon,
      action: () => shareToPlatform("copy", shareData),
      color: "text-primary",
    },
  ];

  // Jei mobile su Web Share API - paprastas mygtukas
  if (canUseWebShare) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleShare}
        className={cn("gap-2", className)}
      >
        <Share2 className="h-4 w-4" />
        {showLabel && "Dalintis"}
      </Button>
    );
  }

  // Desktop - dropdown su platformomis
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("gap-2", className)}>
          <Share2 className="h-4 w-4" />
          {showLabel && "Dalintis"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-semibold text-foreground/60">Dalintis</div>
        <DropdownMenuSeparator />
        {shareOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={index}
              onClick={option.action}
              className="cursor-pointer gap-3 py-2.5"
            >
              <Icon className={cn("h-4 w-4", option.color)} />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Kompaktiškas share icon mygtukas (be teksto)
export const ShareIconButton = (
  props: Omit<ShareButtonProps, "showLabel" | "size" | "variant">
) => {
  return (
    <ShareButton
      {...props}
      variant="ghost"
      size="icon"
      showLabel={false}
      className={cn("h-9 w-9 rounded-full", props.className)}
    />
  );
};

// Share mygtukas su custom ikonėlėmis (alternatyva)
interface ShareButtonsGroupProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  className?: string;
  iconSize?: number;
}

export const ShareButtonsGroup = ({
  title,
  description,
  url,
  imageUrl,
  className,
  iconSize = 20,
}: ShareButtonsGroupProps) => {
  const { shareToPlatform } = useShare();

  const shareData: ShareData = {
    title,
    description,
    url,
    imageUrl,
  };

  const platforms = [
    {
      platform: "facebook" as const,
      icon: Facebook,
      label: "Facebook",
      color: "hover:text-[#1877F2]",
    },
    {
      platform: "whatsapp" as const,
      icon: MessageCircle,
      label: "WhatsApp",
      color: "hover:text-[#25D366]",
    },
    { platform: "reddit" as const, icon: Send, label: "Reddit", color: "hover:text-[#FF4500]" },
    { platform: "email" as const, icon: Mail, label: "Email", color: "hover:text-primary" },
    { platform: "copy" as const, icon: LinkIcon, label: "Kopijuoti", color: "hover:text-primary" },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-foreground/60 mr-1">Dalintis:</span>
      {platforms.map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.platform}
            onClick={() => shareToPlatform(item.platform, shareData)}
            className={cn(
              "p-2 rounded-full transition-colors",
              "hover:bg-accent",
              "text-foreground/60",
              item.color
            )}
            aria-label={`Dalintis per ${item.label}`}
            title={item.label}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}
    </div>
  );
};

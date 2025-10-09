import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface ShareData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export type SharePlatform = 'facebook' | 'reddit' | 'email' | 'copy';

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  // Patikrinti ar naršyklė palaiko Web Share API
  const canUseWebShare = useCallback(() => {
    return typeof navigator !== 'undefined' &&
           navigator.share !== undefined &&
           /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
  }, []);

  // Native Web Share API (mobile)
  const shareNative = useCallback(async (data: ShareData) => {
    try {
      setIsSharing(true);
      await navigator.share({
        title: data.title,
        text: data.description,
        url: data.url,
      });

      toast({
        title: "Pasidalinta sėkmingai",
        description: "Turinys buvo pasidalintas",
      });
      return true;
    } catch (error) {
      // Vartotojas atšaukė share dialog arba įvyko klaida
      if ((error as Error).name !== 'AbortError') {
        // eslint-disable-next-line no-console
        console.error('Share error:', error);
        toast({
          title: "Klaida",
          description: "Nepavyko pasidalinti turiniu",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsSharing(false);
    }
  }, [toast]);

  // Platform-specific share (desktop)
  const shareToPlatform = useCallback((platform: SharePlatform, data: ShareData) => {
    let shareUrl = '';

    switch (platform) {
      case 'facebook': {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
        break;
      }

      case 'reddit': {
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`;
        break;
      }

      case 'email': {
        const emailBody = `${data.description}\n\nSkaityk daugiau: ${data.url}`;
        shareUrl = `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(emailBody)}`;
        break;
      }

      case 'copy':
        // Copy link funkcionalumas
        if (navigator.clipboard) {
          navigator.clipboard.writeText(data.url)
            .then(() => {
              toast({
                title: "Nuoroda nukopijuota",
                description: "Nuoroda buvo nukopijuota į iškarpinę",
              });
            })
            .catch(() => {
              toast({
                title: "Klaida",
                description: "Nepavyko nukopijuoti nuorodos",
                variant: "destructive",
              });
            });
        }
        return;
    }

    if (shareUrl) {
      // Atidarome naują langą
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
    }
  }, [toast]);

  // Universali share funkcija
  const share = useCallback(async (data: ShareData, platform?: SharePlatform) => {
    // Jei nenurodytas platform ir palaiko Web Share - naudojame native
    if (!platform && canUseWebShare()) {
      return await shareNative(data);
    }

    // Kitu atveju - platform share
    if (platform) {
      shareToPlatform(platform, data);
      return true;
    }

    // Jei nei Web Share, nei platform - copy link by default
    shareToPlatform('copy', data);
    return true;
  }, [canUseWebShare, shareNative, shareToPlatform]);

  return {
    share,
    shareToPlatform,
    isSharing,
    canUseWebShare: canUseWebShare(),
  };
};

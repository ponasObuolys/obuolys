/**
 * Share URL builders ir helper funkcijos
 */

export interface ShareUrlData {
  url: string;
  title?: string;
  description?: string;
}

/**
 * Generuoja Facebook share URL
 */
export const getFacebookShareUrl = (data: ShareUrlData): string => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
};

/**
 * Generuoja Reddit share URL
 */
export const getRedditShareUrl = (data: ShareUrlData): string => {
  const params = new URLSearchParams({
    url: data.url,
    ...(data.title && { title: data.title }),
  });
  return `https://www.reddit.com/submit?${params.toString()}`;
};

/**
 * Generuoja Email share URL (mailto)
 */
export const getEmailShareUrl = (data: ShareUrlData): string => {
  const subject = data.title || "Įdomi informacija iš Ponas Obuolys";
  const body = data.description
    ? `${data.description}\n\nSkaityk daugiau: ${data.url}`
    : `Skaityk daugiau: ${data.url}`;

  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:?${params.toString()}`;
};

/**
 * Generuoja Twitter/X share URL
 */
export const getTwitterShareUrl = (data: ShareUrlData): string => {
  const text = data.title ? `${data.title}\n\n${data.url}` : data.url;

  const params = new URLSearchParams({
    text,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

/**
 * Generuoja LinkedIn share URL
 */
export const getLinkedInShareUrl = (data: ShareUrlData): string => {
  const params = new URLSearchParams({
    url: data.url,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
};

/**
 * Generuoja WhatsApp share URL
 */
export const getWhatsAppShareUrl = (data: ShareUrlData): string => {
  const text = data.title ? `${data.title}\n\n${data.url}` : data.url;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

/**
 * Nukopijuoja tekstą į iškarpinę (clipboard)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback metodas senesnėms naršyklėms
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      textArea.remove();

      return successful;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Copy to clipboard failed:", error);
    return false;
  }
};

/**
 * Patikrina ar įrenginys yra mobile
 */
export const isMobileDevice = (): boolean => {
  return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Patikrina ar naršyklė palaiko Web Share API
 */
export const canUseWebShare = (): boolean => {
  return typeof navigator !== "undefined" && navigator.share !== undefined && isMobileDevice();
};

/**
 * Sutrumpina aprašymą iki nurodyto ilgio
 */
export const truncateDescription = (text: string, maxLength = 200): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Išvalo HTML tags iš teksto (jei description turi HTML)
 */
export const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/**
 * Paruošia share data su default reikšmėmis
 */
export const prepareShareData = (data: Partial<ShareUrlData> & { url: string }): ShareUrlData => {
  return {
    url: data.url,
    title: data.title || "Ponas Obuolys - AI naujienos ir įrankiai",
    description: data.description
      ? truncateDescription(stripHtmlTags(data.description))
      : "Atrask naujausias AI technologijas ir įrankius",
  };
};

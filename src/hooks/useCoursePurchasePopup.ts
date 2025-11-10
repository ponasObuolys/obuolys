import { useState, useEffect } from 'react';

interface UseCoursePurchasePopupProps {
  /** Show popup after this many seconds */
  delaySeconds?: number;
  /** Show popup when user scrolls past this percentage */
  scrollThreshold?: number;
  /** Prevent showing popup multiple times in session */
  sessionKey?: string;
}

interface UseCoursePurchasePopupReturn {
  isVisible: boolean;
  showPopup: () => void;
  hidePopup: () => void;
  resetPopup: () => void;
}

/**
 * Hook to manage course purchase popup visibility
 * Shows popup based on time and scroll engagement
 */
export function useCoursePurchasePopup({
  delaySeconds = 45,
  scrollThreshold = 0.6,
  sessionKey = 'course-popup-shown'
}: UseCoursePurchasePopupProps = {}): UseCoursePurchasePopupReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem(sessionKey);
    if (wasShown) {
      setHasBeenShown(true);
      return;
    }

    let hasTriggered = false;

    // Timer-based trigger
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      if (!hasTriggered && !hasBeenShown) {
        setIsVisible(true);
        hasTriggered = true;
        setHasBeenShown(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    }, delaySeconds * 1000);

    // Scroll-based trigger
    const handleScroll = () => {
      if (hasTriggered || hasBeenShown) return;

      const scrolled = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = scrolled / totalHeight;

      if (scrollPercentage >= scrollThreshold) {
        setIsVisible(true);
        hasTriggered = true;
        setHasBeenShown(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delaySeconds, scrollThreshold, sessionKey, hasBeenShown]);

  const showPopup = () => {
    if (!hasBeenShown) {
      setIsVisible(true);
      setHasBeenShown(true);
      sessionStorage.setItem(sessionKey, 'true');
    }
  };

  const hidePopup = () => {
    setIsVisible(false);
  };

  const resetPopup = () => {
    setIsVisible(false);
    setHasBeenShown(false);
    sessionStorage.removeItem(sessionKey);
  };

  return {
    isVisible,
    showPopup,
    hidePopup,
    resetPopup
  };
}
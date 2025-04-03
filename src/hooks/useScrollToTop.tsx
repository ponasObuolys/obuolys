import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook, kuris automatiškai peršoka į viršų, kai pasikeičia location pathname
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
}

import { useState, useEffect } from 'react';
import { getLocalImage } from './file-upload';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  placeholder?: string;
}

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  fallbackSrc = '/images/placeholder.png',
  placeholder = 'blur'
}: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(placeholder === 'blur' ? fallbackSrc : src);
  
  useEffect(() => {
    // Patikrinti, ar tai vietinės atminties nuotrauka
    if (src.startsWith('data:image;base64_') || src.startsWith('local_image_')) {
      // Gauti vietinį paveikslėlį
      const localImage = getLocalImage(src);
      if (localImage) {
        setImageSrc(localImage);
        setLoaded(true);
      } else {
        console.error('Nepavyko rasti vietinio paveikslėlio:', src);
        setError(true);
      }
    } else {
      // Įprasta nuotrauka iš URL - pakrauti
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setImageSrc(src);
        setLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Klaida kraunant paveikslėlį:', src);
        setError(true);
      };
    }
  }, [src, fallbackSrc, placeholder]);
  
  if (error) {
    return <img 
      src={fallbackSrc} 
      alt={alt} 
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-40'}`}
      width={width} 
      height={height}
    />;
  }
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-40'} transition-opacity duration-300`}
      width={width} 
      height={height} 
      loading="lazy"
    />
  );
};

export default LazyImage; 
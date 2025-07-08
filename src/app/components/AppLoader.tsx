import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  loaderColor?: string;
}

const ImageWithLoader = ({ 
  src, 
  alt, 
  className = '', 
  loaderColor = 'text-gray-400' 
}: ImageWithLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => setIsLoading(false);
    
    if (img.complete) {
      handleLoad();
      return;
    }

    img.addEventListener('load', handleLoad);
    return () => img.removeEventListener('load', handleLoad);
  }, [src]);

  return (
    <>
      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader2 className={`h-8 w-8 animate-spin ${loaderColor}`} />
        </div>
      )}
      
      {/* Image with original styling */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        loading="lazy"
      />
    </>
  );
};

export default ImageWithLoader;
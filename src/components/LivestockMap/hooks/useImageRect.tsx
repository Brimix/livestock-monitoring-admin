import {useEffect, useMemo, useState, RefObject} from 'react';
import {measureRenderBox} from '../utils';

/**
 * Custom hook to handle image loading, measurement, and resize logic
 * Returns the computed image rectangle and loading state
 */
export const useImageRect = (
  outerRef: RefObject<HTMLDivElement | null>,
  imgRef: RefObject<HTMLImageElement | null>
) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Size/position of the rendered image inside the container (letterbox-aware)
  const imageRect = useMemo(() => {
    const img = imgRef.current;
    const outer = outerRef.current;
    if (!img || !outer) return null;
    return measureRenderBox(outer, img);
  }, [imageLoaded, outerRef, imgRef]);

  // Recompute imageRect on container or window resize
  useEffect(() => {
    const outer = outerRef.current;
    const img = imgRef.current;
    if (!outer || !img) return;

    const update = () => {
      // force a recompute of imageRect
      setImageLoaded((v) => !v);
      setImageLoaded((v) => !v);
    };

    const ro1 = new ResizeObserver(update);
    const ro2 = new ResizeObserver(update);
    ro1.observe(outer);
    ro2.observe(img);
    window.addEventListener('resize', update);

    return () => {
      ro1.disconnect();
      ro2.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [outerRef, imgRef]);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageLoaded(true);

  return {
    imageRect,
    imageLoaded,
    handleImageLoad,
    handleImageError,
  };
};

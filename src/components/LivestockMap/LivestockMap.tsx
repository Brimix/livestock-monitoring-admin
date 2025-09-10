import React, {useMemo, useRef} from 'react';

import rosarioMap from '../../assets/rosario-google.png';
import {LsuDeviceData} from '../../domain';

import {MAP_BOUNDS} from './constants';
import {MapHeader, MapLegend, MapFooter, MapOverlay} from './ui';
import {useImageRect} from './hooks';
import {DevicePin} from './types';
import {createPinFromDevice} from './utils';

/**
 * LivestockMap – render device pins over a static map image using geo bounds.
 *
 * Fix: pins now account for letterboxing/padding created by `object-contain`.
 * We compute the rendered image box (left/top/width/height) inside the container
 * and place pins relative to that box, so no misalignment when the container
 * is bigger than the image.
 */

interface LivestockMapProps {
  devices: LsuDeviceData[];
  className?: string;
  selectedId?: string | null;
  onSelect?: (deviceId: string) => void;
  showGrid?: boolean;
  maxVh?: number;
};

const LivestockMap = (props: LivestockMapProps) => {
  const {
    devices,
    selectedId,
    onSelect,
    showGrid = false,
    className,
    maxVh = 100,
  } = props;

  const outerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const {imageRect, handleImageLoad, handleImageError} = useImageRect(outerRef, imgRef);

  const pins: DevicePin[] = useMemo(() => {
    if (!imageRect) return [];
    return devices.map((d) => createPinFromDevice(d, imageRect));
  }, [devices, imageRect]);

  return (
    <div
      ref={outerRef}
      className={[
        'relative w-full h-auto max-h-[100dvh] min-h-64 rounded-2xl overflow-hidden bg-neutral-900/60',
        'shadow-xl ring-1 ring-black/5',
        className || '',
      ].join(' ')}
      style={{ maxHeight: `${maxVh}dvh` }}
    >
      <MapHeader bounds={MAP_BOUNDS} />

      {/* Static map image and overlay */}
      <div className="relative">
        <img
          ref={imgRef}
          src={rosarioMap}
          alt="Region map"
          className="pointer-events-none select-none w-full h-auto object-contain"
          style={{maxHeight: 'inherit'}}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* Transparent white overlay for better pin contrast */}
        <div className="absolute inset-0 bg-white/25 pointer-events-none" />
      </div>
      {imageRect && (
        <MapOverlay
          imageRect={imageRect}
          pins={pins}
          showGrid={showGrid}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )}

      <MapLegend />
      <MapFooter deviceCount={devices.length} />
    </div>
  );
};

export default LivestockMap;

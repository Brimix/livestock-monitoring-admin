import React, { useEffect, useMemo, useRef, useState } from 'react';

import rosarioMap from '../../assets/rosario-google.png';
import {LsuDeviceData} from '../../domain';

import {MAP_BOUNDS} from './constants';
import {latLngToXY} from './utils';
import LivestockPin from './LivestockPin';

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
  /** Cap map height to avoid exceeding viewport. Default 100dvh. */
  maxVh?: number; // e.g. 100, 90, 70
};

// ————————————————————————————————————————————————————————————————
// Helpers to compute the rendered image box for `object-contain`
// ————————————————————————————————————————————————————————————————
function getPadding(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return {
    left: parseFloat(cs.paddingLeft) || 0,
    top: parseFloat(cs.paddingTop) || 0,
    right: parseFloat(cs.paddingRight) || 0,
    bottom: parseFloat(cs.paddingBottom) || 0,
  };
}

function measureRenderBox(outer: HTMLElement, img: HTMLImageElement) {
  const natW = img.naturalWidth || 1;
  const natH = img.naturalHeight || 1;
  const pad = getPadding(outer);

  // clientWidth/Height are the padding box; subtract padding to get content area
  const contentW = outer.clientWidth - pad.left - pad.right;
  const contentH = outer.clientHeight - pad.top - pad.bottom;

  // object-contain: scale to fit within content area, preserve aspect
  const scale = Math.min(contentW / natW, contentH / natH);
  const width = natW * scale;
  const height = natH * scale;

  // letterbox offsets (relative to outer's padding edge)
  const left = pad.left + (contentW - width) / 2;
  const top = pad.top + (contentH - height) / 2;

  return new DOMRect(left, top, width, height);
}

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

  const [imageLoaded, setImageLoaded] = useState(false);

  // Size/position of the rendered image inside the container (letterbox-aware)
  const imageRect = useMemo(() => {
    const img = imgRef.current;
    const outer = outerRef.current;
    if (!img || !outer) return null;
    return measureRenderBox(outer, img);
  }, [imageLoaded]);

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
  }, []);

  const pins = useMemo(() => {
    if (!imageRect)
      return [] as { device: LsuDeviceData; x: number; y: number; visible: boolean }[];

    const { width, height } = imageRect;

    return devices.map((d) => {
      const { x, y } = latLngToXY(d.lat, d.lng, MAP_BOUNDS, width, height);
      const visible =
        d.lat <= MAP_BOUNDS.north &&
        d.lat >= MAP_BOUNDS.south &&
        d.lng >= MAP_BOUNDS.west &&
        d.lng <= MAP_BOUNDS.east;

      return { device: d, x, y, visible };
    });
  }, [devices, imageRect]);

  return (
    <div
      ref={outerRef}
      className={[
        // Keep height auto and cap with max-height so we never exceed the viewport
        'relative w-full h-auto max-h-[100dvh] min-h-64 rounded-2xl overflow-hidden bg-neutral-900/60',
        'shadow-xl ring-1 ring-black/5',
        className || '',
      ].join(' ')}
      style={{ maxHeight: `${maxVh}dvh` }}
    >
      {/* Header */}
      <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-xl bg-black/50 backdrop-blur px-3 py-1.5 text-white">
        <div className="text-xs opacity-75">Livestock Map</div>
        <div className="h-1 w-1 rounded-full bg-white/60" />
        <div className="text-[10px] opacity-60">
          N: {MAP_BOUNDS.north.toFixed(5)} S: {MAP_BOUNDS.south.toFixed(5)} W: {MAP_BOUNDS.west.toFixed(5)} E: {MAP_BOUNDS.east.toFixed(5)}
        </div>
      </div>

      {/* Static map image */}
      <img
        ref={imgRef}
        src={rosarioMap}
        alt="Region map"
        className="pointer-events-none select-none w-full h-auto object-contain"
        // Make the image respect the parent's max-height cap
        style={{ maxHeight: 'inherit' }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
      />

      {/* Overlay that exactly matches the rendered image box */}
      {imageRect && (
        <div
          className="absolute z-10"
          style={{ left: imageRect.x, top: imageRect.y, width: imageRect.width, height: imageRect.height }}
        >
          {/* Optional grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
          )}

          {/* Device pins (x,y relative to imageRect box) */}
          {pins.map(({ device, x, y, visible }) => (
            <LivestockPin
              key={device.id}
              device={device}
              x={x}
              y={y}
              visible={visible}
              containerWidth={imageRect.width}
              containerHeight={imageRect.height}
              selected={device.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="absolute right-3 top-3 z-20 rounded-xl bg-black/50 backdrop-blur px-2 py-1 text-white">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> OK
          <span className="h-2 w-2 rounded-full bg-amber-400 inline-block ml-2" /> Warn
          <span className="h-2 w-2 rounded-full bg-red-500 inline-block ml-2" /> Alert
        </div>
      </div>

      {/* Footer: count */}
      <div className="absolute left-3 bottom-3 z-20 rounded-xl bg-black/50 backdrop-blur px-3 py-1.5 text-white text-xs">
        Devices: {devices.length}
      </div>
    </div>
  );
};

export default LivestockMap;

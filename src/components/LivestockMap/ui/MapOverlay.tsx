import React from 'react';
import { LsuDeviceData } from '../../../domain';
import LivestockPin from '../LivestockPin';

interface MapOverlayProps {
  imageRect: DOMRect;
  pins: Array<{ device: LsuDeviceData; x: number; y: number; visible: boolean }>;
  showGrid: boolean;
  selectedId?: string | null;
  onSelect?: (deviceId: string) => void;
}
const MapOverlay = ({ 
  imageRect, 
  pins, 
  showGrid, 
  selectedId, 
  onSelect 
}: MapOverlayProps) => {
  return (
    <div
      className="absolute z-10"
      style={{ 
        left: imageRect.x, 
        top: imageRect.y, 
        width: imageRect.width, 
        height: imageRect.height 
      }}
    >
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      )}
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
  );
};

export default MapOverlay;

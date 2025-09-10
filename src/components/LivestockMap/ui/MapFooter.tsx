import React from 'react';

interface MapFooterProps {
  deviceCount: number;
}

const MapFooter = ({ deviceCount }: MapFooterProps) => {
  return (
    <div className="absolute left-3 bottom-3 z-20 rounded-xl bg-black/50 backdrop-blur px-3 py-1.5 text-white text-xs">
      Devices: {deviceCount}
    </div>
  );
};

export default MapFooter;

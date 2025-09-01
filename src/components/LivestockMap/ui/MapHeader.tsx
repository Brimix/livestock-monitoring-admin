import React from 'react';
import {GeoBounds} from '../types';

interface MapHeaderProps {
  bounds: GeoBounds;
}

const MapHeader = ({bounds}: MapHeaderProps) => {
  return (
    <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-xl bg-black/50 backdrop-blur px-3 py-1.5 text-white">
      <div className="text-xs opacity-75">Livestock Map</div>
      <div className="h-1 w-1 rounded-full bg-white/60" />
      <div className="text-[10px] opacity-60">
        N: {bounds.north.toFixed(5)} S: {bounds.south.toFixed(5)} W: {bounds.west.toFixed(5)} E: {bounds.east.toFixed(5)}
      </div>
    </div>
  );
};

export default MapHeader;

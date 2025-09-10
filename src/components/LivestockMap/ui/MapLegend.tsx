import React from 'react';

const MapLegend = () => {
  return (
    <div className="absolute right-3 top-3 z-20 rounded-xl bg-black/50 backdrop-blur px-2 py-1 text-white">
      <div className="flex items-center gap-2 text-[10px]">
        <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> OK
        <span className="h-2 w-2 rounded-full bg-amber-400 inline-block ml-2" /> Warn
        <span className="h-2 w-2 rounded-full bg-red-500 inline-block ml-2" /> Alert
      </div>
    </div>
  );
};

export default MapLegend;

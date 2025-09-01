import React from 'react';

import {LsuDeviceData} from '../../../domain';

interface LocationProps {
  device: LsuDeviceData;
}

const Location = ({device}: LocationProps) => {
  return (
    <section className="rounded-xl border border-white/10 p-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Location</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-white/60 text-xs">Latitude</div>
          <div className="text-white">{Number(device.lat).toFixed(6)}</div>
        </div>
        <div>
          <div className="text-white/60 text-xs">Longitude</div>
          <div className="text-white">{Number(device.lng).toFixed(6)}</div>
        </div>
      </div>
    </section>
  );
};

export default Location;

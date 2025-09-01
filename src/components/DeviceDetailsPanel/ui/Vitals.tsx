import React from 'react';

import {LsuDeviceData} from '../../../domain';

interface VitalsProps {
  device: LsuDeviceData;
}

const Vitals = ({device}: VitalsProps) => {
  return (
    <section className="rounded-xl border border-white/10 p-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Vitals</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-white/60 text-xs">Heart Rate</div>
          <div className="text-white">{device.heartRateBPM != null ? `${device.heartRateBPM} bpm` : "—"}</div>
        </div>
        <div>
          <div className="text-white/60 text-xs">Temperature</div>
          <div className="text-white">{device.temperatureC != null ? `${device.temperatureC} °C` : "—"}</div>
        </div>
      </div>
    </section>
  );
};

export default Vitals;

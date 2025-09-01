import React from 'react';

import {LsuDeviceData} from '../../../domain';

interface MetaProps {
  device: LsuDeviceData;
}

const Meta = ({device}: MetaProps) => {
  const updatedAt = device.updatedAt ? new Date(device.updatedAt) : null;
  return (
    <section className="rounded-xl border border-white/10 p-3 text-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Meta</div>
      <dl className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <dt className="text-white/60">Updated</dt>
          <dd className="text-white">{updatedAt ? updatedAt.toLocaleString() : "—"}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/60">Label</dt>
          <dd className="text-white">{device.label || "—"}</dd>
        </div>
      </dl>
    </section>
  );
};

export default Meta;

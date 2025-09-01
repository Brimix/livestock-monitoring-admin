import React, {useMemo, useState} from 'react';
import LivestockMap from '../../LivestockMap';
import DeviceDetailsPanel from '../../DeviceDetailsPanel';
import {LsuDeviceData} from '../../../domain';

type MapViewProps = {
  devices: LsuDeviceData[];
};

export default function MapView({ devices }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedDevice = useMemo(
    () => devices.find(d => d.id === selectedId) ?? null,
    [devices, selectedId]
  );

  return (
    <div className="grid h-[75dvh] grid-cols-1 gap-3 p-3 md:grid-cols-[2fr_1fr]">
      {/* Left: Map */}
      <div className="min-h-0">
        <LivestockMap
          devices={devices}
          selectedId={selectedId}
          onSelect={setSelectedId}
          maxVh={75}
        />
      </div>

      {/* Right: Details */}
      <div className="min-h-0">
        <DeviceDetailsPanel
          device={selectedDevice}
          onCenter={(id: string) => {
            // optional: if you add a center-on-id API to the map later
            console.log("center on", id);
          }}
        />
      </div>
    </div>
  );
}

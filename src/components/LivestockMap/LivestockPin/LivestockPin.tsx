import React from 'react';

import {LsuDeviceData} from '../../../domain';
import {clamp} from '../utils';

interface LivestockPinProps {
  device: LsuDeviceData;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
  selected: boolean;
  visible: boolean;
  onSelect?: (deviceId: string) => void;
};
const LivestockPin = React.memo(function LivestockPin({
  device,
  x,
  y,
  containerWidth,
  containerHeight,
  selected,
  visible,
  onSelect,
}: LivestockPinProps) {
  const size = selected ? 16 : 12;
  const offset = size / 2;
  const left = clamp(x - offset, 0, containerWidth - size);
  const top = clamp(y - offset, 0, containerHeight - size);


  const color = device.status === "alert" ? "bg-red-500" : device.status === "warn" ? "bg-amber-400" : "bg-emerald-400";
  const ring = device.status === "alert" ? "ring-red-500/60" : device.status === "warn" ? "ring-amber-400/60" : "ring-emerald-400/60";


  const title =
    `${device.label ?? device.id}
    ` +
    (device.heartRateBPM != null ? `HR: ${device.heartRateBPM} bpm
    ` : "") +
    (device.temperatureC != null ? `Temp: ${device.temperatureC} °C
    ` : "") +
    (device.updatedAt ? `Updated: ${new Date(device.updatedAt).toLocaleString()}` : "");


  return (
    <button
      aria-label={`Device ${device.label ?? device.id}`}
      title={title}
      onClick={() => onSelect?.(device.id)}
      className={[
        "absolute rounded-full shadow-lg ring-2",
        ring,
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60",
        visible ? "" : "hidden",
      ].join(" ")}
      style={{ left, top, width: size, height: size }}
    >
      <span
        className={[
          "absolute inset-0 rounded-full animate-ping",
          device.status === "alert" ? "bg-red-500/30" : device.status === "warn" ? "bg-amber-400/30" : "bg-emerald-400/30",
        ].join(" ")}
      />
      <span className={["relative block h-full w-full rounded-full", color].join(" ")} />
    </button>
  );
});

export default LivestockPin;

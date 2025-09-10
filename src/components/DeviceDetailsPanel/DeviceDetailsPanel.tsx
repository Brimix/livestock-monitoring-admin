import React from 'react';
import {LsuDeviceData} from '../../domain';

import {EmptyState, Header, Vitals, Location, Meta} from './ui';

/**
 * DeviceDetailsPanel – compact, responsive side panel for the Map view.
 *
 * Props
 *  - device: currently selected device (or null)
 *  - className?: additional classes
 *  - onClose?: called when user closes the panel (mobile UX)
 *  - onCenter?: optional action to center the map on this device
 */
export type DeviceDetailsPanelProps = {
  device: LsuDeviceData | null | undefined;
  className?: string;
  onClose?: () => void;
  onCenter?: (deviceId: string) => void;
};

const DeviceDetailsPanel = ({ device, className, onClose, onCenter }: DeviceDetailsPanelProps) => {
  return (
    <aside
      className={[
        "h-full w-full rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-white shadow-xl",
        "backdrop-blur",
        className || "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Device details</h2>
        <div className="flex items-center gap-2">
          {device && (
            <button
              className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
              onClick={() => onCenter?.(device.id)}
              title="Center map on device"
            >
              Center
            </button>
          )}
          {onClose && (
            <button
              className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
              onClick={onClose}
              title="Close"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {!device ? (
        <EmptyState />
      ) : (
        <div className="mt-3 space-y-3">
          <Header device={device} />
          <Vitals device={device} />
          <Location device={device} />
          <Meta device={device} />
        </div>
      )}
    </aside>
  );
};

export default DeviceDetailsPanel;

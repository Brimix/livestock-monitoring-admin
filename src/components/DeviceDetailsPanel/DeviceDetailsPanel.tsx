import React from 'react';
import {LsuDeviceData} from '../../domain';

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

function EmptyState() {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/70">
      Select a device on the map to see details.
    </div>
  );
}

function Header({ device }: { device: LsuDeviceData }) {
  const status = device.status ?? "ok";
  const statusStyles =
    status === "alert"
      ? "bg-red-500/15 text-red-300 ring-red-400/30"
      : status === "warn"
      ? "bg-amber-400/15 text-amber-200 ring-amber-300/30"
      : "bg-emerald-400/15 text-emerald-200 ring-emerald-300/30";

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="text-lg font-medium leading-tight">
          {device.label || device.id}
        </div>
        <div className="text-xs text-white/60">ID: {device.id}</div>
      </div>
      <span className={["rounded-full px-2 py-0.5 text-xs ring-1", statusStyles].join(" ")}>{status}</span>
    </div>
  );
}

function Vitals({ device }: { device: LsuDeviceData }) {
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
}

function Location({ device }: { device: LsuDeviceData }) {
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
}

function Meta({ device }: { device: LsuDeviceData }) {
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
}

import React from 'react';
import {LsuDeviceData, LsuDeviceStatus} from '../../../domain';

interface HeaderProps {
  device: LsuDeviceData;
}

const Header = ({device}: HeaderProps) => {
  const status = device.status ?? LsuDeviceStatus.OK;
  const statusStyles =
    status === LsuDeviceStatus.ALERT
      ? "bg-red-500/15 text-red-300 ring-red-400/30"
      : status === LsuDeviceStatus.WARN
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

export default Header;

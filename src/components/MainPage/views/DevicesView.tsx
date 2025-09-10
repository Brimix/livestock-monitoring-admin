import React, {useState, useEffect} from 'react';

import {DeviceService} from '../../../services';
import {LsuDeviceData, LsuDeviceStatus} from '../../../domain';

interface DevicesViewProps {
  service: DeviceService;
}

const DevicesView = ({service}: DevicesViewProps) => {
  const [devices, setDevices] = useState<LsuDeviceData[]>([]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

  const refreshData = () => {
    const allDevices = service.getActiveDevices();
    setDevices(allDevices);
    setDeviceCount(allDevices.length);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status?: LsuDeviceStatus) => {
    switch (status) {
      case LsuDeviceStatus.OK:
        return 'text-green-400 bg-green-400/10';
      case LsuDeviceStatus.WARN:
        return 'text-yellow-400 bg-yellow-400/10';
      case LsuDeviceStatus.ALERT:
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status?: LsuDeviceStatus) => {
    switch (status) {
      case LsuDeviceStatus.OK:
        return 'OK';
      case LsuDeviceStatus.WARN:
        return 'WARNING';
      case LsuDeviceStatus.ALERT:
        return 'ALERT';
      default:
        return 'UNKNOWN';
    }
  };

  const formatTimestamp = (timestamp?: string | Date) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with stats */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Connected Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Total Devices</div>
            <div className="text-2xl font-bold text-blue-400">{deviceCount}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Status Overview</div>
            <div className="text-sm text-gray-300">
              {devices.filter(d => d.status === LsuDeviceStatus.OK).length} OK, {' '}
              {devices.filter(d => d.status === LsuDeviceStatus.WARN).length} Warning, {' '}
              {devices.filter(d => d.status === LsuDeviceStatus.ALERT).length} Alert
            </div>
          </div>
        </div>
      </div>

      {/* Devices table */}
      <div className="flex-1 overflow-auto">
        {devices.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">No devices connected</div>
              <div className="text-gray-500 text-sm">Devices will appear here when they connect and send data</div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Device ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Temperature</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Heart Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Alert Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Last Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm">{device.id}</div>
                        {device.label && device.label !== device.id && (
                          <div className="text-xs text-gray-400">{device.label}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(device.status)}`}>
                          {getStatusText(device.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div>Lat: {formatCoordinate(device.lat)}</div>
                          <div>Lng: {formatCoordinate(device.lng)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {device.temperatureC !== undefined ? (
                            <span className="text-blue-400">{device.temperatureC.toFixed(1)}°C</span>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {device.heartRateBPM !== undefined ? (
                            <span className="text-green-400">{device.heartRateBPM} BPM</span>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {device.alertDescription ? (
                            <span className={`max-w-xs truncate ${device.status === LsuDeviceStatus.ALERT ? 'text-red-400' : 'text-orange-400'}`} title={device.alertDescription}>
                              {device.alertDescription}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-300">
                          {formatTimestamp(device.updatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Refresh controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Auto-refresh every {refreshInterval / 1000}s
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Refresh Now
          </button>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-1 bg-white/10 text-white text-sm rounded border border-white/20"
          >
            <option value={1000}>1s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={0}>Manual</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DevicesView;

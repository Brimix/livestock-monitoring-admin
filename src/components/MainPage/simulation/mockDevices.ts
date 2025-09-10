import { LsuDeviceData, LsuDeviceStatus } from '../../../domain';

/**
 * Mock device data for testing the UI
 * Coordinates are within the Rosario, Argentina map bounds:
 * North: -32.930619, South: -32.971265, East: -60.608414, West: -60.676064
 */
export const MOCK_DEVICES: LsuDeviceData[] = [
  {
    id: '2',
    lat: -32.9450,
    lng: -60.6200,
    label: 'Cow Alpha',
    heartRateBPM: 72,
    temperatureC: 38.2,
    ambientTemperatureC: 22.5,
    status: LsuDeviceStatus.OK,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: '3',
    lat: -32.9350,
    lng: -60.6400,
    label: 'Cow Beta',
    heartRateBPM: 85,
    temperatureC: 39.8,
    ambientTemperatureC: 25.1,
    status: LsuDeviceStatus.WARN,
    alertDescription: 'Elevated heart rate: 85 BPM - Monitor for stress or illness',
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: '4',
    lat: -32.9600,
    lng: -60.6400,
    label: 'Cow Gamma',
    heartRateBPM: 0,
    temperatureC: 25.5,
    ambientTemperatureC: 28.3,
    status: LsuDeviceStatus.ALERT,
    alertDescription: 'CRITICAL: 0 BPM detected - Cow may be deceased',
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
  },
  {
    id: '5',
    lat: -32.9500,
    lng: -60.6100,
    label: 'Cow Delta',
    heartRateBPM: 68,
    temperatureC: 37.8,
    ambientTemperatureC: 20.1,
    status: LsuDeviceStatus.OK,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
  },
  {
    id: '6',
    lat: -32.9400,
    lng: -60.6300,
    label: 'Cow Epsilon',
    heartRateBPM: 95,
    temperatureC: 40.1,
    ambientTemperatureC: 30.5,
    status: LsuDeviceStatus.WARN,
    alertDescription: 'Elevated heart rate: 95 BPM - Monitor for stress or illness',
    updatedAt: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
  },
  {
    id: '7',
    lat: -32.9550,
    lng: -60.6600,
    label: 'Cow Zeta',
    heartRateBPM: 75,
    temperatureC: 38.5,
    ambientTemperatureC: 23.8,
    status: LsuDeviceStatus.WARN,
    alertDescription: 'Temperature difference too small: 38.5°C vs 23.8°C ambient - Cow may be dead or sensor malfunction',
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
  },
  {
    id: '8',
    lat: -32.9650,
    lng: -60.6200,
    label: 'Cow Eta',
    heartRateBPM: 82,
    temperatureC: 39.5,
    ambientTemperatureC: 26.2,
    status: LsuDeviceStatus.WARN,
    alertDescription: 'Elevated temperature: 39.5°C - Monitor for fever',
    updatedAt: new Date(Date.now() - 45 * 1000).toISOString(), // 45 seconds ago
  },
  {
    id: '9',
    lat: -32.9400,
    lng: -60.6400,
    label: 'Cow Theta',
    heartRateBPM: 70,
    temperatureC: 38.0,
    ambientTemperatureC: 21.3,
    status: LsuDeviceStatus.OK,
    updatedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 minutes ago
  },
  {
    id: '10',
    lat: -32.9500,
    lng: -60.6500,
    label: 'Cow Iota',
    heartRateBPM: 65,
    temperatureC: 37.5,
    ambientTemperatureC: 20.0,
    status: LsuDeviceStatus.ALERT,
    alertDescription: 'Device timeout - No data received for 15+ minutes',
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
  }
];

/**
 * Generate random data counts for mock devices
 * @param deviceId - The device ID
 * @returns Random number between 10-60
 */
export const generateMockDataCount = (deviceId: string): number => {
  // Use device ID as seed for consistent random generation
  let hash = 0;
  for (let i = 0; i < deviceId.length; i++) {
    const char = deviceId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 51 + 10; // 10-60 range
};

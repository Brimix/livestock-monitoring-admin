import {LsuDeviceData, LsuDeviceStatus} from '../domain';
import {MOCK_DEVICES} from './__mocks__/devices';

export interface DeviceService {
  getDeviceById(id: string): Promise<LsuDeviceData | null>;
  getAllDevices(): Promise<LsuDeviceData[]>;
  updateDeviceStatus(id: string, status: LsuDeviceStatus): Promise<void>;
  getDeviceHealthMetrics(id: string): Promise<{
    heartRate: number | null;
    temperature: number | null;
    lastUpdate: Date | null;
  }>;
}

export class DeviceServiceImpl implements DeviceService {
  async getDeviceById(_id: string): Promise<LsuDeviceData | null> {
    // Implementation would connect to infrastructure layer
    // For now, return mock data
    return null;
  }

  async getAllDevices(): Promise<LsuDeviceData[]> {
    // Implementation would connect to infrastructure layer
    return MOCK_DEVICES;
  }

  async updateDeviceStatus(_id: string, _status: LsuDeviceStatus): Promise<void> {
    // Implementation would connect to infrastructure layer
  }

  async getDeviceHealthMetrics(_id: string): Promise<{
    heartRate: number | null;
    temperature: number | null;
    lastUpdate: Date | null;
  }> {
    // Implementation would connect to infrastructure layer
    return {
      heartRate: null,
      temperature: null,
      lastUpdate: null,
    };
  }
}

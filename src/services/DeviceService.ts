import {LsuDeviceData, LsuDeviceStatus} from '../domain';
import {MOCK_DEVICES} from './__mocks__/devices';

interface DeviceServiceI {
  getDeviceById(id: string): LsuDeviceData | null;
  getAllDevices(): LsuDeviceData[];
  updateDeviceStatus(id: string, status: LsuDeviceStatus): void;
  getDeviceHealthMetrics(id: string): {
    heartRate: number | null;
    temperature: number | null;
    lastUpdate: Date | null;
  };
}

class DeviceService implements DeviceServiceI {
  getDeviceById(_id: string): LsuDeviceData | null {
    // Implementation would connect to infrastructure layer
    // For now, return mock data
    return null;
  }

  getAllDevices(): LsuDeviceData[] {
    // Implementation would connect to infrastructure layer
    return MOCK_DEVICES;
  }

  updateDeviceStatus(_id: string, _status: LsuDeviceStatus): void {
    // Implementation would connect to infrastructure layer
  }

  getDeviceHealthMetrics(_id: string): {
    heartRate: number | null;
    temperature: number | null;
    lastUpdate: Date | null;
  } {
    // Implementation would connect to infrastructure layer
    return {
      heartRate: null,
      temperature: null,
      lastUpdate: null,
    };
  }
}

export default DeviceService;

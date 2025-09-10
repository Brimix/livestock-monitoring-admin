import {LsuDeviceData, LsuDeviceStatus} from '../../domain';

export interface DeviceRepositoryI {
  saveDeviceData(deviceData: LsuDeviceData): void;
  getActiveDevices(): LsuDeviceData[];
  getDeviceById(id: string): LsuDeviceData | null;
  getDeviceLatestData(id: string): LsuDeviceData | null;
}

class DeviceRepository implements DeviceRepositoryI {
  private devices: Map<string, LsuDeviceData> = new Map();
  private dataCounts: Map<string, number> = new Map();

  constructor() {
    // Repository starts empty
  }

  saveDeviceData(deviceData: LsuDeviceData): void {
    // Ensure updatedAt is set to now if not provided
    const deviceWithTimestamp: LsuDeviceData = {
      ...deviceData,
      updatedAt: deviceData.updatedAt || new Date().toISOString(),
    };
    
    this.devices.set(deviceWithTimestamp.id, deviceWithTimestamp);
    
    // Increment data count
    const currentCount = this.dataCounts.get(deviceWithTimestamp.id) || 0;
    this.dataCounts.set(deviceWithTimestamp.id, currentCount + 1);
  }

  getActiveDevices(): LsuDeviceData[] {
    return Array.from(this.devices.values())
      .sort((a, b) => {
        // Sort by device ID (numeric)
        const aId = parseInt(a.id, 10);
        const bId = parseInt(b.id, 10);
        return aId - bId;
      });
  }

  getDeviceById(id: string): LsuDeviceData | null {
    return this.devices.get(id) || null;
  }

  getDeviceLatestData(id: string): LsuDeviceData | null {
    return this.getDeviceById(id);
  }
}

export default DeviceRepository;

import {LsuDeviceData, LsuDeviceStatus, MqttMessage} from '../domain';
import {DeviceRepositoryI} from '../infrastructure';
import {MqttParsingUtils} from './MqttParsingUtils';

interface DeviceServiceI {
  handleMqttMessage(message: MqttMessage): void;
  saveDeviceData(deviceData: LsuDeviceData): void;
  getActiveDevices(): LsuDeviceData[];
  getDeviceById(id: string): LsuDeviceData | null;
}

class DeviceService implements DeviceServiceI {
  private repository: DeviceRepositoryI;

  constructor(repository: DeviceRepositoryI) {
    this.repository = repository;
  }

  handleMqttMessage(message: MqttMessage): void {
    try {
      if (!MqttParsingUtils.isValidTopic(message.topic)) {
        console.warn('Invalid topic format:', message.topic);
        return;
      }

      const topicType = MqttParsingUtils.parseTopicType(message.topic);
      const deviceId = MqttParsingUtils.extractDeviceIdFromTopic(message.topic);
      
      if (!deviceId) {
        console.warn('Could not extract device ID from topic:', message.topic);
        return;
      }

      switch (topicType) {
        case 'link':
          this.handleLinkMessage(deviceId);
          break;
        case 'data':
          this.handleDataMessage(deviceId, message);
          break;
        case 'alert':
          this.handleAlertMessage(deviceId, message);
          break;
        default:
          console.warn('Unknown topic type:', topicType, 'for topic:', message.topic);
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }


  private handleLinkMessage(deviceId: string): void {
    // LSU was created - create a basic device entry
    const device: LsuDeviceData = {
      id: deviceId,
      lat: 0, // Will be updated when data is received
      lng: 0, // Will be updated when data is received
      label: deviceId,
      status: LsuDeviceStatus.OK,
      updatedAt: new Date().toISOString(),
    };
    this.repository.saveDeviceData(device);
  }

  private handleDataMessage(deviceId: string, message: MqttMessage): void {
    // Parse the sensing data from the payload
    const payload = MqttParsingUtils.parsePayload(deviceId, message.payload);
    if (!payload) return;

    // Extract coordinates
    const coordinates = MqttParsingUtils.extractCoordinates(payload);
    if (!coordinates) return;

    // Extract health metrics
    const healthMetrics = MqttParsingUtils.extractHealthMetrics(payload);

    // Determine status based on health metrics
    let status: LsuDeviceStatus = LsuDeviceStatus.OK;
    let alertDescription: string | undefined;

    // Check for critical alert conditions first
    if (healthMetrics.heartRateBPM === 0) {
      status = LsuDeviceStatus.ALERT;
      alertDescription = 'CRITICAL: 0 BPM detected - Cow may be deceased';
    } else {
      // Check temperature range
      if (healthMetrics.temperatureC != null && (healthMetrics.temperatureC < 35 || healthMetrics.temperatureC > 40.5)) {
        status = LsuDeviceStatus.WARN;
        if (healthMetrics.temperatureC > 40.5) {
          alertDescription = `Elevated temperature: ${healthMetrics.temperatureC.toFixed(1)}°C - Monitor for fever`;
        }
      }

      // Check heart rate range
      if (healthMetrics.heartRateBPM != null && (healthMetrics.heartRateBPM < 30 || healthMetrics.heartRateBPM > 140)) {
        status = LsuDeviceStatus.WARN;
        if (alertDescription) {
          alertDescription += `; Elevated heart rate: ${healthMetrics.heartRateBPM} BPM - Monitor for stress or illness`;
        } else {
          alertDescription = `Elevated heart rate: ${healthMetrics.heartRateBPM} BPM - Monitor for stress or illness`;
        }
      }

      // Check temperature difference (cow should be considerably higher than ambient)
      if (healthMetrics.temperatureC != null && payload.ambientTemperatureC != null) {
        const tempDifference = healthMetrics.temperatureC - payload.ambientTemperatureC;
        if (tempDifference < 5) { // Less than 5°C difference is concerning
          status = LsuDeviceStatus.WARN;
          if (alertDescription) {
            alertDescription += `; Temperature difference too small: ${healthMetrics.temperatureC.toFixed(1)}°C vs ${payload.ambientTemperatureC.toFixed(1)}°C ambient - Cow may be dead or sensor malfunction`;
          } else {
            alertDescription = `Temperature difference too small: ${healthMetrics.temperatureC.toFixed(1)}°C vs ${payload.ambientTemperatureC.toFixed(1)}°C ambient - Cow may be dead or sensor malfunction`;
          }
        }
      }
    }

    const device: LsuDeviceData = {
      id: deviceId,
      lat: coordinates.lat,
      lng: coordinates.lng,
      label: payload.label ?? deviceId,
      heartRateBPM: healthMetrics.heartRateBPM,
      temperatureC: healthMetrics.temperatureC,
      ambientTemperatureC: payload.ambientTemperatureC,
      updatedAt: payload.updatedAt,
      status,
      alertDescription,
    };

    this.repository.saveDeviceData(device);
  }

  private handleAlertMessage(deviceId: string, message: MqttMessage): void {
    // Parse alert description from payload
    const alertDescription = MqttParsingUtils.parseAlertPayload(message.payload) || undefined;
    
    // Update device status to ALERT and include alert description
    const existingDevice = this.repository.getDeviceById(deviceId);
    if (!existingDevice) {
      // Create a basic device entry if it doesn't exist
      const device: LsuDeviceData = {
        id: deviceId,
        lat: 0,
        lng: 0,
        label: deviceId,
        status: LsuDeviceStatus.ALERT,
        updatedAt: new Date().toISOString(),
        alertDescription,
      };
      this.repository.saveDeviceData(device);
    } else {
      // Update existing device with alert status
      const updatedDevice: LsuDeviceData = {
        ...existingDevice,
        status: LsuDeviceStatus.ALERT,
        updatedAt: new Date().toISOString(),
        alertDescription,
      };
      this.repository.saveDeviceData(updatedDevice);
    }
  }

  saveDeviceData(deviceData: LsuDeviceData): void {
    this.repository.saveDeviceData(deviceData);
  }

  getActiveDevices(): LsuDeviceData[] {
    return this.repository.getActiveDevices();
  }

  getDeviceById(id: string): LsuDeviceData | null {
    return this.repository.getDeviceById(id);
  }
}

export default DeviceService;

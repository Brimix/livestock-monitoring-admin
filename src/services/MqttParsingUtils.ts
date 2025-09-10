import { LsuDeviceData, MqttMessage } from '../domain';

export class MqttParsingUtils {
  /**
   * Parse topic format: livestock/<id>/<type>
   * Returns the topic type: 'link', 'data', or 'alert'
   */
  static parseTopicType(topic: string): string | null {
    const parts = topic.split('/');
    if (parts.length !== 3 || parts[0] !== 'livestock') {
      return null;
    }
    return parts[2]; // link, data, or alert
  }

  /**
   * Extract device ID from topic format: livestock/<id>/<type>
   * Returns the device ID
   */
  static extractDeviceIdFromTopic(topic: string): string | null {
    const parts = topic.split('/');
    if (parts.length !== 3 || parts[0] !== 'livestock') {
      return null;
    }
    return parts[1]; // device ID
  }

  /**
   * Parse MQTT message payload into a structured object
   */
  static parsePayload(deviceId: string, payload: string): LsuDeviceData | null {
    // Handle pipe-separated format: lat|lon|animalTemp|ambientTemp|heartRate
    const parts = payload.split('|');
    if (parts.length >= 5) {

      const lat = parseFloat(parts[0]) / 1000000; // Scale back from 1,000,000
      const lng = parseFloat(parts[1]) / 1000000;
      const animalTemp = parseFloat(parts[2]);
      const ambientTemp = parseFloat(parts[3]);
      const heartRate = parseFloat(parts[4]);

      return {
        id: deviceId,
        lat,
        lng,
        temperatureC: animalTemp,
        ambientTemperatureC: ambientTemp,
        heartRateBPM: heartRate,
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  }

  /**
   * Parse alert message payload to extract alert description
   */
  static parseAlertPayload(payload: string): string | null {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(payload);
      return parsed.description || parsed.message || parsed.alert || payload;
    } catch {
      // If not JSON, return the raw payload as description
      return payload || null;
    }
  }

  /**
   * Validate that a topic follows the expected format
   */
  static isValidTopic(topic: string): boolean {
    const parts = topic.split('/');
    return parts.length === 3 &&
      parts[0] === 'livestock' &&
      parts[1].length > 0 &&
      ['link', 'data', 'alert'].includes(parts[2]);
  }

  /**
   * Extract coordinates from parsed payload
   * Returns { lat, lng } or null if invalid
   */
  static extractCoordinates(payload: LsuDeviceData): {lat: number; lng: number} | null {
    const lat = Number(payload.lat);
    const lng = Number(payload.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  }

  /**
   * Extract health metrics from parsed payload
   * Returns { heartRateBPM, temperatureC } with undefined values if not present
   */
  static extractHealthMetrics(payload: LsuDeviceData): {
    heartRateBPM?: number;
    temperatureC?: number;
  } {
    const heartRateBPM = payload.heartRateBPM;
    const temperatureC = payload.temperatureC;

    return {
      heartRateBPM: heartRateBPM != null ? Number(heartRateBPM) : undefined,
      temperatureC: temperatureC != null ? Number(temperatureC) : undefined,
    };
  }
}

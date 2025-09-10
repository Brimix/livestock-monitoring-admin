import {LsuDeviceData, LsuDeviceStatus, MqttMessage} from '../../../domain';

/**
 * Select the latest message per device and convert to LivestockDevice[] for the map.
 */
const selectDevicesFromMessages = (messages: MqttMessage[]): LsuDeviceData[] => {
  const latestById = new Map<string, MqttMessage>();

  for (const m of messages) {
    const id = (m as any).deviceId || (m as any).id || (m as any).payload?.deviceId;
    if (!id) continue;
    const ts = new Date((m as any).timestamp || (m as any).ts || (m as any).payload?.timestamp || 0).getTime();

    const prev = latestById.get(id);
    if (!prev) {
      latestById.set(id, m);
    } else {
      const prevTs = new Date((prev as any).timestamp || (prev as any).ts || (prev as any).payload?.timestamp || 0).getTime();
      if (ts >= prevTs) latestById.set(id, m);
    }
  }

  const devices: LsuDeviceData[] = [];
  for (const [id, m] of latestById.entries()) {
    const payload = (m as any).payload ?? m;
    const lat = Number(payload.lat ?? payload.latitude);
    const lng = Number(payload.lng ?? payload.lon ?? payload.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue; // skip invalid

    const heartRateBPM = payload.heartRate ?? payload.hr ?? payload.heart_rate;
    const temperatureC = payload.temperature ?? payload.tempC ?? payload.temp;

    // naive status heuristic — feel free to replace with your own
    let status: LsuDeviceStatus = LsuDeviceStatus.OK;
    if (temperatureC != null && (temperatureC < 35 || temperatureC > 40.5)) status = LsuDeviceStatus.WARN;
    if (heartRateBPM != null && (heartRateBPM < 30 || heartRateBPM > 140)) status = LsuDeviceStatus.WARN;

    devices.push({
      id,
      lat,
      lng,
      label: payload.label ?? id,
      heartRateBPM: heartRateBPM != null ? Number(heartRateBPM) : undefined,
      temperatureC: temperatureC != null ? Number(temperatureC) : undefined,
      updatedAt: (m as any).timestamp ?? payload.timestamp,
      status,
    });
  }

  return devices;
}

export default selectDevicesFromMessages;

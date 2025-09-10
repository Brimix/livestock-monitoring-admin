export enum LsuDeviceStatus {
  OK = 'ok',
  WARN = 'warn',
  ALERT = 'alert',
};

export type LsuDeviceData = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  heartRateBPM?: number;
  temperatureC?: number;
  ambientTemperatureC?: number;
  updatedAt?: string | Date;
  status?: LsuDeviceStatus;
  alertDescription?: string;
};

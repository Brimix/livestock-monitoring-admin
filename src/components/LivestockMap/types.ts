import {LsuDeviceData} from '../../domain';

export type GeoBounds = {
  north: number; // max latitude
  south: number; // min latitude
  east: number;  // max longitude
  west: number;  // min longitude
};

export type DevicePin = {
  device: LsuDeviceData;
  x: number;
  y: number;
  visible: boolean;
};

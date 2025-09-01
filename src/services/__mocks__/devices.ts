import {LsuDeviceData, LsuDeviceStatus} from '../../domain';

const MOCK_MAXI_DEVICE: LsuDeviceData = {
  id: "Maxi",
  lat: -32.9359014,
  lng: -60.6437403,
  label: "Maxeto house",
  heartRateBPM: 100,
  temperatureC: 30,
  updatedAt: "13-09-21",
  status: LsuDeviceStatus.OK,
};

const MOCK_BRI_DEVICE: LsuDeviceData = {
  id: "Brian",
  lat: -32.9404768,
  lng: -60.6527411,
  label: "Brian house",
  heartRateBPM: 80,
  temperatureC: 20,
  updatedAt: "13-09-22",
  status: LsuDeviceStatus.WARN,
};

const MOCK_SIBERIA_DEVICE: LsuDeviceData = {
  id: "Siberia",
  lat: -32.9687054,
  lng: -60.6242136,
  label: "La biblio",
  heartRateBPM: 130,
  temperatureC: 10,
  updatedAt: "13-09-23",
  status: LsuDeviceStatus.ALERT,
};

export const MOCK_DEVICES: LsuDeviceData[] = [
  MOCK_MAXI_DEVICE,
  MOCK_BRI_DEVICE,
  MOCK_SIBERIA_DEVICE,
];

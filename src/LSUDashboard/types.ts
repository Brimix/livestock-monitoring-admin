export enum Status {
  OFFLINE = "offline",
  CONNECTING = "connecting",
  ONLINE = "online",
}
  
export type MqttMessage = {
  topic: string;
  payload: string;
  ts: number;
};
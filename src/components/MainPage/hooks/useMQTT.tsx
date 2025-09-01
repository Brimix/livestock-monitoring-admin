import {useEffect, useRef, useState} from 'react';
import mqtt, {MqttClient} from 'mqtt';

import {MQTT_HOSTNAME, MQTT_PORT, MQTT_TOPIC} from '../../LSUDashboard/constants';
import {MqttMessage, MqttStatus} from '../../../domain';

interface UseMQTTProps {
  onMessage: (message: MqttMessage) => void;
}
const useMQTT = ({onMessage}: UseMQTTProps) => {
  const [status, setStatus] = useState(MqttStatus.OFFLINE);
  const clientRef = useRef<MqttClient | null>(null);

  const connect = () => {
    if (clientRef.current && clientRef.current.connected) return;

    setStatus(MqttStatus.CONNECTING);
    const url = `ws://${MQTT_HOSTNAME}:${MQTT_PORT}`;

    const cli = mqtt.connect(url, {
      clientId: `dashboard-${crypto.randomUUID().slice(0, 8)}`,
      keepalive: 30,
    });

    cli.on("connect", () => {
      setStatus(MqttStatus.ONLINE);
      cli.subscribe(MQTT_TOPIC);
    });

    cli.on("message", (topic, payload) => 
      onMessage({topic, payload: payload.toString(), ts: Date.now()})
    );

    cli.on("close", () => setStatus(MqttStatus.OFFLINE));
    cli.on("error", () => setStatus(MqttStatus.OFFLINE));

    clientRef.current = cli;
  };

  const disconnect = () => {
    clientRef.current?.end(true);
    setStatus(MqttStatus.OFFLINE);
  };

  useEffect(
    function connectOnMount() {
      connect();
      return () => disconnect();
    },
    []
  );

  return {status, connect, disconnect, clientRef};
};

export default useMQTT;

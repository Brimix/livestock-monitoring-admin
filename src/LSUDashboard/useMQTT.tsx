import {useEffect, useRef, useState} from 'react';
import mqtt, {MqttClient} from 'mqtt';

import {MQTT_HOSTNAME, MQTT_PORT, MQTT_TOPIC} from './constants';
import {MqttMessage, Status} from './types';

interface UseMQTTProps {
  onMessage: (message: MqttMessage) => void;
}
const useMQTT = ({onMessage}: UseMQTTProps) => {
  const [status, setStatus] = useState(Status.OFFLINE);
  const clientRef = useRef<MqttClient | null>(null);

  const connect = () => {
    if (clientRef.current && clientRef.current.connected) return;

    setStatus(Status.CONNECTING);
    const url = `ws://${MQTT_HOSTNAME}:${MQTT_PORT}`;

    const cli = mqtt.connect(url, {
      clientId: `dashboard-${crypto.randomUUID().slice(0, 8)}`,
      keepalive: 30,
    });

    cli.on("connect", () => {
      setStatus(Status.ONLINE);
      cli.subscribe(MQTT_TOPIC);
    });

    cli.on("message", (topic, payload) => 
      onMessage({topic, payload: payload.toString(), ts: Date.now()})
    );

    cli.on("close", () => setStatus(Status.OFFLINE));
    cli.on("error", () => setStatus(Status.OFFLINE));

    clientRef.current = cli;
  };

  const disconnect = () => {
    clientRef.current?.end(true);
    setStatus(Status.OFFLINE);
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

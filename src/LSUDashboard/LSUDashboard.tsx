import React, {useState} from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { MqttMessage } from './types';
import useMQTT from './useMQTT';
import ConnectionSubheader from './ConnectionSubheader';
import LSUMessage from './LSUMessage';
/**
 * Simple MQTT dashboard component
 *
 * ‣ Connects via WebSocket to `mqtt://<BROKER_HOST>:<WS_PORT>`
 * ‣ Subscribes to the topic pattern `demo/#`
 * ‣ Renders each incoming payload in a scrollable list
 *
 * Environment variables (Vite style):
 *   VITE_MQTT_HOST   default "localhost"
 *   VITE_MQTT_PORT   default "9001"
 */
export default function LSUDashboard() {
  /* ------------------------------ state ------------------------------ */
  const [messages, setMessages] = useState<MqttMessage[]>([]);

  const onMessage = (message: MqttMessage) => {
    setMessages((prev) => [message, ...prev]);
  };

  const {status, connect, disconnect} = useMQTT({onMessage});

  /* ------------------------------ render ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 flex flex-col items-center p-4 w-full">
      <div className="w-full rounded-lg border bg-card text-card-foreground shadow-2xl">
        <ConnectionSubheader status={status} connect={connect} disconnect={disconnect} />
        <CardContent className="space-y-4">
          <div className="h-96 overflow-y-auto border rounded-lg p-2 bg-black/30 font-mono text-sm">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet…</p>
            ) : (
              messages.map((m, idx) => <LSUMessage key={idx} message={m} />)
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}

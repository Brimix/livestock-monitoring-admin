import React, {useState} from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { MqttMessage } from './types';
import useMQTT from './useMQTT';
import ConnectionSubheader from './ConnectionSubheader';
import LSUMessage from './LSUMessage';
import QRCodeBlock from '../components/QRCodeBlock';
import posterQR from '../assets/poster.png';
import externalQR from '../assets/external.png';

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
    <div className="h-full bg-gray-950 text-gray-50 p-4 w-full">
      <div className="flex gap-6 h-full">
        {/* Left Side Panel - Poster QR Code */}
        <div className="w-64 flex-shrink-0">
          <QRCodeBlock 
            title="App Poster"
            description="Scan to view the app explanation poster"
            size="lg"
            imageSrc={posterQR}
            imageAlt="App Poster QR Code"
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1">
          <div className="w-full rounded-lg border bg-card text-card-foreground shadow-2xl h-full">
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

        {/* Right Side Panel - External Links QR Code */}
        <div className="w-64 flex-shrink-0">
          <QRCodeBlock 
            title="External Links"
            description="Scan to access our linktree with useful resources"
            size="lg"
            imageSrc={externalQR}
            imageAlt="External Links QR Code"
          />
        </div>
      </div>
    </div>
  );
}

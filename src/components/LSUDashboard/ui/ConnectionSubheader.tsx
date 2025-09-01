import React from 'react';
import {BadgeCheck, PlugZap, WifiOff} from 'lucide-react';

import {MqttStatus} from '../../../domain';
import {MQTT_CONFIG} from '../../../infrastructure';

interface ConnectionSubheaderI {
  status: MqttStatus;
}
const ConnectionSubheader = ({status}: ConnectionSubheaderI) => {
  return (
    <div className="w-full flex justify-between items-center p-4">
      <div className="text-xl font-bold flex items-center gap-2">
        <div className="font-bold"> MQTT Dashboard </div>
        {status === MqttStatus.ONLINE && (
          <>
            <BadgeCheck className="h-5 w-5 text-green-400" />
            <span className="font-mono text-sm text-gray-400">Subscribed to {MQTT_CONFIG.topic}</span>
          </>
        )}
        {status === MqttStatus.CONNECTING && <PlugZap className="h-5 w-5 text-yellow-400 animate-pulse" />}
        {status === MqttStatus.OFFLINE && <WifiOff className="h-5 w-5 text-red-400" />}
      </div>
    </div>
  );
};

export default ConnectionSubheader;

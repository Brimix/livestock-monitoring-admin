import React from 'react';
import {BadgeCheck, PlugZap, WifiOff} from 'lucide-react';

import {MQTT_TOPIC} from '../constants';
import {Status} from '../types';
import ConnectionButton from './ConnectionButton';

interface ConnectionSubheaderI {
  status: Status;
  connect: () => void;
  disconnect: () => void;
}
const ConnectionSubheader = ({status, connect, disconnect}: ConnectionSubheaderI) => {
  return (
    <div className="w-full flex justify-between items-center p-4">
      <div className="text-xl font-bold flex items-center gap-2">
        <div className="font-bold"> MQTT Dashboard </div>
        {status === Status.ONLINE && (
          <>
            <BadgeCheck className="h-5 w-5 text-green-400" />
            <span className="font-mono text-sm text-gray-400">Subscribed to {MQTT_TOPIC}</span>
          </>
        )}
        {status === Status.CONNECTING && <PlugZap className="h-5 w-5 text-yellow-400 animate-pulse" />}
        {status === Status.OFFLINE && <WifiOff className="h-5 w-5 text-red-400" />}
      </div>
      {status === Status.ONLINE ? (
        <ConnectionButton onClick={disconnect}> Disconnect </ConnectionButton>
      ) : (
        <ConnectionButton onClick={connect}> Connect </ConnectionButton>
      )}
    </div>
  );
};

export default ConnectionSubheader;

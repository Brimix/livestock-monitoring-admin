import React, { useCallback, useMemo, useState } from 'react';

import {MqttMessage} from '../../domain';

import {TabButton, MqttStatusDisplay} from './ui';
import {selectDevicesFromMessages} from './services';
import useMQTT from './hooks/useMQTT';
import DashboardView from './views/DashboardView';
import MapView from './views/MapView';

import { MOCK_DEVICES } from '../../services/__mocks__/devices';

/**
 * ViewsWrapper – top-level tabbed view that hosts the Dashboard and the Map.
 * - Holds MQTT connection & message buffer
 * - Renders tabs row and the active view
 * - Passes {messages, status, connect, disconnect} to Dashboard
 */
const MainPage = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "map">("map");

  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const onMessage = useCallback((message: MqttMessage) => {
    setMessages((prev) => [message, ...prev]);
  }, []);

  const {status, connect, disconnect} = useMQTT({onMessage});

  // Map devices derived from messages
  const devices = useMemo(() => selectDevicesFromMessages(messages), [messages]);

  return (
    <div className="flex h-[85dvh] w-full flex-col bg-neutral-950 text-white">
      {/* Tabs row */}
      <nav className="sticky top-0 z-20 flex items-center gap-2 border-b border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
        <TabButton
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />
        <TabButton
          label="Map"
          active={activeTab === "map"}
          onClick={() => setActiveTab("map")}
        />
        <MqttStatusDisplay
          status={status}
          connect={connect}
          disconnect={disconnect}
        />
      </nav>

      {/* Content area */}
      <div className="flex-1 min-h-0 overflow-auto p-3">
        {activeTab === "dashboard" ? (
          <DashboardView messages={messages} status={status} />
        ) : (
          <MapView devices={MOCK_DEVICES}/>
        )}
      </div>
    </div>
  );
};

export default MainPage;

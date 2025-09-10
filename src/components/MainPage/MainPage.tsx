import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';

import {MqttMessage} from '../../domain';
import {DeviceService} from '../../services';
import {DeviceRepository} from '../../infrastructure';
// import {simulateMqttScenarioWithService} from './simulation'; // Disabled - using actual MQTT data

import {TabButton, MqttStatusDisplay} from './ui';
import useMQTT from './hooks/useMQTT';
import DashboardView from './views/DashboardView';
import MapView from './views/MapView';
import DevicesView from './views/DevicesView';

enum TabType {
  DASHBOARD = "dashboard",
  MAP = "map",
  DEVICES = "devices"
}

/**
 * ViewsWrapper – top-level tabbed view that hosts the Dashboard and the Map.
 * - Holds MQTT connection & message buffer
 * - Renders tabs row and the active view
 * - Passes {messages, status, connect, disconnect} to Dashboard
 */
const MainPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DASHBOARD);
  
  // Initialize device service and repository
  const deviceRepository = useMemo(() => new DeviceRepository(), []);
  const deviceService = useMemo(() => new DeviceService(deviceRepository), [deviceRepository]);

  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<string | null> (null);


  const onMessage = useCallback((message: MqttMessage) => {
    // Create a unique key for deduplication based on topic, payload, and timestamp
    const messageKey = `${message.topic}|${message.payload}`;

    if (lastMessage === messageKey) {
      console.debug('Duplicate MQTT message detected and skipped:', message.topic);
      return;
    }
    setLastMessage(messageKey);
    setMessages((prev) => [message, ...prev]);
    
    // Push message to service for device data extraction
    deviceService.handleMqttMessage(message);
  }, [deviceService]);

  // Simulation disabled - using actual MQTT data instead
  // useEffect(() => {
  //   console.log('🚀 Starting MQTT simulation to populate initial device data...');
  //   simulateMqttScenarioWithService(deviceService, onMessage);
  //   console.log('✅ MQTT simulation complete! Initial data loaded.');
  // }, [deviceService]);

  const {status, connect, disconnect} = useMQTT({onMessage});

  // Map devices derived from messages
  const devices = deviceService.getActiveDevices();

  return (
    <div className="flex h-[85dvh] w-full flex-col bg-neutral-950 text-white">
      {/* Tabs row */}
      <nav className="sticky top-0 z-20 flex items-center gap-2 border-b border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
        <TabButton
          label="Dashboard"
          active={activeTab === TabType.DASHBOARD}
          onClick={() => setActiveTab(TabType.DASHBOARD)}
        />
        <TabButton
          label="Map"
          active={activeTab === TabType.MAP}
          onClick={() => setActiveTab(TabType.MAP)}
        />
        <TabButton
          label="Devices"
          active={activeTab === TabType.DEVICES}
          onClick={() => setActiveTab(TabType.DEVICES)}
        />
        <MqttStatusDisplay
          status={status}
          connect={connect}
          disconnect={disconnect}
        />
      </nav>

      {/* Content area */}
      <div className="flex-1 min-h-0 overflow-auto p-3">
        {activeTab === TabType.DASHBOARD ? (
          <DashboardView messages={messages} status={status} />
        ) : activeTab === TabType.MAP ? (
          <MapView devices={devices}/>
        ) : (
          <DevicesView service={deviceService} />
        )}
      </div>
    </div>
  );
};

export default MainPage;

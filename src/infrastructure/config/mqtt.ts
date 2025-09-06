/**
 * MQTT Configuration Constants
 * 
 * Centralized configuration for MQTT broker connection and topics
 */

// MQTT connection options
export const MQTT_CONFIG = {
  hostname: 'localhost',
  port: '9001',
  topics: ['livestock/#', 'central'],
  // WebSocket URL for MQTT over WebSocket
  wsUrl: 'ws://localhost:9001',
} as const;

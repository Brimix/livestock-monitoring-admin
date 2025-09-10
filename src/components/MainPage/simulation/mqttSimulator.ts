import { DeviceService } from '../../../services';
import DeviceRepository from '../../../infrastructure/repositories/DeviceRepository';
import { MOCK_MQTT_MESSAGES, ADDITIONAL_MQTT_MESSAGES } from './mockMqttMessages';
import { MqttMessage } from '../../../domain';

/**
 * Utility to simulate MQTT message processing
 * This can be used for testing or to replay the exact scenario that created the mock devices
 */
export class MqttSimulator {
  private deviceRepository: DeviceRepository;
  private deviceService: DeviceService;

  constructor() {
    this.deviceRepository = new DeviceRepository();
    this.deviceService = new DeviceService(this.deviceRepository);
  }

  /**
   * Process all mock MQTT messages to recreate the device scenario
   * @param clearFirst - Whether to clear existing data first (default: true)
   */
  simulateScenario(clearFirst: boolean = true): void {
    if (clearFirst) {
      // Clear existing mock data
      this.deviceRepository = new DeviceRepository();
      this.deviceService = new DeviceService(this.deviceRepository);
    }

    // Process messages in chronological order (oldest first)
    const sortedMessages = [...MOCK_MQTT_MESSAGES].sort((a, b) => a.ts - b.ts);

    console.log('🔄 Simulating MQTT message processing...');
    sortedMessages.forEach((message, index) => {
      console.log(`📨 Processing message ${index + 1}/${sortedMessages.length}: ${message.topic}`);
      this.deviceService.handleMqttMessage(message);
    });

    console.log('✅ MQTT simulation complete!');
    console.log(`📊 Generated ${this.deviceService.getActiveDevices().length} devices`);
  }

  /**
   * Process additional test messages
   */
  simulateAdditionalScenarios(): void {
    console.log('🔄 Processing additional test scenarios...');
    ADDITIONAL_MQTT_MESSAGES.forEach((message, index) => {
      console.log(`📨 Processing additional message ${index + 1}: ${message.topic}`);
      this.deviceService.handleMqttMessage(message);
    });
    console.log('✅ Additional scenarios complete!');
  }

  /**
   * Get the current device service (useful for testing)
   */
  getDeviceService(): DeviceService {
    return this.deviceService;
  }

  /**
   * Get the current device repository (useful for testing)
   */
  getDeviceRepository(): DeviceRepository {
    return this.deviceRepository;
  }
}

/**
 * Quick function to simulate the scenario
 */
export const simulateMqttScenario = (): MqttSimulator => {
  const simulator = new MqttSimulator();
  simulator.simulateScenario();
  return simulator;
};

/**
 * Simulate MQTT scenario using an existing device service
 */
export const simulateMqttScenarioWithService = (
  deviceService: DeviceService,
  onMessage: (message: MqttMessage) => void,
): void => {
  console.log('🔄 Simulating MQTT message processing with existing service...');
  
  // Process messages in chronological order (oldest first)
  const sortedMessages = [...MOCK_MQTT_MESSAGES].sort((a, b) => a.ts - b.ts);

  sortedMessages.forEach((message, index: number) => {
    console.log(`📨 Processing message ${index + 1}/${sortedMessages.length}: ${message.topic}`);
    onMessage(message);
  });

  console.log('✅ MQTT simulation complete!');
  console.log(`📊 Generated ${deviceService.getActiveDevices().length} devices`);
};

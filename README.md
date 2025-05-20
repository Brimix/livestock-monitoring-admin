# Livestock Monitoring System

A React-based dashboard for monitoring livestock data in real-time using MQTT.

## Overview

This application provides a web interface for administrators to monitor livestock data including:
- GPS location coordinates
- Animal body temperature
- Ambient temperature 
- Heart rate

The system connects to an MQTT broker over WebSocket to receive real-time updates from livestock monitoring units (LSUs) in the field.

## Technical Details

### Architecture
- Frontend: React with TypeScript
- Real-time Communication: MQTT over WebSocket
- Data Format: Hyphen-separated values (lat-lon-animalTemp-ambientTemp-heartRate)

### Key Components
- `LSUDashboard`: Main dashboard component
- `useMQTT`: Custom React hook for MQTT connection management
- `LSUMessage`: Component for parsing and displaying individual messages
- Message payload format: `latitude-longitude-animalTemp-ambientTemp-heartRate`
  - Latitude/Longitude are scaled by 1,000,000
  - Temperatures are in Celsius
  - Heart rate in BPM

### Connection States
The system handles three connection states:
- OFFLINE
- CONNECTING  
- ONLINE

## Development

### Prerequisites
- Node.js
- npm/yarn

### Installation
1. `git clone {this repo}`
2. `npm install`
3. `npm run dev`
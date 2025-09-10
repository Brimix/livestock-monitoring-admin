import React from 'react';
import LSUDashboard from '../../LSUDashboard';
import {MqttMessage, MqttStatus} from '../../../domain';

interface DashboardViewProps {
  messages: MqttMessage[];
  status: MqttStatus;
}
const DashboardView = ({ messages, status }: DashboardViewProps) => {
  return (
    <div className="h-[75dvh] p-3">
      <LSUDashboard messages={messages} status={status} />
    </div>
  );
};

export default DashboardView;

import {MqttMessage, MqttStatus} from '../../domain';
import externalQR from '../../assets/external.png';

import {ConnectionSubheader, QRCodeBlock, CardContent} from './ui';
import LSUMessage from './LSUMessage';

interface LSUDashboardProps {
  messages: MqttMessage[];
  status: MqttStatus;
}
const LSUDashboard = (props: LSUDashboardProps) => {
  const {messages, status} = props;

  return (
    <div className="h-full bg-gray-950 text-gray-50 p-4 w-full">
      <div className="flex gap-6 h-full">
        {/* Main Dashboard Content */}
        <div className="flex-1">
          <div className="w-full rounded-lg border bg-card text-card-foreground shadow-2xl h-full">
            <ConnectionSubheader status={status}/>
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
};

export default LSUDashboard;

import {MqttMessage} from './types';

interface LSUMessageProps {
  message: MqttMessage;
}
const LSUMessage = ({message}: LSUMessageProps) => {
  const {topic, payload, ts} = message;

  const parsePayload = (payload: string) => {
    try {
      const [lat, lon, animalTemp, ambientTemp, heartRate] = payload.split('-').map(Number);
      
      return (
        <>
          Location: ({lat / 1000000}, {lon / 1000000}) • 
          Animal: {animalTemp}°C • 
          Ambient: {ambientTemp}°C • 
          Heart: {heartRate} BPM
        </>
      );
    } catch (err) {
      return `Invalid payload format: ${payload}`;
    }
  }

  return (
    <div className="mb-1 break-all">
      <span className="text-green-400">{topic}</span> ▸ {parsePayload(payload)}
      <span className="float-right text-gray-500 text-xs">
        {new Date(ts).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default LSUMessage;

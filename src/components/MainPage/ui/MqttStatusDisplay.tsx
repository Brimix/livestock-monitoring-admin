import {MqttStatus} from '../../../domain';

interface MqttStatusDisplayProps {
  status: MqttStatus,
  connect: () => void,
  disconnect: () => void,
}
const MqttStatusDisplay = (props: MqttStatusDisplayProps) => {
  const {status, connect, disconnect} = props;
  return (
    <div className="ml-auto text-xs opacity-70">
      MQTT: 
      <span className={
        status === MqttStatus.ONLINE ? "text-emerald-400" : 
        status === MqttStatus.CONNECTING ? "text-amber-300" : 
        "text-red-400"}
      >
        {status}
      </span>

      {status === MqttStatus.OFFLINE && (
        <button
          className="ml-2 rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-300 hover:bg-emerald-500/20"
          onClick={connect}>
          Connect
        </button>
      )}
      {status === MqttStatus.ONLINE && (
        <button
          className="ml-2 rounded-md bg-red-500/10 px-2 py-1 text-red-300 hover:bg-red-500/20"
          onClick={disconnect}>
          Disconnect
        </button>
      )}
    </div>
  )
}

export default MqttStatusDisplay;

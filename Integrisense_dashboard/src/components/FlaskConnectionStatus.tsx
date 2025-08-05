import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { websocketService } from "@/services/websocket";
import { RefreshCw, Wifi, WifiOff, AlertCircle } from "lucide-react";

interface ConnectionStatus {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  message?: string;
}

export const FlaskConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected'
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleConnectionStatus = (data: { status: string; message?: string }) => {
      setConnectionStatus({
        status: data.status as ConnectionStatus['status'],
        message: data.message
      });
      setIsConnecting(false);
    };

    websocketService.on('connection_status', handleConnectionStatus);

    return () => {
      websocketService.off('connection_status', handleConnectionStatus);
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await websocketService.connect();
    } catch (error) {
      console.error('Failed to connect to Flask backend:', error);
      setIsConnecting(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'Flask Backend Connected';
      case 'connecting':
        return 'Connecting to Flask...';
      case 'error':
        return connectionStatus.message || 'Connection Error';
      default:
        return 'Flask Backend Disconnected';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Badge variant="outline" className={`px-3 py-1 ${getStatusColor()}`}>
        <span className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </span>
      </Badge>

      {connectionStatus.status !== 'connected' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
          <span>Connect</span>
        </Button>
      )}
    </div>
  );
};
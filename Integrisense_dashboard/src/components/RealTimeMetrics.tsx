import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Heart, Thermometer, Zap, Play, Pause, RotateCcw, Wifi, WifiOff, Gauge, Droplet } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface RealTimeData {
  timestamp: string;
  bvp: number;
  temperature: number;
  eda: number;
  acceleration_magnitude: number;
  prediction?: string;
}

interface SensorData {
  bvp: number;
  temperature: number;
  eda: number;
  acceleration_magnitude: number;
  prediction?: string;
  timestamp: string;
  source: string; // 'serial' or 'http'
}

export const RealTimeMetrics = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [data, setData] = useState<RealTimeData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    bvp: 0,
    temperature: 0,
    eda: 0,
    acceleration_magnitude: 0,
    prediction: 'No prediction'
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataCount, setDataCount] = useState(0);
  const [esp32Connected, setEsp32Connected] = useState(false);

  // WebSocket connection effect
  useEffect(() => {
  if (isMonitoring) {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket','polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

      newSocket.on("connect", () => {
        console.log("Connected to Flask backend");
        setIsConnected(true);
      });
      newSocket.on("disconnect", () => {
        console.log("Disconnected from Flask backend");
        setIsConnected(false);
        setEsp32Connected(false);
      });
      
      newSocket.on("stream", (sensorData: SensorData) => {
        console.log("Received sensor data:", sensorData);
        
        // Check if data is coming from ESP32 (serial source)
        if (sensorData.source === 'serial') {
          setEsp32Connected(true);
        }
        
        // Update current metrics
        setCurrentMetrics({
          bvp: sensorData.bvp || 0,
          temperature: sensorData.temperature || 0,
          eda: sensorData.eda || 0,
          acceleration_magnitude: sensorData.acceleration_magnitude || 0,
          prediction: sensorData.prediction || 'No prediction'
        });
        
        // Update last updated timestamp and data count
        setLastUpdated(new Date().toLocaleTimeString());
        setDataCount(prev => prev + 1);
        
        // Add to chart data
        const newDataPoint: RealTimeData = {
          bvp: sensorData.bvp || 0,
          temperature: sensorData.temperature || 0,
          eda: sensorData.eda || 0,
          acceleration_magnitude: sensorData.acceleration_magnitude || 0,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setData(prev => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-50); // Keep last 50 points
        });
      });

      // Listen for ESP32 connection status
      newSocket.on("esp32_status", (status: { connected: boolean }) => {
        setEsp32Connected(status.connected);
      });
      
      setSocket(newSocket);
      
      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setEsp32Connected(false);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setEsp32Connected(false);
      }
    }
  }, [isMonitoring]);

  const handleStart = () => {
    setIsMonitoring(true);
    setDataCount(0);
  };

  const handleStop = () => setIsMonitoring(false);
  
  const handleReset = () => {
    setIsMonitoring(false);
    setData([]);
    setDataCount(0);
    setCurrentMetrics({
      bvp: 0,
      temperature: 0,
      eda: 0,
      acceleration_magnitude: 0,
      prediction: 'No prediction'
    });
  };

  const getConnectionStatus = () => {
    if (!isMonitoring) return { label: "Stopped", color: "secondary", icon: WifiOff };
    if (isConnected && esp32Connected) return { label: "ESP32 Connected", color: "success", icon: Wifi };
    if (isConnected) return { label: "Backend Connected", color: "warning", icon: Wifi };
    return { label: "Disconnected", color: "destructive", icon: WifiOff };
  };

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  // Map connection status to Tailwind-safe theme classes (avoid dynamic class names)
  const statusClassMap: Record<string, { border: string; icon: string }> = {
    success: { border: 'border-success/20', icon: 'text-success' },
    warning: { border: 'border-warning/20', icon: 'text-warning' },
    destructive: { border: 'border-destructive/20', icon: 'text-destructive' },
    secondary: { border: 'border-muted/20', icon: 'text-muted-foreground' },
  };

  const statusClasses = statusClassMap[connectionStatus.color] || statusClassMap.secondary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Real-Time ESP32 Sensor Monitoring</span>
              </CardTitle>
              <CardDescription>
                Live biometric data streaming from ESP32 device
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={isMonitoring ? "secondary" : "default"}
                onClick={handleStart}
                disabled={isMonitoring}
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button 
                variant="outline"
                onClick={handleStop}
                disabled={!isMonitoring}
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </Button>
              <Button 
                variant="outline"
                onClick={handleReset}
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Connection Status */}
      <Card className={`${statusClasses.border} shadow-card`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <StatusIcon className={`h-5 w-5 ${statusClasses.icon} ${esp32Connected ? 'animate-pulse' : ''}`} />
              <div>
                <Badge variant={connectionStatus.color === "success" ? "default" : "secondary"}>
                  {connectionStatus.label}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  Data packets received: {dataCount}
                </div>
              </div>
            </div>
            {lastUpdated && (
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-muted/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BVP</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.bvp.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Beats per minute</p>
          </CardContent>
        </Card>
        <Card className="border-muted/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.temperature.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Body temperature</p>
          </CardContent>
        </Card>
        <Card className="border-muted/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EDA</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.eda.toFixed(2)} μS</div>
            <p className="text-xs text-muted-foreground">Electrodermal Activity</p>
          </CardContent>
        </Card>
        <Card className="border-muted/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceleration</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.acceleration_magnitude.toFixed(2)} g</div>
            <p className="text-xs text-muted-foreground">Movement magnitude</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.prediction}</div>
            <p className="text-xs text-muted-foreground">AI Prediction</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>BVP Trend</span>
            </CardTitle>
            <CardDescription>Real-time Blood Volume Pulse monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bvp" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-accent" />
              <span>Temperature Trend</span>
            </CardTitle>
            <CardDescription>Real-time body temperature monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-info/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-info" />
              <span>EDA Trend</span>
            </CardTitle>
            <CardDescription>Real-time electrodermal activity (EDA)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="eda" 
                    stroke="#00b894" 
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-info/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-info" />
              <span>Acceleration Trend</span>
            </CardTitle>
            <CardDescription>Real-time movement acceleration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="acceleration_magnitude" 
                    stroke="hsl(var(--info))" 
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Summary */}
      {data.length > 0 && (
        <Card className="border-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Data Points</div>
                <div className="text-lg font-bold">{data.length}/50</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Avg BVP</div>
                <div className="text-lg font-bold">
                  {data.length > 0 ? (data.reduce((sum, d) => sum + d.bvp, 0) / data.length).toFixed(3) : '0.000'}
                </div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Avg Temp</div>
                <div className="text-lg font-bold">
                  {data.length > 0 ? (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1) : '0.0'}°C
                </div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Avg EDA</div>
                <div className="text-lg font-bold">
                  {data.length > 0 ? (data.reduce((sum, d) => sum + d.eda, 0) / data.length).toFixed(3) : '0.000'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
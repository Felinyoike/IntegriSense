import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Heart, Thermometer, Zap, Play, Pause, RotateCcw } from "lucide-react";

interface RealTimeData {
  timestamp: string;
  heartRate: number;
  temperature: number;
  stress: number;
  eda: number;
}

export const RealTimeMetrics = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [data, setData] = useState<RealTimeData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    heartRate: 72,
    temperature: 37.2,
    stress: 0.3,
    eda: 45.2
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        const now = new Date();
        const newMetrics = {
          heartRate: Math.floor(Math.random() * 40) + 60,
          temperature: Math.round((Math.random() * 2 + 36.5) * 10) / 10,
          stress: Math.round(Math.random() * 100) / 100,
          eda: Math.round((Math.random() * 20 + 35) * 10) / 10
        };
        
        setCurrentMetrics(newMetrics);
        
        const newDataPoint: RealTimeData = {
          timestamp: now.toLocaleTimeString(),
          ...newMetrics
        };
        
        setData(prev => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-20); // Keep last 20 points
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleStart = () => setIsMonitoring(true);
  const handleStop = () => setIsMonitoring(false);
  const handleReset = () => {
    setIsMonitoring(false);
    setData([]);
  };

  const getStressLevel = (stress: number) => {
    if (stress < 0.3) return { label: "Low", color: "success" };
    if (stress < 0.7) return { label: "Medium", color: "warning" };
    return { label: "High", color: "destructive" };
  };

  const stressLevel = getStressLevel(currentMetrics.stress);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Real-Time Biometric Monitoring</span>
              </CardTitle>
              <CardDescription>
                Live stress detection using biometric sensors
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

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentMetrics.heartRate}</div>
            <p className="text-xs text-muted-foreground">BPM</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{currentMetrics.temperature}°C</div>
            <p className="text-xs text-muted-foreground">Body temperature</p>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EDA</CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{currentMetrics.eda}</div>
            <p className="text-xs text-muted-foreground">µS (microsiemens)</p>
          </CardContent>
        </Card>

        <Card className={`border-${stressLevel.color}/20`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
            <Badge variant={stressLevel.color === "success" ? "default" : "destructive"}>
              {stressLevel.label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-${stressLevel.color}`}>
              {Math.round(currentMetrics.stress * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">AI prediction</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Heart Rate Trend</span>
            </CardTitle>
            <CardDescription>Real-time heart rate monitoring</CardDescription>
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
                    dataKey="heartRate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-destructive" />
              <span>Stress Level Trend</span>
            </CardTitle>
            <CardDescription>Real-time stress detection</CardDescription>
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
                    domain={[0, 1]}
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
                    dataKey="stress" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <Card className="border-success/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
            <span className="text-lg font-medium">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
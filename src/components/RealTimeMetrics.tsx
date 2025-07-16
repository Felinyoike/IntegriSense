import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Heart, Thermometer, Zap, Brain } from "lucide-react";

interface BiometricData {
  timestamp: string;
  eda: number;
  ecg: number;
  resp: number;
  temp: number;
  stress: number;
}

export const RealTimeMetrics = () => {
  const [data, setData] = useState<BiometricData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    eda: 0,
    ecg: 0,
    resp: 0,
    temp: 0,
    stress: 0
  });
  const [isStressed, setIsStressed] = useState(false);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const newMetrics = {
        eda: Math.random() * 100 + 50, // EDA: 50-150
        ecg: Math.random() * 40 + 60,  // ECG: 60-100 BPM
        resp: Math.random() * 10 + 12, // Resp: 12-22 per min
        temp: Math.random() * 2 + 36.5, // Temp: 36.5-38.5°C
        stress: Math.random() * 100
      };

      const newDataPoint = {
        timestamp,
        ...newMetrics
      };

      setData(prev => [...prev.slice(-19), newDataPoint]);
      setCurrentMetrics(newMetrics);
      setIsStressed(newMetrics.stress > 60);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value: number, min: number, max: number) => {
    if (value < min) return "low";
    if (value > max) return "high";
    return "normal";
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className={`border-2 ${isStressed ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isStressed ? 'bg-destructive' : 'bg-success'}`}></div>
              <CardTitle className="text-xl">
                Current Status: {isStressed ? "Stress Detected" : "Calm State"}
              </CardTitle>
            </div>
            <Badge variant={isStressed ? "destructive" : "default"} className="text-sm">
              {currentMetrics.stress.toFixed(1)}% Stress Level
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EDA Level</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {currentMetrics.eda.toFixed(1)}
            </div>
            <Progress 
              value={currentMetrics.eda} 
              className="mt-2" 
              max={150}
            />
            <p className="text-xs text-muted-foreground mt-1">
              μS (microsiemens)
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {currentMetrics.ecg.toFixed(0)}
            </div>
            <Progress 
              value={currentMetrics.ecg - 40} 
              className="mt-2" 
              max={80}
            />
            <p className="text-xs text-muted-foreground mt-1">
              BPM
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respiration</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {currentMetrics.resp.toFixed(1)}
            </div>
            <Progress 
              value={(currentMetrics.resp - 10) * 10} 
              className="mt-2" 
              max={120}
            />
            <p className="text-xs text-muted-foreground mt-1">
              breaths/min
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {currentMetrics.temp.toFixed(1)}°C
            </div>
            <Progress 
              value={(currentMetrics.temp - 36) * 50} 
              className="mt-2" 
              max={100}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Body temperature
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card className="border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Real-time Stress Analysis</span>
          </CardTitle>
          <CardDescription>
            Live biometric data and stress prediction over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
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
                  dataKey="stress" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Stress Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="ecg" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={false}
                  name="Heart Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(data.length / 60)}:{(data.length % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-muted-foreground">minutes:seconds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">measurements collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Stress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length > 0 ? (data.reduce((sum, d) => sum + d.stress, 0) / data.length).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">session average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
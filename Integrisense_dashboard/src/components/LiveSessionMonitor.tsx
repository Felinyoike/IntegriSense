import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Thermometer, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestSession {
  id: string;
  session_name: string;
  status: string;
  started_at: string;
  ended_at?: string;
  notes?: string;
}

interface SensorData {
  id: string;
  timestamp: string;
  heart_rate?: number;
  temperature?: number;
  gsr?: number;
  stress_level?: number;
  prediction?: string;
}

interface LiveSessionMonitorProps {
  session: TestSession;
}

export const LiveSessionMonitor: React.FC<LiveSessionMonitorProps> = ({ session }) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    heartRate: 0,
    temperature: 0,
    gsr: 0,
    stressLevel: 0,
    prediction: 'Unknown'
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadSessionData();
    if (session.status === 'active') {
      setIsMonitoring(true);
      simulateRealTimeData();
    }
  }, [session]);

  const loadSessionData = async () => {
    try {
      const { data, error } = await supabase
        .from('session_sensor_data')
        .select('*')
        .eq('session_id', session.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setSensorData(data || []);
      
      if (data && data.length > 0) {
        const latest = data[data.length - 1];
        setCurrentMetrics({
          heartRate: latest.heart_rate || 0,
          temperature: latest.temperature || 0,
          gsr: latest.gsr || 0,
          stressLevel: latest.stress_level || 0,
          prediction: latest.prediction || 'Unknown'
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive"
      });
    }
  };

  // Simulate real-time data generation
  const simulateRealTimeData = () => {
    const interval = setInterval(async () => {
      if (session.status !== 'active') {
        clearInterval(interval);
        setIsMonitoring(false);
        return;
      }

      // Generate simulated sensor data
      const newHeartRate = 60 + Math.random() * 40 + Math.sin(Date.now() / 10000) * 15;
      const newTemperature = 36.5 + Math.random() * 1.5;
      const newGSR = Math.random() * 100;
      const baseStress = 30 + Math.random() * 40;
      const stressVariation = Math.sin(Date.now() / 15000) * 20;
      const newStressLevel = Math.max(0, Math.min(100, baseStress + stressVariation));
      
      const prediction = newStressLevel > 60 ? 'Stressed' : newStressLevel > 40 ? 'Moderate' : 'Calm';

      const newDataPoint = {
        timestamp: new Date().toISOString(),
        heart_rate: newHeartRate,
        temperature: newTemperature,
        gsr: newGSR,
        stress_level: newStressLevel,
        prediction: prediction
      };

      // Update current metrics
      setCurrentMetrics({
        heartRate: newHeartRate,
        temperature: newTemperature,
        gsr: newGSR,
        stressLevel: newStressLevel,
        prediction: prediction
      });

      // Save to database
      try {
        await supabase
          .from('session_sensor_data')
          .insert({
            session_id: session.id,
            ...newDataPoint
          });

        // Update local state
        setSensorData(prev => {
          const updated = [...prev, { id: Date.now().toString(), ...newDataPoint }];
          return updated.slice(-50); // Keep only last 50 data points
        });
      } catch (error: any) {
        console.error('Failed to save sensor data:', error);
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  };

  const getStressColor = (stressLevel: number) => {
    if (stressLevel > 70) return 'text-red-500';
    if (stressLevel > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPredictionBadge = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case 'stressed':
        return <Badge variant="destructive">Stressed</Badge>;
      case 'moderate':
        return <Badge variant="secondary">Moderate</Badge>;
      case 'calm':
        return <Badge variant="default" className="bg-green-500">Calm</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Prepare chart data
  const chartData = sensorData.slice(-20).map((data, index) => ({
    time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: data.heart_rate,
    stressLevel: data.stress_level,
    temperature: data.temperature
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Session Monitoring
          {isMonitoring && <Badge variant="default" className="bg-green-500">Live</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{currentMetrics.heartRate.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">BPM</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Thermometer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{currentMetrics.temperature.toFixed(1)}°</div>
            <div className="text-sm text-muted-foreground">Temperature</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{currentMetrics.gsr.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">GSR</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Activity className={`h-8 w-8 mx-auto mb-2 ${getStressColor(currentMetrics.stressLevel)}`} />
            <div className={`text-2xl font-bold ${getStressColor(currentMetrics.stressLevel)}`}>
              {currentMetrics.stressLevel.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Stress</div>
          </div>
        </div>

        {/* Prediction */}
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Current State:</div>
          {getPredictionBadge(currentMetrics.prediction)}
        </div>

        {/* Real-time Charts */}
        {chartData.length > 0 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">Heart Rate & Stress Level</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="stressLevel" stroke="#f59e0b" strokeWidth={2} name="Stress Level" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Temperature</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} name="Temperature" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {!isMonitoring && (
          <div className="text-center text-muted-foreground">
            Monitoring paused. Resume session to continue data collection.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
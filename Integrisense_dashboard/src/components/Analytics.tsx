import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface AnalyticsData {
  timestamp: string;
  stress: number;
  calm: number;
  total: number;
}

interface MetricTrend {
  date: string;
  eda: number;
  ecg: number;
  resp: number;
  temp: number;
  accuracy: number;
}

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [stressTrendData, setStressTrendData] = useState<AnalyticsData[]>([]);
  const [metricTrendData, setMetricTrendData] = useState<MetricTrend[]>([]);
  const [distributionData, setDistributionData] = useState([
    { name: "Stress", value: 65, color: "hsl(var(--destructive))" },
    { name: "Calm", value: 35, color: "hsl(var(--success))" }
  ]);

  // Generate mock analytics data
  useEffect(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    
    // Stress trend data
    const stressData: AnalyticsData[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const total = Math.floor(Math.random() * 20) + 10;
      const stress = Math.floor(Math.random() * total * 0.7);
      return {
        timestamp: date.toLocaleDateString(),
        stress,
        calm: total - stress,
        total
      };
    });

    // Metric trend data
    const metricData: MetricTrend[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toLocaleDateString(),
        eda: Math.random() * 50 + 75,
        ecg: Math.random() * 20 + 70,
        resp: Math.random() * 5 + 15,
        temp: Math.random() * 1 + 37,
        accuracy: Math.random() * 10 + 85
      };
    });

    setStressTrendData(stressData);
    setMetricTrendData(metricData);
  }, [timeRange]);

  const totalTests = stressTrendData.reduce((sum, data) => sum + data.total, 0);
  const totalStress = stressTrendData.reduce((sum, data) => sum + data.stress, 0);
  const stressRate = totalTests > 0 ? (totalStress / totalTests * 100) : 0;
  const avgAccuracy = metricTrendData.length > 0 ? 
    metricTrendData.reduce((sum, data) => sum + data.accuracy, 0) / metricTrendData.length : 0;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Analytics Dashboard</span>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of stress detection patterns and system performance
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{totalTests}</div>
            <p className="text-xs text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stressRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Stress Detection Rate</p>
          </CardContent>
        </Card>
        <Card className="border-success/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{(100 - stressRate).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Calm State Rate</p>
          </CardContent>
        </Card>
        <Card className="border-warning/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{avgAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average Accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stress Trend Over Time */}
        <Card className="border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Stress Detection Trends</span>
            </CardTitle>
            <CardDescription>
              Daily stress vs calm state detection over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stressTrendData}>
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
                  <Bar dataKey="stress" fill="hsl(var(--destructive))" name="Stress" />
                  <Bar dataKey="calm" fill="hsl(var(--success))" name="Calm" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stress/Calm Distribution */}
        <Card className="border-accent/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-accent" />
              <span>Overall Distribution</span>
            </CardTitle>
            <CardDescription>
              Ratio of stress vs calm states detected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-sm">Stress ({distributionData[0].value}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm">Calm ({distributionData[1].value}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biometric Trends */}
      <Card className="border-success/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-success" />
            <span>Biometric Trends & System Performance</span>
          </CardTitle>
          <CardDescription>
            Average biometric readings and ML model accuracy over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
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
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Accuracy (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="ecg" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Avg Heart Rate"
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  name="Avg Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
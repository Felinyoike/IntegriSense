import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Thermometer, Zap, Users, TrendingUp, Download, Brain } from "lucide-react";
import { RealTimeMetrics } from "./RealTimeMetrics";
import { PreviousTests } from "./PreviousTests";
import { Analytics } from "./Analytics";
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, signOut } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Integrisense
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Stress Detection</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">
                {currentTime.toLocaleTimeString()}
              </Badge>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">System Online</span>
              </div>
              <Button variant="outline" onClick={signOut} size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Real-time</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Previous Tests</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-primary/20 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stress Detected</CardTitle>
                  <Heart className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">8</div>
                  <p className="text-xs text-muted-foreground">67% detection rate</p>
                </CardContent>
              </Card>

              <Card className="border-success/20 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calm States</CardTitle>
                  <Thermometer className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">4</div>
                  <p className="text-xs text-muted-foreground">33% calm rate</p>
                </CardContent>
              </Card>

              <Card className="border-warning/20 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  <Brain className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">94%</div>
                  <p className="text-xs text-muted-foreground">ML model accuracy</p>
                </CardContent>
              </Card>
            </div>

            {/* Welcome Card */}
            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Welcome to Integrisense</CardTitle>
                <CardDescription>
                  Advanced AI-powered stress detection using biometric input and machine learning analysis.
                  Monitor real-time physiological data and get instant stress level predictions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Key Features:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Real-time biometric monitoring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>AI-powered stress prediction</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Historical data analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span>PDF export capabilities</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <Brain className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="realtime">
            <RealTimeMetrics />
          </TabsContent>

          {/* Previous Tests Tab */}
          <TabsContent value="tests">
            <PreviousTests />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
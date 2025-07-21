import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Calendar, Download, FileText, TrendingUp, AlertCircle } from "lucide-react";

interface TestResult {
  id: string;
  date: string;
  time: string;
  participant: string;
  duration: string;
  stressLevel: "Low" | "Medium" | "High";
  accuracy: number;
  heartRate: number;
  temperature: number;
  notes: string;
}

export const PreviousTests = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Generate mock test data
    const mockTests: TestResult[] = Array.from({ length: 15 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const stressLevels: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];
      const participants = ["Patient A", "Patient B", "Patient C", "Patient D", "Patient E"];
      
      return {
        id: `test-${i + 1}`,
        date: date.toLocaleDateString(),
        time: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000).toLocaleTimeString(),
        participant: participants[Math.floor(Math.random() * participants.length)],
        duration: `${Math.floor(Math.random() * 30) + 10} min`,
        stressLevel: stressLevels[Math.floor(Math.random() * stressLevels.length)],
        accuracy: Math.floor(Math.random() * 20) + 80,
        heartRate: Math.floor(Math.random() * 40) + 60,
        temperature: Math.round((Math.random() * 2 + 36.5) * 10) / 10,
        notes: "Test completed successfully"
      };
    });
    
    setTests(mockTests);
  }, []);

  const getStressLevelColor = (level: string) => {
    switch (level) {
      case "Low": return "success";
      case "Medium": return "warning";
      case "High": return "destructive";
      default: return "secondary";
    }
  };

  const filteredTests = tests.filter(test => {
    if (activeTab === "all") return true;
    return test.stressLevel.toLowerCase() === activeTab;
  });

  const testStats = {
    total: tests.length,
    high: tests.filter(t => t.stressLevel === "High").length,
    medium: tests.filter(t => t.stressLevel === "Medium").length,
    low: tests.filter(t => t.stressLevel === "Low").length,
    avgAccuracy: tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Previous Test Results</span>
              </CardTitle>
              <CardDescription>
                Historical stress detection test results and analytics
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{testStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{testStats.high}</div>
            <p className="text-xs text-muted-foreground">High Stress</p>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{testStats.medium}</div>
            <p className="text-xs text-muted-foreground">Medium Stress</p>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{testStats.low}</div>
            <p className="text-xs text-muted-foreground">Low Stress</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">{testStats.avgAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Avg Accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card className="border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Test History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Tests</TabsTrigger>
              <TabsTrigger value="high">High Stress</TabsTrigger>
              <TabsTrigger value="medium">Medium Stress</TabsTrigger>
              <TabsTrigger value="low">Low Stress</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Stress Level</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.date}</TableCell>
                        <TableCell>{test.time}</TableCell>
                        <TableCell>{test.participant}</TableCell>
                        <TableCell>{test.duration}</TableCell>
                        <TableCell>
                          <Badge variant={getStressLevelColor(test.stressLevel) as any}>
                            {test.stressLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{test.accuracy}%</TableCell>
                        <TableCell>{test.heartRate} BPM</TableCell>
                        <TableCell>{test.temperature}°C</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredTests.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tests found for the selected filter.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
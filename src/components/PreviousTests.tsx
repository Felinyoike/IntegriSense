import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";

interface TestData {
  id: string;
  timestamp: string;
  age: number;
  gender: string;
  eda: number;
  ecg: number;
  resp: number;
  temp: number;
  prediction: string;
  confidence: number;
}

interface UserHistory {
  username: string;
  tests: TestData[];
}

export const PreviousTests = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userHistories, setUserHistories] = useState<UserHistory[]>([]);
  const [filteredTests, setFilteredTests] = useState<TestData[]>([]);

  // Generate mock data
  useEffect(() => {
    const mockUsers = ["john_doe", "jane_smith", "mike_johnson", "sarah_wilson"];
    const mockHistories: UserHistory[] = mockUsers.map(username => ({
      username,
      tests: Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
        id: `${username}_${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
        age: Math.floor(Math.random() * 40) + 20,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        eda: Math.random() * 100 + 50,
        ecg: Math.random() * 40 + 60,
        resp: Math.random() * 10 + 12,
        temp: Math.random() * 2 + 36.5,
        prediction: Math.random() > 0.6 ? "Stress" : "Calm",
        confidence: Math.random() * 30 + 70
      }))
    }));
    
    setUserHistories(mockHistories);
    if (mockHistories.length > 0) {
      setSelectedUser(mockHistories[0].username);
      setFilteredTests(mockHistories[0].tests);
    }
  }, []);

  const handleUserChange = (username: string) => {
    setSelectedUser(username);
    const userHistory = userHistories.find(h => h.username === username);
    setFilteredTests(userHistory?.tests || []);
  };

  const handleExportPDF = () => {
    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }

    // Simulate PDF export
    toast.success(`Exporting PDF for ${selectedUser.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}...`);
    
    setTimeout(() => {
      toast.success("PDF exported successfully!");
    }, 2000);
  };

  const getStressCount = () => {
    return filteredTests.filter(test => test.prediction === "Stress").length;
  };

  const getCalmCount = () => {
    return filteredTests.filter(test => test.prediction === "Calm").length;
  };

  const getAverageConfidence = () => {
    if (filteredTests.length === 0) return 0;
    return filteredTests.reduce((sum, test) => sum + test.confidence, 0) / filteredTests.length;
  };

  return (
    <div className="space-y-6">
      {/* User Selection and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Select User</span>
            </CardTitle>
            <CardDescription>
              Choose a user to view their test history and export data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedUser} onValueChange={handleUserChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user..." />
              </SelectTrigger>
              <SelectContent>
                {userHistories.map(history => (
                  <SelectItem key={history.username} value={history.username}>
                    {history.username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleExportPDF} 
              className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              disabled={!selectedUser}
            >
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-accent" />
              <span>Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Tests:</span>
                <Badge variant="outline">{filteredTests.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stress Detected:</span>
                <Badge variant="destructive">{getStressCount()}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Calm States:</span>
                <Badge variant="default" className="bg-success text-success-foreground">
                  {getCalmCount()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Confidence:</span>
                <Badge variant="secondary">{getAverageConfidence().toFixed(1)}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test History Table */}
      <Card className="border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Test History</span>
          </CardTitle>
          <CardDescription>
            Complete test history for {selectedUser ? selectedUser.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'selected user'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>EDA</TableHead>
                  <TableHead>ECG</TableHead>
                  <TableHead>Resp</TableHead>
                  <TableHead>Temp</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No test data available. Select a user to view their history.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-xs">
                        {test.timestamp}
                      </TableCell>
                      <TableCell>{test.age}</TableCell>
                      <TableCell>{test.gender}</TableCell>
                      <TableCell>{test.eda.toFixed(1)}</TableCell>
                      <TableCell>{test.ecg.toFixed(0)}</TableCell>
                      <TableCell>{test.resp.toFixed(1)}</TableCell>
                      <TableCell>{test.temp.toFixed(1)}°C</TableCell>
                      <TableCell>
                        <Badge 
                          variant={test.prediction === "Stress" ? "destructive" : "default"}
                          className={test.prediction === "Calm" ? "bg-success text-success-foreground" : ""}
                        >
                          {test.prediction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {test.confidence.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
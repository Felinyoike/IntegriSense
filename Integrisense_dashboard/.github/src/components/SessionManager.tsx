import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LiveSessionMonitor } from './LiveSessionMonitor';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface TestSession {
  id: string;
  session_name: string;
  status: string;
  started_at: string;
  ended_at?: string;
  notes?: string;
}

interface SessionManagerProps {
  client: Client;
  onBack: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ client, onBack }) => {
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null);
  const [pastSessions, setPastSessions] = useState<TestSession[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPastSessions();
    checkActiveSession();
  }, [client.id]);

  const loadPastSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .select('*')
        .eq('client_id', client.id)
        .neq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPastSessions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load past sessions",
        variant: "destructive"
      });
    }
  };

  const checkActiveSession = async () => {
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .select('*')
        .eq('client_id', client.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCurrentSession(data);
        setSessionName(data.session_name);
        setSessionNotes(data.notes || '');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to check for active session",
        variant: "destructive"
      });
    }
  };

  const startNewSession = async () => {
    if (!user || !sessionName.trim()) {
      toast({
        title: "Error",
        description: "Session name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .insert({
          client_id: client.id,
          therapist_id: user.id,
          session_name: sessionName,
          status: 'active',
          notes: sessionNotes
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      toast({
        title: "Success",
        description: "Session started successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const pauseSession = async () => {
    if (!currentSession) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .update({ 
          status: 'paused',
          notes: sessionNotes
        })
        .eq('id', currentSession.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      toast({
        title: "Success", 
        description: "Session paused"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to pause session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resumeSession = async () => {
    if (!currentSession) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .update({ 
          status: 'active',
          notes: sessionNotes
        })
        .eq('id', currentSession.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      toast({
        title: "Success",
        description: "Session resumed"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to resume session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString(),
          notes: sessionNotes
        })
        .eq('id', currentSession.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(null);
      setSessionName('');
      setSessionNotes('');
      loadPastSessions();
      
      toast({
        title: "Success",
        description: "Session completed"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const continueSession = async (session: TestSession) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_sessions')
        .update({ status: 'active' })
        .eq('id', session.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setSessionName(data.session_name);
      setSessionNotes(data.notes || '');
      loadPastSessions();
      
      toast({
        title: "Success",
        description: "Session continued"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to continue session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><Activity className="h-3 w-3 mr-1" />Active</Badge>;
      case 'paused':
        return <Badge variant="secondary"><Pause className="h-3 w-3 mr-1" />Paused</Badge>;
      case 'completed':
        return <Badge variant="outline"><Square className="h-3 w-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Session Management</h2>
          <p className="text-muted-foreground">
            Client: {client.first_name} {client.last_name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Client Selection
        </Button>
      </div>

      {/* Current Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{currentSession.session_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Started: {new Date(currentSession.started_at).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(currentSession.status)}
              </div>

              <div>
                <Label htmlFor="session-notes">Session Notes</Label>
                <Textarea
                  id="session-notes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                {currentSession.status === 'active' ? (
                  <>
                    <Button onClick={pauseSession} disabled={loading} variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={endSession} disabled={loading} variant="destructive">
                      <Square className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={resumeSession} disabled={loading}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                    <Button onClick={endSession} disabled={loading} variant="destructive">
                      <Square className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-session-name">Session Name</Label>
                <Input
                  id="new-session-name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Stress Assessment Session 1"
                />
              </div>

              <div>
                <Label htmlFor="new-session-notes">Initial Notes</Label>
                <Textarea
                  id="new-session-notes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={3}
                  placeholder="Any initial observations or setup notes..."
                />
              </div>

              <Button onClick={startNewSession} disabled={loading || !sessionName.trim()}>
                <Play className="h-4 w-4 mr-2" />
                Start New Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Monitoring */}
      {currentSession && currentSession.status === 'active' && (
        <LiveSessionMonitor session={currentSession} />
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{session.session_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.started_at).toLocaleDateString()}
                      {session.ended_at && ` - ${new Date(session.ended_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(session.status)}
                    {session.status === 'paused' && (
                      <Button
                        size="sm"
                        onClick={() => continueSession(session)}
                        disabled={loading || !!currentSession}
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
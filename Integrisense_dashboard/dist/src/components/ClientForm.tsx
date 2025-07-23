import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Search, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  notes?: string;
}

interface ClientFormProps {
  onClientSelected: (client: Client) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onClientSelected }) => {
  const [mode, setMode] = useState<'search' | 'new'>('search');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    notes: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const searchClients = async () => {
    if (!user || !searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('therapist_id', user.id)
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to search clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllClients = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('therapist_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Failed to load clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (mode === 'search') {
      loadAllClients();
    }
  }, [mode, user]);

  const handleCreateClient = async () => {
    if (!user || !formData.first_name || !formData.last_name) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          therapist_id: user.id,
          ...formData,
          date_of_birth: formData.date_of_birth || null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client created successfully"
      });
      
      onClientSelected(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClient = () => {
    const client = clients.find(c => c.id === selectedClientId);
    if (client) {
      onClientSelected(client);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Client Selection
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={mode === 'search' ? 'default' : 'outline'}
            onClick={() => setMode('search')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Existing Client
          </Button>
          <Button
            variant={mode === 'new' ? 'default' : 'outline'}
            onClick={() => setMode('new')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            New Client
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {mode === 'search' ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={searchClients} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {clients.length > 0 && (
              <div className="space-y-2">
                <Label>Select Client:</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                        {client.email && ` (${client.email})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              onClick={handleSelectClient} 
              disabled={!selectedClientId || loading}
              className="w-full"
            >
              Continue with Selected Client
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCreateClient} 
              disabled={loading || !formData.first_name || !formData.last_name}
              className="w-full"
            >
              Create Client & Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
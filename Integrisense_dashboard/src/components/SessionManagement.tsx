import React, { useState } from 'react';
import { ClientForm } from './ClientForm';
import { SessionManager } from './SessionManager';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  notes?: string;
}

export const SessionManagement: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleClientSelected = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBackToClientSelection = () => {
    setSelectedClient(null);
  };

  return (
    <div className="p-6">
      {!selectedClient ? (
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Session Management</h1>
            <p className="text-muted-foreground">
              Start a new test session for a client or continue an existing session.
            </p>
          </div>
          <ClientForm onClientSelected={handleClientSelected} />
        </div>
      ) : (
        <SessionManager 
          client={selectedClient} 
          onBack={handleBackToClientSelection}
        />
      )}
    </div>
  );
};
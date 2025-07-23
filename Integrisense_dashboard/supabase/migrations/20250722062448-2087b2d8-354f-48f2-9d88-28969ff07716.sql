-- Create clients table for patient information
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_sessions table for session management
CREATE TABLE public.test_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session_sensor_data table to link sensor data to sessions
CREATE TABLE public.session_sensor_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  heart_rate DOUBLE PRECISION,
  temperature DOUBLE PRECISION,
  gsr DOUBLE PRECISION,
  stress_level DOUBLE PRECISION,
  prediction TEXT,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_sensor_data ENABLE ROW LEVEL SECURITY;

-- Create policies for clients
CREATE POLICY "Therapists can view their own clients" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Therapists can update their own clients" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can delete their own clients" 
ON public.clients 
FOR DELETE 
USING (auth.uid() = therapist_id);

-- Create policies for test_sessions
CREATE POLICY "Therapists can view their own sessions" 
ON public.test_sessions 
FOR SELECT 
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can create sessions" 
ON public.test_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Therapists can update their own sessions" 
ON public.test_sessions 
FOR UPDATE 
USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can delete their own sessions" 
ON public.test_sessions 
FOR DELETE 
USING (auth.uid() = therapist_id);

-- Create policies for session_sensor_data
CREATE POLICY "Therapists can view sensor data for their sessions" 
ON public.session_sensor_data 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.test_sessions 
  WHERE test_sessions.id = session_sensor_data.session_id 
  AND test_sessions.therapist_id = auth.uid()
));

CREATE POLICY "System can insert sensor data" 
ON public.session_sensor_data 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Therapists can update sensor data for their sessions" 
ON public.session_sensor_data 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.test_sessions 
  WHERE test_sessions.id = session_sensor_data.session_id 
  AND test_sessions.therapist_id = auth.uid()
));

-- Create triggers for timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_sessions_updated_at
BEFORE UPDATE ON public.test_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_clients_therapist_id ON public.clients(therapist_id);
CREATE INDEX idx_test_sessions_client_id ON public.test_sessions(client_id);
CREATE INDEX idx_test_sessions_therapist_id ON public.test_sessions(therapist_id);
CREATE INDEX idx_test_sessions_status ON public.test_sessions(status);
CREATE INDEX idx_session_sensor_data_session_id ON public.session_sensor_data(session_id);
CREATE INDEX idx_session_sensor_data_timestamp ON public.session_sensor_data(timestamp);
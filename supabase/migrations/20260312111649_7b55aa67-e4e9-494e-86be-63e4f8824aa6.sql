-- Create email_templates table for saving user templates
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write templates (no auth required for this app)
CREATE POLICY "Anyone can view templates"
  ON public.email_templates FOR SELECT USING (true);

CREATE POLICY "Anyone can create templates"
  ON public.email_templates FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update templates"
  ON public.email_templates FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete templates"
  ON public.email_templates FOR DELETE USING (true);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
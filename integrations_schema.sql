-- 🛡️ Cunemo CRM: Esquema de Integraciones
-- Este script crea la tabla necesaria para gestionar WhatsApp y otras APIs.

-- 1. Crear la tabla de integraciones
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- Ej: 'whatsapp', 'google_calendar'
    access_token TEXT,
    refresh_token TEXT,
    settings JSONB DEFAULT '{}'::jsonb, -- Aquí guardamos el estado, QR, nombre de instancia, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, provider) -- Solo una instancia por proveedor por usuario
);

-- 2. Habilitar Seguridad de Nivel de Fila (RLS)
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Seguridad
-- Los usuarios solo pueden ver sus propias integraciones
CREATE POLICY "Users can view their own integrations" 
ON public.integrations FOR SELECT 
USING (auth.uid() = user_id);

-- Los usuarios pueden desconectar (borrar) sus propias integraciones
CREATE POLICY "Users can delete their own integrations" 
ON public.integrations FOR DELETE 
USING (auth.uid() = user_id);

-- El backend (service_role) tiene permiso total para gestionar las instancias
-- Esto es lo que usa /api/integrations/whatsapp/instance
CREATE POLICY "Service role can manage all integrations" 
ON public.integrations FOR ALL 
USING (true)
WITH CHECK (true);

-- 4. Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_integrations_user_provider ON public.integrations(user_id, provider);

-- 5. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

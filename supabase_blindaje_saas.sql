-- 1. ADICIÓN DE USER_ID PARA AISLAMIENTO (SAAS BLINDADO)
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE deals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE activities ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. ACTIVACIÓN DE SEGURIDAD DE FILA (RLS)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE ACCESO (Muros invisibles entre suscriptores)
-- Cuentas
DROP POLICY IF EXISTS "User can only access their own accounts" ON accounts;
CREATE POLICY "User can only access their own accounts" ON accounts
FOR ALL USING (auth.uid() = user_id);

-- Contactos
DROP POLICY IF EXISTS "User can only access their own contacts" ON contacts;
CREATE POLICY "User can only access their own contacts" ON contacts
FOR ALL USING (auth.uid() = user_id);

-- Negocios (Deals)
DROP POLICY IF EXISTS "User can only access their own deals" ON deals;
CREATE POLICY "User can only access their own deals" ON deals
FOR ALL USING (auth.uid() = user_id);

-- Actividades
DROP POLICY IF EXISTS "User can only access their own activities" ON activities;
CREATE POLICY "User can only access their own activities" ON activities
FOR ALL USING (auth.uid() = user_id);

-- 4. TABLA DE INTEGRACIONES (LLAVES PRIVADAS)
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    provider TEXT NOT NULL, -- 'google_calendar', 'whatsapp', etc.
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can only access their own integrations" ON integrations;
CREATE POLICY "User can only access their own integrations" ON integrations
FOR ALL USING (auth.uid() = user_id);

-- 5. CAMPO PARA SINCRONIZACIÓN DE GOOGLE CALENDAR
ALTER TABLE activities ADD COLUMN IF NOT EXISTS google_event_id TEXT;

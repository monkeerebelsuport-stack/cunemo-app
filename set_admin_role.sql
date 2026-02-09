-- 🛡️ Cunemo CRM: Creación de Tabla de Perfiles y Roles
-- Este script crea la infraestructura necesaria para el Super Admin.

-- 1. Crear la tabla de perfiles si no existe
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS en perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Seguridad para Perfiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- 4. Inyectar a Anderson como Super Admin (Populado manual para el primer admin)
-- Nota: '7815581d-aa40-41d9-8c1f-30e9b548ab39' es el ID detectado de Anderson.
INSERT INTO public.profiles (id, email, role)
VALUES ('7815581d-aa40-41d9-8c1f-30e9b548ab39', 'monkkee.rebel.suport@gmail.com', 'super_admin')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- 5. Verificar resultado
SELECT * FROM public.profiles WHERE role = 'super_admin';

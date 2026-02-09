-- 🏛️ Cunemo CRM: Gestión de Roles de Administración
-- Este script otorga el rol de 'super_admin' a Anderson.

-- 1. Asegurar que la columna 'role' exista en la tabla de perfiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- 2. Otorgar estatus de Super Admin a Anderson
-- Reemplaza 'TU_USER_ID' con tu ID de usuario de Supabase que aparece en la URL del dashboard.
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE id = '7815581d-aa40-41d9-8c1f-30e9b548ab39'; -- Este es el ID que vi en los errores de log de Anderson

-- 3. Verificar cambios
SELECT id, email, role FROM public.profiles WHERE role = 'super_admin';

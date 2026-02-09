import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // 🛡️ Protección de rutas de administración
    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Verificar si el usuario tiene el rol de super_admin
        // Consultamos la tabla de perfiles (donde Anderson es el único super_admin)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        if (!profile || profile.role !== 'super_admin') {
            // Si no es admin, redirigir al dashboard normal con un aviso
            console.warn(`Intento de acceso no autorizado a /admin por usuario: ${session.user.id}`);
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    // 🔐 Protección de rutas de dashboard (usuarios normales)
    if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/onboarding')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/onboarding/:path*'],
}

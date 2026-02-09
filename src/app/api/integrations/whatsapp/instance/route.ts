export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de servicio de Supabase para bypass RLS solo en creación controlada
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        // En un entorno real, aquí validaríamos la sesión del usuario
        // Por ahora simulamos la creación de una instancia externa

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 1. Simular llamada a Evolution API o similar
        // const response = await fetch(`${SERVER_URL}/instance/create`, { ... });
        // const data = await response.json();

        // 2. Generar un QR placeholder para demostración técnica
        const mockQr = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CunemoConnect_Mock_QR_" + Math.random().toString(36).substr(2, 9);

        // 3. Registrar o actualizar la integración en Supabase
        const { error } = await supabaseAdmin
            .from('integrations')
            .upsert({
                user_id: userId,
                provider: 'whatsapp',
                access_token: 'instance_token_placeholder', // El token que nos daría la API externa
                settings: {
                    type: 'unofficial',
                    status: 'connecting',
                    instance_name: `user_${userId.split('-')[0]}`,
                    qr: mockQr
                }
            }, { onConflict: 'user_id,provider' });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            qr: mockQr,
            instanceName: `user_${userId.split('-')[0]}`,
            message: 'Instancia lista para escaneo'
        });

    } catch (err) {
        console.error('Error creating WhatsApp instance:', err);
        return NextResponse.json({ error: 'Failed to create instance' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // Para consultar el estado de la conexión
    return NextResponse.json({ message: 'WhatsApp Instance status status endpoint active' });
}

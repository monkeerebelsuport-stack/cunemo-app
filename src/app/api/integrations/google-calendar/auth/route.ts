export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Integración con Google Calendar en construcción 🏗️',
        status: 'coming_soon'
    }, { status: 200 });
}

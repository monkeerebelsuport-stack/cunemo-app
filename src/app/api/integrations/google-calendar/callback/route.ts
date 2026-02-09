export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Callback de Google en construcción 🏗️',
        status: 'coming_soon'
    }, { status: 200 });
}

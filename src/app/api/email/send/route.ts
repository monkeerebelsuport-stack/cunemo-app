export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        message: 'Módulo de Email en construcción 🏗️',
        status: 'coming_soon'
    }, { status: 200 });
}

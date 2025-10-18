import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { script } = await request.json();

    if (!script || !script.trim()) {
      return NextResponse.json(
        { success: false, message: 'Script is required' },
        { status: 400 }
      );
    }

    // Generate random hash (32 karakter hex)
    const hash = crypto.randomBytes(16).toString('hex');

    // Simpan ke Redis dengan expiration 30 hari (2592000 detik)
    await redis.set(`script:${hash}`, script, { ex: 2592000 });

    console.log(`✅ Script created with hash: ${hash}`);

    return NextResponse.json({
      success: true,
      hash: hash,
      url: `/api/raw/${hash}`
    });

  } catch (error) {
    console.error('❌ Error creating script:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

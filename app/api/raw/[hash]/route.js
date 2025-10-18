import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { hash } = params;
    
    // Ambil User-Agent dari request
    const userAgent = request.headers.get('user-agent') || '';
    
    console.log(`🔍 Accessing script: ${hash}`);
    console.log(`📱 User-Agent: ${userAgent}`);

    // Cek apakah ini request dari browser
    const isBrowser = userAgent.toLowerCase().includes('mozilla') || 
                      userAgent.toLowerCase().includes('chrome') || 
                      userAgent.toLowerCase().includes('safari') || 
                      userAgent.toLowerCase().includes('edge') ||
                      userAgent.toLowerCase().includes('firefox');

    // ❌ Kalau dari browser -> BLOCK dengan ACCESS DENIED
    if (isBrowser) {
      console.log('❌ Browser detected - Access denied');
      return new NextResponse('ACCESS DENIED', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    // ✅ Bukan dari browser (script executor, cURL, dll) -> Allowed
    console.log('✅ Non-browser request detected - Checking script...');
    
    const script = await redis.get(`script:${hash}`);

    if (!script) {
      console.log(`❌ Script not found: ${hash}`);
      return new NextResponse('ACCESS DENIED', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    console.log(`✅ Script retrieved successfully: ${hash}`);

    // Return script asli sebagai plain text
    return new NextResponse(script, {
      status: 200,
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('❌ Error retrieving script:', error);
    return new NextResponse('ACCESS DENIED', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

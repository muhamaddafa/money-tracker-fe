import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    
    // Build allowed origins
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      host ? `https://${host}` : null,
      host ? `http://${host}` : null,
    ].filter(Boolean) as string[];

    // Check if origin matches
    const isValidOrigin = origin && allowedOrigins.some(allowed => 
      origin === allowed || origin.startsWith(allowed)
    );

    // Check if referer matches (fallback for some browsers)
    const isValidReferer = referer && allowedOrigins.some(allowed =>
      referer.startsWith(allowed)
    );

    // Block if neither origin nor referer is valid
    if (!isValidOrigin && !isValidReferer) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'API can only be accessed from the application' 
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: '/api/:path*',
};
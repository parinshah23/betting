import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Routes that require authentication
  // Note: We use config.matcher to filter, so this runs on those routes.
  // We can add more logic here if needed.
  
  if (!refreshToken) {
    const loginUrl = new URL('/login', request.url);
    // Add redirect param so we can send them back after login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart',
    '/checkout/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/my-tickets/:path*',
    '/my-wins/:path*',
    '/wallet/:path*',
    '/admin/:path*'
  ],
};

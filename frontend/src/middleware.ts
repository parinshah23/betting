import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Auth is handled client-side by each protected layout (DashboardLayout etc.)
  // Server-side cookie checks cannot work here because the refreshToken cookie
  // is set by the backend on a different domain (onrender.com) and browsers
  // never forward cross-domain cookies to the Next.js middleware on vercel.app.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

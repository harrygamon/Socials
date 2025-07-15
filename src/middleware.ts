import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = [
  '/feed',
  '/profile',
  '/messages',
  '/discover',
  '/pricing',
  '/settings',
  // add more protected routes as needed
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Allow public and onboarding routes
  if (
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Only check protected paths
  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Get user session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    // Not signed in, let other auth logic handle
    return NextResponse.next();
  }

  // If user is not onboarded, redirect to onboarding
  if (token.onboarded === false || token.onboarded === undefined) {
    const url = req.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/feed/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/discover/:path*',
    '/pricing/:path*',
    '/settings/:path*',
    // add more protected routes as needed
  ],
}; 
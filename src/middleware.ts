import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected application routes requiring active authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/vehicles',
  '/drivers',
  '/trips',
  '/fuel',
  '/maintenance',
  '/expenses',
  '/reports',
  '/ai-center',
  '/ai-assistant',
  '/settings',
  '/profile',
  '/users',
  '/notifications',
  '/tracking',
]

// Auth routes that should redirect to /dashboard if user is already logged in
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('fleetvision_session')?.value

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route)

  // 1. Unauthenticated user trying to access protected route
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Authenticated user trying to access login/register
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets/* (public vehicle/login media)
     * - api/* (API routes handle their own auth responses)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|api).*)',
  ],
}

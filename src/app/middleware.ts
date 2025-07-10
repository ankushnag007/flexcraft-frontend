import { NextResponse, type NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth' // Your auth logic

export async function middleware(request: NextRequest) {
  const isAuthenticated = false // Check cookies/tokens

  // Protected routes (add more as needed)
 const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/manageprojects',
  '/email',
  '/apiworkspace',
  '/chat',
  '/github',
  '/aiagent',
  '/deployment',
  '/integrationsapp',
  '/automation',
  '/designArchitecture'
];

  if (
    protectedRoutes.some((route) => 
      request.nextUrl.pathname.startsWith(route)
    ) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
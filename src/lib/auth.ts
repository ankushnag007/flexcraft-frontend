import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function verifyAuth(request: NextRequest) {
  const cookie = request.cookies.get('auth-token')?.value
  // OR check a session (e.g., NextAuth.js)
  return !!cookie // Returns `true` if authenticated
}
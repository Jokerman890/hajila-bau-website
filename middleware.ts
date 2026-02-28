import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = process.env.ADMIN_BASIC_USER
const ADMIN_PASSWORD = process.env.ADMIN_BASIC_PASSWORD

function unauthorizedResponse() {
  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Hajila Admin"',
    },
  })
}

function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function middleware(request: NextRequest) {
  // Fail-closed: if credentials are missing, block protected routes.
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return unauthorizedResponse()
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  const base64Credentials = authHeader.split(' ')[1] ?? ''
  let decoded = ''
  try {
    decoded = atob(base64Credentials)
  } catch {
    return unauthorizedResponse()
  }

  const separatorIndex = decoded.indexOf(':')
  if (separatorIndex === -1) {
    return unauthorizedResponse()
  }

  const username = decoded.slice(0, separatorIndex)
  const password = decoded.slice(separatorIndex + 1)

  const userOk = safeEquals(username, ADMIN_USER)
  const passwordOk = safeEquals(password, ADMIN_PASSWORD)

  if (!userOk || !passwordOk) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

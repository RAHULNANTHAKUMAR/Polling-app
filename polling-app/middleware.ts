import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Define restricted routes for non-logged-in users
  const restrictedRoutes = ['/dashboard', '/create', '/logout'];

  // Block dynamic route pattern /[slug]/result
  const isRestrictedDynamicRoute = /^\/[^\/]+\/result$/.test(pathname);

  if (!token) {
    // If user is not logged in, restrict access to certain routes
    if (restrictedRoutes.includes(pathname) || isRestrictedDynamicRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } else {
    // If user is logged in, redirect from /login to /dashboard
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

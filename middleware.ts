import { auth } from '@/lib/auth/auth';

export default auth((req) => {
  // Auth middleware runs automatically
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

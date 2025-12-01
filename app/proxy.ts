import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ['/'], // Only the homepage is public
});

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    '/((?!_next|.*\\.(?:css|js|png|jpg|jpeg|svg|ico|webp|gif|woff2?|ttf|json|txt)).*)',
    // Protect all API routes
    '/(api|trpc)(.*)',
  ],
};

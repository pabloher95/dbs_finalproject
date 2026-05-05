import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/import(.*)",
  "/products(.*)",
  "/contacts(.*)",
  "/orders(.*)",
  "/purchasing(.*)",
  "/api/products(.*)",
  "/api/contacts(.*)",
  "/api/orders(.*)",
  "/api/import(.*)",
  "/api/materials(.*)",
  "/api/business(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};

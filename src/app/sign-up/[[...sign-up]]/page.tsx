import { ClerkProvider, SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <ClerkProvider
      dynamic
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <main className="min-h-screen px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1320px] items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div>
              <p className="eyebrow text-[var(--vermilion)]">SmallBiz IQ</p>
              <h1 className="editorial mt-3 text-[clamp(2.4rem,5vw,4rem)]">Create account</h1>
              <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
                Set up your studio and start tracking inventory, orders, and purchasing.
              </p>
            </div>

            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
            />

            <p className="marginalia">
              Already have an account? <Link href={"/sign-in" as Route}>Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </ClerkProvider>
  );
}

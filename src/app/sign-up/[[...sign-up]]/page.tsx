import { ClerkProvider, SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { LanguageSwitcher } from "@/components/providers/language-switcher";
import { authCopy } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const { userId } = await auth();
  const language = await getRequestLanguage();
  const copy = authCopy(language);

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
            <div className="flex justify-end">
              <LanguageSwitcher />
            </div>
            <div>
              <p className="eyebrow text-[var(--vermilion)]">SmallBiz IQ</p>
              <h1 className="editorial mt-3 text-[clamp(2.4rem,5vw,4rem)]">{copy.createAccount}</h1>
              <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
                {copy.signUpDescription}
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
              {copy.alreadyHave} <Link href={"/sign-in" as Route}>{copy.signIn}</Link>
            </p>
          </div>
        </div>
      </main>
    </ClerkProvider>
  );
}

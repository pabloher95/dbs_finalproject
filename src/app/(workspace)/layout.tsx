import { ClerkProvider } from "@clerk/nextjs";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      <WorkspaceShell>{children}</WorkspaceShell>
    </ClerkProvider>
  );
}

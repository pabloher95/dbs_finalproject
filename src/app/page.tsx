import { HomePageContent } from "@/components/layout/home-page-content";
import { OnboardingGate } from "@/components/layout/onboarding-gate";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function HomePage() {
  const { snapshot } = await getWorkspaceOverview();

  return (
    <WorkspaceShell>
      <OnboardingGate defaultOpen>
        <HomePageContent snapshot={snapshot} />
      </OnboardingGate>
    </WorkspaceShell>
  );
}

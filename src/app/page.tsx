import { HomePageContent } from "@/components/layout/home-page-content";
import { OnboardingGate } from "@/components/layout/onboarding-gate";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export default function HomePage() {
  return (
    <WorkspaceShell>
      <OnboardingGate>
        <HomePageContent />
      </OnboardingGate>
    </WorkspaceShell>
  );
}

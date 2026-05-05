import { BusinessNameGate } from "@/components/layout/business-name-gate";
import { HomePageContent } from "@/components/layout/home-page-content";
import { OnboardingGate } from "@/components/layout/onboarding-gate";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function DashboardPage() {
  const { snapshot } = await getWorkspaceOverview();
  const needsBusinessName = !snapshot.business.name.trim() || snapshot.business.name === "Your Business";

  return (
    <BusinessNameGate businessName={snapshot.business.name}>
      <OnboardingGate defaultOpen={!needsBusinessName}>
        <HomePageContent snapshot={snapshot} />
      </OnboardingGate>
    </BusinessNameGate>
  );
}

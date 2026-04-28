import { ImportPageContent } from "@/components/layout/import-page-content";
import { OnboardingGate } from "@/components/layout/onboarding-gate";

export default function HomePage() {
  return (
    <OnboardingGate>
      <ImportPageContent />
    </OnboardingGate>
  );
}

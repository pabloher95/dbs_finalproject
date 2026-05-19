import { BusinessNameGate } from "@/components/layout/business-name-gate";
import { HomePageContent } from "@/components/layout/home-page-content";
import { getWorkspaceOverview } from "@/lib/server/workspace";

export default async function DashboardPage() {
  const { snapshot } = await getWorkspaceOverview();

  return (
    <BusinessNameGate businessName={snapshot.business.name}>
      <HomePageContent snapshot={snapshot} />
    </BusinessNameGate>
  );
}

import { ImportExperience } from "@/components/forms/import-experience";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function ImportPageContent({ snapshot }: Readonly<{ snapshot: BusinessSnapshot }>) {
  return <ImportExperience snapshot={snapshot} />;
}

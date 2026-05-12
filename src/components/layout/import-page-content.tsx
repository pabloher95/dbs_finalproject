import { ImportExperience } from "@/components/forms/import-experience";
import type { BusinessSnapshot } from "@/lib/domain/types";

export function ImportPageContent({
  snapshot,
  editingProductId
}: Readonly<{ snapshot: BusinessSnapshot; editingProductId?: string }>) {
  return <ImportExperience snapshot={snapshot} editingProductId={editingProductId} />;
}

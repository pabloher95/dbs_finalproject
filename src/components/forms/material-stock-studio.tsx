"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Eyebrow, Pill, Toast } from "@/components/ui/surfaces";
import type { Material, Supplier } from "@/lib/domain/types";

function supplierName(material: Material, suppliers: Supplier[]) {
  return suppliers.find((supplier) => supplier.id === material.preferredSupplierId)?.name ?? "Unassigned";
}

export function MaterialStockStudio({
  materials,
  suppliers
}: Readonly<{
  materials: Material[];
  suppliers: Supplier[];
}>) {
  const router = useRouter();
  const [inventory, setInventory] = useState(materials);
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id ?? "");
  const [delta, setDelta] = useState("12");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "info" | "success" | "warn" | "error" } | null>(null);

  useEffect(() => {
    setInventory(materials);
    if (!selectedMaterialId && materials[0]?.id) {
      setSelectedMaterialId(materials[0].id);
    }
  }, [materials, selectedMaterialId]);

  const visibleMaterials = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return inventory;
    return inventory.filter((material) =>
      [material.name, material.unit, supplierName(material, suppliers)].some((value) =>
        value.toLowerCase().includes(key)
      )
    );
  }, [inventory, search, suppliers]);

  const selectedMaterial = inventory.find((material) => material.id === selectedMaterialId) ?? visibleMaterials[0];

  useEffect(() => {
    if (!selectedMaterial && visibleMaterials[0]?.id) {
      setSelectedMaterialId(visibleMaterials[0].id);
    }
  }, [selectedMaterial, visibleMaterials]);

  async function applyAdjustment(amount: number) {
    if (!selectedMaterialId) {
      setToast({ message: "Choose a material first.", tone: "warn" });
      return;
    }
    if (!Number.isFinite(amount) || amount === 0) {
      setToast({ message: "Enter a non-zero stock adjustment.", tone: "warn" });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust",
          materialId: selectedMaterialId,
          delta: amount
        })
      });
      const data = (await response.json()) as { snapshot?: { materials: Material[] }; error?: string };
      if (!response.ok || !data.snapshot) {
        setToast({ message: data.error ?? "Unable to update material stock.", tone: "error" });
        return;
      }

      setInventory(data.snapshot.materials);
      setToast({ message: "Material stock updated.", tone: "success" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="rounded-[28px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow tone="flame">Inventory</Eyebrow>
          <p className="mt-2 font-display text-3xl leading-tight text-[var(--ink)]">Track stock on hand</p>
          <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-[var(--muted-strong)]">
            Add receipts, subtract usage, and keep the purchasing plan grounded in what is already on the shelf.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="ink">{inventory.length} materials</Pill>
          <Pill tone={inventory.some((material) => material.onHandQuantity > 0) ? "moss" : "amber"}>
            {inventory.filter((material) => material.onHandQuantity > 0).length} stocked
          </Pill>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_11rem_8rem]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search material or supplier"
          className="field"
        />
        <select
          value={selectedMaterialId}
          onChange={(event) => setSelectedMaterialId(event.target.value)}
          className="field"
        >
          {visibleMaterials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
        <input
          value={delta}
          onChange={(event) => setDelta(event.target.value)}
          type="number"
          step="1"
          className="field font-mono text-sm"
          placeholder="+12 / -12"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-flame" disabled={busy} onClick={() => void applyAdjustment(Number(delta))}>
          {busy ? "Saving…" : "Apply adjustment"}
        </button>
        {([1, 5, 12, -12] as const).map((amount) => (
          <button
            key={amount}
            type="button"
            className="btn btn-soft"
            disabled={busy}
            onClick={() => {
              void applyAdjustment(amount);
            }}
          >
            {amount > 0 ? "+" : ""}
            {amount}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)]">
        <table className="console-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>On hand</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {visibleMaterials.map((material) => (
              <tr
                key={material.id}
                className={material.id === selectedMaterialId ? "bg-[rgba(46,83,57,0.06)]" : undefined}
                onClick={() => setSelectedMaterialId(material.id)}
              >
                <td>
                  <p className="font-display text-lg text-[var(--ink)]">{material.name}</p>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                    Unit {material.unit}
                  </p>
                </td>
                <td className="font-mono text-[0.9rem]">
                  <span className="font-display text-2xl text-[var(--ink)]">{material.onHandQuantity.toFixed(0)}</span>{" "}
                  <span className="text-xs text-[var(--muted-strong)]">{material.unit}</span>
                </td>
                <td className="text-sm text-[var(--muted-strong)]">{supplierName(material, suppliers)}</td>
              </tr>
            ))}
            {!visibleMaterials.length ? (
              <tr>
                <td colSpan={3} className="text-center text-sm text-[var(--muted-strong)]">
                  No materials match that search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selectedMaterial ? (
        <p className="mt-4 text-sm text-[var(--muted-strong)]">
          Selected <span className="font-medium text-[var(--ink)]">{selectedMaterial.name}</span> at{" "}
          {selectedMaterial.onHandQuantity.toFixed(0)} {selectedMaterial.unit} on hand.
        </p>
      ) : null}

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={() => setToast(null)} /> : null}
    </Card>
  );
}

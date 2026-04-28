export type ImportTarget = "products" | "orders";

export type ImportRowReport = {
  rowNumber: number;
  status: "created" | "skipped" | "error";
  message: string;
};

export type ImportPreview = {
  createdRecords: number;
  skippedRows: number[];
  errors: Array<{ rowNumber: number; message: string }>;
  rowReports: ImportRowReport[];
};

function parseCsv(csv: string) {
  return csv
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function parseProductImport(csv: string): ImportPreview {
  const rows = parseCsv(csv);
  const header = rows[0] ?? [];
  const expected = [
    "sku",
    "name",
    "category",
    "unit",
    "yield_quantity",
    "material_name",
    "material_unit",
    "material_quantity"
  ];

  if (header.join(",") !== expected.join(",")) {
    return {
      createdRecords: 0,
      skippedRows: [],
      errors: [{ rowNumber: 1, message: "Header does not match products-formulas-v1 template." }],
      rowReports: [{ rowNumber: 1, status: "error", message: "Header does not match products-formulas-v1 template." }]
    };
  }

  const seenFormulaRows = new Set<string>();
  const reports: ImportRowReport[] = [];
  const errors: Array<{ rowNumber: number; message: string }> = [];
  let created = 0;

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    if (row.every((cell) => cell === "")) {
      reports.push({ rowNumber, status: "skipped", message: "Blank row skipped." });
      return;
    }
    const [sku, name, category, unit, yieldQuantity, materialName, materialUnit, materialQuantity] = row;
    if (![sku, name, category, unit, yieldQuantity, materialName, materialUnit, materialQuantity].every(Boolean)) {
      const message = "Missing one or more required product fields.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message });
      return;
    }
    const dedupeKey = `${sku}:${materialName}`;
    if (seenFormulaRows.has(dedupeKey)) {
      reports.push({ rowNumber, status: "skipped", message: "Duplicate product material row skipped." });
      return;
    }
    if (Number.isNaN(Number(yieldQuantity)) || Number.isNaN(Number(materialQuantity))) {
      const message = "Yield quantity and material quantity must be numeric.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message });
      return;
    }
    seenFormulaRows.add(dedupeKey);
    created += 1;
    reports.push({ rowNumber, status: "created", message: `Prepared ${name} material row.` });
  });

  return {
    createdRecords: created,
    skippedRows: reports.filter((report) => report.status === "skipped").map((report) => report.rowNumber),
    errors,
    rowReports: reports
  };
}

export function parseOrderImport(csv: string): ImportPreview {
  const rows = parseCsv(csv);
  const header = rows[0] ?? [];
  const expected = ["order_number", "client_name", "due_date", "status", "product_sku", "quantity"];

  if (header.join(",") !== expected.join(",")) {
    return {
      createdRecords: 0,
      skippedRows: [],
      errors: [{ rowNumber: 1, message: "Header does not match orders-v1 template." }],
      rowReports: [{ rowNumber: 1, status: "error", message: "Header does not match orders-v1 template." }]
    };
  }

  const reports: ImportRowReport[] = [];
  const errors: Array<{ rowNumber: number; message: string }> = [];
  let created = 0;

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    if (row.every((cell) => cell === "")) {
      reports.push({ rowNumber, status: "skipped", message: "Blank row skipped." });
      return;
    }
    const [orderNumber, clientName, dueDate, status, productSku, quantity] = row;
    if (![orderNumber, clientName, dueDate, status, productSku, quantity].every(Boolean)) {
      const message = "Missing one or more required order fields.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message });
      return;
    }
    if (!["draft", "open", "fulfilled"].includes(status)) {
      const message = "Status must be draft, open, or fulfilled.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message });
      return;
    }
    if (Number.isNaN(Number(quantity))) {
      const message = "Quantity must be numeric.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message });
      return;
    }
    created += 1;
    reports.push({ rowNumber, status: "created", message: `Prepared order line ${orderNumber}.` });
  });

  return {
    createdRecords: created,
    skippedRows: reports.filter((report) => report.status === "skipped").map((report) => report.rowNumber),
    errors,
    rowReports: reports
  };
}

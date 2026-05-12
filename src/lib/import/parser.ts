import { UserFacingError } from "../user-facing-error.js";

export type ImportTarget = "products" | "orders";

export type ImportRowReport = {
  rowNumber: number;
  status: "created" | "skipped" | "error";
  message: string;
  raw?: string;
};

export type ImportPreview = {
  createdRecords: number;
  skippedRows: number[];
  errors: Array<{ rowNumber: number; message: string }>;
  rowReports: ImportRowReport[];
};

export type ParsedProductImportRow = {
  rowNumber: number;
  sku: string;
  name: string;
  category: string;
  unit: string;
  yieldQuantity: number;
  materialName: string;
  materialUnit: string;
  materialQuantity: number;
};

export type ParsedOrderImportRow = {
  rowNumber: number;
  orderNumber: string;
  clientName: string;
  destination: string;
  dueDate: string;
  status: "open" | "fulfilled";
  productSku: string;
  quantity: number;
};

type CsvRow = {
  cells: string[];
  raw: string;
};

function parseCsv(csv: string): CsvRow[] {
  const rows: CsvRow[] = [];
  const source = csv.replace(/^\uFEFF/, "");
  let cells: string[] = [];
  let cell = "";
  let raw = "";
  let inQuotes = false;

  const pushCell = () => {
    cells.push(cell.trim());
    cell = "";
  };

  const pushRow = () => {
    if (!cells.length && !cell.length && !raw.trim().length) {
      cells = [];
      cell = "";
      raw = "";
      return;
    }

    pushCell();
    rows.push({ cells: [...cells], raw });
    cells = [];
    cell = "";
    raw = "";
  };

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inQuotes) {
      if (char === '"') {
        if (next === '"') {
          cell += '"';
          raw += '""';
          index += 1;
          continue;
        }

        inQuotes = false;
        raw += char;
        continue;
      }

      cell += char;
      raw += char;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      raw += char;
      continue;
    }

    if (char === ",") {
      pushCell();
      raw += char;
      continue;
    }

    if (char === "\r" || char === "\n") {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      pushRow();
      continue;
    }

    cell += char;
    raw += char;
  }

  if (inQuotes) {
    throw new UserFacingError("CSV contains an unclosed quoted field.");
  }

  pushRow();
  return rows;
}

function normalizeHeader(header: string[]) {
  return header.map((cell) => cell.trim().toLowerCase());
}

function rowHasArityMismatch(row: string[], expectedLength: number) {
  return row.length !== expectedLength;
}

export function parseProductImport(csv: string): ImportPreview {
  return parseProductImportRows(csv).preview;
}

export function parseProductImportRows(csv: string): {
  preview: ImportPreview;
  rows: ParsedProductImportRow[];
} {
  const rows = parseCsv(csv);
  const header = rows[0]?.cells ?? [];
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

  if (normalizeHeader(header).join(",") !== expected.join(",")) {
    const preview: ImportPreview = {
      createdRecords: 0,
      skippedRows: [],
      errors: [{ rowNumber: 1, message: "Header does not match products-formulas-v1 template." }],
      rowReports: [
        {
          rowNumber: 1,
          status: "error",
          message: "Header does not match products-formulas-v1 template.",
          raw: rows[0]?.raw
        }
      ]
    };

    return { preview, rows: [] };
  }

  const seenFormulaRows = new Set<string>();
  const reports: ImportRowReport[] = [];
  const errors: Array<{ rowNumber: number; message: string }> = [];
  const parsedRows: ParsedProductImportRow[] = [];
  let created = 0;

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    if (row.cells.every((cell) => cell === "")) {
      reports.push({ rowNumber, status: "skipped", message: "Blank row skipped.", raw: row.raw });
      return;
    }
    if (rowHasArityMismatch(row.cells, expected.length)) {
      const message = `Expected ${expected.length} columns but found ${row.cells.length}. Check for missing values or unescaped commas.`;
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    const [sku, name, category, unit, yieldQuantity, materialName, materialUnit, materialQuantity] = row.cells;
    if (![sku, name, category, unit, yieldQuantity, materialName, materialUnit, materialQuantity].every(Boolean)) {
      const message = "Missing one or more required product fields.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    const dedupeKey = `${sku}:${materialName}`;
    if (seenFormulaRows.has(dedupeKey)) {
      reports.push({ rowNumber, status: "skipped", message: "Duplicate product material row skipped.", raw: row.raw });
      return;
    }
    if (Number.isNaN(Number(yieldQuantity)) || Number.isNaN(Number(materialQuantity))) {
      const message = "Yield quantity and material quantity must be numeric.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    seenFormulaRows.add(dedupeKey);
    created += 1;
    parsedRows.push({
      rowNumber,
      sku,
      name,
      category,
      unit,
      yieldQuantity: Number(yieldQuantity),
      materialName,
      materialUnit,
      materialQuantity: Number(materialQuantity)
    });
    reports.push({ rowNumber, status: "created", message: `Prepared ${name} material row.`, raw: row.raw });
  });

  const preview: ImportPreview = {
    createdRecords: created,
    skippedRows: reports.filter((report) => report.status === "skipped").map((report) => report.rowNumber),
    errors,
    rowReports: reports
  };

  return { preview, rows: parsedRows };
}

export function parseOrderImport(csv: string): ImportPreview {
  return parseOrderImportRows(csv).preview;
}

export function parseOrderImportRows(csv: string): {
  preview: ImportPreview;
  rows: ParsedOrderImportRow[];
} {
  const rows = parseCsv(csv);
  const header = rows[0]?.cells ?? [];
  const expected = ["order_number", "client_name", "destination", "due_date", "status", "product_sku", "quantity"];

  if (normalizeHeader(header).join(",") !== expected.join(",")) {
    const preview: ImportPreview = {
      createdRecords: 0,
      skippedRows: [],
      errors: [{ rowNumber: 1, message: "Header does not match orders-v1 template." }],
      rowReports: [
        {
          rowNumber: 1,
          status: "error",
          message: "Header does not match orders-v1 template.",
          raw: rows[0]?.raw
        }
      ]
    };

    return { preview, rows: [] };
  }

  const reports: ImportRowReport[] = [];
  const errors: Array<{ rowNumber: number; message: string }> = [];
  const parsedRows: ParsedOrderImportRow[] = [];
  const seenOrderLines = new Set<string>();
  let created = 0;

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    if (row.cells.every((cell) => cell === "")) {
      reports.push({ rowNumber, status: "skipped", message: "Blank row skipped.", raw: row.raw });
      return;
    }
    if (rowHasArityMismatch(row.cells, expected.length)) {
      const message = `Expected ${expected.length} columns but found ${row.cells.length}. Check for missing values or unescaped commas.`;
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    const [orderNumber, clientName, destination, dueDate, status, productSku, quantity] = row.cells;
    if (![orderNumber, clientName, destination, dueDate, status, productSku, quantity].every(Boolean)) {
      const message = "Missing one or more required order fields.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    if (!["open", "fulfilled"].includes(status)) {
      const message = "Status must be open or fulfilled.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    if (Number.isNaN(Number(quantity))) {
      const message = "Quantity must be numeric.";
      errors.push({ rowNumber, message });
      reports.push({ rowNumber, status: "error", message, raw: row.raw });
      return;
    }
    const dedupeKey = `${orderNumber}:${productSku}`;
    if (seenOrderLines.has(dedupeKey)) {
      reports.push({ rowNumber, status: "skipped", message: "Duplicate order line skipped.", raw: row.raw });
      return;
    }
    seenOrderLines.add(dedupeKey);
    created += 1;
    parsedRows.push({
      rowNumber,
      orderNumber,
      clientName,
      destination,
      dueDate,
      status: status as ParsedOrderImportRow["status"],
      productSku,
      quantity: Number(quantity)
    });
    reports.push({ rowNumber, status: "created", message: `Prepared order line ${orderNumber}.`, raw: row.raw });
  });

  const preview: ImportPreview = {
    createdRecords: created,
    skippedRows: reports.filter((report) => report.status === "skipped").map((report) => report.rowNumber),
    errors,
    rowReports: reports
  };

  return { preview, rows: parsedRows };
}

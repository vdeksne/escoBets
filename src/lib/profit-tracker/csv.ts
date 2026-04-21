import type { ProfitTrackerEntry, TrackingType } from "@/types/profit-tracker";
import { generateProfitTrackerEntryId } from "@/lib/profit-tracker/entry-id";

const VALID_TYPES: TrackingType[] = ["investment", "profit", "loss"];

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** UTF-8 BOM so Excel opens UTF-8 CSV correctly */
export function entriesToCsv(entries: ProfitTrackerEntry[]): string {
  const header = ["id", "name", "date", "type", "amount"];
  const rows = entries.map((e) =>
    [e.id, e.name ?? "", e.date, e.type, String(e.amount)].map(escapeCsvCell).join(","),
  );
  return `\uFEFF${[header.join(","), ...rows].join("\r\n")}\r\n`;
}

/** Normalize BOM, line breaks (incl. Mac CR-only), optional Excel sep= row */
export function normalizeRawCsvText(raw: string): string {
  let text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const allLines = text.split("\n");
  const first = allLines[0]?.trim() ?? "";
  if (/^sep\s*=/i.test(first)) {
    text = allLines.slice(1).join("\n");
  }
  return text;
}

/** Read CSV from disk with UTF-8 / UTF-16 (Excel) detection */
export async function readCsvFileAsText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return normalizeRawCsvText(new TextDecoder("utf-16le").decode(buf));
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return normalizeRawCsvText(new TextDecoder("utf-16be").decode(buf));
  }
  return normalizeRawCsvText(new TextDecoder("utf-8").decode(buf));
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function normalizeType(raw: string): TrackingType | null {
  const t = raw.trim().replace(/^\uFEFF/, "").toLowerCase();
  return VALID_TYPES.includes(t as TrackingType) ? (t as TrackingType) : null;
}

function parseIsoDate(raw: string): string | null {
  const s = raw.trim().replace(/^\uFEFF/, "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Excel US-style M/D/YYYY or MM/DD/YYYY
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) {
    const mo = Number(mdy[1]);
    const da = Number(mdy[2]);
    const yr = Number(mdy[3]);
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      return `${yr}-${String(mo).padStart(2, "0")}-${String(da).padStart(2, "0")}`;
    }
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${mo}-${da}`;
  }
  return null;
}

type CsvDelimiter = "," | "\t" | ";";

function parseDelimitedLine(line: string, delimiter: CsvDelimiter): string[] {
  if (delimiter === "\t") {
    return line.split("\t").map((c) => c.trim());
  }
  if (delimiter === ";") {
    return line.split(";").map((c) => c.trim());
  }
  return parseCsvLine(line);
}

/**
 * Parse CSV text. Expected header row: id,name,date,type,amount (order flexible).
 * Returns new entries (ids generated when missing or invalid).
 */
export function parseProfitTrackerCsv(text: string): ProfitTrackerEntry[] {
  const normalized = normalizeRawCsvText(text);
  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.");
  }

  const headerLine = lines[0].replace(/^\uFEFF/, "");
  const tabCols = headerLine.split("\t").filter((c) => c.length > 0).length;
  const commaCols = parseCsvLine(headerLine).length;
  const semiCols = headerLine.split(";").filter((c) => c.trim().length > 0).length;
  let delimiter: CsvDelimiter = ",";
  if (headerLine.includes("\t") && tabCols >= commaCols) {
    delimiter = "\t";
  } else if (semiCols >= 4 && commaCols < 4) {
    delimiter = ";";
  }

  const headerCells = parseDelimitedLine(headerLine, delimiter).map((h) =>
    h.trim().replace(/^\uFEFF/, "").toLowerCase(),
  );
  const idx = (name: string) => headerCells.indexOf(name);

  const idCol = idx("id");
  const nameCol = (() => {
    const direct = idx("name");
    if (direct >= 0) return direct;
    const entryName = idx("entryname");
    if (entryName >= 0) return entryName;
    const label = idx("label");
    if (label >= 0) return label;
    return idx("title");
  })();
  const dateCol = idx("date");
  const typeCol = idx("type");
  const amountCol = idx("amount");

  if (dateCol < 0 || typeCol < 0 || amountCol < 0) {
    throw new Error(
      'CSV header must include columns: date, type, amount (optional: "id", "name").',
    );
  }

  const out: ProfitTrackerEntry[] = [];
  for (let r = 1; r < lines.length; r++) {
    const rowLine = lines[r].replace(/^\uFEFF/, "");
    const cells = parseDelimitedLine(rowLine, delimiter);
    if (cells.every((c) => !c.trim())) continue;

    const date = dateCol < cells.length ? parseIsoDate(cells[dateCol] ?? "") : null;
    const type = typeCol < cells.length ? normalizeType(cells[typeCol] ?? "") : null;
    const amountRaw = amountCol < cells.length ? (cells[amountCol] ?? "").trim() : "";
    const amount = Number.parseFloat(amountRaw.replace(/,/g, ""));

    if (!date || !type || !Number.isFinite(amount)) {
      throw new Error(`Invalid row ${r + 1}: need valid date, type, and amount.`);
    }

    const idCell = idCol >= 0 && idCol < cells.length ? (cells[idCol] ?? "").trim() : "";
    const id = idCell.length > 0 ? idCell : generateProfitTrackerEntryId();
    const nameRaw = nameCol >= 0 && nameCol < cells.length ? (cells[nameCol] ?? "").trim() : "";
    const name = nameRaw.length > 0 ? nameRaw : undefined;

    out.push({ id, name, amount, type, date });
  }

  if (out.length === 0) {
    throw new Error(
      "No valid data rows found. Use columns id, name, date, type, amount (comma, tab, or semicolon separated).",
    );
  }

  return out;
}

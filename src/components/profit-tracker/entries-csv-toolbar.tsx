"use client";

import { useCallback, useRef } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  clearProfitTrackerEntries,
  loadProfitTrackerEntries,
  saveProfitTrackerEntries,
} from "@/lib/profit-tracker/entries-storage";
import {
  entriesToCsv,
  parseProfitTrackerCsv,
  readCsvFileAsText,
} from "@/lib/profit-tracker/csv";
import type { ProfitTrackerEntry } from "@/types/profit-tracker";

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type Props = {
  entries: ProfitTrackerEntry[];
  /** When set, import/export/clear use this scoped store (e.g. admin viewing a user). */
  storageScope?: string;
};

export function EntriesCsvToolbar({ entries, storageScope }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const data =
      entries.length > 0 ? entries : loadProfitTrackerEntries(storageScope);
    const csv = entriesToCsv(data);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`profit-tracker-${stamp}.csv`, csv);
  }, [entries, storageScope]);

  const handleImportFile = useCallback(
    async (file: File) => {
      let text: string;
      try {
        text = await readCsvFileAsText(file);
      } catch {
        window.alert("Could not read the file.");
        return;
      }
      let imported;
      try {
        imported = parseProfitTrackerCsv(text);
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Invalid CSV.");
        return;
      }
      const deletePrevious = window.confirm(
        "Delete all existing profit tracker data and use only the rows from this file?\n\n" +
          "OK = Yes, delete previous data and import\n" +
          "Cancel = No, keep existing data and merge with the import (same id updates a row)",
      );
      if (deletePrevious) {
        saveProfitTrackerEntries(imported, storageScope);
      } else {
        const existing = loadProfitTrackerEntries(storageScope);
        const byId = new Map(existing.map((e) => [e.id, e]));
        for (const row of imported) {
          byId.set(row.id, row);
        }
        saveProfitTrackerEntries(Array.from(byId.values()), storageScope);
      }
    },
    [storageScope],
  );

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={handleExport}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-red-500/70 text-xs text-red-200 hover:bg-red-500/10"
        onClick={() => {
          const first = window.confirm(
            "Clear all profit tracker data?\n\nThis will delete everything stored in this browser.",
          );
          if (!first) return;
          const second = window.confirm("Are you sure? This cannot be undone.");
          if (!second) return;
          clearProfitTrackerEntries(storageScope);
        }}
      >
        <Trash2 className="h-4 w-4" />
        Clear all
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const input = e.currentTarget;
          const f = input.files?.[0];
          if (f) {
            void handleImportFile(f).finally(() => {
              input.value = "";
            });
          }
        }}
      />
    </div>
  );
}

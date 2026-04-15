"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import RatesTableWithRestrictions from "@/components/RatesTableWithRestrictions";
import ApplyRestrictionModal from "@/components/restrictions/ApplyRestrictionModal";
import TableSettingsModal from "@/components/restrictions/TableSettingsModal";
import { DayRestriction, HOTEL_NAMES, HOTEL_RESTRICTIONS, RestrictionType } from "@/lib/restrictionData";

// Seed restriction lookup — used to decide if a "Clear" actually needs publishing
const SEED_MAP = new Map(HOTEL_RESTRICTIONS.map((h) => [h.hotelId, h.restrictions]));

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  );
}

function TableSettingsIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      {/* TableChart icon clipped to L-shape, clearing space for cog in bottom-right */}
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60"
        style={{
          position: "absolute", top: 0, left: 0,
          clipPath: "polygon(0px 0px, 100% 0px, 100% 50%, 70% 50%, 70% 100%, 0px 100%)",
        }}
      >
        <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z" />
      </svg>
      {/* Settings cog overlay in bottom-right */}
      <svg
        width="9" height="9" viewBox="0 0 24 24" fill="#4f5b60"
        style={{ position: "absolute", bottom: 0, right: 0 }}
      >
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94zM12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
      </svg>
    </div>
  );
}

function BulkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

export default function V1Page() {
  const [dirtyRestrictions, setDirtyRestrictions] = useState<
    Map<string, DayRestriction>
  >(new Map());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Table display settings — lifted so both table and modals share them
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [visibleHotels, setVisibleHotels] = useState<string[]>(HOTEL_NAMES.slice(0, 10));
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["committedOcc", "demandOcc", "competitorAvg"]);

  function handleSettingsApply(
    nextShowRestrictions: boolean,
    nextVisibleHotels: string[],
    nextVisibleColumns: string[]
  ) {
    setShowRestrictions(nextShowRestrictions);
    setVisibleHotels(nextVisibleHotels);
    setVisibleColumns(nextVisibleColumns);
    setSettingsModalOpen(false);
  }

  function handleConfirmRestriction(
    hotels: string[],
    type: RestrictionType | "Clear",
    value: number | null,
    dayIndices: number[]
  ) {
    const updates = new Map(dirtyRestrictions);
    for (const hotelId of hotels) {
      for (const dayIdx of dayIndices) {
        const key = `${hotelId}:${dayIdx}`;
        if (type === "Clear") {
          const seed = SEED_MAP.get(hotelId)?.[dayIdx] ?? { type: "None" };
          if (seed.type !== "None") {
            // Published restriction exists — mark as pending clear (strikethrough)
            updates.set(key, { type: "None", isDirty: true });
          } else {
            // No published restriction — discard any unpublished addition silently
            updates.delete(key);
          }
        } else {
          updates.set(key, { type, value: value ?? undefined, isDirty: true });
        }
      }
    }
    setDirtyRestrictions(updates);
    setBulkModalOpen(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        activeNav="Pricing & Strategy"
        propertyName="Europe"
        breadcrumb={["Home", "Pricing & Strategy", "Rates"]}
        propertyPicker={{
          allProperties: { label: "All Properties", path: "/single" },
          groups: [{
            label: "Europe",
            path: "/v1",
            hotels: visibleHotels.map((h) => ({ label: h, path: `/single?hotel=${encodeURIComponent(h)}` })),
          }],
        }}
      />

      <main className="flex-1 flex flex-col">
        {/* Page header bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: "#dde1e2" }}
        >
          <h1 className="text-[18px] font-bold" style={{ color: "#0e2124" }}>
            Manage Rates
          </h1>

          <div className="flex items-center gap-3">
            {/* Review & Publish */}
            <button
              className="flex items-center gap-1.5 px-4 h-8 rounded text-[13px] font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#006461", color: "#ffffff" }}
            >
              Review &amp; Publish
            </button>

            {/* Table settings */}
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <TableSettingsIcon />
              Table settings
            </button>

            {/* Bulk restriction */}
            <button
              onClick={() => setBulkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <BulkIcon />
              Bulk restrictions
            </button>

            {/* Date range */}
            <button
              className="flex items-center gap-2 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              5/7/2026 – 5/13/2026
              <CalendarIcon />
            </button>
          </div>
        </div>

        {/* Dirty state banner — count + discard only; Publish is in the top bar */}
        {dirtyRestrictions.size > 0 && (
          <div
            className="flex items-center justify-between px-6 py-2 text-[13px]"
            style={{ backgroundColor: "#e6f4f3", borderBottom: "1px solid #006461" }}
          >
            <span style={{ color: "#065f46" }}>
              {dirtyRestrictions.size} unpublished restriction change{dirtyRestrictions.size !== 1 ? "s" : ""}
            </span>
            <button
              className="text-[13px] underline"
              style={{ color: "#065f46" }}
              onClick={() => setDirtyRestrictions(new Map())}
            >
              Discard all
            </button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 p-0">
          <RatesTableWithRestrictions
            dirtyRestrictions={dirtyRestrictions}
            showRestrictions={showRestrictions}
            visibleHotels={visibleHotels}
            visibleColumns={visibleColumns}
          />
        </div>
      </main>

      {/* Modals */}
      <ApplyRestrictionModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onConfirm={handleConfirmRestriction}
        availableHotels={visibleHotels}
      />
      <TableSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onApply={handleSettingsApply}
        initialShowRestrictions={showRestrictions}
        initialVisibleHotels={visibleHotels}
        initialVisibleColumns={visibleColumns}
      />
    </div>
  );
}

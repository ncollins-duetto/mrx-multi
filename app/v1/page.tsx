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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z" />
    </svg>
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

  function handleSettingsApply(
    nextShowRestrictions: boolean,
    nextVisibleHotels: string[]
  ) {
    setShowRestrictions(nextShowRestrictions);
    setVisibleHotels(nextVisibleHotels);
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
          // Determine current effective restriction (dirty override → seed → None)
          const effective = updates.get(key) ?? SEED_MAP.get(hotelId)?.[dayIdx] ?? { type: "None" };
          if (effective.type !== "None") {
            // Something real exists — mark as pending clear
            updates.set(key, { type: "None", isDirty: true });
          } else {
            // Already empty — remove any dirty entry so it stays clean
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
            Europe
          </h1>

          <div className="flex items-center gap-3">
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

            {/* Review */}
            <button
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <EyeIcon />
              Review
            </button>

            {/* Date range */}
            <button
              className="flex items-center gap-2 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              5/7/2026 – 5/13/2026
              <CalendarIcon />
            </button>

            {/* Publish — always visible */}
            <button
              className="flex items-center gap-1.5 px-4 h-8 rounded text-[13px] font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#006461", color: "#ffffff" }}
            >
              Publish
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
      />
    </div>
  );
}

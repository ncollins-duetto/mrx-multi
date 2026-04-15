"use client";

import { useState } from "react";
import V3Header from "@/components/V3Header";
import RatesTableWithRestrictions from "@/components/RatesTableWithRestrictions";
import ApplyRestrictionModal from "@/components/restrictions/ApplyRestrictionModal";
import TableSettingsModal from "@/components/restrictions/TableSettingsModal";
import { DayRestriction, HOTEL_NAMES, HOTEL_RESTRICTIONS, RestrictionType } from "@/lib/restrictionData";

const SEED_MAP = new Map(HOTEL_RESTRICTIONS.map((h) => [h.hotelId, h.restrictions]));

// Static group/hotel selector data
const GROUPS = ["Europe", "Americas", "Asia Pacific"];

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
function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

// ── Group + Hotel Selector ───────────────────────────────────────────────────

type HotelSelectorProps = {
  visibleHotels: string[];
  onChange: (hotels: string[]) => void;
};

function HotelSelector({ visibleHotels, onChange }: HotelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const MAX = 10;

  const filtered = HOTEL_NAMES.filter((h) =>
    h.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(hotel: string) {
    if (visibleHotels.includes(hotel)) {
      onChange(visibleHotels.filter((h) => h !== hotel));
    } else if (visibleHotels.length < MAX) {
      onChange([...visibleHotels, hotel]);
    }
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1.5 h-7 px-3 border rounded text-[13px] hover:bg-gray-50 transition-colors"
        style={{ borderColor: "#dde1e2", color: "#1a2533" }}
        onClick={() => setOpen((v) => !v)}
      >
        {visibleHotels.length} hotel{visibleHotels.length !== 1 ? "s" : ""} selected
        <ChevronDown />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-8 z-50 w-64 shadow-xl border rounded overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderColor: "#dde1e2" }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: "#dde1e2" }}>
              <input
                className="w-full border rounded px-2 py-1 text-[13px]"
                style={{ borderColor: "#dde1e2", color: "#1a2533" }}
                placeholder="Search hotels…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "#dde1e2", backgroundColor: "#f5f7f8" }}>
              <span
                className="text-[11px] font-semibold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: visibleHotels.length >= MAX ? "#006461" : "#e6f4f3",
                  color: visibleHotels.length >= MAX ? "#ffffff" : "#006461",
                }}
              >
                {visibleHotels.length}/{MAX}
              </span>
              {visibleHotels.length > 0 && (
                <button
                  className="text-[12px] underline"
                  style={{ color: "#006461" }}
                  onClick={() => onChange([])}
                >
                  Deselect all
                </button>
              )}
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filtered.map((hotel) => {
                const checked = visibleHotels.includes(hotel);
                const disabled = !checked && visibleHotels.length >= MAX;
                return (
                  <label
                    key={hotel}
                    className="flex items-center gap-2 px-3 py-2 border-b text-[13px] cursor-pointer hover:bg-gray-50"
                    style={{
                      borderColor: "#f0f2f3",
                      color: "#1a2533",
                      opacity: disabled ? 0.4 : 1,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(hotel)}
                      style={{ accentColor: "#006461" }}
                    />
                    {hotel}
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type GroupSelectorProps = {
  selected: string;
};

function GroupSelector({ selected }: GroupSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1.5 h-7 px-3 border rounded text-[13px] hover:bg-gray-50 transition-colors"
        style={{ borderColor: "#dde1e2", color: "#1a2533" }}
        onClick={() => setOpen((v) => !v)}
      >
        {selected}
        <ChevronDown />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-8 z-50 w-44 shadow-xl border rounded overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderColor: "#dde1e2" }}
          >
            {GROUPS.map((g) => (
              <button
                key={g}
                disabled={g !== selected}
                className="w-full text-left px-3 py-2 text-[13px] border-b hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: "#f0f2f3",
                  color: g === selected ? "#006461" : "#9aa5ab",
                  fontWeight: g === selected ? 600 : 400,
                  cursor: g === selected ? "pointer" : "not-allowed",
                }}
                onClick={() => setOpen(false)}
              >
                {g}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function V3MultiPage() {
  const [dirtyRestrictions, setDirtyRestrictions] = useState<Map<string, DayRestriction>>(new Map());
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(true);
  const [visibleHotels, setVisibleHotels] = useState<string[]>(HOTEL_NAMES.slice(0, 10));

  function handleSettingsApply(nextShowRestrictions: boolean, nextVisibleHotels: string[]) {
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
          const effective = updates.get(key) ?? SEED_MAP.get(hotelId)?.[dayIdx] ?? { type: "None" };
          if (effective.type !== "None") {
            updates.set(key, { type: "None", isDirty: true });
          } else {
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
      <V3Header
        mode="multi"
        breadcrumb={["Home", "Pricing & Strategy", "Rates & Restrictions"]}
        activeMenuItem="Manage Rates and Restrictions"
      />

      <main className="flex-1 flex flex-col">
        {/* Page header bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: "#dde1e2" }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-[18px] font-bold" style={{ color: "#0e2124" }}>
              Rates &amp; Restrictions
            </h1>
            {/* Group + hotel selectors */}
            <div className="flex items-center gap-2">
              <GroupSelector selected="Europe" />
              <HotelSelector
                visibleHotels={visibleHotels}
                onChange={setVisibleHotels}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <TableSettingsIcon />
              Table settings
            </button>
            <button
              onClick={() => setBulkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <BulkIcon />
              Bulk restrictions
            </button>
            <button
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <EyeIcon />
              Review
            </button>
            <button
              className="flex items-center gap-2 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              5/7/2026 – 5/13/2026
              <CalendarIcon />
            </button>
            <button
              className="flex items-center gap-1.5 px-4 h-8 rounded text-[13px] font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#006461", color: "#ffffff" }}
            >
              Publish
            </button>
          </div>
        </div>

        {/* Dirty state banner */}
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

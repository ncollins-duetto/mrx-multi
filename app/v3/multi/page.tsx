"use client";

import { useState } from "react";
import V3Header from "@/components/V3Header";
import RatesTableWithRestrictions from "@/components/RatesTableWithRestrictions";
import ApplyRestrictionModal from "@/components/restrictions/ApplyRestrictionModal";
import { DayRestriction, HOTEL_NAMES, HOTEL_RESTRICTIONS, RestrictionType } from "@/lib/restrictionData";

const SEED_MAP = new Map(HOTEL_RESTRICTIONS.map((h) => [h.hotelId, h.restrictions]));

const GROUPS = ["Europe", "Americas", "Asia Pacific"];

// ── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
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

// Table+cog icon for the drawer header
function DrawerTableSettingsIcon() {
  return (
    <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60"
        style={{
          position: "absolute", top: 0, left: 0,
          clipPath: "polygon(0px 0px, 100% 0px, 100% 50%, 70% 50%, 70% 100%, 0px 100%)",
        }}
      >
        <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z" />
      </svg>
      <svg
        width="9" height="9" viewBox="0 0 24 24" fill="#4f5b60"
        style={{ position: "absolute", bottom: 0, right: 0 }}
      >
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94zM12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
      </svg>
    </div>
  );
}

// ── Column drawer ─────────────────────────────────────────────────────────────

const DRAWER_COLS = [
  { key: "committedOcc",  label: "Committed Occupancy" },
  { key: "demandOcc",     label: "Demand Occupancy" },
  { key: "competitorAvg", label: "Competitor Average" },
];

function ColumnDrawer({
  open,
  onToggle,
  visibleColumns,
  onChange,
}: {
  open: boolean;
  onToggle: () => void;
  visibleColumns: string[];
  onChange: (cols: string[]) => void;
}) {
  function toggleCol(key: string) {
    onChange(
      visibleColumns.includes(key)
        ? visibleColumns.filter((k) => k !== key)
        : [...visibleColumns, key]
    );
  }

  return (
    <div
      className="flex-shrink-0 flex flex-col border-l overflow-hidden"
      style={{
        width: open ? "240px" : "40px",
        transition: "width 200ms ease",
        borderColor: "#dde1e2",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Toggle strip / header */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 flex-shrink-0 hover:bg-gray-50 transition-colors border-b"
        style={{ height: "40px", padding: "0 12px", minWidth: 0, width: "100%", borderColor: "#dde1e2" }}
        title={open ? "Close column settings" : "Column settings"}
      >
        <DrawerTableSettingsIcon />
        <span
          className="text-[13px] font-medium whitespace-nowrap overflow-hidden flex-1 text-left"
          style={{ opacity: open ? 1 : 0, transition: "opacity 100ms ease", color: "#1a2533" }}
        >
          Columns
        </span>
        {/* Chevron rotates to indicate open/close */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60"
          style={{
            flexShrink: 0,
            opacity: open ? 1 : 0,
            transition: "opacity 100ms ease, transform 200ms ease",
            transform: open ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
        </svg>
      </button>

      {/* Content — white panel */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity 150ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Section label */}
        <div
          className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "#9aa5ab" }}
        >
          Expanded columns
        </div>

        {/* Checkboxes */}
        <div className="px-3 pb-4">
          {DRAWER_COLS.map((col) => {
            const checked = visibleColumns.includes(col.key);
            return (
              <label
                key={col.key}
                className="flex items-center gap-2.5 px-1 py-2 cursor-pointer rounded hover:bg-gray-50"
                style={{ marginLeft: "-4px", marginRight: "-4px" }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCol(col.key)}
                  style={{ accentColor: "#006461" }}
                />
                <span className="text-[13px] whitespace-nowrap" style={{ color: "#1a2533" }}>
                  {col.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* Subtle footer note */}
        <div className="px-4 pb-4 text-[11px]" style={{ color: "#9aa5ab" }}>
          Visible when a date column is expanded.
        </div>
      </div>
    </div>
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
  const [visibleHotels, setVisibleHotels] = useState<string[]>(HOTEL_NAMES.slice(0, 10));
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["committedOcc", "demandOcc", "competitorAvg"]);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      <V3Header
        mode="multi"
        breadcrumb={["Home", "Pricing & Strategy", "Rates & Restrictions"]}
        activeMenuItem="Manage Rates and Restrictions"
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page header bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "#dde1e2" }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-[18px] font-bold" style={{ color: "#0e2124" }}>
              Rates &amp; Restrictions
            </h1>
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
              className="flex items-center gap-1.5 px-4 h-8 rounded text-[13px] font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#006461", color: "#ffffff" }}
            >
              Review &amp; Publish
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
              className="flex items-center gap-2 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              5/7/2026 – 5/13/2026
              <CalendarIcon />
            </button>
          </div>
        </div>

        {/* Dirty state banner */}
        {dirtyRestrictions.size > 0 && (
          <div
            className="flex items-center justify-between px-6 py-2 text-[13px] flex-shrink-0"
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

        {/* Table + drawer */}
        <div className="flex-1 flex flex-row overflow-hidden">
          <div className="flex-1 overflow-auto">
            <RatesTableWithRestrictions
              dirtyRestrictions={dirtyRestrictions}
              showRestrictions={true}
              visibleHotels={visibleHotels}
              visibleColumns={visibleColumns}
            />
          </div>
          <ColumnDrawer
            open={drawerOpen}
            onToggle={() => setDrawerOpen((v) => !v)}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />
        </div>
      </main>

      <ApplyRestrictionModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onConfirm={handleConfirmRestriction}
        availableHotels={visibleHotels}
      />
    </div>
  );
}

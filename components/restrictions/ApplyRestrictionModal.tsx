"use client";

import { useState } from "react";
import { DAYS, RestrictionType } from "@/lib/restrictionData";

type Props = {
  open: boolean;
  onClose: () => void;
  availableHotels: string[];
  onConfirm: (
    hotels: string[],
    type: RestrictionType | "Clear",
    value: number | null,
    dayIndices: number[]
  ) => void;
};

const RESTRICTION_TYPES: { type: RestrictionType; label: string; hasValue: boolean }[] = [
  { type: "CTA",   label: "Closed to Arrival",   hasValue: false },
  { type: "CTD",   label: "Closed to Departure",  hasValue: false },
  { type: "CTS",   label: "Closed to Stay",       hasValue: false },
  { type: "MinSA", label: "Min Stay Arrival",     hasValue: true  },
  { type: "MinST", label: "Min Stay Thru",        hasValue: true  },
  { type: "MaxSA", label: "Max Stay Arrival",     hasValue: true  },
  { type: "MaxST", label: "Max Stay Thru",        hasValue: true  },
];


export default function ApplyRestrictionModal({
  open,
  onClose,
  onConfirm,
  availableHotels,
}: Props) {
  const [selectedHotels, setSelectedHotels] = useState<Set<string>>(
    new Set(availableHotels)
  );
  const [selectedDays, setSelectedDays] = useState<Set<number>>(
    new Set([0, 1, 2, 3, 4, 5, 6])
  );
  const [selectedType, setSelectedType] = useState<RestrictionType | "Clear" | null>(null);
  const [value, setValue] = useState<string>("2");
  const [warningOpen, setWarningOpen] = useState(false);

  if (!open) return null;

  const currentType = RESTRICTION_TYPES.find((r) => r.type === selectedType) ?? null;
  const isClearMode = selectedType === "Clear";

  function toggleHotel(name: string) {
    setSelectedHotels((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function toggleDay(idx: number) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  function handleConfirm() {
    if (!selectedType || selectedHotels.size === 0 || selectedDays.size === 0) return;
    onConfirm(
      Array.from(selectedHotels),
      selectedType,
      currentType?.hasValue ? (parseInt(value, 10) || 1) : null,
      Array.from(selectedDays)
    );
  }

  const canApply = selectedType !== null && selectedHotels.size > 0 && selectedDays.size > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full flex flex-col"
        style={{ maxWidth: "660px", maxHeight: "90vh", margin: "0 16px" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#dde1e2" }}
        >
          <h2 className="text-[18px] font-semibold" style={{ color: "#1a2533" }}>
            Add Restrictions
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100"
            style={{ color: "#9aa5ab" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Warning banner */}
        <div className="px-6 pt-4">
          <button
            className="w-full flex items-center justify-between px-4 py-3 rounded border text-left"
            style={{ borderColor: "#c97c1a", backgroundColor: "#fffbf2" }}
            onClick={() => setWarningOpen((v) => !v)}
          >
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#c97c1a">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              <span className="text-[13px] font-medium" style={{ color: "#7a4a08" }}>
                Important to consider before clicking "Apply":
              </span>
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#c97c1a"
              style={{ transform: warningOpen ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }}
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>
          {warningOpen && (
            <div
              className="border border-t-0 rounded-b px-4 py-3 text-[13px]"
              style={{ borderColor: "#c97c1a", color: "#7a4a08", backgroundColor: "#fffbf2" }}
            >
              Applying restrictions will overwrite any existing restrictions for the selected
              properties and dates. This action cannot be undone automatically — review the
              pending changes in the table before publishing.
            </div>
          )}
        </div>

        {/* Body — two columns */}
        <div
          className="flex flex-1 overflow-hidden mt-4"
          style={{ borderTop: "1px solid #dde1e2" }}
        >
          {/* Left: Properties + Days */}
          <div
            className="flex flex-col overflow-y-auto px-6 py-4 gap-5"
            style={{ flex: "0 0 300px", borderRight: "1px solid #dde1e2" }}
          >
            {/* Properties */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#4f5b60" }}>
                  Properties
                </div>
                <span className="text-[12px]" style={{ color: "#4f5b60" }}>
                  {selectedHotels.size} of {availableHotels.length} selected
                </span>
              </div>

              {/* Scrollable checklist */}
              <div
                className="border rounded overflow-y-auto"
                style={{ borderColor: "#dde1e2", maxHeight: "180px" }}
              >
                {availableHotels.map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 px-3 py-1.5 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: "#dde1e2" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedHotels.has(name)}
                      onChange={() => toggleHotel(name)}
                      style={{ accentColor: "#006461" }}
                    />
                    <span className="text-[13px]" style={{ color: "#1a2533" }}>
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date range — the 7 days currently in view */}
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#4f5b60" }}>
                Dates
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day, idx) => {
                  const [dow, date] = day.split(", "); // "Thu", "05/07"
                  const checked = selectedDays.has(idx);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(idx)}
                      className="flex flex-col items-center rounded border transition-colors"
                      style={{
                        width: "46px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        backgroundColor: checked ? "#006461" : "#ffffff",
                        color: checked ? "#ffffff" : "#4f5b60",
                        borderColor: checked ? "#006461" : "#dde1e2",
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 600 }}>{dow}</span>
                      <span style={{ fontSize: "10px", opacity: checked ? 0.85 : 0.7, marginTop: "1px" }}>{date}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Restriction types */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#4f5b60" }}>
              Restrictions
            </div>
            <div className="space-y-0">
              {RESTRICTION_TYPES.map((r) => {
                const isSelected = selectedType === r.type;
                const isDisabled = isClearMode;
                return (
                  <label
                    key={r.type}
                    className="flex items-center gap-3 py-2.5 border-b"
                    style={{
                      borderColor: "#f0f2f3",
                      opacity: isDisabled ? 0.35 : 1,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => setSelectedType(isSelected ? null : r.type)}
                      style={{ accentColor: "#006461" }}
                    />
                    <span className="text-[13px] flex-1" style={{ color: "#1a2533" }}>
                      {r.label}
                    </span>
                    {r.hasValue && (
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={isSelected ? value : ""}
                        disabled={isDisabled}
                        onChange={(e) => { setSelectedType(r.type); setValue(e.target.value); }}
                        onClick={(e) => { e.preventDefault(); if (!isDisabled) setSelectedType(r.type); }}
                        placeholder="—"
                        className="border rounded px-2 py-1 text-[13px] text-center"
                        style={{
                          width: "52px",
                          borderColor: isSelected ? "#006461" : "#dde1e2",
                          color: "#1a2533",
                        }}
                      />
                    )}
                  </label>
                );
              })}

              {/* Separator */}
              <div className="my-1" style={{ borderTop: "1px solid #dde1e2" }} />

              {/* Clear all restrictions — mutually exclusive with above */}
              <label
                className="flex items-center gap-3 py-2.5 rounded"
                style={{
                  cursor: (selectedType !== null && !isClearMode) ? "not-allowed" : "pointer",
                  opacity: (selectedType !== null && !isClearMode) ? 0.35 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={isClearMode}
                  disabled={selectedType !== null && !isClearMode}
                  onChange={() => setSelectedType(isClearMode ? null : "Clear")}
                  style={{ accentColor: "#b91c1c" }}
                />
                <span className="flex items-center gap-1.5 text-[13px] flex-1 font-medium" style={{ color: "#b91c1c" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  Remove all restrictions
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-3 border-t"
          style={{ borderColor: "#dde1e2" }}
        >
          <button
            onClick={onClose}
            className="px-4 h-8 text-[13px] font-medium transition-colors hover:underline"
            style={{ color: "#4f5b60" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canApply}
            className="px-5 h-8 rounded text-[13px] font-semibold transition-colors disabled:opacity-40"
            style={{ backgroundColor: "#006461", color: "#ffffff" }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

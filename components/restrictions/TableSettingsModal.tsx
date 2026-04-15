"use client";

import { useState } from "react";
import { HOTEL_NAMES } from "@/lib/restrictionData";

const MAX_HOTELS = 10;

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (showRestrictions: boolean, visibleHotels: string[]) => void;
  initialShowRestrictions: boolean;
  initialVisibleHotels: string[];
};

export default function TableSettingsModal({
  open,
  onClose,
  onApply,
  initialShowRestrictions,
  initialVisibleHotels,
}: Props) {
  const [pickupDays, setPickupDays] = useState({ first: 3, second: 7, third: 14 });
  const [showMultiCurrency, setShowMultiCurrency] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(initialShowRestrictions);
  const [visibleHotels, setVisibleHotels] = useState<Set<string>>(
    new Set(initialVisibleHotels)
  );
  const [hotelSearch, setHotelSearch] = useState("");

  if (!open) return null;

  const filteredHotels = HOTEL_NAMES.filter((h) =>
    h.toLowerCase().includes(hotelSearch.toLowerCase())
  );
  const atMax = visibleHotels.size >= MAX_HOTELS;

  function toggleHotel(name: string) {
    setVisibleHotels((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < MAX_HOTELS) {
        next.add(name);
      }
      return next;
    });
  }

  function handleSave() {
    onApply(showRestrictions, Array.from(visibleHotels));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col"
        style={{ width: "510px", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "#dde1e2" }}
        >
          <h2 className="text-[15px] font-semibold" style={{ color: "#1a2533" }}>
            Table settings
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Pickup days */}
          <div className="px-6 py-4">
            <div className="text-[13px] font-semibold mb-3" style={{ color: "#1a2533" }}>
              Customize pickup days
            </div>
            <div className="flex items-center gap-3">
              {(["first", "second", "third"] as const).map((key) => (
                <input
                  key={key}
                  type="number"
                  min={0}
                  value={pickupDays[key]}
                  onChange={(e) =>
                    setPickupDays((p) => ({ ...p, [key]: parseInt(e.target.value) || 0 }))
                  }
                  className="border rounded text-center text-[13px]"
                  style={{ width: "60px", height: "36px", borderColor: "#dde1e2", color: "#1a2533" }}
                />
              ))}
              <span className="text-[13px]" style={{ color: "#4f5b60" }}>days</span>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: "#dde1e2" }} />

          {/* Toggles */}
          <div className="px-6 py-4 space-y-3">
            <Toggle
              label="Show multi-currency"
              checked={showMultiCurrency}
              onChange={setShowMultiCurrency}
            />
            <Toggle
              label="Show restrictions column"
              checked={showRestrictions}
              onChange={setShowRestrictions}
            />
          </div>

          <div className="border-t" style={{ borderColor: "#dde1e2" }} />

          {/* Hotels */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-semibold" style={{ color: "#1a2533" }}>
                Properties displayed
              </div>
              <div className="flex items-center gap-2">
                {visibleHotels.size > 0 && (
                  <button
                    onClick={() => setVisibleHotels(new Set())}
                    className="text-[12px] underline"
                    style={{ color: "#4f5b60" }}
                  >
                    Deselect all
                  </button>
                )}
                <span
                  className="text-[12px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: atMax ? "#006461" : "#e9eced",
                    color: atMax ? "#ffffff" : "#4f5b60",
                  }}
                >
                  {visibleHotels.size} / {MAX_HOTELS}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-2">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="#9aa5ab"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Search properties…"
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
                className="w-full border rounded pl-8 pr-3 py-1.5 text-[13px]"
                style={{ borderColor: "#dde1e2", color: "#1a2533" }}
              />
            </div>

            {/* Scrollable list */}
            <div
              className="border rounded overflow-y-auto"
              style={{ borderColor: "#dde1e2", maxHeight: "200px" }}
            >
              {filteredHotels.length === 0 ? (
                <div className="px-3 py-3 text-[13px]" style={{ color: "#9aa5ab" }}>
                  No properties match
                </div>
              ) : (
                filteredHotels.map((name) => {
                  const checked = visibleHotels.has(name);
                  const disabled = !checked && atMax;
                  return (
                    <label
                      key={name}
                      className="flex items-center gap-2.5 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                      style={{
                        borderColor: "#dde1e2",
                        opacity: disabled ? 0.4 : 1,
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleHotel(name)}
                        style={{ accentColor: "#006461" }}
                      />
                      <span className="text-[13px]" style={{ color: "#1a2533" }}>
                        {name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {atMax && (
              <p className="mt-1.5 text-[11px]" style={{ color: "#9aa5ab" }}>
                Maximum of {MAX_HOTELS} properties reached. Uncheck one to add another.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-3 border-t"
          style={{ borderColor: "#dde1e2" }}
        >
          <button
            onClick={onClose}
            className="px-4 h-8 border rounded text-[13px] hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={visibleHotels.size === 0}
            className="px-4 h-8 rounded text-[13px] font-semibold disabled:opacity-40"
            style={{ backgroundColor: "#006461", color: "#ffffff" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between" style={{ height: "36px" }}>
      <span className="text-[13px]" style={{ color: "#1a2533" }}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex items-center rounded-full transition-colors"
        style={{
          width: "36px",
          height: "20px",
          backgroundColor: checked ? "#006461" : "#dde1e2",
        }}
      >
        <span
          className="inline-block rounded-full bg-white transition-transform"
          style={{
            width: "16px",
            height: "16px",
            transform: checked ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </button>
    </div>
  );
}

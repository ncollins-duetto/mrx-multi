"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader, { PropertyPickerConfig } from "@/components/AppHeader";
import { HOTEL_NAMES } from "@/lib/restrictionData";

// Static date rows matching the screenshot
const ROWS = [
  { day: "Tue", date: "4/14", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,974.35", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Wed", date: "4/15", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Thu", date: "4/16", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Fri", date: "4/17", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Sat", date: "4/18", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Sun", date: "4/19", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "$2,700.00", promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Mon", date: "4/20", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Tue", date: "4/21", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Wed", date: "4/22", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Thu", date: "4/23", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
  { day: "Fri", date: "4/24", barCurrent: "$3,000.00", barRec: "$1,000.00", recDir: "down", promoCurrent: "",          promoRec: "$800.00",   casino: "$2,973.00", casinoRec: "$3,000.00", casinoDir: "up" },
];

// Day-of-week pill colours from the screenshot
const DAY_PILL_COLORS: Record<string, { bg: string; color: string }> = {
  Mon: { bg: "#4a90d9", color: "#ffffff" },
  Tue: { bg: "#3b7ec4", color: "#ffffff" },
  Wed: { bg: "#2d6faf", color: "#ffffff" },
  Thu: { bg: "#5b9fd4", color: "#ffffff" },
  Fri: { bg: "#4a90d9", color: "#ffffff" },
  Sat: { bg: "#6baed6", color: "#ffffff" },
  Sun: { bg: "#2171b5", color: "#ffffff" },
};

function ArrowUp() {
  return (
    <span style={{ color: "#006461", fontSize: "12px", marginLeft: "2px" }}>▲</span>
  );
}
function ArrowDown() {
  return (
    <span style={{ color: "#d32f2f", fontSize: "12px", marginLeft: "2px" }}>▼</span>
  );
}

function OptimizeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
    </svg>
  );
}
function TableSettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}
function ChevronRightSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

const BORDER = "#dde1e2";
const SECTION_BORDER = "#8899ae";
const TEXT = "#1a2533";
const SUBTEXT = "#4f5b60";

function SinglePropertyContent() {
  const searchParams = useSearchParams();
  const hotelName = searchParams.get("hotel") ?? "Hotel de Crillon";

  const propertyPicker: PropertyPickerConfig = {
    allProperties: { label: "All Properties", path: "/single" },
    groups: [{
      label: "Europe",
      path: "/v1",
      hotels: HOTEL_NAMES.slice(0, 10).map((h) => ({ label: h, path: `/single?hotel=${encodeURIComponent(h)}` })),
    }],
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <AppHeader
        activeNav="Pricing & Strategy"
        propertyName={hotelName}
        breadcrumb={["Home", "Pricing & Strategy", "Rates"]}
        propertyPicker={propertyPicker}
      />

      <main className="flex-1 flex flex-col">
        {/* Page header */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: BORDER }}
        >
          <h1 className="text-[18px] font-bold" style={{ color: "#0e2124" }}>
            Manage Rates
          </h1>
          <div className="flex items-center gap-2">
            {/* Publish — greyed */}
            <button
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px]"
              style={{ borderColor: BORDER, color: "#9aa5ab", cursor: "not-allowed" }}
              disabled
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#9aa5ab">
                <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
              </svg>
              Publish
            </button>
            <button className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] hover:bg-gray-50" style={{ borderColor: BORDER, color: SUBTEXT }}>
              <OptimizeIcon /> Optimize
            </button>
            <button className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] hover:bg-gray-50" style={{ borderColor: BORDER, color: SUBTEXT }}>
              <TableSettingsIcon /> Table settings
            </button>
            <button className="flex items-center justify-center w-8 h-8 border rounded hover:bg-gray-50" style={{ borderColor: BORDER }}>
              <DownloadIcon />
            </button>
            <button className="flex items-center gap-2 px-3 h-8 border rounded text-[13px] hover:bg-gray-50" style={{ borderColor: BORDER, color: SUBTEXT }}>
              4/14/2026 – 7/12/2026
              <CalendarIcon />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 px-6 py-2 border-b" style={{ borderColor: BORDER }}>
          <button
            className="px-3 h-7 border rounded text-[13px] hover:bg-gray-50"
            style={{ borderColor: BORDER, color: TEXT }}
          >
            Add Filters
          </button>
          <span className="text-[13px]" style={{ color: SUBTEXT }}>No filters applied</span>
        </div>

        {/* Tab bar */}
        <div
          className="flex items-center justify-between px-6 border-b"
          style={{ borderColor: BORDER }}
        >
          <div className="flex">
            {["Segments", "Room Types", "Summary"].map((tab) => (
              <button
                key={tab}
                className="px-4 py-2.5 text-[13px] border-b-2 transition-colors"
                style={{
                  borderBottomColor: tab === "Segments" ? "#006461" : "transparent",
                  color: tab === "Segments" ? "#006461" : SUBTEXT,
                  fontWeight: tab === "Segments" ? 600 : 400,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Toggle */}
              <div
                className="relative inline-flex items-center rounded-full"
                style={{ width: "36px", height: "20px", backgroundColor: "#dde1e2" }}
              >
                <span className="inline-block rounded-full bg-white" style={{ width: "16px", height: "16px", transform: "translateX(2px)" }} />
              </div>
              <span className="text-[13px]" style={{ color: SUBTEXT }}>Use current for room type calculations</span>
            </div>
            <button className="flex items-center gap-1 text-[13px] hover:underline" style={{ color: SUBTEXT }}>
              <ChevronLeft /> Previous 7 days
            </button>
            <button className="flex items-center gap-1 text-[13px] hover:underline" style={{ color: SUBTEXT }}>
              Next 7 days <ChevronRight />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="border-collapse text-[13px]" style={{ minWidth: "900px" }}>
            <thead>
              {/* Row 1: section headers */}
              <tr>
                <th
                  className="text-left px-4 py-2 border-b font-medium text-[12px]"
                  style={{ width: "140px", color: SUBTEXT, borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}` }}
                  rowSpan={2}
                >
                  Stay Date
                </th>
                {/* BAR */}
                <th
                  colSpan={3}
                  className="text-center px-3 py-2 border-b font-semibold text-[12px]"
                  style={{ backgroundColor: "#dce8f5", color: "#1e3a5f", borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}` }}
                >
                  BAR
                </th>
                {/* PROMO */}
                <th
                  colSpan={4}
                  className="text-center px-3 py-2 border-b font-semibold text-[12px]"
                  style={{ backgroundColor: "#dce8f5", color: "#1e3a5f", borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}` }}
                >
                  <span className="flex items-center justify-center gap-1">
                    PROMO <ChevronRightSmall />
                  </span>
                </th>
                {/* Casino8 */}
                <th
                  colSpan={2}
                  className="text-center px-3 py-2 border-b font-semibold text-[12px]"
                  style={{ backgroundColor: "#dce8f5", color: "#1e3a5f", borderColor: BORDER, borderRight: `1px solid ${BORDER}` }}
                >
                  Casino8 ($0-$34)
                </th>
              </tr>
              {/* Row 2: sub-headers */}
              <tr>
                {/* BAR */}
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "110px" }}>Current</th>
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "130px" }}>
                  <span className="flex items-center justify-end gap-1">
                    <input type="checkbox" style={{ accentColor: "#006461" }} readOnly /> Recommended
                  </span>
                </th>
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}`, width: "110px" }}>Override</th>
                {/* PROMO */}
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "110px" }}>Current</th>
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "130px" }}>
                  <span className="flex items-center justify-end gap-1">
                    <input type="checkbox" style={{ accentColor: "#006461" }} readOnly /> Recommended
                  </span>
                </th>
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "110px" }}>Override</th>
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}`, width: "110px" }}>standard room</th>
                {/* Casino8 */}
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "110px" }}>Current</th>
                <th className="text-right px-3 py-1 font-normal text-[12px] border-b" style={{ backgroundColor: "#e8f0f8", color: SUBTEXT, borderColor: BORDER, borderRight: `1px solid ${BORDER}`, width: "130px" }}>
                  <span className="flex items-center justify-end gap-1">
                    <input type="checkbox" style={{ accentColor: "#006461" }} readOnly /> Recommended
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const pill = DAY_PILL_COLORS[row.day] ?? { bg: "#4a90d9", color: "#ffffff" };
                return (
                  <tr key={`${row.day}-${row.date}`} className="hover:bg-gray-50">
                    {/* Date — plain text */}
                    <td className="px-4 py-2 border-b text-[13px]" style={{ borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}`, whiteSpace: "nowrap", color: TEXT }}>
                      {row.day}, {row.date}
                    </td>
                    {/* BAR Current */}
                    <td className="px-3 py-2 border-b text-right" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}`, color: TEXT, whiteSpace: "nowrap" }}>
                      {row.barCurrent}
                    </td>
                    {/* BAR Recommended */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                      <span className="flex items-center justify-end gap-1">
                        <input type="checkbox" style={{ accentColor: "#006461" }} readOnly />
                        <span style={{ color: TEXT }}>{row.barRec}</span>
                        {row.recDir === "down" ? <ArrowDown /> : <ArrowUp />}
                      </span>
                    </td>
                    {/* BAR Override */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}` }}>
                      <input
                        type="text"
                        placeholder=""
                        className="w-full border rounded px-2 py-1 text-[13px] text-right"
                        style={{ borderColor: BORDER, color: TEXT, width: "90px" }}
                        readOnly
                      />
                    </td>
                    {/* PROMO Current */}
                    <td className="px-3 py-2 border-b text-right" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}`, color: TEXT, whiteSpace: "nowrap" }}>
                      {row.promoCurrent}
                    </td>
                    {/* PROMO Recommended */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                      <span className="flex items-center justify-end gap-1">
                        <input type="checkbox" style={{ accentColor: "#006461" }} readOnly />
                        <span style={{ color: TEXT }}>{row.promoRec}</span>
                      </span>
                    </td>
                    {/* PROMO Override */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}` }}>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-[13px] text-right"
                        style={{ borderColor: BORDER, color: TEXT, width: "90px" }}
                        readOnly
                      />
                    </td>
                    {/* PROMO standard room */}
                    <td className="px-3 py-2 border-b text-right" style={{ borderColor: BORDER, borderRight: `3px solid ${SECTION_BORDER}`, color: TEXT, whiteSpace: "nowrap" }} />
                    {/* Casino8 Current */}
                    <td className="px-3 py-2 border-b text-right" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}`, color: TEXT, whiteSpace: "nowrap" }}>
                      {row.casino}
                    </td>
                    {/* Casino8 Recommended */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: BORDER, borderRight: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                      <span className="flex items-center justify-end gap-1">
                        <input type="checkbox" style={{ accentColor: "#006461" }} readOnly />
                        <span style={{ color: TEXT }}>{row.casinoRec}</span>
                        {row.casinoDir === "up" ? <ArrowUp /> : <ArrowDown />}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function SinglePage() {
  return (
    <Suspense>
      <SinglePropertyContent />
    </Suspense>
  );
}

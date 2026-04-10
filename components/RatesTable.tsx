"use client";

import { Fragment, useState } from "react";

// Current: lock (closed/manual) or unlock (open/auto)
// Recommended: "plane" | "equals" | null (no icon)
type CurrentIcon = "lock" | "unlock";
type RecommendedIcon = "plane" | "equals" | null;

// Hotels come in two flavours:
//   "plane"    — all Recommended cells show a plane icon
//   "standard" — Recommended cells show = or nothing (no plane)
type HotelType = "plane" | "standard";

type DayRate = {
  currentIcon: CurrentIcon;
  currentValue: string;
  recommendedIcon: RecommendedIcon;
  recommendedValue: string;
  committedOccupancy: number;
  demandOccupancy: string;
  competitorAverage: string;
};

type Hotel = {
  name: string;
  hotelType: HotelType;
  rates: DayRate[];
};

const DAYS = [
  "Thu, 05/07",
  "Fri, 05/08",
  "Sat, 05/09",
  "Sun, 05/10",
  "Mon, 05/11",
  "Tue, 05/12",
  "Wed, 05/13",
];

// "plane" hotels — Recommended always shows plane
const HOTELS: Hotel[] = [
  {
    name: "The Grand Aldoria",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "$289.00", recommendedIcon: "plane", recommendedValue: "$310.00", committedOccupancy: 42, demandOccupancy: "68%", competitorAverage: "$295.00" },
      { currentIcon: "lock",   currentValue: "$289.00", recommendedIcon: "plane", recommendedValue: "$325.00", committedOccupancy: 51, demandOccupancy: "74%", competitorAverage: "$310.00" },
      { currentIcon: "unlock", currentValue: "$340.00", recommendedIcon: "plane", recommendedValue: "$340.00", committedOccupancy: 67, demandOccupancy: "82%", competitorAverage: "$330.00" },
      { currentIcon: "unlock", currentValue: "$340.00", recommendedIcon: "plane", recommendedValue: "$355.00", committedOccupancy: 70, demandOccupancy: "85%", competitorAverage: "$335.00" },
      { currentIcon: "unlock", currentValue: "$199.00", recommendedIcon: "plane", recommendedValue: "$199.00", committedOccupancy: 28, demandOccupancy: "41%", competitorAverage: "$210.00" },
      { currentIcon: "unlock", currentValue: "$199.00", recommendedIcon: "plane", recommendedValue: "$215.00", committedOccupancy: 33, demandOccupancy: "47%", competitorAverage: "$215.00" },
      { currentIcon: "lock",   currentValue: "$249.00", recommendedIcon: "plane", recommendedValue: "$249.00", committedOccupancy: 39, demandOccupancy: "55%", competitorAverage: "$245.00" },
    ],
  },
  {
    name: "Maison du Soleil",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€175.00", recommendedIcon: null,     recommendedValue: "€175.00", committedOccupancy: 18, demandOccupancy: "32%", competitorAverage: "€180.00" },
      { currentIcon: "unlock", currentValue: "€175.00", recommendedIcon: "equals", recommendedValue: "€175.00", committedOccupancy: 22, demandOccupancy: "38%", competitorAverage: "€188.00" },
      { currentIcon: "unlock", currentValue: "€220.00", recommendedIcon: "equals", recommendedValue: "€220.00", committedOccupancy: 35, demandOccupancy: "59%", competitorAverage: "€215.00" },
      { currentIcon: "unlock", currentValue: "€220.00", recommendedIcon: null,     recommendedValue: "€235.00", committedOccupancy: 40, demandOccupancy: "63%", competitorAverage: "€218.00" },
      { currentIcon: "unlock", currentValue: "€155.00", recommendedIcon: null,     recommendedValue: "€155.00", committedOccupancy: 12, demandOccupancy: "24%", competitorAverage: "€160.00" },
      { currentIcon: "unlock", currentValue: "€155.00", recommendedIcon: "equals", recommendedValue: "€155.00", committedOccupancy: 14, demandOccupancy: "27%", competitorAverage: "€158.00" },
      { currentIcon: "unlock", currentValue: "€168.00", recommendedIcon: "equals", recommendedValue: "€168.00", committedOccupancy: 19, demandOccupancy: "35%", competitorAverage: "€170.00" },
    ],
  },
  {
    name: "Beacon & Harbor Inn",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "$129.00", recommendedIcon: "plane", recommendedValue: "$145.00", committedOccupancy: 55, demandOccupancy: "71%", competitorAverage: "$138.00" },
      { currentIcon: "lock",   currentValue: "$129.00", recommendedIcon: "plane", recommendedValue: "$155.00", committedOccupancy: 62, demandOccupancy: "79%", competitorAverage: "$148.00" },
      { currentIcon: "lock",   currentValue: "$159.00", recommendedIcon: "plane", recommendedValue: "$159.00", committedOccupancy: 74, demandOccupancy: "88%", competitorAverage: "$155.00" },
      { currentIcon: "unlock", currentValue: "$159.00", recommendedIcon: "plane", recommendedValue: "$175.00", committedOccupancy: 78, demandOccupancy: "91%", competitorAverage: "$162.00" },
      { currentIcon: "unlock", currentValue: "$109.00", recommendedIcon: "plane", recommendedValue: "$109.00", committedOccupancy: 31, demandOccupancy: "44%", competitorAverage: "$115.00" },
      { currentIcon: "unlock", currentValue: "$109.00", recommendedIcon: "plane", recommendedValue: "$109.00", committedOccupancy: 36, demandOccupancy: "49%", competitorAverage: "$112.00" },
      { currentIcon: "unlock", currentValue: "$119.00", recommendedIcon: "plane", recommendedValue: "$128.00", committedOccupancy: 44, demandOccupancy: "60%", competitorAverage: "$122.00" },
    ],
  },
  {
    name: "Villa Rosso Milano",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€310.00", recommendedIcon: "equals", recommendedValue: "€310.00", committedOccupancy: 29, demandOccupancy: "45%", competitorAverage: "€320.00" },
      { currentIcon: "unlock", currentValue: "€310.00", recommendedIcon: null,     recommendedValue: "€335.00", committedOccupancy: 38, demandOccupancy: "57%", competitorAverage: "€330.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "equals", recommendedValue: "€380.00", committedOccupancy: 52, demandOccupancy: "70%", competitorAverage: "€370.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "equals", recommendedValue: "€380.00", committedOccupancy: 58, demandOccupancy: "75%", competitorAverage: "€375.00" },
      { currentIcon: "lock",   currentValue: "€265.00", recommendedIcon: null,     recommendedValue: "€280.00", committedOccupancy: 21, demandOccupancy: "36%", competitorAverage: "€275.00" },
      { currentIcon: "lock",   currentValue: "€265.00", recommendedIcon: "equals", recommendedValue: "€265.00", committedOccupancy: 25, demandOccupancy: "40%", competitorAverage: "€270.00" },
      { currentIcon: "unlock", currentValue: "€290.00", recommendedIcon: null,     recommendedValue: "€305.00", committedOccupancy: 32, demandOccupancy: "50%", competitorAverage: "€298.00" },
    ],
  },
  {
    name: "The Clocktower Suites",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "$215.00", recommendedIcon: "plane", recommendedValue: "$215.00", committedOccupancy: 47, demandOccupancy: "62%", competitorAverage: "$220.00" },
      { currentIcon: "lock",   currentValue: "$215.00", recommendedIcon: "plane", recommendedValue: "$235.00", committedOccupancy: 55, demandOccupancy: "71%", competitorAverage: "$228.00" },
      { currentIcon: "lock",   currentValue: "$260.00", recommendedIcon: "plane", recommendedValue: "$260.00", committedOccupancy: 69, demandOccupancy: "83%", competitorAverage: "$255.00" },
      { currentIcon: "lock",   currentValue: "$260.00", recommendedIcon: "plane", recommendedValue: "$280.00", committedOccupancy: 73, demandOccupancy: "87%", competitorAverage: "$268.00" },
      { currentIcon: "unlock", currentValue: "$175.00", recommendedIcon: "plane", recommendedValue: "$175.00", committedOccupancy: 30, demandOccupancy: "43%", competitorAverage: "$180.00" },
      { currentIcon: "unlock", currentValue: "$175.00", recommendedIcon: "plane", recommendedValue: "$188.00", committedOccupancy: 34, demandOccupancy: "48%", competitorAverage: "$185.00" },
      { currentIcon: "unlock", currentValue: "$198.00", recommendedIcon: "plane", recommendedValue: "$198.00", committedOccupancy: 41, demandOccupancy: "57%", competitorAverage: "$195.00" },
    ],
  },
  {
    name: "Nomad House Berlin",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€89.00",  recommendedIcon: null,     recommendedValue: "€89.00",  committedOccupancy: 61, demandOccupancy: "78%", competitorAverage: "€92.00" },
      { currentIcon: "unlock", currentValue: "€89.00",  recommendedIcon: null,     recommendedValue: "€98.00",  committedOccupancy: 68, demandOccupancy: "84%", competitorAverage: "€98.00" },
      { currentIcon: "unlock", currentValue: "€110.00", recommendedIcon: "equals", recommendedValue: "€110.00", committedOccupancy: 80, demandOccupancy: "93%", competitorAverage: "€108.00" },
      { currentIcon: "lock",   currentValue: "€110.00", recommendedIcon: "equals", recommendedValue: "€110.00", committedOccupancy: 82, demandOccupancy: "95%", competitorAverage: "€112.00" },
      { currentIcon: "unlock", currentValue: "€72.00",  recommendedIcon: "equals", recommendedValue: "€72.00",  committedOccupancy: 44, demandOccupancy: "58%", competitorAverage: "€75.00" },
      { currentIcon: "unlock", currentValue: "€72.00",  recommendedIcon: null,     recommendedValue: "€72.00",  committedOccupancy: 48, demandOccupancy: "62%", competitorAverage: "€74.00" },
      { currentIcon: "unlock", currentValue: "€82.00",  recommendedIcon: null,     recommendedValue: "€90.00",  committedOccupancy: 55, demandOccupancy: "70%", competitorAverage: "€85.00" },
    ],
  },
  {
    name: "Aria Tokyo Boutique",
    hotelType: "plane",
    rates: [
      { currentIcon: "unlock", currentValue: "¥28,000", recommendedIcon: "plane", recommendedValue: "¥31,000", committedOccupancy: 36, demandOccupancy: "52%", competitorAverage: "¥29,500" },
      { currentIcon: "unlock", currentValue: "¥28,000", recommendedIcon: "plane", recommendedValue: "¥33,000", committedOccupancy: 44, demandOccupancy: "60%", competitorAverage: "¥31,000" },
      { currentIcon: "unlock", currentValue: "¥35,000", recommendedIcon: "plane", recommendedValue: "¥35,000", committedOccupancy: 59, demandOccupancy: "76%", competitorAverage: "¥34,000" },
      { currentIcon: "unlock", currentValue: "¥35,000", recommendedIcon: "plane", recommendedValue: "¥38,000", committedOccupancy: 63, demandOccupancy: "80%", competitorAverage: "¥34,500" },
      { currentIcon: "unlock", currentValue: "¥22,000", recommendedIcon: "plane", recommendedValue: "¥24,500", committedOccupancy: 20, demandOccupancy: "34%", competitorAverage: "¥23,000" },
      { currentIcon: "unlock", currentValue: "¥22,000", recommendedIcon: "plane", recommendedValue: "¥22,000", committedOccupancy: 24, demandOccupancy: "38%", competitorAverage: "¥22,500" },
      { currentIcon: "lock",   currentValue: "¥25,000", recommendedIcon: "plane", recommendedValue: "¥27,500", committedOccupancy: 31, demandOccupancy: "47%", competitorAverage: "¥26,000" },
    ],
  },
  {
    name: "The Fern & Lodge",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "$165.00", recommendedIcon: "equals", recommendedValue: "$165.00", committedOccupancy: 25, demandOccupancy: "39%", competitorAverage: "$170.00" },
      { currentIcon: "unlock", currentValue: "$165.00", recommendedIcon: null,     recommendedValue: "$180.00", committedOccupancy: 30, demandOccupancy: "45%", competitorAverage: "$175.00" },
      { currentIcon: "unlock", currentValue: "$195.00", recommendedIcon: "equals", recommendedValue: "$195.00", committedOccupancy: 48, demandOccupancy: "65%", competitorAverage: "$190.00" },
      { currentIcon: "lock",   currentValue: "$195.00", recommendedIcon: null,     recommendedValue: "$210.00", committedOccupancy: 52, demandOccupancy: "70%", competitorAverage: "$200.00" },
      { currentIcon: "unlock", currentValue: "$138.00", recommendedIcon: "equals", recommendedValue: "$138.00", committedOccupancy: 17, demandOccupancy: "29%", competitorAverage: "$142.00" },
      { currentIcon: "unlock", currentValue: "$138.00", recommendedIcon: null,     recommendedValue: "$138.00", committedOccupancy: 19, demandOccupancy: "32%", competitorAverage: "$140.00" },
      { currentIcon: "unlock", currentValue: "$148.00", recommendedIcon: null,     recommendedValue: "$158.00", committedOccupancy: 27, demandOccupancy: "42%", competitorAverage: "$152.00" },
    ],
  },
  {
    name: "Caldera Bay Resort",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "€445.00", recommendedIcon: "plane", recommendedValue: "€480.00", committedOccupancy: 33, demandOccupancy: "51%", competitorAverage: "€460.00" },
      { currentIcon: "lock",   currentValue: "€445.00", recommendedIcon: "plane", recommendedValue: "€510.00", committedOccupancy: 41, demandOccupancy: "62%", competitorAverage: "€490.00" },
      { currentIcon: "lock",   currentValue: "€520.00", recommendedIcon: "plane", recommendedValue: "€520.00", committedOccupancy: 57, demandOccupancy: "75%", competitorAverage: "€510.00" },
      { currentIcon: "lock",   currentValue: "€520.00", recommendedIcon: "plane", recommendedValue: "€555.00", committedOccupancy: 62, demandOccupancy: "80%", competitorAverage: "€530.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "plane", recommendedValue: "€400.00", committedOccupancy: 22, demandOccupancy: "37%", competitorAverage: "€390.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "plane", recommendedValue: "€380.00", committedOccupancy: 26, demandOccupancy: "42%", competitorAverage: "€385.00" },
      { currentIcon: "unlock", currentValue: "€415.00", recommendedIcon: "plane", recommendedValue: "€435.00", committedOccupancy: 35, demandOccupancy: "53%", competitorAverage: "€425.00" },
    ],
  },
  {
    name: "St. Moritz Palace",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "CHF 620", recommendedIcon: null,     recommendedValue: "CHF 620", committedOccupancy: 28, demandOccupancy: "44%", competitorAverage: "CHF 640" },
      { currentIcon: "unlock", currentValue: "CHF 620", recommendedIcon: null,     recommendedValue: "CHF 660", committedOccupancy: 36, demandOccupancy: "55%", competitorAverage: "CHF 670" },
      { currentIcon: "unlock", currentValue: "CHF 750", recommendedIcon: "equals", recommendedValue: "CHF 750", committedOccupancy: 50, demandOccupancy: "70%", competitorAverage: "CHF 735" },
      { currentIcon: "unlock", currentValue: "CHF 750", recommendedIcon: null,     recommendedValue: "CHF 790", committedOccupancy: 55, demandOccupancy: "76%", competitorAverage: "CHF 760" },
      { currentIcon: "unlock", currentValue: "CHF 520", recommendedIcon: "equals", recommendedValue: "CHF 520", committedOccupancy: 18, demandOccupancy: "31%", competitorAverage: "CHF 530" },
      { currentIcon: "unlock", currentValue: "CHF 520", recommendedIcon: "equals", recommendedValue: "CHF 520", committedOccupancy: 22, demandOccupancy: "36%", competitorAverage: "CHF 525" },
      { currentIcon: "lock",   currentValue: "CHF 575", recommendedIcon: null,     recommendedValue: "CHF 610", committedOccupancy: 30, demandOccupancy: "48%", competitorAverage: "CHF 590" },
    ],
  },
];

// ── Styles ──────────────────────────────────────────────────────────────────
const DATE_HEADER_BG  = "#d4e4f5";
const SUBHEADER_BG    = "#e4dff5";
const HOTEL_COL_BG    = "#ece8f8";
const BORDER_THIN     = "#dde1e2";
const BORDER_THICK    = "#8899ae";   // section divider
const COL_WIDTH       = "120px";     // equal width for Current + Recommended
const PRIMARY_TEXT    = "#1a2533";
const CELL_TEXT       = "#1a2533";
const SUBHEADER_TEXT  = "#4f5b60";
const DATE_HEADER_TEXT = "#1e3a5f";

// ── Icons ────────────────────────────────────────────────────────────────────
function LockedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#006461">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function UnlockedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006461" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function EqualsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M19 10H5v2h14v-2zm0 4H5v2h14v-2z" />
    </svg>
  );
}

function ChevronIcon({ left = false }: { left?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={DATE_HEADER_TEXT} style={left ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function thickBorder(side: "right" | "left" = "right") {
  return side === "right"
    ? { borderRight: `3px solid ${BORDER_THICK}` }
    : { borderLeft: `3px solid ${BORDER_THICK}` };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RatesTable() {
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  function toggleDay(day: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[13px]" style={{ minWidth: "900px" }}>
        <thead>
          {/* Row 1: Hotel + date group headers */}
          <tr>
            <th
              className="text-left px-4 py-2 font-semibold border-b sticky left-0 z-20"
              style={{ width: "180px", borderColor: BORDER_THIN, color: PRIMARY_TEXT, backgroundColor: "#ffffff", ...thickBorder() }}
              rowSpan={2}
            >
              Hotel
            </th>
            {DAYS.map((day, di) => {
              const expanded = expandedDays.has(day);
              const isLast = di === DAYS.length - 1;
              return (
                <th
                  key={day}
                  colSpan={expanded ? 5 : 2}
                  className="text-center px-2 py-1.5 font-normal border-b text-[12px]"
                  style={{
                    backgroundColor: DATE_HEADER_BG,
                    borderColor: BORDER_THIN,
                    color: DATE_HEADER_TEXT,
                    ...(isLast ? { borderRight: `1px solid ${BORDER_THIN}` } : thickBorder()),
                  }}
                >
                  <button className="flex items-center justify-center gap-1 w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => toggleDay(day)}>
                    {day}
                    <ChevronIcon left={expanded} />
                  </button>
                </th>
              );
            })}
          </tr>

          {/* Row 2: Current / Recommended (+ expanded cols) */}
          <tr>
            {DAYS.map((day, di) => {
              const expanded = expandedDays.has(day);
              const isLast = di === DAYS.length - 1;
              const lastColBorder = isLast ? { borderRight: `1px solid ${BORDER_THIN}` } : thickBorder();
              return (
                <Fragment key={day}>
                  <th
                    className="text-right px-4 py-1 font-normal border-b text-[12px]"
                    style={{ backgroundColor: SUBHEADER_BG, borderRight: `1px solid ${BORDER_THIN}`, color: SUBHEADER_TEXT, width: COL_WIDTH }}
                  >
                    Current
                  </th>
                  <th
                    className="text-right px-4 py-1 font-normal border-b text-[12px]"
                    style={{ backgroundColor: SUBHEADER_BG, color: SUBHEADER_TEXT, width: COL_WIDTH, ...(expanded ? { borderRight: `1px solid ${BORDER_THIN}` } : lastColBorder) }}
                  >
                    Recommended
                  </th>
                  {expanded && (
                    <>
                      <th className="text-right px-4 py-1 font-normal border-b text-[12px]" style={{ backgroundColor: SUBHEADER_BG, borderRight: `1px solid ${BORDER_THIN}`, color: SUBHEADER_TEXT, width: "110px" }}>
                        Committed Occupancy
                      </th>
                      <th className="text-right px-4 py-1 font-normal border-b text-[12px]" style={{ backgroundColor: SUBHEADER_BG, borderRight: `1px solid ${BORDER_THIN}`, color: SUBHEADER_TEXT, width: "110px" }}>
                        Demand Occupancy
                      </th>
                      <th className="text-right px-4 py-1 font-normal border-b text-[12px]" style={{ backgroundColor: SUBHEADER_BG, color: SUBHEADER_TEXT, width: "110px", ...lastColBorder }}>
                        Competitor Average
                      </th>
                    </>
                  )}
                </Fragment>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {HOTELS.map((hotel) => {
            const isSelected = selectedHotel === hotel.name;
            const rowBg = isSelected ? "#eaf1fb" : "#ffffff";
            return (
              <tr
                key={hotel.name}
                onClick={() => setSelectedHotel(isSelected ? null : hotel.name)}
                className="cursor-pointer hover:brightness-[0.97] transition-all"
                style={{ backgroundColor: rowBg }}
              >
                {/* Hotel name */}
                <td
                  className="px-4 py-2 border-b sticky left-0 z-10"
                  style={{
                    color: PRIMARY_TEXT,
                    backgroundColor: HOTEL_COL_BG,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "180px",
                    borderBottom: `1px solid ${BORDER_THIN}`,
                    ...thickBorder(),
                  }}
                >
                  {hotel.name}
                </td>

                {/* Rate cells */}
                {hotel.rates.map((rate, i) => {
                  const expanded = expandedDays.has(DAYS[i]);
                  const isLast = i === DAYS.length - 1;
                  const lastColBorder = isLast ? { borderRight: `1px solid ${BORDER_THIN}` } : thickBorder();
                  return (
                    <Fragment key={i}>
                      {/* Current — no right border; section divider lives on Recommended */}
                      <td className="px-3 py-2 border-b" style={{ borderColor: BORDER_THIN, color: CELL_TEXT, width: COL_WIDTH }}>
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 shrink-0 flex justify-center">
                            {rate.currentIcon === "lock" ? <LockedIcon /> : <UnlockedIcon />}
                          </span>
                          <span className="flex-1 text-right">{rate.currentValue}</span>
                        </span>
                      </td>

                      {/* Recommended */}
                      <td
                        className="px-3 py-2 border-b"
                        style={{ color: CELL_TEXT, width: COL_WIDTH, borderBottom: `1px solid ${BORDER_THIN}`, ...(expanded ? { borderRight: `1px solid ${BORDER_THIN}` } : lastColBorder) }}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 shrink-0 flex justify-center">
                            {rate.recommendedIcon === "plane" && <PlaneIcon />}
                            {rate.recommendedIcon === "equals" && <EqualsIcon />}
                          </span>
                          <span className="flex-1 text-right">{rate.recommendedValue}</span>
                        </span>
                      </td>

                      {/* Expanded columns */}
                      {expanded && (
                        <>
                          <td className="px-3 py-2 border-b text-right" style={{ borderColor: BORDER_THIN, color: CELL_TEXT, width: "110px" }}>
                            {rate.committedOccupancy}
                          </td>
                          <td className="px-3 py-2 border-b text-right" style={{ borderColor: BORDER_THIN, color: CELL_TEXT, width: "110px" }}>
                            {rate.demandOccupancy}
                          </td>
                          <td className="px-3 py-2 border-b text-right" style={{ color: CELL_TEXT, width: "110px", borderBottom: `1px solid ${BORDER_THIN}`, ...lastColBorder }}>
                            {rate.competitorAverage}
                          </td>
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { Fragment, useState } from "react";

type Rate = {
  current: { icon: "lock" | "plane" | "equals"; value: string };
  recommended: { icon: "lock" | "plane" | "equals"; value: string };
};

type Hotel = {
  name: string;
  rates: Rate[]; // one per day
};

type Day = {
  label: string; // e.g. "Thu, 05/07"
};

const DAYS: Day[] = [
  { label: "Thu, 05/07" },
  { label: "Fri, 05/08" },
  { label: "Sat, 05/09" },
  { label: "Sun, 05/10" },
  { label: "Mon, 05/11" },
  { label: "Tue, 05/12" },
  { label: "Wed, 05/13" },
];

const HOTELS: Hotel[] = [
  {
    name: "Cecilia's Demo",
    rates: DAYS.map(() => ({
      current: { icon: "lock", value: "$59.00" },
      recommended: { icon: "plane", value: "$59.00" },
    })),
  },
  {
    name: "Rocio's Demo",
    rates: [
      { current: { icon: "equals", value: "€243.00" }, recommended: { icon: "equals", value: "€243.00" } },
      { current: { icon: "equals", value: "€285.00" }, recommended: { icon: "equals", value: "€285.00" } },
      { current: { icon: "equals", value: "€325.00" }, recommended: { icon: "equals", value: "€325.00" } },
      { current: { icon: "equals", value: "€227.00" }, recommended: { icon: "equals", value: "€227.00" } },
      { current: { icon: "equals", value: "€198.00" }, recommended: { icon: "equals", value: "€198.00" } },
      { current: { icon: "equals", value: "€212.00" }, recommended: { icon: "equals", value: "€212.00" } },
      { current: { icon: "equals", value: "€240.00" }, recommended: { icon: "equals", value: "€240.00" } },
    ],
  },
];

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#006461">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );
}

function RateIcon({ type }: { type: "lock" | "plane" | "equals" }) {
  if (type === "lock") return <LockIcon />;
  if (type === "plane") return <PlaneIcon />;
  return <EqualsIcon />;
}

export default function RatesTable() {
  const [selectedHotel, setSelectedHotel] = useState<string | null>("Rocio's Demo");

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[13px]" style={{ minWidth: "900px" }}>
        <thead>
          {/* Row 1: Hotel label + date group headers */}
          <tr>
            <th
              className="text-left px-4 py-2 font-normal border-b border-r sticky left-0 bg-white z-10"
              style={{ width: "160px", borderColor: "#dde1e2", color: "#4f5b60" }}
              rowSpan={2}
            >
              Hotel
            </th>
            {DAYS.map((day) => (
              <th
                key={day.label}
                colSpan={2}
                className="text-center px-2 py-1.5 font-normal border-b border-r text-[12px]"
                style={{
                  backgroundColor: "#dae3f0",
                  borderColor: "#c0cfe0",
                  color: "#2c4870",
                  minWidth: "180px",
                }}
              >
                <span className="flex items-center justify-center gap-1">
                  {day.label}
                  <ChevronRightIcon />
                </span>
              </th>
            ))}
          </tr>
          {/* Row 2: Current / Recommended sub-headers */}
          <tr>
            {DAYS.map((day) => (
              <Fragment key={day.label}>
                <th
                  className="text-right px-4 py-1 font-normal border-b border-r text-[12px]"
                  style={{ borderColor: "#dde1e2", color: "#4f5b60", width: "90px" }}
                >
                  Current
                </th>
                <th
                  className="text-right px-4 py-1 font-normal border-b border-r text-[12px]"
                  style={{ borderColor: "#dde1e2", color: "#4f5b60", width: "90px" }}
                >
                  Recommended
                </th>
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOTELS.map((hotel) => {
            const isSelected = selectedHotel === hotel.name;
            return (
              <tr
                key={hotel.name}
                onClick={() => setSelectedHotel(hotel.name)}
                className="cursor-pointer hover:brightness-95 transition-all"
                style={{
                  backgroundColor: isSelected ? "#eaf1fb" : "#ffffff",
                }}
              >
                {/* Hotel name cell */}
                <td
                  className="px-4 py-2 border-b border-r sticky left-0 z-10 font-normal"
                  style={{
                    borderColor: "#dde1e2",
                    color: "#2c4870",
                    backgroundColor: isSelected ? "#eaf1fb" : "#ffffff",
                  }}
                >
                  {hotel.name}
                </td>
                {/* Rate cells */}
                {hotel.rates.map((rate, i) => (
                  <Fragment key={i}>
                    <td
                      className="px-3 py-2 border-b border-r text-right"
                      style={{ borderColor: "#dde1e2", color: "#2c4870" }}
                    >
                      <span className="flex items-center justify-end gap-1.5">
                        <RateIcon type={rate.current.icon} />
                        {rate.current.value}
                      </span>
                    </td>
                    <td
                      className="px-3 py-2 border-b border-r text-right"
                      style={{ borderColor: "#dde1e2", color: "#2c4870" }}
                    >
                      <span className="flex items-center justify-end gap-1.5">
                        <RateIcon type={rate.recommended.icon} />
                        {rate.recommended.value}
                      </span>
                    </td>
                  </Fragment>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

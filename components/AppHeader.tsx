"use client";

const LOGO_URL =
  "https://www.figma.com/api/mcp/asset/19c3c66e-f32d-48c4-a8d1-127851011ea6";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  hasDropdown?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home" },
  { label: "Advance" },
  { label: "Pricing & Strategy", hasDropdown: true },
  { label: "Restrictions" },
  { label: "Forecasts & Budgets", hasDropdown: true },
  { label: "Reports", hasDropdown: true },
  { label: "Groups", hasDropdown: true },
  { label: "Onboarding" },
];

const VERSIONS = [
  { label: "Current MRX", path: "/" },
  { label: "P&S Rates with restrictions", path: "/v1" },
  { label: "MP Rates & Restrictions", path: "/v3" },
];

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-[#ff5900] flex items-center justify-center">
      <span className="text-white text-[10px] font-bold leading-none">N</span>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#006461">
      <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5v-2h2v2zm4 4H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z" />
    </svg>
  );
}

export type PropertyPickerConfig = {
  allProperties: { label: string; path: string };
  groups: Array<{
    label: string;
    path: string;
    hotels: Array<{ label: string; path: string }>;
  }>;
};

type AppHeaderProps = {
  activeNav?: string;
  propertyName?: string;
  breadcrumb?: string[];
  propertyPicker?: PropertyPickerConfig;
};

export default function AppHeader({
  activeNav = "Pricing & Strategy",
  propertyName = "All Properties",
  breadcrumb = ["Home", "Pricing & Strategy", "Rates"],
  propertyPicker,
}: AppHeaderProps) {
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [propertyPickerOpen, setPropertyPickerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(
    propertyPicker?.groups.map((g) => g.label) ?? []
  ));
  const pathname = usePathname();
  const router = useRouter();

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  return (
    <header className="w-full">
      {/* Top nav bar */}
      <div
        className="flex items-center gap-4 h-10 px-6"
        style={{ backgroundColor: "#0e2124" }}
      >
        {/* Duetto logo */}
        <div className="shrink-0 h-[15px] w-[72px]">
          <img src={LOGO_URL} alt="Duetto" className="h-full w-auto" />
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 h-10 overflow-hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-0.5 h-10 px-4 text-[13px] shrink-0 cursor-pointer transition-colors"
              style={
                item.label === activeNav
                  ? {
                      backgroundColor: "#c4ff45",
                      color: "#0e2124",
                    }
                  : { color: "#ffffff" }
              }
            >
              {item.label}
              {item.hasDropdown && (
                <span style={item.label === activeNav ? { color: "#0e2124" } : { color: "#ffffff" }}>
                  <ChevronDownIcon />
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
            <NotificationsIcon />
            <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] rounded-full px-0.5 leading-none py-px">
              4
            </span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
            <HelpIcon />
          </button>
          <div className="relative">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              onClick={() => setVersionMenuOpen((v) => !v)}
              title="Switch prototype version"
            >
              <SettingsIcon />
            </button>
            {versionMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setVersionMenuOpen(false)}
                />
                {/* Dropdown */}
                <div
                  className="absolute right-0 top-9 z-50 w-44 rounded shadow-lg border"
                  style={{ backgroundColor: "#1a2533", borderColor: "#2d3f50" }}
                >
                  <div
                    className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "#9aa5ab" }}
                  >
                    Prototype version
                  </div>
                  {VERSIONS.map((v) => {
                    const isCurrent = pathname === v.path;
                    return (
                      <button
                        key={v.path}
                        className="w-full text-left px-3 py-2 text-[13px] flex items-center gap-2 hover:bg-white/10 transition-colors"
                        style={{ color: isCurrent ? "#c4ff45" : "#ffffff" }}
                        onClick={() => {
                          setVersionMenuOpen(false);
                          router.push(v.path);
                        }}
                      >
                        {isCurrent && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#c4ff45">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                        {!isCurrent && <span className="w-3" />}
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
            <AvatarIcon />
          </button>
        </div>
      </div>

      {/* Breadcrumb + property picker bar */}
      <div
        className="flex items-center justify-between h-8 pl-6 border-b"
        style={{ backgroundColor: "#fafafa", borderColor: "#dde1e2" }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1">
              {i > 0 && (
                <span style={{ color: "#4f5b60" }}>
                  <ChevronRightIcon />
                </span>
              )}
              <span
                className="text-[12px]"
                style={{
                  color: i === breadcrumb.length - 1 ? "#4f5b60" : "#006461",
                }}
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* Property picker */}
        <div className="relative">
          <button
            className="flex items-center gap-2 h-8 px-2 w-[312px] border-l cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#dde1e2" }}
            onClick={() => propertyPicker && setPropertyPickerOpen((v) => !v)}
          >
            <BuildingIcon />
            <span className="flex-1 text-left text-[13px] truncate" style={{ color: "#006461" }}>
              {propertyName}
            </span>
            {propertyPicker && (
              <span style={{ color: "#4f5b60" }}>
                <ChevronDownIcon />
              </span>
            )}
          </button>

          {propertyPickerOpen && propertyPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPropertyPickerOpen(false)} />
              <div
                className="absolute right-0 top-8 z-50 w-[320px] shadow-xl border overflow-hidden"
                style={{ backgroundColor: "#ffffff", borderColor: "#dde1e2", borderRadius: "0 0 6px 6px" }}
              >
                {/* Picker header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "#dde1e2", backgroundColor: "#f5f7f8" }}>
                  <BuildingIcon />
                  <span className="flex-1 text-[13px] font-medium truncate" style={{ color: "#006461" }}>
                    {propertyName}
                  </span>
                  <button
                    onClick={() => setPropertyPickerOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
                    style={{ color: "#4f5b60" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>

                {/* All Properties */}
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 border-b text-left hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#f0f2f3" }}
                  onClick={() => { setPropertyPickerOpen(false); router.push(propertyPicker.allProperties.path); }}
                >
                  {/* Infinity icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f5b60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
                    <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
                  </svg>
                  <span className="text-[13px] font-semibold" style={{ color: "#1a2533" }}>
                    {propertyPicker.allProperties.label}
                  </span>
                </button>

                {/* Groups */}
                {propertyPicker.groups.map((group) => {
                  const expanded = expandedGroups.has(group.label);
                  return (
                    <div key={group.label}>
                      {/* Group row */}
                      <div className="flex items-center border-b" style={{ borderColor: "#f0f2f3" }}>
                        <button
                          className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
                          onClick={() => { setPropertyPickerOpen(false); router.push(group.path); }}
                        >
                          {/* Layers icon */}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f5b60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                          </svg>
                          <span className="text-[13px] font-medium" style={{ color: "#1a2533" }}>
                            {group.label}
                          </span>
                        </button>
                        {/* Expand/collapse toggle */}
                        <button
                          className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
                          onClick={(e) => { e.stopPropagation(); toggleGroup(group.label); }}
                        >
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="#4f5b60"
                            style={{ transform: expanded ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }}
                          >
                            <path d="M7 10l5 5 5-5H7z" />
                          </svg>
                        </button>
                      </div>

                      {/* Hotels under group */}
                      {expanded && group.hotels.map((hotel) => (
                        <button
                          key={hotel.path}
                          className="w-full flex items-center text-left px-3 py-2 border-b hover:bg-gray-50 transition-colors"
                          style={{ borderColor: "#f0f2f3", paddingLeft: "44px" }}
                          onClick={() => { setPropertyPickerOpen(false); router.push(hotel.path); }}
                        >
                          <span className="text-[13px]" style={{ color: "#1a2533" }}>
                            {hotel.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import AppHeader from "@/components/AppHeader";
import RatesTable from "@/components/RatesTable";

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

export default function RatesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        activeNav="Pricing & Strategy"
        propertyName="All Properties"
        breadcrumb={["Home", "Pricing & Strategy", "Rates"]}
      />

      {/* Page content */}
      <main className="flex-1 flex flex-col">
        {/* Page header bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: "#dde1e2" }}
        >
          <h1 className="text-[18px] font-bold" style={{ color: "#0e2124" }}>
            All Properties
          </h1>

          <div className="flex items-center gap-3">
            {/* Review button */}
            <button
              className="flex items-center gap-1.5 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              <EyeIcon />
              Review
            </button>

            {/* Date range picker */}
            <button
              className="flex items-center gap-2 px-3 h-8 border rounded text-[13px] transition-colors hover:bg-gray-50"
              style={{ borderColor: "#dde1e2", color: "#4f5b60" }}
            >
              5/7/2026 – 5/13/2026
              <CalendarIcon />
            </button>
          </div>
        </div>

        {/* Rates table */}
        <div className="flex-1 p-0">
          <RatesTable />
        </div>
      </main>
    </div>
  );
}

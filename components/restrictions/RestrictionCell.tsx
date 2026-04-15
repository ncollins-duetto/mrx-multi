import { DayRestriction } from "@/lib/restrictionData";

const GREEN = "#006461";

// Shared outline pill style — base for all restriction chips
function pill(dirty: boolean, extra?: React.CSSProperties): React.CSSProperties {
  return {
    display: "inline-block",
    border: `1px solid ${GREEN}`,
    color: GREEN,
    backgroundColor: dirty ? "rgba(0,100,97,0.07)" : "transparent",
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "10px",
    fontWeight: 500,
    lineHeight: "16px",
    whiteSpace: "nowrap",
    ...extra,
  };
}

function restrictionLabel(r: DayRestriction): string {
  return r.value != null ? `${r.type}=${r.value}` : r.type;
}

export default function RestrictionCell({
  restriction,
  originalRestriction,
}: {
  restriction: DayRestriction;
  originalRestriction?: DayRestriction;
}) {
  // Pending clear — show the original value struck through (if there was one)
  if (restriction.type === "None" && restriction.isDirty) {
    if (originalRestriction && originalRestriction.type !== "None") {
      return (
        <span style={pill(true, { textDecoration: "line-through", opacity: 0.55 })}>
          {restrictionLabel(originalRestriction)}
        </span>
      );
    }
    // Nothing published to strike through — just show empty
    return (
      <span style={{ color: "#9aa5ab", fontSize: "11px", userSelect: "none" }}>
        —
      </span>
    );
  }

  // No restriction, nothing pending
  if (restriction.type === "None") {
    return (
      <span style={{ color: "#9aa5ab", fontSize: "11px", userSelect: "none" }}>
        —
      </span>
    );
  }

  // Active restriction — outline pill, tinted if dirty (pending publish)
  return (
    <span style={pill(!!restriction.isDirty)}>
      {restrictionLabel(restriction)}
    </span>
  );
}

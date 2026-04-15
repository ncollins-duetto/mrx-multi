import { DayRestriction } from "@/lib/restrictionData";

export default function RestrictionCell({
  restriction,
}: {
  restriction: DayRestriction;
}) {
  if (restriction.type === "None") {
    if (restriction.isDirty) {
      // Pending clear — only shown when there was a restriction to remove
      return (
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#daf0ec",
            color: "#065f46",
            fontSize: "11px",
            padding: "2px 6px",
            borderRadius: "10px",
            fontWeight: 500,
            lineHeight: "16px",
            whiteSpace: "nowrap",
          }}
        >
          Cleared
        </span>
      );
    }
    return (
      <span style={{ color: "#9aa5ab", fontSize: "11px", userSelect: "none" }}>
        —
      </span>
    );
  }

  const label =
    restriction.value != null
      ? `${restriction.type}=${restriction.value}`
      : restriction.type;

  const bgColor = restriction.isDirty ? "#daf0ec" : "#dce8f5";
  const textColor = restriction.isDirty ? "#065f46" : "#1e3a5f";

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: bgColor,
        color: textColor,
        fontSize: "11px",
        padding: "2px 6px",
        borderRadius: "10px",
        fontWeight: 500,
        lineHeight: "16px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

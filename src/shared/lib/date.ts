/**
 * All timestamps from the backend are in UTC (+0).
 * Display timezone is fixed to America/Winnipeg (UTC-5 / UTC-6 depending on DST).
 */

const WINNIPEG_TZ = "America/Winnipeg";

/**
 * Format a UTC ISO string as a short date (e.g. "Jun 4")
 * displayed in Winnipeg local time.
 */
export const formatShortDate = (iso: string): string => {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: WINNIPEG_TZ,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

/**
 * Format a UTC ISO string as a full date + time (e.g. "04/06/2025, 14:32:10")
 * displayed in Winnipeg local time.
 */
export const formatDateTime = (iso: string): string => {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: WINNIPEG_TZ,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

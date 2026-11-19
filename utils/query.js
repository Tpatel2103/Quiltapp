export function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parsePage(value) {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

// Ken Yong Code Review: The regex checks that the date follows the YYYY-MM-DD format,
// but JavaScript may normalize some invalid calendar dates instead of rejecting them.
// Consider also verifying that the parsed year, month, and day match the original input so invalid dates are rejected.

// Dates arrive as "YYYY-MM-DD". Storing them at noon UTC keeps the
// calendar day stable across time zones.
export function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function cleanText(value, maxLength) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

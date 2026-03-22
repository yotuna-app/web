export function getBrowserLocale(): string {
  return navigator.language || "en";
}

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatPlaylistTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const timeStr = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    return timeStr;
  } catch {
    return dateString;
  }
}

export function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getPlaylistDateRange(date: Date): { from: string; to: string } {
  // Create start/end of day in the browser's timezone
  const dateStr = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const from = `${dateStr}T00:00:00`;
  const to = `${dateStr}T23:59:59`;
  return { from, to };
}

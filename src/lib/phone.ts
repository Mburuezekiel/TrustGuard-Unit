export const normalizePhone = (input: string): string | null => {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  // Keep digits and an optional leading +
  let v = raw.replace(/[^\\d+]/g, "");

  // Convert 00 international prefix to +
  if (v.startsWith("00")) v = `+${v.slice(2)}`;

  // Kenya-friendly normalization
  if (!v.startsWith("+")) {
    if (v.startsWith("254")) v = `+${v}`;
    else if (v.startsWith("0") && v.length === 10) v = `+254${v.slice(1)}`;
    else if ((v.startsWith("7") || v.startsWith("1")) && v.length === 9) v = `+254${v}`;
  }

  // E.164 validation
  if (!/^\+[1-9]\d{1,14}$/.test(v)) return null;
  return v;
};

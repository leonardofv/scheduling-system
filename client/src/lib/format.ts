export function formatDateBR(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateLong(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(dateStr)
  );
}

export function formatDateShort(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(dateStr)
  );
}

export function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatRole(role: string) {
  return role === "admin" ? "Administrador" : "Paciente";
}

export function formatCurrency(value: string) {
  const num = parseFloat(String(value));
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseCurrencyToDecimal(value: string) {
  return String(value).replace(/[R$\s.]/g, "").replace(",", ".");
}

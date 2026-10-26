/**
 * Định dạng số tiền sang định dạng tiền tệ Việt Nam Đồng (VND)
 * Ví dụ: 57650000 -> "57.650.000 ₫" hoặc "57.650.000 VND"
 */
export function formatVND(amount: number, showCurrency: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showCurrency ? "0 ₫" : "0";
  }
  const formatted = new Intl.NumberFormat("vi-VN").format(Math.round(amount));
  return showCurrency ? `${formatted} ₫` : formatted;
}

/**
 * Định dạng rút gọn cho biểu đồ tâm tròn hoặc nhãn nhỏ
 * Ví dụ: 7469000 -> "7.5tr", 21619000 -> "21.6tr"
 */
export function formatShortVND(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}tỷ`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}tr`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`;
  }
  return `${amount}`;
}

/**
 * Định dạng ngày ISO (YYYY-MM-DD) sang hiển thị người dùng (DD/MM/YYYY)
 */
export function formatDateVN(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-");
    if (year && month && day) {
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

/**
 * Lấy chuỗi tháng hiện tại theo chuẩn YYYY-MM
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Danh sách tên các tháng tiếng Việt để hiển thị bộ chọn tháng
 */
export function getMonthDisplayLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  return `Tháng ${parseInt(month, 10)}/${year}`;
}

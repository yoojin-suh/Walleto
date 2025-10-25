/**
 * Format a number as currency with commas and 2 decimal places
 * @param amount - The number to format
 * @returns Formatted currency string (e.g., "1,234.56")
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get current month and year as formatted string
 * @returns Formatted string like "October 2025"
 */
export function getCurrentMonthYear(): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

/**
 * Get short month and year
 * @returns Formatted string like "Oct 2025"
 */
export function getShortMonthYear(): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

import { clsx, type ClassValue } from "clsx";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export const webNameMCP = "Mr. Clean Piece";
export const webNameLiberty = "Liberty Computers";
const webCurrency = "UGX";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocaleCurrency(amount: number) {
  const parsedAmount = Number(amount);
  return `${webCurrency} ${parsedAmount.toLocaleString()}`;
}

export function formatCurrency(price: number | string = 0, currency?: string) {
  const numericPrice = Number(price);

  const formattedPrice = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || webCurrency,
    minimumFractionDigits: numericPrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);

  return formattedPrice;
}

export function formatDateToLocal(from: Date) {
  // const from = new Date(date)
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

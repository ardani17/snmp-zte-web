import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPower(value: string): {
  text: string;
  color: string;
  status: "good" | "warning" | "bad";
} {
  const num = parseFloat(value);

  // Invalid power reading
  if (isNaN(num) || num > 50) {
    return { text: "-", color: "text-gray-400", status: "bad" };
  }

  // Good: -8 to -25 dBm
  if (num >= -25 && num <= -8) {
    return {
      text: `${num.toFixed(2)} dBm`,
      color: "text-green-600",
      status: "good",
    };
  }

  // Warning: -25 to -28 dBm
  if (num >= -28) {
    return {
      text: `${num.toFixed(2)} dBm`,
      color: "text-yellow-600",
      status: "warning",
    };
  }

  // Bad: below -28 dBm
  return {
    text: `${num.toFixed(2)} dBm`,
    color: "text-red-600",
    status: "bad",
  };
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "online":
      return "bg-green-100 text-green-800";
    case "offline":
      return "bg-red-100 text-red-800";
    case "logging":
    case "synchronization":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

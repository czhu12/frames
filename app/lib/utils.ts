import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractFrameData(formData: FormData) {
  const url = formData.get("url") as string;
  const x = parseInt(formData.get("x") as string);
  const y = parseInt(formData.get("y") as string);
  const width = parseInt(formData.get("width") as string);
  const height = parseInt(formData.get("height") as string);
  return { url, x, y, width, height };
}

export function parseFrameFavicon(url: string) {
  const faviconUrl = new URL(url);
  faviconUrl.pathname = "/favicon.ico";
  return faviconUrl.toString();
}
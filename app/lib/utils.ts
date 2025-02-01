import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react";


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

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount

  return windowSize;
}
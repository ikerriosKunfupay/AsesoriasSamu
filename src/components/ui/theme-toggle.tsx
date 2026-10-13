"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "team-ortega:theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const activeTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const frame = window.requestAnimationFrame(() => setTheme(activeTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = nextTheme === "dark" ? Moon : Sun;

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn("justify-start", className)}
      aria-label={`Activar modo ${nextTheme === "dark" ? "oscuro" : "claro"}`}
      onClick={() => {
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        setTheme(nextTheme);
      }}
    >
      <Icon aria-hidden="true" className="size-4" />
      Modo {nextTheme === "dark" ? "oscuro" : "claro"}
    </Button>
  );
}

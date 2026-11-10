"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("theme")
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  function cycleTheme() {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
        aria-label={t("toggle")}
      >
        <span className="size-4" />
        <span className="sr-only">{t("toggle")}</span>
      </Button>
    )
  }

  const currentLabel =
    theme === "light"
      ? t("light")
      : theme === "dark"
        ? t("dark")
        : t("system")

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={`${t("toggle")} (${currentLabel})`}
      title={`${t("toggle")} (${currentLabel})`}
    >
      {theme === "light" ? (
        <Sun className="size-4" />
      ) : theme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Monitor className="size-4" />
      )}
      <span className="sr-only">{t("toggle")}</span>
    </Button>
  )
}

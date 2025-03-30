import type React from "react"
import type { ThemePalette } from "@/types/mkdocs-config"

export interface ColorPaletteProps {
  palettes: ThemePalette[]
  onChange: (palettes: ThemePalette[]) => void
  onAutomaticModeChange: (enabled: boolean) => void
  onSystemPreferencesChange: (enabled: boolean) => void
  automaticMode: boolean
}

export interface PaletteCardProps {
  palette: ThemePalette
  index: number
  onChange: (index: number, palette: ThemePalette) => void
  onRemove: (index: number) => void
  totalPalettes: number
}

export interface ColorToggleProps {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled: boolean
  icon: React.ReactNode
  tooltipContent?: string
}


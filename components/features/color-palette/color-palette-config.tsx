"use client"

import { Button } from "@/components/ui/button"
import { Plus, Monitor, Clock } from "lucide-react"
import type { ColorPaletteProps } from "@/types/features/color-palette"
import { PaletteCard } from "./palette-card"
import { ColorToggle } from "./color-toggle"

export function ColorPaletteConfig({
  palettes,
  onChange,
  onAutomaticModeChange,
  onSystemPreferencesChange,
  automaticMode,
}: ColorPaletteProps) {
  const updatePalette = (index: number, palette: any) => {
    // If changing scheme and we have 2 palettes, ensure they remain different
    if ("scheme" in palette && palettes.length === 2) {
      const otherIndex = index === 0 ? 1 : 0
      const otherPalette = palettes[otherIndex]

      if (palette.scheme === otherPalette.scheme) {
        // If trying to set both to the same scheme, prevent it
        return
      }
    }

    const newPalettes = [...palettes]
    newPalettes[index] = palette
    onChange(newPalettes)
  }

  const addPalette = () => {
    // Don't allow more than 2 palettes
    if (palettes.length >= 2) return

    // If we already have one palette, make the new one the opposite scheme
    let newScheme = "default"
    let newIcon = "material/brightness-7"
    let newName = "Switch to dark mode"

    if (palettes.length === 1) {
      // Make the new palette the opposite of the existing one
      newScheme = palettes[0].scheme === "slate" ? "default" : "slate"
      newIcon = newScheme === "slate" ? "material/brightness-4" : "material/brightness-7"
      newName = newScheme === "slate" ? "Switch to light mode" : "Switch to dark mode"
    }

    const newPalette = {
      scheme: newScheme,
      primary: "indigo",
      accent: "indigo",
      toggle: {
        icon: newIcon,
        name: newName,
      },
    }

    onChange([...palettes, newPalette])
  }

  const removePalette = (index: number) => {
    // Check if we're going from 2 palettes to 1
    if (palettes.length === 2) {
      // Turn off automatic mode before removing the palette
      onAutomaticModeChange(false)
    }

    const newPalettes = [...palettes]
    newPalettes.splice(index, 1)
    onChange(newPalettes)
  }

  // Check if system preferences are enabled
  const isSystemPreferencesEnabled = (): boolean => {
    if (palettes.length !== 2) return false
    return palettes.some((p) => p.media && p.media.includes("prefers-color-scheme"))
  }

  // Check if we have both light and dark palettes
  const hasBothSchemes = (): boolean => {
    if (palettes.length !== 2) return false

    const hasDefault = palettes.some((p) => p.scheme === "default" || !p.scheme)
    const hasSlate = palettes.some((p) => p.scheme === "slate")

    return hasDefault && hasSlate
  }

  // Check if we can add another palette
  const canAddPalette = (): boolean => {
    return palettes.length < 2
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 mb-4">
        <ColorToggle
          id="system-preferences"
          label="Use System Preferences"
          description="Automatically switch between light and dark themes based on user's system preferences"
          checked={isSystemPreferencesEnabled()}
          onCheckedChange={onSystemPreferencesChange}
          disabled={!hasBothSchemes()}
          icon={<Monitor />}
          tooltipContent={
            !hasBothSchemes()
              ? "System preferences are only available when both light and dark palettes are configured"
              : undefined
          }
        />

        <ColorToggle
          id="automatic-mode"
          label="Time-based Automatic Mode"
          description="Add a third palette that enables automatic switching based on local time"
          checked={automaticMode}
          onCheckedChange={onAutomaticModeChange}
          disabled={!hasBothSchemes() || !isSystemPreferencesEnabled()}
          icon={<Clock />}
          tooltipContent={
            !hasBothSchemes() || !isSystemPreferencesEnabled()
              ? "Automatic mode requires both light and dark palettes with system preferences enabled"
              : undefined
          }
        />
      </div>

      {palettes.map((palette, index) => (
        <PaletteCard
          key={index}
          palette={palette}
          index={index}
          onChange={updatePalette}
          onRemove={removePalette}
          totalPalettes={palettes.length}
        />
      ))}

      {canAddPalette() && (
        <Button variant="outline" onClick={addPalette} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add {palettes.length === 0 ? "Palette" : palettes[0].scheme === "slate" ? "Light Palette" : "Dark Palette"}
        </Button>
      )}

      {!canAddPalette() && (
        <p className="text-sm text-muted-foreground">Maximum of two palettes (one light, one dark) allowed.</p>
      )}
    </div>
  )
}


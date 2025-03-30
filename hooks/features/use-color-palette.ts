"use client"

import { useState, useEffect } from "react"
import type { ThemePalette } from "@/types/mkdocs-config"

export function useColorPalette(
  initialPalettes: ThemePalette[],
  initialAutomaticMode: boolean,
  onChange: (palettes: ThemePalette[], automaticMode: boolean) => void,
) {
  const [palettes, setPalettes] = useState<ThemePalette[]>(initialPalettes)
  const [automaticMode, setAutomaticMode] = useState<boolean>(initialAutomaticMode)

  // Effect to ensure automatic mode is turned off when there aren't two palettes
  useEffect(() => {
    // If automatic mode is enabled but we don't have exactly 2 palettes, turn it off
    if (automaticMode && palettes.length !== 2) {
      setAutomaticMode(false)
      onChange(palettes, false)
    }

    // If automatic mode is enabled but system preferences are not enabled, turn it off
    if (automaticMode && !isSystemPreferencesEnabled()) {
      setAutomaticMode(false)
      onChange(palettes, false)
    }
  }, [palettes, automaticMode, onChange])

  const updatePalettes = (newPalettes: ThemePalette[]) => {
    // If we're going from 2 palettes to 1, turn off automatic mode
    const isReducingPalettes = palettes.length === 2 && newPalettes.length === 1

    if (isReducingPalettes) {
      setAutomaticMode(false)
    }

    setPalettes(newPalettes)
    onChange(newPalettes, isReducingPalettes ? false : automaticMode)
  }

  const updatePalette = (index: number, palette: ThemePalette) => {
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
    updatePalettes(newPalettes)
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

    const newPalette: ThemePalette = {
      scheme: newScheme,
      primary: "indigo",
      accent: "indigo",
      toggle: {
        icon: newIcon,
        name: newName,
      },
    }

    updatePalettes([...palettes, newPalette])
  }

  const removePalette = (index: number) => {
    // If we're going from 2 palettes to 1, first turn off automatic mode
    if (palettes.length === 2) {
      // Explicitly turn off automatic mode first
      setAutomaticMode(false)

      const remainingIndex = index === 0 ? 1 : 0
      const remainingPalette = { ...palettes[remainingIndex] }

      // Remove media query as it doesn't make sense for a single palette
      if (remainingPalette.media) {
        delete remainingPalette.media
      }

      // Then handle system preferences
      if (isSystemPreferencesEnabled()) {
        // Remove media queries from both palettes
        const updatedPalettes = palettes.map((palette) => {
          const newPalette = { ...palette }
          if (newPalette.media) {
            delete newPalette.media
          }
          return newPalette
        })

        // Remove the palette at the specified index
        updatedPalettes.splice(index, 1)

        // Update the remaining palette
        setPalettes([updatedPalettes[0]])
        onChange([updatedPalettes[0]], false) // Pass false for automaticMode
      } else {
        // Remove the palette at the specified index
        const newPalettes = [...palettes]
        newPalettes.splice(index, 1)

        // Update the remaining palette
        setPalettes([remainingPalette])
        onChange([remainingPalette], false) // Pass false for automaticMode
      }
    } else {
      // Just remove the palette
      const newPalettes = [...palettes]
      newPalettes.splice(index, 1)
      updatePalettes(newPalettes)
    }
  }

  // Check if system preferences are enabled
  const isSystemPreferencesEnabled = (): boolean => {
    if (palettes.length !== 2) return false
    return palettes.some((p) => p.media && p.media.includes("prefers-color-scheme"))
  }

  // Toggle system preferences
  const toggleSystemPreferences = (enabled: boolean) => {
    if (palettes.length !== 2) return

    // If turning off system preferences, also turn off automatic mode
    if (!enabled && automaticMode) {
      setAutomaticMode(false)
    }

    // Find light and dark palettes
    const lightPalette = palettes.find((p) => p.scheme === "default" || !p.scheme)
    const darkPalette = palettes.find((p) => p.scheme === "slate")

    if (!lightPalette || !darkPalette) return

    const newPalettes = [...palettes]

    if (enabled) {
      // Add media queries
      const lightIndex = palettes.findIndex((p) => p.scheme === "default" || !p.scheme)
      const darkIndex = palettes.findIndex((p) => p.scheme === "slate")

      if (lightIndex !== -1) {
        newPalettes[lightIndex] = {
          ...newPalettes[lightIndex],
          media: "(prefers-color-scheme: light)",
        }
      }

      if (darkIndex !== -1) {
        newPalettes[darkIndex] = {
          ...newPalettes[darkIndex],
          media: "(prefers-color-scheme: dark)",
        }
      }
    } else {
      // Remove media queries
      newPalettes.forEach((palette, index) => {
        if (palette.media) {
          newPalettes[index] = { ...palette }
          delete newPalettes[index].media
        }
      })
    }

    updatePalettes(newPalettes)
  }

  // Toggle automatic mode
  const toggleAutomaticMode = (enabled: boolean) => {
    setAutomaticMode(enabled)

    // If enabling automatic mode, ensure system preferences are enabled
    if (enabled && !isSystemPreferencesEnabled()) {
      toggleSystemPreferences(true)
    }

    onChange(palettes, enabled)
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

  return {
    palettes,
    automaticMode,
    updatePalette,
    addPalette,
    removePalette,
    isSystemPreferencesEnabled,
    toggleSystemPreferences,
    toggleAutomaticMode,
    hasBothSchemes,
    canAddPalette,
  }
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorPaletteConfig } from "@/components/features/color-palette/color-palette-config"
import type { MkDocsConfig, ThemePalette } from "@/types/mkdocs-config"

interface AppearanceColorsSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function AppearanceColorsSection({ config, onChange }: AppearanceColorsSectionProps) {
  const getPalettes = (): ThemePalette[] => {
    if (!config.theme.palette) {
      return []
    }
    return Array.isArray(config.theme.palette) ? config.theme.palette : [config.theme.palette]
  }

  const handlePaletteChange = (palettes: ThemePalette[]) => {
    // If we're going from 2 palettes to fewer, turn off automatic mode
    if (getPalettes().length === 2 && palettes.length < 2 && config.theme.automaticMode) {
      onChange({
        ...config,
        theme: {
          ...config.theme,
          palette: palettes.length > 0 ? (palettes.length === 1 ? palettes[0] : palettes) : undefined,
          automaticMode: false, // Turn off automatic mode
        },
      })
    } else {
      onChange({
        ...config,
        theme: {
          ...config.theme,
          palette: palettes.length > 0 ? (palettes.length === 1 ? palettes[0] : palettes) : undefined,
        },
      })
    }
  }

  const handleAutomaticModeChange = (enabled: boolean) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        automaticMode: enabled,
      },
    })
  }

  const handleSystemPreferencesChange = (enabled: boolean) => {
    const palettes = getPalettes()
    if (palettes.length !== 2) return

    // If turning off system preferences, also turn off automatic mode
    if (!enabled && config.theme.automaticMode) {
      handleAutomaticModeChange(false)
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

    handlePaletteChange(newPalettes)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Palettes</CardTitle>
        <CardDescription>Configure the color palettes for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <ColorPaletteConfig
          palettes={getPalettes()}
          onChange={handlePaletteChange}
          onAutomaticModeChange={handleAutomaticModeChange}
          onSystemPreferencesChange={handleSystemPreferencesChange}
          automaticMode={!!config.theme.automaticMode}
        />
      </CardContent>
    </Card>
  )
}


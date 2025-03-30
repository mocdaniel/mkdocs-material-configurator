"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FontConfig } from "@/components/features/font-config/font-config"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface AppearanceFontsSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function AppearanceFontsSection({ config, onChange }: AppearanceFontsSectionProps) {
  const isFontEnabled = config.theme.font !== false
  const fontConfig = typeof config.theme.font === "object" ? config.theme.font : {}

  const handleFontEnabledChange = (enabled: boolean) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        font: enabled ? fontConfig || {} : false,
      },
    })
  }

  const handleFontChange = (textFont: string | undefined, codeFont: string | undefined) => {
    if (!isFontEnabled) return

    onChange({
      ...config,
      theme: {
        ...config.theme,
        font: {
          ...(typeof config.theme.font === "object" ? config.theme.font : {}),
          text: textFont,
          code: codeFont,
        },
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fonts</CardTitle>
        <CardDescription>Configure the fonts for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <FontConfig
          fontEnabled={isFontEnabled}
          textFont={isFontEnabled && fontConfig.text}
          codeFont={isFontEnabled && fontConfig.code}
          onFontEnabledChange={handleFontEnabledChange}
          onChange={handleFontChange}
        />
      </CardContent>
    </Card>
  )
}


"use client"

import { useEffect } from "react"
import { FontPicker } from "./font-picker"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { FontConfigProps } from "@/types/features/font-config"
import { getFontUrl } from "@/utils/features/font-utils"

export function FontConfig({ fontEnabled, textFont, codeFont, onFontEnabledChange, onChange }: FontConfigProps) {
  // Load the selected fonts
  useEffect(() => {
    if (!fontEnabled) return

    const links: HTMLLinkElement[] = []

    if (textFont) {
      const textFontLink = document.createElement("link")
      textFontLink.href = getFontUrl(textFont)
      textFontLink.rel = "stylesheet"
      document.head.appendChild(textFontLink)
      links.push(textFontLink)
    }

    if (codeFont) {
      const codeFontLink = document.createElement("link")
      codeFontLink.href = getFontUrl(codeFont)
      codeFontLink.rel = "stylesheet"
      document.head.appendChild(codeFontLink)
      links.push(codeFontLink)
    }

    return () => {
      links.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      })
    }
  }, [fontEnabled, textFont, codeFont])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="font-loading">Enable Font Loading</Label>
          <p className="text-sm text-muted-foreground">When disabled, MkDocs will use the system default fonts</p>
        </div>
        <Switch id="font-loading" checked={fontEnabled} onCheckedChange={onFontEnabledChange} />
      </div>

      <FontPicker
        value={textFont}
        onChange={(value) => onChange(value, codeFont)}
        label="Text Font"
        description="Select a font for regular text content"
        placeholder="Select text font (default: Roboto)"
        disabled={!fontEnabled}
        disabledTooltip="Enable font loading to select a text font"
      />

      <FontPicker
        value={codeFont}
        onChange={(value) => onChange(textFont, value)}
        label="Code Font"
        description="Select a font for code blocks and monospaced content"
        placeholder="Select code font (default: Roboto Mono)"
        disabled={!fontEnabled}
        disabledTooltip="Enable font loading to select a code font"
      />
    </div>
  )
}


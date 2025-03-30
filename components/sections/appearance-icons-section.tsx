"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconConfig } from "@/components/features/icon-config/icon-config"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface AppearanceIconsSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function AppearanceIconsSection({ config, onChange }: AppearanceIconsSectionProps) {
  const handleIconsChange = (icons: Record<string, string | undefined>) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        icon: Object.keys(icons).length > 0 ? icons : undefined,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Icons</CardTitle>
        <CardDescription>Configure custom icons for different parts of your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <IconConfig icons={config.theme.icon || {}} onChange={handleIconsChange} />
      </CardContent>
    </Card>
  )
}


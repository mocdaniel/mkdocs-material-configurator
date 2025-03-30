"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface AdvancedSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function AdvancedSection({ config, onChange }: AdvancedSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Configure advanced settings for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Advanced configuration will be added in the next iteration.</p>
      </CardContent>
    </Card>
  )
}


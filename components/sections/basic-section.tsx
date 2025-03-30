"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface BasicSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function BasicSection({ config, onChange }: BasicSectionProps) {
  const handleSiteNameChange = (value: string) => {
    onChange({
      ...config,
      site_name: value,
    })
  }

  const handleSiteUrlChange = (value: string) => {
    onChange({
      ...config,
      site_url: value || undefined,
    })
  }

  const handleLogoChange = (value: string) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        logo: value || undefined,
      },
    })
  }

  const handleFaviconChange = (value: string) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        favicon: value || undefined,
      },
    })
  }

  const handleHomepageChange = (value: string) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update or remove the homepage
    if (value) {
      newExtra.homepage = value
    } else {
      // If there's no value, remove the homepage property
      if (newExtra.homepage) {
        delete newExtra.homepage
      }
    }

    // Update the config with the new extra object
    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Configuration</CardTitle>
        <CardDescription>Configure the basic settings for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input id="site_name" value={config.site_name} onChange={(e) => handleSiteNameChange(e.target.value)} />
            <p className="text-xs text-muted-foreground">The name of your documentation site</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_url">Site URL</Label>
            <Input
              id="site_url"
              value={config.site_url || ""}
              onChange={(e) => handleSiteUrlChange(e.target.value)}
              placeholder="e.g., https://example.com"
            />
            <p className="text-xs text-muted-foreground">
              The URL where your documentation will be hosted (required for some navigation features)
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              value={config.theme.logo || ""}
              onChange={(e) => handleLogoChange(e.target.value)}
              placeholder="e.g., assets/logo.png"
            />
            <p className="text-xs text-muted-foreground">Path to your logo image (relative to docs directory)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="homepage">Logo Link</Label>
            <Input
              id="homepage"
              value={config.extra?.homepage || ""}
              onChange={(e) => handleHomepageChange(e.target.value)}
              placeholder="e.g., https://example.com"
            />
            <p className="text-xs text-muted-foreground">
              Where the logo links to (default is the documentation home page)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon</Label>
            <Input
              id="favicon"
              value={config.theme.favicon || ""}
              onChange={(e) => handleFaviconChange(e.target.value)}
              placeholder="e.g., assets/favicon.ico"
            />
            <p className="text-xs text-muted-foreground">Path to your favicon (relative to docs directory)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


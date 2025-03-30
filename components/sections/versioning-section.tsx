"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, ExternalLink } from "lucide-react"
import type { MkDocsConfig } from "@/types/mkdocs-config"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VersioningSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function VersioningSection({ config, onChange }: VersioningSectionProps) {
  // Check if versioning is enabled
  const isVersioningEnabled = !!config.extra?.version

  // Get versioning configuration
  const versionConfig = config.extra?.version || {}

  // Toggle versioning
  const toggleVersioning = (enabled: boolean) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    if (enabled) {
      // Enable versioning with default values
      newExtra.version = {
        provider: "mike",
        alias: true,
      }
    } else {
      // Remove versioning if disabled
      if (newExtra.version) {
        delete newExtra.version
      }
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Update versioning configuration
  const updateVersionConfig = (key: string, value: any) => {
    if (!isVersioningEnabled) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update versioning configuration
    newExtra.version = {
      ...newExtra.version,
      [key]: value,
    }

    // If default is empty string, remove it
    if (key === "default" && value === "") {
      delete newExtra.version.default
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versioning</CardTitle>
        <CardDescription>Configure versioning for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="versioning-enabled">Enable Versioning</Label>
            <p className="text-sm text-muted-foreground">Add versioning functionality to your documentation site</p>
          </div>
          <Switch id="versioning-enabled" checked={isVersioningEnabled} onCheckedChange={toggleVersioning} />
        </div>

        {isVersioningEnabled && (
          <>
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>This feature uses the 3rd party tool mike for versioning.</span>
                <Button variant="link" className="h-auto p-0" asChild>
                  <a
                    href="https://github.com/jimporter/mike"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm"
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="version-provider">Provider</Label>
                <Select
                  value={versionConfig.provider || "mike"}
                  onValueChange={(value) => updateVersionConfig("provider", value)}
                >
                  <SelectTrigger id="version-provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mike">mike</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The versioning provider to use (currently only mike is supported)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="version-alias">Enable Version Aliases</Label>
                  <p className="text-sm text-muted-foreground">Allow version aliases like "latest" or "stable"</p>
                </div>
                <Switch
                  id="version-alias"
                  checked={versionConfig.alias !== false}
                  onCheckedChange={(checked) => updateVersionConfig("alias", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version-default">Default Version</Label>
                <Input
                  id="version-default"
                  value={versionConfig.default || ""}
                  onChange={(e) => updateVersionConfig("default", e.target.value)}
                  placeholder="e.g., stable, latest"
                />
                <p className="text-xs text-muted-foreground">The default version alias to display (optional)</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}


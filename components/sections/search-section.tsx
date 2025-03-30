"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon, InfoIcon } from "lucide-react"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface SearchSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function SearchSection({ config, onChange }: SearchSectionProps) {
  // Check if search plugin is explicitly disabled
  const isSearchPluginDisabled = config.plugins?.some((plugin) => {
    if (typeof plugin === "object" && "search" in plugin) {
      return plugin.search === false
    }
    return false
  })

  // Search is enabled by default unless explicitly disabled
  const isSearchPluginEnabled = !isSearchPluginDisabled

  // Get search features from config
  const getSearchFeatures = (): string[] => {
    return (config.theme.features || []).filter((feature) => feature.startsWith("search."))
  }

  const searchFeatures = getSearchFeatures()

  // Toggle search plugin
  const handleSearchPluginToggle = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    if (enabled) {
      // If enabling search, remove any explicit disabling of search
      newPlugins = newPlugins.filter((plugin) => {
        if (typeof plugin === "object" && "search" in plugin) {
          return false // Remove search configuration
        }
        return true
      })

      // If there are other plugins, add search explicitly to maintain it
      if (newPlugins.length > 0 && !newPlugins.includes("search")) {
        newPlugins.push("search")
      }
    } else {
      // If disabling search, add explicit search: false
      // First remove any existing search configuration
      newPlugins = newPlugins.filter((plugin) => {
        if (typeof plugin === "string" && plugin === "search") {
          return false
        }
        if (typeof plugin === "object" && "search" in plugin) {
          return false
        }
        return true
      })

      // Then add search: false
      newPlugins.push({ search: false })
    }

    onChange({
      ...config,
      plugins: newPlugins.length > 0 ? newPlugins : undefined,
    })
  }

  // Toggle search feature
  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    let newFeatures = [...(config.theme.features || [])]

    if (enabled) {
      // Add the feature if not already present
      if (!newFeatures.includes(featureId)) {
        newFeatures.push(featureId)
      }
    } else {
      // Remove the feature
      newFeatures = newFeatures.filter((feature) => feature !== featureId)
    }

    onChange({
      ...config,
      theme: {
        ...config.theme,
        features: newFeatures.length > 0 ? newFeatures : undefined,
      },
    })
  }

  // Define search features
  const searchFeatureOptions = [
    {
      id: "search.suggest",
      name: "Search Suggestions",
      description: "Display search suggestions below the search bar as you type",
    },
    {
      id: "search.highlight",
      name: "Search Highlighting",
      description: "Highlight search terms in the search results",
    },
    {
      id: "search.share",
      name: "Search Sharing",
      description: "Allow sharing search results via a direct link",
    },
  ]

  // Check if other plugins are explicitly configured
  const hasOtherPlugins =
    config.plugins &&
    config.plugins.some((plugin) => {
      if (typeof plugin === "string") {
        return plugin !== "search"
      }
      if (typeof plugin === "object") {
        return !("search" in plugin)
      }
      return false
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search</CardTitle>
        <CardDescription>Configure search functionality for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="search-plugin">Enable Search</Label>
            <p className="text-sm text-muted-foreground">Add search functionality to your documentation site</p>
          </div>
          <Switch id="search-plugin" checked={isSearchPluginEnabled} onCheckedChange={handleSearchPluginToggle} />
        </div>

        {isSearchPluginEnabled && hasOtherPlugins && (
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Search is enabled by default</AlertTitle>
            <AlertDescription>
              The search plugin is enabled by default in MkDocs Material. It's explicitly included in your configuration
              because you have other plugins configured.
            </AlertDescription>
          </Alert>
        )}

        {!isSearchPluginEnabled && (
          <Alert variant="warning">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Search is disabled</AlertTitle>
            <AlertDescription>Enable search to configure additional search features.</AlertDescription>
          </Alert>
        )}

        {isSearchPluginEnabled && (
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Search Features</h3>
            {searchFeatureOptions.map((feature) => (
              <div key={feature.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={feature.id} className="font-medium">
                      {feature.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch
                    id={feature.id}
                    checked={searchFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                    disabled={!isSearchPluginEnabled}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


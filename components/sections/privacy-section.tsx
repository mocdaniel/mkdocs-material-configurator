"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrivacyPluginConfig } from "@/components/features/privacy/privacy-plugin-config"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface PrivacySectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function PrivacySection({ config, onChange }: PrivacySectionProps) {
  // Get the privacy plugin configuration or use defaults
  const getPrivacyPluginConfig = () => {
    const plugins = config.plugins || []

    // Find the privacy plugin configuration
    for (const plugin of plugins) {
      if (typeof plugin === "object" && "privacy" in plugin) {
        return plugin.privacy
      }
    }

    // Return default configuration if not found
    return {
      enabled: true,
      concurrency: 1,
      cache: true,
      cache_dir: ".cache/plugin/privacy",
      assets: true,
      assets_fetch_dir: "assets/external",
    }
  }

  const privacyPluginConfig = getPrivacyPluginConfig()

  const handlePrivacyPluginChange = (newConfig: any) => {
    // Create a new plugins array
    const newPlugins = [...(config.plugins || [])]

    // Find the privacy plugin index
    const privacyPluginIndex = newPlugins.findIndex((plugin) => typeof plugin === "object" && "privacy" in plugin)

    // Always include the plugin in the config, even when disabled
    const pluginConfig = {
      privacy: {
        ...newConfig,
      },
    }

    if (privacyPluginIndex >= 0) {
      newPlugins[privacyPluginIndex] = pluginConfig
    } else {
      newPlugins.push(pluginConfig)
    }

    // Update the config
    onChange({
      ...config,
      plugins: newPlugins.length > 0 ? newPlugins : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Plugin</CardTitle>
        <CardDescription>Configure the privacy plugin for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <PrivacyPluginConfig config={privacyPluginConfig} onChange={handlePrivacyPluginChange} />
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationFeatures } from "@/components/features/navigation/navigation-features"
import { TocFeatures } from "@/components/features/navigation/toc-features"
import { Separator } from "@/components/ui/separator"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface NavigationSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function NavigationSection({ config, onChange }: NavigationSectionProps) {
  // Update the handleFeaturesChange function to preserve non-navigation/TOC features
  const handleFeaturesChange = (features: string[], incompatibleTocFeatures?: string[]) => {
    // If there are incompatible TOC features, remove them
    if (incompatibleTocFeatures && incompatibleTocFeatures.length > 0) {
      const currentTocFeatures = getTocFeatures()
      const updatedTocFeatures = currentTocFeatures.filter((feature) => !incompatibleTocFeatures.includes(feature))

      // Get all features that are not navigation or TOC features (like search features)
      const otherFeatures = (config.theme.features || []).filter(
        (feature) => !feature.startsWith("navigation.") && !feature.startsWith("toc."),
      )

      // Update with all feature types: navigation, TOC, and others (like search)
      const allFeatures = [...features, ...updatedTocFeatures, ...otherFeatures]

      onChange({
        ...config,
        theme: {
          ...config.theme,
          features: allFeatures.length > 0 ? allFeatures : undefined,
        },
      })

      return
    }

    // Get all features that are not navigation or TOC features (like search features)
    const otherFeatures = (config.theme.features || []).filter(
      (feature) => !feature.startsWith("navigation.") && !feature.startsWith("toc."),
    )

    // Update with all feature types: navigation, TOC, and others (like search)
    const updatedFeatures = [...features, ...getTocFeatures(), ...otherFeatures]

    onChange({
      ...config,
      theme: {
        ...config.theme,
        features: updatedFeatures.length > 0 ? updatedFeatures : undefined,
      },
    })
  }

  // Update the handleTocFeaturesChange function to preserve non-navigation/TOC features
  const handleTocFeaturesChange = (tocFeatures: string[], incompatibleNavFeatures?: string[]) => {
    // If there are incompatible navigation features, remove them
    if (incompatibleNavFeatures && incompatibleNavFeatures.length > 0) {
      const currentNavFeatures = getNavigationFeatures()
      const updatedNavFeatures = currentNavFeatures.filter((feature) => !incompatibleNavFeatures.includes(feature))

      // Get all features that are not navigation or TOC features (like search features)
      const otherFeatures = (config.theme.features || []).filter(
        (feature) => !feature.startsWith("navigation.") && !feature.startsWith("toc."),
      )

      // Update with all feature types: navigation, TOC, and others (like search)
      const allFeatures = [...updatedNavFeatures, ...tocFeatures, ...otherFeatures]

      onChange({
        ...config,
        theme: {
          ...config.theme,
          features: allFeatures.length > 0 ? allFeatures : undefined,
        },
      })

      return
    }

    // Get all features that are not navigation or TOC features (like search features)
    const otherFeatures = (config.theme.features || []).filter(
      (feature) => !feature.startsWith("navigation.") && !feature.startsWith("toc."),
    )

    // Update with all feature types: navigation, TOC, and others (like search)
    const updatedFeatures = [...getNavigationFeatures(), ...tocFeatures, ...otherFeatures]

    onChange({
      ...config,
      theme: {
        ...config.theme,
        features: updatedFeatures.length > 0 ? updatedFeatures : undefined,
      },
    })
  }

  // Get navigation features from config
  const getNavigationFeatures = (): string[] => {
    return (config.theme.features || []).filter((feature) => feature.startsWith("navigation."))
  }

  // Get TOC features from config
  const getTocFeatures = (): string[] => {
    return (config.theme.features || []).filter((feature) => feature.startsWith("toc."))
  }

  const hasSiteUrl = !!config.site_url

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
        <CardDescription>Configure the navigation settings for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Navigation Features</h3>
          <NavigationFeatures
            features={getNavigationFeatures()}
            onChange={handleFeaturesChange}
            hasSiteUrl={hasSiteUrl}
            tocFeatures={getTocFeatures()}
          />
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Table of Contents</h3>
          <TocFeatures
            features={getTocFeatures()}
            onChange={handleTocFeaturesChange}
            navigationFeatures={getNavigationFeatures()}
          />
        </div>
      </CardContent>
    </Card>
  )
}


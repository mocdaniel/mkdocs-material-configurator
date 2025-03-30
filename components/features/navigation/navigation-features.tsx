"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavigationFeature {
  id: string
  name: string
  description: string
  incompatibleWith?: string[]
  requiresSiteUrl?: boolean
  dependsOn?: string[]
}

interface NavigationFeaturesProps {
  features: string[]
  onChange: (features: string[]) => void
  hasSiteUrl: boolean
  tocFeatures?: string[]
}

export function NavigationFeatures({ features, onChange, hasSiteUrl, tocFeatures = [] }: NavigationFeaturesProps) {
  const [showWarnings, setShowWarnings] = useState<Record<string, boolean>>({})

  // Define all available navigation features
  const navigationFeatures: NavigationFeature[] = [
    {
      id: "navigation.instant",
      name: "Instant Navigation",
      description: "Make navigation instant by preloading pages",
      requiresSiteUrl: true,
    },
    {
      id: "navigation.instant.progress",
      name: "Instant Navigation Progress",
      description: "Show progress bar during navigation",
      dependsOn: ["navigation.instant"],
    },
    {
      id: "navigation.tracking",
      name: "Navigation Tracking",
      description: "Update URL hash when navigating",
    },
    {
      id: "navigation.tabs",
      name: "Navigation Tabs",
      description: "Render top-level sections as tabs",
    },
    {
      id: "navigation.tabs.sticky",
      name: "Sticky Navigation Tabs",
      description: "Make navigation tabs sticky",
    },
    {
      id: "navigation.sections",
      name: "Navigation Sections",
      description: "Render sections as groups in sidebar",
    },
    {
      id: "navigation.expand",
      name: "Expand Navigation",
      description: "Expand all collapsible sections by default",
      incompatibleWith: ["navigation.prune"],
    },
    {
      id: "navigation.prune",
      name: "Prune Navigation",
      description: "Hide navigation items for pages not in the current section",
      incompatibleWith: ["navigation.expand"],
    },
    {
      id: "navigation.indexes",
      name: "Navigation Indexes",
      description: "Link section index pages to sections",
      incompatibleWith: ["toc.integrate"],
    },
    {
      id: "navigation.top",
      name: "Back to Top Button",
      description: "Add a back-to-top button on each page",
    },
  ]

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    let newFeatures = [...features]

    if (enabled) {
      // Check for incompatibilities
      const feature = navigationFeatures.find((f) => f.id === featureId)
      if (feature?.incompatibleWith) {
        // Remove incompatible features
        newFeatures = newFeatures.filter((f) => !feature.incompatibleWith?.includes(f))

        // Check if this feature is incompatible with any enabled TOC features
        const incompatibleTocFeatures = feature.incompatibleWith.filter((id) => tocFeatures.includes(id))

        if (incompatibleTocFeatures.length > 0) {
          // Notify parent to update TOC features
          onChange(newFeatures, incompatibleTocFeatures)
          return
        }
      }

      // Add the feature
      newFeatures.push(featureId)
    } else {
      // Remove the feature
      newFeatures = newFeatures.filter((f) => f !== featureId)

      // Hide any warnings for this feature
      setShowWarnings((prev) => ({
        ...prev,
        [featureId]: false,
      }))
    }

    onChange(newFeatures)
  }

  const isFeatureEnabled = (featureId: string) => {
    return features.includes(featureId)
  }

  const isFeatureDisabled = (feature: NavigationFeature) => {
    // Check if this feature depends on other features that are not enabled
    if (feature.dependsOn) {
      const missingDependencies = feature.dependsOn.filter((dependencyId) => !features.includes(dependencyId))
      if (missingDependencies.length > 0) {
        return true
      }
    }

    // Check if this feature is incompatible with any enabled features
    if (feature.incompatibleWith) {
      // Check both navigation features and TOC features
      return feature.incompatibleWith.some(
        (incompatibleId) => features.includes(incompatibleId) || tocFeatures.includes(incompatibleId),
      )
    }

    // Check if this feature requires site_url but it's not set
    if (feature.requiresSiteUrl && !hasSiteUrl) {
      return true
    }

    return false
  }

  const getFeatureDisabledReason = (feature: NavigationFeature) => {
    // Check for missing dependencies
    if (feature.dependsOn) {
      const missingDependencies = feature.dependsOn.filter((dependencyId) => !features.includes(dependencyId))
      if (missingDependencies.length > 0) {
        const dependencyNames = missingDependencies.map((id) => navigationFeatures.find((f) => f.id === id)?.name || id)
        return `Requires ${dependencyNames.join(", ")} to be enabled`
      }
    }

    if (feature.incompatibleWith) {
      // Check navigation features
      const enabledIncompatible = feature.incompatibleWith.filter((id) => features.includes(id))

      // Check TOC features
      const enabledIncompatibleToc = feature.incompatibleWith.filter((id) => tocFeatures.includes(id))

      const allIncompatible = [...enabledIncompatible, ...enabledIncompatibleToc]

      if (allIncompatible.length > 0) {
        return `Incompatible with ${allIncompatible.join(", ")}`
      }
    }

    if (feature.requiresSiteUrl && !hasSiteUrl) {
      return "Requires site_url to be set in Basic Configuration"
    }

    return ""
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {navigationFeatures.map((feature) => {
          const isDisabled = isFeatureDisabled(feature)
          const disabledReason = getFeatureDisabledReason(feature)
          const isEnabled = isFeatureEnabled(feature.id)

          return (
            <div key={feature.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={feature.id} className="font-medium">
                      {feature.name}
                    </Label>
                    {isDisabled && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{disabledReason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Switch
                  id={feature.id}
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                  disabled={isDisabled}
                />
              </div>

              {/* Show warning for navigation.instant without site_url */}
              {feature.id === "navigation.instant" && isEnabled && !hasSiteUrl && showWarnings[feature.id] && (
                <Alert variant="warning" className="mt-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Instant navigation requires site_url to be set. Please configure site_url in the Basic Configuration
                    section.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )
        })}
      </div>

      {features.includes("navigation.instant") && !hasSiteUrl && (
        <Alert variant="warning">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Instant navigation requires site_url to be set. Please configure site_url in the Basic Configuration
            section.
          </AlertDescription>
        </Alert>
      )}

      {features.includes("navigation.expand") && features.includes("navigation.prune") && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Incompatible Features</AlertTitle>
          <AlertDescription>
            Navigation Expand and Navigation Prune are incompatible and cannot be used together.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}


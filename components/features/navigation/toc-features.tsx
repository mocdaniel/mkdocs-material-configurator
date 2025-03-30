"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangleIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TocFeature {
  id: string
  name: string
  description: string
  incompatibleWith?: string[]
}

interface TocFeaturesProps {
  features: string[]
  onChange: (features: string[]) => void
  navigationFeatures: string[]
}

export function TocFeatures({ features, onChange, navigationFeatures }: TocFeaturesProps) {
  // Define all available TOC features
  const tocFeatures: TocFeature[] = [
    {
      id: "toc.follow",
      name: "Follow Table of Contents",
      description: "Automatically highlight the current section in the table of contents",
    },
    {
      id: "toc.integrate",
      name: "Integrate Table of Contents",
      description: "Integrate the table of contents into the navigation sidebar",
      incompatibleWith: ["navigation.indexes"],
    },
  ]

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    let newFeatures = [...features]

    if (enabled) {
      // Check for incompatibilities with navigation features
      const feature = tocFeatures.find((f) => f.id === featureId)

      if (feature?.incompatibleWith) {
        // If this feature is incompatible with any enabled navigation features,
        // we need to notify the parent to remove those features
        const incompatibleNavFeatures = feature.incompatibleWith.filter((id) => navigationFeatures.includes(id))

        if (incompatibleNavFeatures.length > 0) {
          // Remove incompatible navigation features
          const updatedNavFeatures = navigationFeatures.filter((f) => !incompatibleNavFeatures.includes(f))

          // Notify parent to update navigation features
          onChange([...newFeatures, featureId], updatedNavFeatures)
          return
        }
      }

      // Add the feature
      newFeatures.push(featureId)
    } else {
      // Remove the feature
      newFeatures = newFeatures.filter((f) => f !== featureId)
    }

    onChange(newFeatures)
  }

  const isFeatureEnabled = (featureId: string) => {
    return features.includes(featureId)
  }

  const isFeatureDisabled = (feature: TocFeature) => {
    // Check if this feature is incompatible with any enabled navigation features
    if (feature.incompatibleWith) {
      return feature.incompatibleWith.some((incompatibleId) => navigationFeatures.includes(incompatibleId))
    }

    return false
  }

  const getFeatureDisabledReason = (feature: TocFeature) => {
    if (feature.incompatibleWith) {
      const enabledIncompatible = feature.incompatibleWith.filter((id) => navigationFeatures.includes(id))
      if (enabledIncompatible.length > 0) {
        return `Incompatible with ${enabledIncompatible.join(", ")} in Navigation Features`
      }
    }

    return ""
  }

  return (
    <div className="space-y-4">
      {tocFeatures.map((feature) => {
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
          </div>
        )
      })}
    </div>
  )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/features/language-config/language-selector"
import { AlternateLanguageConfig } from "@/components/features/language-config/alternate-language-config"
import { Separator } from "@/components/ui/separator"
import type { MkDocsConfig, AlternateLanguage } from "@/types/mkdocs-config"

interface LocalizationSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function LocalizationSection({ config, onChange }: LocalizationSectionProps) {
  const handleLanguageChange = (language: string | undefined) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        language,
      },
    })
  }

  const handleAlternateLanguagesChange = (languages: AlternateLanguage[]) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update or remove the alternate languages
    if (languages && languages.length > 0) {
      newExtra.alternate = [...languages]
    } else {
      // If there are no languages, remove the alternate property
      if (newExtra.alternate) {
        delete newExtra.alternate
      }
    }

    // Update the config with the new extra object
    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Get alternate languages or empty array
  const getAlternateLanguages = (): AlternateLanguage[] => {
    return config.extra?.alternate || []
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localization</CardTitle>
        <CardDescription>Configure language and localization settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <LanguageSelector language={config.theme.language} onChange={handleLanguageChange} />

          <Separator className="my-6" />

          <AlternateLanguageConfig languages={getAlternateLanguages()} onChange={handleAlternateLanguagesChange} />
        </div>
      </CardContent>
    </Card>
  )
}


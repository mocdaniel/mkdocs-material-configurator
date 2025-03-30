"use client"

import type { MkDocsConfig, ThemePalette, AlternateLanguage } from "@/types/mkdocs-config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { ColorPaletteConfig } from "@/components/features/color-palette/color-palette-config"
import { FontConfig } from "@/components/features/font-config/font-config"
import { IconConfig } from "@/components/features/icon-config/icon-config"
import { LanguageSelector } from "@/components/features/language-config/language-selector"
import { AlternateLanguageConfig } from "@/components/features/language-config/alternate-language-config"
import { PrivacyConfig } from "@/components/features/privacy/privacy-config"

export function ConfigurationForm({
  config,
  onChange,
}: {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}) {
  const handleSiteNameChange = (value: string) => {
    onChange({
      ...config,
      site_name: value,
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

  const handleIconsChange = (icons: Record<string, string | undefined>) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        icon: Object.keys(icons).length > 0 ? icons : undefined,
      },
    })
  }

  const getPalettes = (): ThemePalette[] => {
    if (!config.theme.palette) {
      return []
    }
    return Array.isArray(config.theme.palette) ? config.theme.palette : [config.theme.palette]
  }

  const handlePaletteChange = (palettes: ThemePalette[]) => {
    // If we're going from 2 palettes to fewer, turn off automatic mode
    if (getPalettes().length === 2 && palettes.length < 2 && config.theme.automaticMode) {
      onChange({
        ...config,
        theme: {
          ...config.theme,
          palette: palettes.length > 0 ? (palettes.length === 1 ? palettes[0] : palettes) : undefined,
          automaticMode: false, // Turn off automatic mode
        },
      })
    } else {
      onChange({
        ...config,
        theme: {
          ...config.theme,
          palette: palettes.length > 0 ? (palettes.length === 1 ? palettes[0] : palettes) : undefined,
        },
      })
    }
  }

  const handleAutomaticModeChange = (enabled: boolean) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        automaticMode: enabled,
      },
    })
  }

  const handleSystemPreferencesChange = (enabled: boolean) => {
    const palettes = getPalettes()
    if (palettes.length !== 2) return

    // If turning off system preferences, also turn off automatic mode
    if (!enabled && config.theme.automaticMode) {
      handleAutomaticModeChange(false)
    }

    // Find light and dark palettes
    const lightPalette = palettes.find((p) => p.scheme === "default" || !p.scheme)
    const darkPalette = palettes.find((p) => p.scheme === "slate")

    if (!lightPalette || !darkPalette) return

    const newPalettes = [...palettes]

    if (enabled) {
      // Add media queries
      const lightIndex = palettes.findIndex((p) => p.scheme === "default" || !p.scheme)
      const darkIndex = palettes.findIndex((p) => p.scheme === "slate")

      if (lightIndex !== -1) {
        newPalettes[lightIndex] = {
          ...newPalettes[lightIndex],
          media: "(prefers-color-scheme: light)",
        }
      }

      if (darkIndex !== -1) {
        newPalettes[darkIndex] = {
          ...newPalettes[darkIndex],
          media: "(prefers-color-scheme: dark)",
        }
      }
    } else {
      // Remove media queries
      newPalettes.forEach((palette, index) => {
        if (palette.media) {
          newPalettes[index] = { ...palette }
          delete newPalettes[index].media
        }
      })
    }

    handlePaletteChange(newPalettes)
  }

  const isFontEnabled = config.theme.font !== false
  const fontConfig = typeof config.theme.font === "object" ? config.theme.font : {}

  const handleFontEnabledChange = (enabled: boolean) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        font: enabled ? fontConfig || {} : false,
      },
    })
  }

  const handleFontChange = (textFont: string | undefined, codeFont: string | undefined) => {
    if (!isFontEnabled) return

    onChange({
      ...config,
      theme: {
        ...config.theme,
        font: {
          ...(typeof config.theme.font === "object" ? config.theme.font : {}),
          text: textFont,
          code: codeFont,
        },
      },
    })
  }

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

  // Cookie consent configuration
  const isConsentEnabled = !!config.extra?.consent
  const consentTitle = config.extra?.consent?.title
  const consentDescription = config.extra?.consent?.description
  const consentCookies = config.extra?.consent?.cookies

  const handleConsentChange = (
    enabled: boolean,
    title: string | undefined,
    description: string | undefined,
    actions?: string[],
    cookies?: Record<string, { name: string; checked?: boolean }>,
  ) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update or remove the consent configuration
    if (enabled) {
      // Always create the consent object when enabled, even if title and description are empty
      newExtra.consent = {
        ...(newExtra.consent || {}),
        title: title || "Cookie consent",
        description: description || "We use cookies to recognize your repeated visits and preferences.",
      }

      // Add actions if they exist
      if (actions && actions.length > 0) {
        newExtra.consent.actions = [...actions]
      } else if (newExtra.consent.actions) {
        // Remove actions if they're empty
        delete newExtra.consent.actions
      }

      // Initialize default cookies if none exist
      if (!cookies || Object.keys(cookies).length === 0) {
        newExtra.consent.cookies = {
          analytics: {
            name: "Google Analytics",
            checked: true,
          },
          github: {
            name: "GitHub",
            checked: true,
          },
        }
      } else {
        // Add cookies if they exist
        newExtra.consent.cookies = cookies
      }
    } else {
      // If consent is disabled, remove the consent property
      if (newExtra.consent) {
        delete newExtra.consent
      }
    }

    // Update the config with the new extra object
    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  return (
    <div className="space-y-6">
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

      <Tabs defaultValue="appearance">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Configure the appearance of your MkDocs site</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full" defaultValue={["colors", "fonts", "icons"]}>
                <AccordionItem value="colors">
                  <AccordionTrigger>Color Palettes</AccordionTrigger>
                  <AccordionContent>
                    <ColorPaletteConfig
                      palettes={getPalettes()}
                      onChange={handlePaletteChange}
                      onAutomaticModeChange={handleAutomaticModeChange}
                      onSystemPreferencesChange={handleSystemPreferencesChange}
                      automaticMode={!!config.theme.automaticMode}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fonts">
                  <AccordionTrigger>Fonts</AccordionTrigger>
                  <AccordionContent>
                    <FontConfig
                      fontEnabled={isFontEnabled}
                      textFont={isFontEnabled && fontConfig.text}
                      codeFont={isFontEnabled && fontConfig.code}
                      onFontEnabledChange={handleFontEnabledChange}
                      onChange={handleFontChange}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="icons">
                  <AccordionTrigger>Icons</AccordionTrigger>
                  <AccordionContent>
                    <IconConfig icons={config.theme.icon || {}} onChange={handleIconsChange} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Configure language and localization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <LanguageSelector language={config.theme.language} onChange={handleLanguageChange} />

                <Separator className="my-6" />

                <AlternateLanguageConfig
                  languages={getAlternateLanguages()}
                  onChange={handleAlternateLanguagesChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>Configure the navigation settings for your MkDocs site</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigation configuration will be added in the next iteration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Configure privacy-related settings for your MkDocs site</CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacyConfig
                consent={{
                  enabled: isConsentEnabled,
                  title: consentTitle,
                  description: consentDescription,
                  cookies: consentCookies,
                }}
                onConsentChange={handleConsentChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced settings for your MkDocs site</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced configuration will be added in the next iteration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


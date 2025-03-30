"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CookieConsent } from "@/components/features/privacy/cookie-consent"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface CookieConsentSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function CookieConsentSection({ config, onChange }: CookieConsentSectionProps) {
  // Cookie consent configuration
  const isConsentEnabled = !!config.extra?.consent
  const consentTitle = config.extra?.consent?.title
  const consentDescription = config.extra?.consent?.description
  const consentActions = config.extra?.consent?.actions
  const consentCookies = config.extra?.consent?.cookies
  const cookieSettingsText = config.copyright?.includes("#__consent")
    ? config.copyright.match(/a href="#__consent">(.*?)<\/a>/)?.[1]
    : "Change cookie settings"

  const handleConsentChange = (
    enabled: boolean,
    title: string | undefined,
    description: string | undefined,
    actions?: string[],
    cookies?: Record<string, { name: string; checked?: boolean }>,
    cookieSettingsText?: string,
  ) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}
    const currentYear = new Date().getFullYear()

    // Update or remove the consent configuration
    if (enabled) {
      // Always create the consent object when enabled, even if title and description are empty
      newExtra.consent = {
        ...(newExtra.consent || {}),
        // Only use default values if title/description are undefined, not if they're empty strings
        title: title === undefined ? "Cookie consent" : title,
        description:
          description === undefined ? "We use cookies to recognize your repeated visits and preferences." : description,
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

      // Add copyright with cookie settings link
      const linkText = cookieSettingsText || "Change cookie settings"
      onChange({
        ...config,
        extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
        copyright: `Copyright &copy; ${currentYear} - <a href="#__consent">${linkText}</a>`,
      })
    } else {
      // If consent is disabled, remove the consent property
      if (newExtra.consent) {
        delete newExtra.consent
      }

      // Remove copyright if it contains the cookie settings link
      const updatedConfig = {
        ...config,
        extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
      }

      if (config.copyright?.includes("#__consent")) {
        delete updatedConfig.copyright
      }

      onChange(updatedConfig)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Consent</CardTitle>
        <CardDescription>Configure cookie consent banner and settings for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent>
        <CookieConsent
          enabled={isConsentEnabled}
          title={consentTitle}
          description={consentDescription}
          actions={consentActions}
          cookies={consentCookies}
          cookieSettingsText={cookieSettingsText}
          onEnabledChange={(enabled) =>
            handleConsentChange(
              enabled,
              consentTitle,
              consentDescription,
              consentActions,
              consentCookies,
              cookieSettingsText,
            )
          }
          onChange={(title, description, actions, cookies, newCookieSettingsText) =>
            handleConsentChange(isConsentEnabled, title, description, actions, cookies, newCookieSettingsText)
          }
        />
      </CardContent>
    </Card>
  )
}


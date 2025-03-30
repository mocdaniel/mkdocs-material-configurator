"use client"

import { CookieConsent } from "./cookie-consent"

interface PrivacyConfigProps {
  consent: {
    enabled: boolean
    title: string | undefined
    description: string | undefined
    actions?: string[]
    cookies?: Record<string, { name: string; checked?: boolean }>
  }
  cookieSettingsText?: string
  onConsentChange: (
    enabled: boolean,
    title: string | undefined,
    description: string | undefined,
    actions?: string[],
    cookies?: Record<string, { name: string; checked?: boolean }>,
    cookieSettingsText?: string,
  ) => void
}

export function PrivacyConfig({ consent, cookieSettingsText, onConsentChange }: PrivacyConfigProps) {
  const handleConsentEnabledChange = (enabled: boolean) => {
    // If enabling consent, initialize with default values if none exist
    if (enabled && (!consent.cookies || Object.keys(consent.cookies || {}).length === 0)) {
      onConsentChange(
        enabled,
        consent.title || "Cookie consent",
        consent.description || "We use cookies to recognize your repeated visits and preferences.",
        consent.actions && consent.actions.length > 0 ? consent.actions : ["accept", "manage"],
        {
          analytics: {
            name: "Google Analytics",
            checked: true,
          },
          github: {
            name: "GitHub",
            checked: true,
          },
        },
        cookieSettingsText || "Change cookie settings",
      )
    } else {
      onConsentChange(enabled, consent.title, consent.description, consent.actions, consent.cookies, cookieSettingsText)
    }
  }

  const handleConsentChange = (
    title: string | undefined,
    description: string | undefined,
    actions: string[] | undefined,
    cookies?: Record<string, { name: string; checked?: boolean }>,
    newCookieSettingsText?: string,
  ) => {
    onConsentChange(consent.enabled, title, description, actions, cookies, newCookieSettingsText || cookieSettingsText)
  }

  return (
    <div className="space-y-6">
      <CookieConsent
        enabled={consent.enabled}
        title={consent.title}
        description={consent.description}
        actions={consent.actions}
        cookies={consent.cookies}
        cookieSettingsText={cookieSettingsText}
        onEnabledChange={handleConsentEnabledChange}
        onChange={handleConsentChange}
      />
    </div>
  )
}


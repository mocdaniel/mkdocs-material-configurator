"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { CookieItemForm, type CookieItem } from "./cookie-item"
import { ConsentActions } from "./consent-actions"

interface CookieConsentProps {
  enabled: boolean
  title: string | undefined
  description: string | undefined
  actions: string[] | undefined
  cookies: Record<string, { name: string; checked?: boolean }> | undefined
  cookieSettingsText: string | undefined
  onEnabledChange: (enabled: boolean) => void
  onChange: (
    title: string | undefined,
    description: string | undefined,
    actions: string[] | undefined,
    cookies: Record<string, { name: string; checked?: boolean }> | undefined,
    cookieSettingsText: string | undefined,
  ) => void
}

export function CookieConsent({
  enabled,
  title,
  description,
  actions = [],
  cookies = {},
  cookieSettingsText,
  onEnabledChange,
  onChange,
}: CookieConsentProps) {
  const [newCookieId, setNewCookieId] = useState("")
  const [showNewCookieForm, setShowNewCookieForm] = useState(false)

  // Initialize default cookies and actions if none exist when enabled
  useEffect(() => {
    if (enabled && (!cookies || Object.keys(cookies).length === 0)) {
      onChange(
        title || "Cookie consent",
        description || "We use cookies to recognize your repeated visits and preferences.",
        actions && actions.length > 0 ? actions : ["accept", "manage"],
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
        cookieSettingsText,
      )
    }
  }, [enabled, cookies, actions, onChange, title, description, cookieSettingsText])

  const handleTitleChange = (value: string) => {
    // Pass the exact value, even if it's an empty string
    onChange(value, description, actions, cookies, cookieSettingsText)
  }

  const handleDescriptionChange = (value: string) => {
    // Pass the exact value, even if it's an empty string
    onChange(title, value, actions, cookies, cookieSettingsText)
  }

  const handleActionsChange = (newActions: string[]) => {
    onChange(title, description, newActions, cookies, cookieSettingsText)
  }

  // Convert cookies object to array for easier manipulation
  const cookieItems: CookieItem[] = Object.entries(cookies || {}).map(([id, cookie]) => ({
    id,
    name: cookie.name,
    checked: cookie.checked !== undefined ? cookie.checked : true, // Default to true if not specified
    isBuiltin: id === "analytics" || id === "github",
  }))

  // Add built-in cookies if they don't exist
  if (enabled) {
    if (!cookieItems.some((c) => c.id === "analytics")) {
      cookieItems.push({
        id: "analytics",
        name: "Google Analytics",
        checked: true,
        isBuiltin: true,
      })
    }
    if (!cookieItems.some((c) => c.id === "github")) {
      cookieItems.push({
        id: "github",
        name: "GitHub",
        checked: true,
        isBuiltin: true,
      })
    }
  }

  const handleCookieChange = (updatedCookie: CookieItem) => {
    const newCookies = { ...(cookies || {}) }
    newCookies[updatedCookie.id] = {
      name: updatedCookie.name,
      checked: updatedCookie.checked,
    }
    onChange(title, description, actions, newCookies, cookieSettingsText)
  }

  const handleCookieDelete = (id: string) => {
    const newCookies = { ...cookies }
    delete newCookies[id]
    onChange(
      title,
      description,
      actions,
      Object.keys(newCookies).length > 0 ? newCookies : undefined,
      cookieSettingsText,
    )
  }

  const handleAddCookie = () => {
    if (!newCookieId.trim()) return

    const newCookie: CookieItem = {
      id: newCookieId.trim(),
      name: newCookieId.trim(),
      checked: false,
    }

    const newCookies = { ...cookies }
    newCookies[newCookie.id] = {
      name: newCookie.name,
      checked: newCookie.checked,
    }

    onChange(title, description, actions, newCookies, cookieSettingsText)
    setNewCookieId("")
    setShowNewCookieForm(false)
  }

  const handleCookieSettingsTextChange = (value: string) => {
    // Pass the exact value, even if it's an empty string
    onChange(title, description, actions, cookies, value)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cookie Consent</CardTitle>
            <CardDescription>Configure the cookie consent banner for your MkDocs site</CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cookie-title">Title</Label>
              <Input
                id="cookie-title"
                value={title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Cookie consent"
                disabled={!enabled}
              />
              <p className="text-xs text-muted-foreground">The title of the cookie consent banner</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookie-description">Description</Label>
              <Textarea
                id="cookie-description"
                value={description || ""}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe how cookies are used on your site..."
                disabled={!enabled}
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                The description of how cookies are used on your site. Markdown is supported.
              </p>
            </div>

            <Separator className="my-6" />

            <ConsentActions actions={actions || []} onChange={handleActionsChange} />

            <Separator className="my-6" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Cookies</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCookieForm(true)}
                  disabled={showNewCookieForm}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Cookie
                </Button>
              </div>

              {showNewCookieForm && (
                <div className="mb-4 p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Add New Cookie</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-cookie-id">Cookie ID</Label>
                      <Input
                        id="new-cookie-id"
                        value={newCookieId}
                        onChange={(e) => setNewCookieId(e.target.value)}
                        placeholder="e.g., facebook, twitter, custom_analytics"
                      />
                      <p className="text-xs text-muted-foreground">
                        A unique identifier for this cookie (no spaces or special characters)
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewCookieForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCookie} disabled={!newCookieId.trim()}>
                        Add Cookie
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {cookieItems.length > 0 ? (
                <div className="space-y-4">
                  {cookieItems.map((cookie) => (
                    <CookieItemForm
                      key={cookie.id}
                      cookie={cookie}
                      onChange={handleCookieChange}
                      onDelete={!cookie.isBuiltin ? () => handleCookieDelete(cookie.id) : undefined}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No cookies configured yet.</p>
              )}
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="cookie-settings-text">Cookie Settings Link Text</Label>
              <Input
                id="cookie-settings-text"
                value={cookieSettingsText || ""}
                onChange={(e) => handleCookieSettingsTextChange(e.target.value)}
                placeholder="e.g., Change cookie settings"
                disabled={!enabled}
              />
              <p className="text-xs text-muted-foreground">
                The text for the link to change cookie settings in the copyright section
              </p>
            </div>
          </>
        )}

        {!enabled && (
          <p className="text-sm text-muted-foreground">
            Enable cookie consent to configure the banner that will be shown to users.
          </p>
        )}
      </CardContent>
    </Card>
  )
}


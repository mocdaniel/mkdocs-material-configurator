"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Plus, Trash2, ExternalLink } from "lucide-react"
import type { MkDocsConfig } from "@/types/mkdocs-config"
import { IconPicker } from "@/components/icon-picker"

interface HeaderFooterSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

interface SocialLink {
  icon: string
  link: string
  name?: string
}

export function HeaderFooterSection({ config, onChange }: HeaderFooterSectionProps) {
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    icon: "",
    link: "",
    name: "",
  })
  const [isAddingSocialLink, setIsAddingSocialLink] = useState(false)

  // Get features from config
  const features = config.theme.features || []

  // Check if specific features are enabled
  const isHeaderAutohideEnabled = features.includes("header.autohide")
  const isAnnounceDismissEnabled = features.includes("announce.dismiss")
  const isNavigationFooterEnabled = features.includes("navigation.footer")

  // Check if generator is enabled
  const isGeneratorEnabled = config.extra?.generator !== false

  // Get social links
  const socialLinks = config.extra?.social || []

  // Get copyright text
  const copyrightText = config.copyright || ""

  // Toggle feature
  const toggleFeature = (feature: string, enabled: boolean) => {
    let newFeatures = [...features]

    if (enabled) {
      // Add feature if not already present
      if (!newFeatures.includes(feature)) {
        newFeatures.push(feature)
      }
    } else {
      // Remove feature
      newFeatures = newFeatures.filter((f) => f !== feature)
    }

    onChange({
      ...config,
      theme: {
        ...config.theme,
        features: newFeatures.length > 0 ? newFeatures : undefined,
      },
    })
  }

  // Toggle generator
  const toggleGenerator = (enabled: boolean) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    if (enabled) {
      newExtra.generator = true
    } else {
      newExtra.generator = false
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Update copyright text
  const updateCopyright = (value: string) => {
    onChange({
      ...config,
      copyright: value || undefined,
    })
  }

  // Add social link
  const addSocialLink = () => {
    if (!newSocialLink.icon || !newSocialLink.link) return

    // Create a properly formatted social link object
    const socialLink = {
      icon: newSocialLink.icon,
      link: newSocialLink.link,
    }

    // Only add name if it's not empty
    if (newSocialLink.name) {
      socialLink.name = newSocialLink.name
    }

    const newSocialLinks = [...socialLinks, socialLink]

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}
    newExtra.social = newSocialLinks

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })

    // Reset form
    setNewSocialLink({
      icon: "",
      link: "",
      name: "",
    })
    setIsAddingSocialLink(false)
  }

  // Remove social link
  const removeSocialLink = (index: number) => {
    const newSocialLinks = [...socialLinks]
    newSocialLinks.splice(index, 1)

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    if (newSocialLinks.length > 0) {
      newExtra.social = newSocialLinks
    } else {
      delete newExtra.social
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Header and Footer</CardTitle>
        <CardDescription>Configure header and footer settings for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Header Settings</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="header-autohide">Auto-hide Header</Label>
              <p className="text-sm text-muted-foreground">Automatically hide the header when scrolling down</p>
            </div>
            <Switch
              id="header-autohide"
              checked={isHeaderAutohideEnabled}
              onCheckedChange={(checked) => toggleFeature("header.autohide", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="announce-dismiss">Dismissible Announcements</Label>
              <p className="text-sm text-muted-foreground">Allow users to dismiss announcement banners</p>
            </div>
            <Switch
              id="announce-dismiss"
              checked={isAnnounceDismissEnabled}
              onCheckedChange={(checked) => toggleFeature("announce.dismiss", checked)}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Footer Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Footer Settings</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="navigation-footer">Navigation Footer</Label>
              <p className="text-sm text-muted-foreground">Show previous/next page navigation in the footer</p>
            </div>
            <Switch
              id="navigation-footer"
              checked={isNavigationFooterEnabled}
              onCheckedChange={(checked) => toggleFeature("navigation.footer", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="generator">Show Generator Notice</Label>
              <p className="text-sm text-muted-foreground">Display "Made with Material for MkDocs" in the footer</p>
            </div>
            <Switch id="generator" checked={isGeneratorEnabled} onCheckedChange={toggleGenerator} />
          </div>

          {!isGeneratorEnabled && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <p className="mb-2">
                  The subtle "Made with Material for MkDocs" hint in the footer is one of the reasons why this project
                  is so popular, as it tells the user how the site is generated, helping new users to discover this
                  project. Before removing please consider that you're enjoying the benefits of @squidfunk's work for
                  free, as this project is Open Source and has a permissive license. Thousands of hours went into this
                  project, most of them without any financial return.
                </p>
                <p>
                  Thus, if you remove this notice, please consider{" "}
                  <a
                    href="https://github.com/sponsors/squidfunk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    sponsoring the project
                  </a>
                  . Thank you
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="copyright">Copyright Notice</Label>
              <a
                href="https://squidfunk.github.io/mkdocs-material/setup/setting-up-the-footer/#copyright-notice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Input
              id="copyright"
              value={copyrightText}
              onChange={(e) => updateCopyright(e.target.value)}
              placeholder="Copyright &copy; 2023 Your Name"
            />
            <p className="text-xs text-muted-foreground">HTML is supported. Use &amp;copy; for the copyright symbol.</p>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label>Social Links</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingSocialLink(true)}
                disabled={isAddingSocialLink}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </div>

            {isAddingSocialLink && (
              <Card className="p-4 border-dashed">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-icon">Icon</Label>
                    <IconPicker
                      value={newSocialLink.icon}
                      onChange={(value) => setNewSocialLink({ ...newSocialLink, icon: value })}
                      placeholder="Select an icon"
                    />
                    <p className="text-xs text-muted-foreground">
                      Select an icon for the social link (e.g., fontawesome/brands/github)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-link">URL</Label>
                    <Input
                      id="social-link"
                      value={newSocialLink.link}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, link: e.target.value })}
                      placeholder="https://example.com"
                    />
                    <p className="text-xs text-muted-foreground">The URL the social link points to</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social-name">Name (Optional)</Label>
                    <Input
                      id="social-name"
                      value={newSocialLink.name || ""}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value || undefined })}
                      placeholder="GitHub"
                    />
                    <p className="text-xs text-muted-foreground">
                      A descriptive name for the link (used for accessibility)
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingSocialLink(false)
                        setNewSocialLink({ icon: "", link: "", name: "" })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addSocialLink} disabled={!newSocialLink.icon || !newSocialLink.link}>
                      Add Link
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {socialLinks.length > 0 ? (
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted w-8 h-8 flex items-center justify-center rounded-md">
                        <span className="text-xs font-mono">{link.icon.split("/").pop()?.substring(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{link.name || link.icon.split("/").pop()}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.link}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeSocialLink(index)} className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No social links configured</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


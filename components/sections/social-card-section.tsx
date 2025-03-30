"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MkDocsConfig } from "@/types/mkdocs-config"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SocialCardSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function SocialCardSection({ config, onChange }: SocialCardSectionProps) {
  // Check if social plugin is enabled
  const isSocialPluginEnabled = config.plugins?.some((plugin) => {
    if (typeof plugin === "string") {
      return plugin === "social"
    }
    if (typeof plugin === "object") {
      return "social" in plugin
    }
    return false
  })

  // Get social plugin configuration
  const getSocialPluginConfig = () => {
    if (!isSocialPluginEnabled) return { cards: true, cards_dir: "assets/images/social" }

    for (const plugin of config.plugins || []) {
      if (typeof plugin === "object" && "social" in plugin) {
        return plugin.social || { cards: true, cards_dir: "assets/images/social" }
      }
    }

    return { cards: true, cards_dir: "assets/images/social" }
  }

  const socialConfig = getSocialPluginConfig()

  // Check if site_url is set
  const hasSiteUrl = !!config.site_url

  // Handle social plugin toggle
  const handleSocialPluginToggle = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    if (enabled) {
      // Remove any existing social plugin configuration
      newPlugins = newPlugins.filter((plugin) => {
        if (typeof plugin === "string") {
          return plugin !== "social"
        }
        if (typeof plugin === "object") {
          return !("social" in plugin)
        }
        return true
      })

      // Add social plugin with default configuration
      newPlugins.push({
        social: {
          cards: true,
          cards_dir: "assets/images/social",
        },
      })
    } else {
      // Remove social plugin
      newPlugins = newPlugins.filter((plugin) => {
        if (typeof plugin === "string") {
          return plugin !== "social"
        }
        if (typeof plugin === "object") {
          return !("social" in plugin)
        }
        return true
      })
    }

    onChange({
      ...config,
      plugins: newPlugins.length > 0 ? newPlugins : undefined,
    })
  }

  // Handle cards toggle
  const handleCardsToggle = (enabled: boolean) => {
    if (!isSocialPluginEnabled) return

    const newPlugins = [...(config.plugins || [])]

    // Find and update the social plugin configuration
    for (let i = 0; i < newPlugins.length; i++) {
      const plugin = newPlugins[i]
      if (typeof plugin === "object" && "social" in plugin) {
        newPlugins[i] = {
          social: {
            ...plugin.social,
            cards: enabled,
          },
        }
        break
      }
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Handle cards_dir change
  const handleCardsDirChange = (value: string) => {
    if (!isSocialPluginEnabled) return

    const newPlugins = [...(config.plugins || [])]

    // Find and update the social plugin configuration
    for (let i = 0; i < newPlugins.length; i++) {
      const plugin = newPlugins[i]
      if (typeof plugin === "object" && "social" in plugin) {
        newPlugins[i] = {
          social: {
            ...plugin.social,
            cards_dir: value,
          },
        }
        break
      }
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Cards</CardTitle>
        <CardDescription>Configure social cards for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="social-enabled" className="font-medium">
                Enable Social Cards
              </Label>
              {!hasSiteUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Requires site_url to be set in Basic Configuration</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Generate social cards for sharing your documentation on social media
            </p>
          </div>
          <Switch
            id="social-enabled"
            checked={isSocialPluginEnabled}
            onCheckedChange={handleSocialPluginToggle}
            disabled={!hasSiteUrl}
          />
        </div>

        {isSocialPluginEnabled && !hasSiteUrl && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Site URL Required</AlertTitle>
            <AlertDescription>
              Social cards require the site_url to be set in the Basic Configuration section. Please configure your
              site_url before enabling social cards.
            </AlertDescription>
          </Alert>
        )}

        {isSocialPluginEnabled && hasSiteUrl && (
          <div className="space-y-6">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Social cards require additional image processing dependencies. See the{" "}
                <a
                  href="https://squidfunk.github.io/mkdocs-material/plugins/requirements/image-processing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  image processing requirements documentation
                </a>{" "}
                for details.
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cards-enabled">Enable Cards Generation</Label>
                  <p className="text-sm text-muted-foreground">Generate social cards for each page</p>
                </div>
                <Switch id="cards-enabled" checked={socialConfig.cards !== false} onCheckedChange={handleCardsToggle} />
              </div>

              {socialConfig.cards !== false && (
                <div className="space-y-2">
                  <Label htmlFor="cards-dir">Cards Directory</Label>
                  <Input
                    id="cards-dir"
                    value={socialConfig.cards_dir || "assets/images/social"}
                    onChange={(e) => handleCardsDirChange(e.target.value)}
                    placeholder="assets/images/social"
                  />
                  <p className="text-xs text-muted-foreground">Directory where generated social cards will be stored</p>
                </div>
              )}
            </div>

            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-base font-medium mb-2">About Social Cards</h3>
                  <p className="text-sm text-muted-foreground">
                    Social cards are images that are displayed when your documentation is shared on social media
                    platforms like Twitter, Facebook, and LinkedIn.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The social plugin automatically generates these cards for each page in your documentation, using the
                    page title and site information.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>
                      The <code>site_url</code> must be set in the Basic Configuration
                    </li>
                    <li>
                      Image processing dependencies as specified in the{" "}
                      <a
                        href="https://squidfunk.github.io/mkdocs-material/plugins/requirements/image-processing/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                      >
                        documentation
                      </a>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="example" className="mt-4">
                <div className="border rounded-md p-4 bg-muted/30">
                  <h3 className="text-base font-medium mb-2">Example Social Card</h3>
                  <div className="aspect-[1200/630] rounded-md overflow-hidden border border-muted">
                    <img
                      src="https://squidfunk.github.io/mkdocs-material/assets/screenshots/social-cards-variant.png"
                      alt="Example social card from MkDocs Material"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Example social card from the official MkDocs Material documentation.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!isSocialPluginEnabled && (
          <p className="text-sm text-muted-foreground">
            Enable social cards to generate images for sharing your documentation on social media platforms.
          </p>
        )}
      </CardContent>
    </Card>
  )
}


"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PrivacyPluginConfig {
  enabled: boolean
  concurrency: number
  cache: boolean
  cache_dir: string
  assets: boolean
  assets_fetch_dir: string
}

interface PrivacyPluginConfigProps {
  config: PrivacyPluginConfig
  onChange: (config: PrivacyPluginConfig) => void
}

export function PrivacyPluginConfig({ config, onChange }: PrivacyPluginConfigProps) {
  const handleChange = <K extends keyof PrivacyPluginConfig>(key: K, value: PrivacyPluginConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="privacy-enabled">Enable Privacy Plugin</Label>
          <p className="text-sm text-muted-foreground">Automatically downloads and optimizes external assets</p>
        </div>
        <Switch
          id="privacy-enabled"
          checked={config.enabled}
          onCheckedChange={(checked) => handleChange("enabled", checked)}
        />
      </div>

      {config.enabled && (
        <>
          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="privacy-concurrency">Concurrency</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of concurrent downloads (1-8)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="privacy-concurrency"
                  min={1}
                  max={8}
                  step={1}
                  value={[config.concurrency]}
                  onValueChange={(value) => handleChange("concurrency", value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{config.concurrency}</span>
              </div>
              <p className="text-xs text-muted-foreground">Number of concurrent downloads (default: 1)</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privacy-cache">Enable Caching</Label>
                <p className="text-sm text-muted-foreground">Cache downloaded external assets</p>
              </div>
              <Switch
                id="privacy-cache"
                checked={config.cache}
                onCheckedChange={(checked) => handleChange("cache", checked)}
              />
            </div>

            {config.cache && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="privacy-cache-dir">Cache Directory</Label>
                <Input
                  id="privacy-cache-dir"
                  value={config.cache_dir}
                  onChange={(e) => handleChange("cache_dir", e.target.value)}
                  placeholder=".cache/plugin/privacy"
                />
                <p className="text-xs text-muted-foreground">
                  Directory to store cached assets (default: .cache/plugin/privacy)
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privacy-assets">Enable Assets</Label>
                <p className="text-sm text-muted-foreground">Download and optimize external assets</p>
              </div>
              <Switch
                id="privacy-assets"
                checked={config.assets}
                onCheckedChange={(checked) => handleChange("assets", checked)}
              />
            </div>

            {config.assets && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                <Label htmlFor="privacy-assets-fetch-dir">Assets Fetch Directory</Label>
                <Input
                  id="privacy-assets-fetch-dir"
                  value={config.assets_fetch_dir}
                  onChange={(e) => handleChange("assets_fetch_dir", e.target.value)}
                  placeholder="assets/external"
                />
                <p className="text-xs text-muted-foreground">
                  Directory to store downloaded assets (default: assets/external)
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}


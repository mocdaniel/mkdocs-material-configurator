"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface IconConfigProps {
  icons: Record<string, string | undefined>
  onChange: (icons: Record<string, string | undefined>) => void
}

interface IconOption {
  name: string
  key: string
  description: string
}

const iconOptions: IconOption[] = [
  { key: "logo", name: "Logo", description: "Icon used for the logo" },
  { key: "menu", name: "Menu", description: "Icon used for opening the drawer" },
  { key: "alternate", name: "Alternate", description: "Icon used for language selection" },
  { key: "search", name: "Search", description: "Icon used for search functionality" },
  { key: "share", name: "Share", description: "Icon used for sharing search results" },
  { key: "close", name: "Close", description: "Icon used to reset search or dismiss announcements" },
  { key: "top", name: "Top", description: "Icon used for back-to-top button" },
  { key: "edit", name: "Edit", description: "Icon used for editing the current page" },
  { key: "view", name: "View", description: "Icon used for viewing page source" },
  { key: "repo", name: "Repository", description: "Icon used for repository links" },
  { key: "admonition", name: "Admonition", description: "Icon used for admonitions" },
  { key: "tag", name: "Tag", description: "Icon used for tags" },
  { key: "previous", name: "Previous", description: "Icon used for previous page in footer" },
  { key: "next", name: "Next", description: "Icon used for next page in footer" },
]

export function IconConfig({ icons, onChange }: IconConfigProps) {
  const handleIconChange = (key: string, value: string) => {
    const newIcons = { ...icons, [key]: value }
    onChange(newIcons)
  }

  const handleIconClear = (key: string) => {
    const newIcons = { ...icons }
    delete newIcons[key]
    onChange(newIcons)
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Configure custom icons for different parts of your MkDocs site. Icons should be specified in the format
          "namespace/icon-name", e.g., "material/home".
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          <a
            href="https://squidfunk.github.io/mkdocs-material/reference/icons-emojis/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Browse available icons
          </a>
        </p>
      </div>

      <div className="grid gap-4">
        {iconOptions.map((option) => (
          <div key={option.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`icon-${option.key}`} className="font-medium">
                {option.name}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{option.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id={`icon-${option.key}`}
                value={icons[option.key] || ""}
                onChange={(e) => handleIconChange(option.key, e.target.value)}
                placeholder={`e.g., material/${option.key}`}
                className="flex-1"
              />
              {icons[option.key] && (
                <Button variant="ghost" size="icon" onClick={() => handleIconClear(option.key)} className="h-10 w-10">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


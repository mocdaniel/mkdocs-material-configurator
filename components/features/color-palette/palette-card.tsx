"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Sun, Moon } from "lucide-react"
import type { PaletteCardProps } from "@/types/features/color-palette"
import { getColorHex, colorOptions } from "@/utils/features/color-utils"

export function PaletteCard({ palette, index, onChange, onRemove, totalPalettes }: PaletteCardProps) {
  return (
    <Card className="border border-muted">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {palette.scheme === "slate" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onRemove(index)} className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove palette</span>
          </Button>
        </div>
        <CardDescription>
          {palette.scheme === "slate" ? "Dark theme" : "Light theme"} palette
          {palette.media && (
            <span className="ml-2 text-xs">
              ({palette.media.includes("light") ? "System light mode" : "System dark mode"})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="p-3 rounded-lg border mb-4"
          style={{
            backgroundColor: palette.scheme === "slate" ? "#1e212a" : "#fff",
            color: palette.scheme === "slate" ? "#fff" : "inherit",
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: getColorHex(palette.primary || "indigo") }}
              ></div>
              <span>Primary: {palette.primary || "indigo"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: getColorHex(palette.accent || "indigo") }}
              ></div>
              <span>Accent: {palette.accent || "indigo"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`scheme-${index}`}>Color Scheme</Label>
          <Select
            value={palette.scheme || "default"}
            onValueChange={(value) => {
              onChange(index, {
                ...palette,
                scheme: value,
                toggle: {
                  ...palette.toggle,
                  icon: value === "slate" ? "material/brightness-4" : "material/brightness-7",
                  name: value === "slate" ? "Switch to light mode" : "Switch to dark mode",
                },
              })
            }}
            disabled={totalPalettes === 2} // Disable scheme change if we have 2 palettes
          >
            <SelectTrigger id={`scheme-${index}`}>
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-white border"></div>
                  <span>Light (default)</span>
                </div>
              </SelectItem>
              <SelectItem value="slate">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: "#1e212a" }}></div>
                  <span>Dark (slate)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {totalPalettes === 2 && (
            <p className="text-xs text-muted-foreground mt-1">
              Scheme cannot be changed when both light and dark themes are configured.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`primary-${index}`}>Primary Color</Label>
          <Select
            value={palette.primary || "indigo"}
            onValueChange={(value) => {
              onChange(index, { ...palette, primary: value })
            }}
          >
            <SelectTrigger id={`primary-${index}`}>
              <SelectValue placeholder="Select primary color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.hex }}></div>
                    <span>{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`accent-${index}`}>Accent Color</Label>
          <Select
            value={palette.accent || "indigo"}
            onValueChange={(value) => {
              onChange(index, { ...palette, accent: value })
            }}
          >
            <SelectTrigger id={`accent-${index}`}>
              <SelectValue placeholder="Select accent color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.hex }}></div>
                    <span>{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`toggle-icon-${index}`}>Toggle Icon</Label>
          <Input
            id={`toggle-icon-${index}`}
            value={palette.toggle?.icon || ""}
            onChange={(e) => {
              onChange(index, {
                ...palette,
                toggle: {
                  ...palette.toggle,
                  icon: e.target.value,
                },
              })
            }}
            placeholder="material/brightness-7"
          />
          <p className="text-xs text-muted-foreground">
            Material icon name, e.g., material/brightness-7.{" "}
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

        <div className="space-y-2">
          <Label htmlFor={`toggle-name-${index}`}>Toggle Name</Label>
          <Input
            id={`toggle-name-${index}`}
            value={palette.toggle?.name || ""}
            onChange={(e) => {
              onChange(index, {
                ...palette,
                toggle: {
                  ...palette.toggle,
                  name: e.target.value,
                },
              })
            }}
            placeholder="Switch to dark mode"
          />
          <p className="text-xs text-muted-foreground">Text displayed when hovering over the toggle</p>
        </div>
      </CardContent>
    </Card>
  )
}


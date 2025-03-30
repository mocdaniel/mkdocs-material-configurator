"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { popularFonts, getFontUrl } from "@/utils/features/font-utils"
import type { FontPickerProps } from "@/types/features/font-config"

export function FontPicker({
  value,
  onChange,
  placeholder = "Select a font",
  label,
  description,
  disabled = false,
  disabledTooltip,
}: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Filter fonts based on search query
  const filteredFonts =
    searchQuery.length > 0
      ? popularFonts.filter((font) => font.family.toLowerCase().includes(searchQuery.toLowerCase()))
      : popularFonts

  // Load fonts when dropdown is opened
  useEffect(() => {
    if (open && !fontsLoaded) {
      // Create a style element to load all fonts
      const style = document.createElement("style")

      // Generate @font-face rules for all fonts
      const fontFaceRules = filteredFonts
        .map((font) => {
          const fontFamily = font.family.replace(/\s+/g, "+")
          return `
          @import url('https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;700&display=swap');
        `
        })
        .join("")

      style.textContent = fontFaceRules
      document.head.appendChild(style)

      setFontsLoaded(true)

      return () => {
        // Cleanup is handled by the browser's caching mechanism
      }
    }
  }, [open, fontsLoaded, filteredFonts])

  // Load the selected font for the button display
  useEffect(() => {
    if (value) {
      const link = document.createElement("link")
      link.href = getFontUrl(value)
      link.rel = "stylesheet"
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [value])

  // Sample text to show font preview
  const sampleText = "The quick brown fox jumps over the lazy dog"

  const fontPickerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn("w-full justify-between", disabled && "opacity-50 cursor-not-allowed")}
      disabled={disabled}
    >
      {value ? <span style={{ fontFamily: value }}>{value}</span> : placeholder}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        {disabled && disabledTooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">{fontPickerButton}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{disabledTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{fontPickerButton}</PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
              <Command>
                <CommandInput placeholder="Search fonts..." value={searchQuery} onValueChange={setSearchQuery} />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty>No fonts found.</CommandEmpty>
                  <CommandGroup>
                    {filteredFonts.map((font) => (
                      <CommandItem
                        key={font.family}
                        value={font.family}
                        onSelect={() => {
                          onChange(font.family === value ? undefined : font.family)
                          setOpen(false)
                        }}
                        className="flex flex-col items-start py-3 px-2"
                      >
                        <div className="flex w-full justify-between items-center">
                          <span className="text-sm text-muted-foreground">{font.family}</span>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-2">{font.category}</span>
                            <Check className={cn("h-4 w-4", value === font.family ? "opacity-100" : "opacity-0")} />
                          </div>
                        </div>
                        <div className="w-full text-base mt-1 truncate" style={{ fontFamily: font.family }}>
                          {sampleText}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {value && !disabled && (
          <Button variant="ghost" size="icon" onClick={() => onChange(undefined)} className="h-10 w-10">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </div>
  )
}


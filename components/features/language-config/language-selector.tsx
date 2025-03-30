"use client"

import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { supportedLanguages, getLanguageDisplayName } from "@/utils/features/language-utils"
import type { LanguageConfigProps } from "@/types/features/language-config"

export function LanguageSelector({ language, onChange }: LanguageConfigProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter languages based on search query
  const filteredLanguages =
    searchQuery.length > 0
      ? supportedLanguages.filter(
          (lang) =>
            lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lang.nativeName && lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            lang.code.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : supportedLanguages

  // Get the selected language display
  const selectedLanguage = language ? supportedLanguages.find((lang) => lang.code === language) : undefined

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>Language</Label>
        <p className="text-sm text-muted-foreground">Select the language for your MkDocs site interface</p>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {selectedLanguage ? (
                <span>{getLanguageDisplayName(selectedLanguage)}</span>
              ) : (
                "Select language (default: English)"
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0">
            <Command>
              <CommandInput placeholder="Search languages..." value={searchQuery} onValueChange={setSearchQuery} />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No languages found.</CommandEmpty>
                <CommandGroup>
                  {filteredLanguages.map((lang) => (
                    <CommandItem
                      key={lang.code}
                      value={lang.code}
                      onSelect={() => {
                        onChange(lang.code === language ? undefined : lang.code)
                        setOpen(false)
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span>{getLanguageDisplayName(lang)}</span>
                        {lang.code === "custom" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Use this option if you have custom translations</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <Check className={cn("h-4 w-4", language === lang.code ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {language && (
          <Button variant="ghost" size="icon" onClick={() => onChange(undefined)} className="h-10 w-10">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {language === "custom" && (
        <div className="mt-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <p>
            <strong>Note:</strong> When using the "Custom" language option, you'll need to provide your own
            translations. See the{" "}
            <a
              href="https://squidfunk.github.io/mkdocs-material/setup/changing-the-language/#custom-translations"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              documentation
            </a>{" "}
            for more details.
          </p>
        </div>
      )}
    </div>
  )
}


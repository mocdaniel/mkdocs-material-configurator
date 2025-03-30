"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Globe, Languages, Info } from "lucide-react"
import { AlternateLanguageForm } from "./alternate-language-form"
import { LanguageBadge } from "./language-badge"
import type { AlternateLanguageConfigProps } from "@/types/features/alternate-language-config"
import type { AlternateLanguage } from "@/types/mkdocs-config"

export function AlternateLanguageConfig({ languages, onChange }: AlternateLanguageConfigProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newLanguage, setNewLanguage] = useState<AlternateLanguage>({
    name: "",
    link: "", // Empty link to show placeholder
    lang: "en",
  })

  const handleAddNew = () => {
    setIsAddingNew(true)
    setNewLanguage({
      name: "",
      link: "", // Empty link to show placeholder
      lang: "en",
    })
  }

  const handleCancelNew = () => {
    setIsAddingNew(false)
  }

  const handleSaveNew = () => {
    // Make sure we have valid data
    if (newLanguage.name && newLanguage.link && newLanguage.lang) {
      const updatedLanguages = [...languages, { ...newLanguage }]
      onChange(updatedLanguages)
      setIsAddingNew(false)
    }
  }

  const handleDeleteLanguage = (index: number) => {
    const updatedLanguages = [...languages]
    updatedLanguages.splice(index, 1)
    onChange(updatedLanguages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Alternate Languages</h3>
          <p className="text-sm text-muted-foreground">Configure multiple languages for your documentation</p>
        </div>
        <Languages className="h-6 w-6 text-muted-foreground" />
      </div>

      {languages.length === 0 && !isAddingNew && (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg bg-muted/50">
          <Globe className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            No alternate languages configured. Add languages to create a language selector on your site.
          </p>
        </div>
      )}

      {/* Display configured languages as compact badges */}
      {languages.length > 0 && (
        <div className="space-y-2">
          {languages.map((language, index) => (
            <LanguageBadge key={index} language={language} onDelete={() => handleDeleteLanguage(index)} />
          ))}
        </div>
      )}

      {isAddingNew && (
        <AlternateLanguageForm
          language={newLanguage}
          onChange={setNewLanguage}
          onDelete={handleCancelNew}
          isNew={true}
          onSave={handleSaveNew}
        />
      )}

      {!isAddingNew && (
        <Button onClick={handleAddNew} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      )}

      {/* Always show the "How it works" section */}
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h4 className="font-medium mb-2">How it works</h4>
        <p className="text-sm text-muted-foreground mb-2">
          This configuration adds a language selector to your MkDocs site. You'll need to:
        </p>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1 mb-4">
          <li>Organize your documentation in language-specific directories (e.g., /docs/en/, /docs/de/)</li>
          <li>Configure the links to match your directory structure</li>
          <li>Set up proper language codes for each language</li>
        </ol>

        <div className="flex items-start gap-3 p-3 border-l-4 border-primary bg-primary/5 rounded-r-md">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Include your main language</p>
            <p className="text-sm text-muted-foreground">
              For complete language navigation, include an alternate entry for your main site language (the one set at
              the top of this tab). For example, if your main language is English (en), add an alternate entry for
              English pointing to its directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


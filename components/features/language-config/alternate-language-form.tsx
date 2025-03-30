"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supportedLanguages, getLanguageDisplayName } from "@/utils/features/language-utils"
import type { AlternateLanguageFormProps } from "@/types/features/alternate-language-config"
import type { AlternateLanguage } from "@/types/mkdocs-config"

export function AlternateLanguageForm({
  language,
  onChange,
  onDelete,
  isNew = false,
  onSave,
  onCancel,
}: AlternateLanguageFormProps) {
  const [formData, setFormData] = useState<AlternateLanguage>({
    name: language.name || "",
    link: language.link || "", // Remove default value to show placeholder
    lang: language.lang || "en",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form data when language prop changes
  useEffect(() => {
    setFormData({
      name: language.name || "",
      link: language.link || "", // Remove default value to show placeholder
      lang: language.lang || "en",
    })
  }, [language])

  const handleChange = (field: keyof AlternateLanguage, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.link.trim()) {
      newErrors.link = "Link is required"
    } else if (!formData.link.startsWith("/")) {
      newErrors.link = "Link must start with /"
    }

    if (!formData.lang) {
      newErrors.lang = "Language code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onChange(formData)
      if (onSave) onSave()
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., English, Deutsch, Français"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          <p className="text-xs text-muted-foreground">The name that will be shown in the language selector</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link Path</Label>
          <Input
            id="link"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            placeholder="e.g., /en/, /de/, /fr/"
            className={errors.link ? "border-destructive" : ""}
          />
          {errors.link && <p className="text-xs text-destructive">{errors.link}</p>}
          <p className="text-xs text-muted-foreground">The path where the documentation for this language resides</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lang">Language Code</Label>
          <Select value={formData.lang} onValueChange={(value) => handleChange("lang", value)}>
            <SelectTrigger id="lang" className={errors.lang ? "border-destructive" : ""}>
              <SelectValue placeholder="Select language code" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.code} - {getLanguageDisplayName(lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lang && <p className="text-xs text-destructive">{errors.lang}</p>}
          <p className="text-xs text-muted-foreground">The ISO language code for this language</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onDelete}>
          {isNew ? "Cancel" : "Delete"}
        </Button>
        <Button onClick={handleSave}>{isNew ? "Add" : "Update"}</Button>
      </CardFooter>
    </Card>
  )
}


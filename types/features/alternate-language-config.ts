import type { AlternateLanguage } from "@/types/mkdocs-config"

export interface AlternateLanguageConfigProps {
  languages: AlternateLanguage[]
  onChange: (languages: AlternateLanguage[]) => void
}

export interface AlternateLanguageFormProps {
  language: AlternateLanguage
  onChange: (language: AlternateLanguage) => void
  onDelete: () => void
  isNew?: boolean
  onSave?: () => void
  onCancel?: () => void
}


export interface LanguageConfigProps {
  language: string | undefined
  onChange: (language: string | undefined) => void
}

export interface Language {
  code: string
  name: string
  nativeName?: string
  description?: string
}


"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { AlternateLanguage } from "@/types/mkdocs-config"
import { getLanguageByCode } from "@/utils/features/language-utils"

interface LanguageBadgeProps {
  language: AlternateLanguage
  onDelete: () => void
}

export function LanguageBadge({ language, onDelete }: LanguageBadgeProps) {
  const langInfo = getLanguageByCode(language.lang)
  const langName = langInfo ? langInfo.name : language.lang

  return (
    <div className="flex items-center justify-between p-2 border rounded-md mb-2 bg-background">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs">
          {language.lang}
        </Badge>
        <span className="font-medium">{language.name}</span>
        <span className="text-muted-foreground text-sm">→</span>
        <span className="text-sm font-mono text-muted-foreground">{language.link}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0">
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        <span className="sr-only">Delete language</span>
      </Button>
    </div>
  )
}


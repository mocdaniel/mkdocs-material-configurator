export interface FontConfigProps {
  fontEnabled: boolean
  textFont: string | undefined
  codeFont: string | undefined
  onFontEnabledChange: (enabled: boolean) => void
  onChange: (textFont: string | undefined, codeFont: string | undefined) => void
}

export interface FontPickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  placeholder?: string
  label: string
  description: string
  disabled?: boolean
  disabledTooltip?: string
}

export interface FontPreviewProps {
  textFont: string | undefined
  codeFont: string | undefined
}


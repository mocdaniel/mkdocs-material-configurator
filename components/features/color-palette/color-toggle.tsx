"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ColorToggleProps } from "@/types/features/color-palette"

export function ColorToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  icon,
  tooltipContent,
}: ColorToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
                <div className={`h-4 w-4 ${disabled ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                  {icon}
                </div>
              </div>
            </TooltipTrigger>
            {disabled && tooltipContent && (
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}


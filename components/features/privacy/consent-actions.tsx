"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Check, X, Settings, ArrowUp, ArrowDown, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ConsentAction = "accept" | "reject" | "manage"

interface ConsentActionsProps {
  actions: string[]
  onChange: (actions: string[]) => void
}

interface ActionInfo {
  id: ConsentAction
  label: string
  icon: React.ReactNode
  description: string
}

const availableActions: ActionInfo[] = [
  {
    id: "accept",
    label: "Accept",
    icon: <Check className="h-4 w-4" />,
    description: "Allow users to accept all cookies",
  },
  {
    id: "reject",
    label: "Reject",
    icon: <X className="h-4 w-4" />,
    description: "Allow users to reject all cookies",
  },
  {
    id: "manage",
    label: "Manage",
    icon: <Settings className="h-4 w-4" />,
    description: "Allow users to manage cookie preferences",
  },
]

export function ConsentActions({ actions, onChange }: ConsentActionsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleAddAction = (action: ConsentAction) => {
    if (!actions.includes(action)) {
      onChange([...actions, action])
    }
  }

  const handleRemoveAction = (index: number) => {
    const newActions = [...actions]
    newActions.splice(index, 1)
    onChange(newActions)
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newActions = [...actions]
      const temp = newActions[index]
      newActions[index] = newActions[index - 1]
      newActions[index - 1] = temp
      onChange(newActions)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < actions.length - 1) {
      const newActions = [...actions]
      const temp = newActions[index]
      newActions[index] = newActions[index + 1]
      newActions[index + 1] = temp
      onChange(newActions)
    }
  }

  // Get actions that are not yet added
  const availableToAdd = availableActions.filter((action) => !actions.includes(action.id))

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Consent Actions</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Configure which actions are available in the consent banner and their display order.
          {!actions.includes("manage") && (
            <span className="block mt-1 text-amber-500">
              Note: Without the "manage" action, cookie options will always be shown.
            </span>
          )}
        </p>
      </div>

      {actions.length > 0 ? (
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {actions.map((action, index) => {
                const actionInfo = availableActions.find((a) => a.id === action)
                if (!actionInfo) return null

                return (
                  <li
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-2 border rounded-md",
                      hoveredIndex === index ? "bg-muted/50" : "bg-background",
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {index + 1}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        {actionInfo.icon}
                        <span className="font-medium">{actionInfo.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="h-8 w-8"
                            >
                              <ArrowUp className="h-4 w-4" />
                              <span className="sr-only">Move up</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move up</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === actions.length - 1}
                              className="h-8 w-8"
                            >
                              <ArrowDown className="h-4 w-4" />
                              <span className="sr-only">Move down</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move down</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveAction(index)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove action</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground text-center mb-2">
            No consent actions configured. Add actions to create buttons in the consent banner.
          </p>
        </div>
      )}

      {availableToAdd.length > 0 && (
        <div className="mt-4">
          <Label className="mb-2 block">Add Actions</Label>
          <div className="flex flex-wrap gap-2">
            {availableToAdd.map((action) => (
              <TooltipProvider key={action.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAction(action.id as ConsentAction)}
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {action.icon}
                      {action.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{action.description}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


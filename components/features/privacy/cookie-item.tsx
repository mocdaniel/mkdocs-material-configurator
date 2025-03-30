"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface CookieItem {
  id: string
  name: string
  checked: boolean
  isBuiltin?: boolean
}

interface CookieItemProps {
  cookie: CookieItem
  onChange: (cookie: CookieItem) => void
  onDelete?: () => void
}

export function CookieItemForm({ cookie, onChange, onDelete }: CookieItemProps) {
  const handleNameChange = (value: string) => {
    onChange({ ...cookie, name: value })
  }

  const handleCheckedChange = (checked: boolean) => {
    onChange({ ...cookie, checked })
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {cookie.isBuiltin ? (
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">Built-in</div>
            ) : (
              <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md">Custom</div>
            )}
            <h3 className="font-medium">{cookie.id}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Enabled by default</span>
              <Switch
                id={`cookie-enabled-${cookie.id}`}
                checked={cookie.checked}
                onCheckedChange={handleCheckedChange}
              />
            </div>
            {!cookie.isBuiltin && onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete cookie</span>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`cookie-name-${cookie.id}`}>Display Name</Label>
          <Input
            id={`cookie-name-${cookie.id}`}
            value={cookie.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Google Analytics"
          />
          <p className="text-xs text-muted-foreground">The name that will be shown to users</p>
        </div>
      </CardContent>
    </Card>
  )
}


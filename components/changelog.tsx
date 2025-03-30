"use client"
import { Badge } from "@/components/ui/badge"

interface ReleaseNote {
  version: string
  date: string
  title: string
  description: string
  changes: {
    type: "added" | "changed" | "fixed" | "removed"
    items: string[]
  }[]
}

const releaseNotes: ReleaseNote[] = [
  {
    version: "v1.0.0-9.6.10",
    date: "March 30, 2025",
    title: "Initial Release",
    description:
      "First public release of the Material for MkDocs Configurator, supporting Material for MkDocs version 9.6.10.",
    changes: [
      {
        type: "added",
        items: [
          "Complete visual configuration interface for Material for MkDocs",
          "Real-time YAML preview with syntax highlighting",
          "Basic configuration options (site name, author, description)",
          "Color scheme customization with primary and accent color pickers",
          "Font configuration for text and code",
          "Icon customization options",
          "Localization settings with language selector",
          "Navigation features configuration",
          "Privacy settings and cookie consent options",
          "Search configuration",
          "Analytics integration options",
          "Social card customization",
          "Blog feature configuration",
          "Tag support settings",
          "Versioning options",
          "Header and footer customization",
          "Git repository integration with revision date and committers",
        ],
      },
    ],
  },
]

export function Changelog() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Changelog</h2>
        <p className="text-muted-foreground">
          Track the evolution of the Material for MkDocs Configurator with our detailed changelog.
        </p>
      </div>

      <div className="space-y-8">
        {releaseNotes.map((release) => (
          <div key={release.version} className="border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{release.version}</h3>
                <Badge variant="outline" className="ml-2">
                  {release.date}
                </Badge>
              </div>
              <h4 className="text-lg font-medium text-muted-foreground">{release.title}</h4>
            </div>

            <p className="mb-6">{release.description}</p>

            {release.changes.map((changeGroup, index) => (
              <div key={index} className="mb-4">
                <h5 className="font-semibold mb-2 capitalize">
                  {changeGroup.type === "added" && "✨ Added"}
                  {changeGroup.type === "changed" && "🔄 Changed"}
                  {changeGroup.type === "fixed" && "🐛 Fixed"}
                  {changeGroup.type === "removed" && "🗑️ Removed"}
                </h5>
                <ul className="list-disc pl-6 space-y-1">
                  {changeGroup.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


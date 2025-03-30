"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

// Define icon sets with their prefixes
type IconSet = {
  name: string
  prefix: string
  icons: { name: string; keywords: string[] }[]
}

const iconSets: IconSet[] = [
  {
    name: "Material Design",
    prefix: "material",
    icons: [
      { name: "home", keywords: ["house", "main"] },
      { name: "search", keywords: ["find", "magnify", "glass"] },
      { name: "menu", keywords: ["hamburger", "navigation", "lines"] },
      { name: "close", keywords: ["x", "cancel", "delete"] },
      { name: "settings", keywords: ["gear", "cog", "preferences"] },
      { name: "account", keywords: ["user", "person", "profile"] },
      { name: "brightness-4", keywords: ["dark", "mode", "night", "theme"] },
      { name: "brightness-7", keywords: ["light", "mode", "day", "theme", "sun"] },
      { name: "check", keywords: ["tick", "done", "complete"] },
      { name: "arrow-left", keywords: ["back", "previous"] },
      { name: "arrow-right", keywords: ["next", "forward"] },
      { name: "arrow-up", keywords: ["top", "upward"] },
      { name: "arrow-down", keywords: ["bottom", "downward"] },
      { name: "star", keywords: ["favorite", "bookmark"] },
      { name: "heart", keywords: ["like", "love", "favorite"] },
      { name: "info", keywords: ["information", "help"] },
      { name: "warning", keywords: ["alert", "caution"] },
      { name: "error", keywords: ["problem", "issue"] },
      { name: "add", keywords: ["plus", "new", "create"] },
      { name: "remove", keywords: ["minus", "delete", "subtract"] },
      { name: "edit", keywords: ["pencil", "modify", "change"] },
      { name: "delete", keywords: ["trash", "bin", "remove"] },
      { name: "share", keywords: ["send", "social"] },
      { name: "download", keywords: ["save", "arrow"] },
      { name: "upload", keywords: ["send", "arrow"] },
      { name: "refresh", keywords: ["reload", "update", "sync"] },
      { name: "sync", keywords: ["update", "reload", "refresh"] },
      { name: "cloud", keywords: ["storage", "online", "save"] },
      { name: "folder", keywords: ["directory", "files"] },
      { name: "file", keywords: ["document", "paper"] },
      { name: "image", keywords: ["picture", "photo"] },
      { name: "video", keywords: ["movie", "film"] },
      { name: "music", keywords: ["audio", "sound", "note"] },
      { name: "email", keywords: ["mail", "message", "envelope"] },
      { name: "phone", keywords: ["call", "telephone"] },
      { name: "message", keywords: ["chat", "comment", "text"] },
      { name: "notifications", keywords: ["bell", "alert"] },
      { name: "calendar", keywords: ["date", "schedule", "event"] },
      { name: "clock", keywords: ["time", "watch", "hour"] },
      { name: "map", keywords: ["location", "directions", "pin"] },
    ],
  },
  {
    name: "FontAwesome",
    prefix: "fontawesome",
    icons: [
      { name: "home", keywords: ["house", "main"] },
      { name: "search", keywords: ["find", "magnify", "glass"] },
      { name: "bars", keywords: ["menu", "hamburger", "navigation"] },
      { name: "times", keywords: ["close", "x", "cancel"] },
      { name: "cog", keywords: ["settings", "gear", "preferences"] },
      { name: "user", keywords: ["account", "person", "profile"] },
      { name: "moon", keywords: ["dark", "night", "theme"] },
      { name: "sun", keywords: ["light", "day", "theme", "brightness"] },
      { name: "check", keywords: ["tick", "done", "complete"] },
      { name: "arrow-left", keywords: ["back", "previous"] },
      { name: "arrow-right", keywords: ["next", "forward"] },
      { name: "star", keywords: ["favorite", "bookmark"] },
      { name: "heart", keywords: ["like", "love", "favorite"] },
      { name: "info-circle", keywords: ["information", "help"] },
      { name: "exclamation-triangle", keywords: ["warning", "alert", "caution"] },
      { name: "exclamation-circle", keywords: ["error", "problem", "issue"] },
      { name: "plus", keywords: ["add", "new", "create"] },
      { name: "minus", keywords: ["remove", "delete", "subtract"] },
      { name: "pencil-alt", keywords: ["edit", "modify", "change"] },
      { name: "trash-alt", keywords: ["delete", "bin", "remove"] },
      { name: "share", keywords: ["send", "social"] },
      { name: "download", keywords: ["save", "arrow"] },
      { name: "upload", keywords: ["send", "arrow"] },
      { name: "sync", keywords: ["refresh", "update", "reload"] },
      { name: "cloud", keywords: ["storage", "online", "save"] },
      { name: "folder", keywords: ["directory", "files"] },
      { name: "file", keywords: ["document", "paper"] },
      { name: "image", keywords: ["picture", "photo"] },
      { name: "video", keywords: ["movie", "film"] },
      { name: "music", keywords: ["audio", "sound", "note"] },
      { name: "envelope", keywords: ["email", "mail", "message"] },
      { name: "phone", keywords: ["call", "telephone"] },
      { name: "comment", keywords: ["message", "chat", "text"] },
      { name: "bell", keywords: ["notifications", "alert"] },
      { name: "calendar", keywords: ["date", "schedule", "event"] },
      { name: "clock", keywords: ["time", "watch", "hour"] },
      { name: "map-marker-alt", keywords: ["location", "pin", "directions"] },
    ],
  },
  {
    name: "Octicons",
    prefix: "octicons",
    icons: [
      { name: "home", keywords: ["house", "main"] },
      { name: "search", keywords: ["find", "magnify", "glass"] },
      { name: "three-bars", keywords: ["menu", "hamburger", "navigation"] },
      { name: "x", keywords: ["close", "cancel", "delete"] },
      { name: "gear", keywords: ["settings", "cog", "preferences"] },
      { name: "person", keywords: ["account", "user", "profile"] },
      { name: "moon", keywords: ["dark", "night", "theme"] },
      { name: "sun", keywords: ["light", "day", "theme", "brightness"] },
      { name: "check", keywords: ["tick", "done", "complete"] },
      { name: "arrow-left", keywords: ["back", "previous"] },
      { name: "arrow-right", keywords: ["next", "forward"] },
      { name: "star", keywords: ["favorite", "bookmark"] },
      { name: "heart", keywords: ["like", "love", "favorite"] },
      { name: "info", keywords: ["information", "help"] },
      { name: "alert", keywords: ["warning", "caution"] },
      { name: "stop", keywords: ["error", "problem", "issue"] },
      { name: "plus", keywords: ["add", "new", "create"] },
      { name: "dash", keywords: ["minus", "remove", "subtract"] },
      { name: "pencil", keywords: ["edit", "modify", "change"] },
      { name: "trash", keywords: ["delete", "bin", "remove"] },
      { name: "repo-push", keywords: ["share", "send", "upload"] },
      { name: "desktop-download", keywords: ["save", "arrow"] },
      { name: "sync", keywords: ["refresh", "update", "reload"] },
      { name: "cloud", keywords: ["storage", "online", "save"] },
      { name: "file-directory", keywords: ["folder", "directory"] },
      { name: "file", keywords: ["document", "paper"] },
      { name: "file-media", keywords: ["image", "picture", "photo"] },
      { name: "device-camera-video", keywords: ["video", "movie", "film"] },
      { name: "unmute", keywords: ["music", "audio", "sound"] },
      { name: "mail", keywords: ["email", "message", "envelope"] },
      { name: "device-mobile", keywords: ["phone", "call", "telephone"] },
      { name: "comment", keywords: ["message", "chat", "text"] },
      { name: "bell", keywords: ["notifications", "alert"] },
      { name: "calendar", keywords: ["date", "schedule", "event"] },
      { name: "clock", keywords: ["time", "watch", "hour"] },
      { name: "location", keywords: ["map", "pin", "directions"] },
    ],
  },
  {
    name: "Simple Icons",
    prefix: "simple-icons",
    icons: [
      { name: "github", keywords: ["git", "code", "repository"] },
      { name: "gitlab", keywords: ["git", "code", "repository"] },
      { name: "bitbucket", keywords: ["git", "code", "repository"] },
      { name: "twitter", keywords: ["social", "tweet", "x"] },
      { name: "facebook", keywords: ["social", "meta"] },
      { name: "instagram", keywords: ["social", "photos"] },
      { name: "linkedin", keywords: ["social", "professional", "job"] },
      { name: "youtube", keywords: ["video", "streaming"] },
      { name: "twitch", keywords: ["streaming", "gaming"] },
      { name: "discord", keywords: ["chat", "gaming", "community"] },
      { name: "slack", keywords: ["chat", "work", "team"] },
      { name: "telegram", keywords: ["chat", "messaging"] },
      { name: "whatsapp", keywords: ["chat", "messaging"] },
      { name: "signal", keywords: ["chat", "messaging", "secure"] },
      { name: "gmail", keywords: ["email", "google", "mail"] },
      { name: "microsoft", keywords: ["windows", "office"] },
      { name: "apple", keywords: ["mac", "iphone", "ios"] },
      { name: "android", keywords: ["mobile", "phone", "google"] },
      { name: "linux", keywords: ["os", "open-source", "tux"] },
      { name: "ubuntu", keywords: ["linux", "os", "open-source"] },
      { name: "windows", keywords: ["microsoft", "os"] },
      { name: "chrome", keywords: ["browser", "google", "web"] },
      { name: "firefox", keywords: ["browser", "mozilla", "web"] },
      { name: "safari", keywords: ["browser", "apple", "web"] },
      { name: "edge", keywords: ["browser", "microsoft", "web"] },
      { name: "opera", keywords: ["browser", "web"] },
      { name: "npm", keywords: ["node", "package", "javascript"] },
      { name: "yarn", keywords: ["package", "javascript"] },
      { name: "react", keywords: ["javascript", "framework", "ui"] },
      { name: "vue", keywords: ["javascript", "framework", "ui"] },
      { name: "angular", keywords: ["javascript", "framework", "ui"] },
      { name: "svelte", keywords: ["javascript", "framework", "ui"] },
      { name: "nextdotjs", keywords: ["react", "framework", "vercel"] },
      { name: "nuxtdotjs", keywords: ["vue", "framework"] },
      { name: "python", keywords: ["programming", "language"] },
      { name: "javascript", keywords: ["programming", "language", "js"] },
      { name: "typescript", keywords: ["programming", "language", "ts"] },
      { name: "rust", keywords: ["programming", "language"] },
      { name: "go", keywords: ["programming", "language", "golang"] },
      { name: "docker", keywords: ["container", "devops"] },
      { name: "kubernetes", keywords: ["container", "devops", "k8s"] },
      { name: "aws", keywords: ["cloud", "amazon"] },
      { name: "googlecloud", keywords: ["cloud", "gcp"] },
      { name: "azure", keywords: ["cloud", "microsoft"] },
      { name: "vercel", keywords: ["hosting", "deployment", "nextjs"] },
      { name: "netlify", keywords: ["hosting", "deployment"] },
      { name: "cloudflare", keywords: ["cdn", "dns", "security"] },
    ],
  },
]

// Flatten all icons for search
const allIcons = iconSets.flatMap((set) =>
  set.icons.map((icon) => ({
    ...icon,
    fullName: `${set.prefix}/${icon.name}`,
    set: set.name,
    prefix: set.prefix,
  })),
)

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function IconPicker({ value, onChange, placeholder = "Select an icon" }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Parse the current value to highlight the correct icon
  const currentPrefix = value.split("/")[0]
  const currentName = value.split("/")[1]

  // Filter icons based on search query
  const filteredIcons =
    searchQuery.length > 0
      ? allIcons.filter(
          (icon) =>
            icon.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            icon.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : allIcons

  return (
    <div className="space-y-2">
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full" />
      <p className="text-xs text-muted-foreground">
        Enter the icon name in the format "namespace/icon-name", e.g., "material/home".{" "}
        <a
          href="https://squidfunk.github.io/mkdocs-material/reference/icons-emojis/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Browse available icons
        </a>
      </p>
    </div>
  )
}


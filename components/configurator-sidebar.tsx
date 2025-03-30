"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  AppWindow,
  Palette,
  Globe,
  Navigation,
  Shield,
  Type,
  ImagesIcon as Icons,
  Cookie,
  Search,
  LineChart,
  Share2,
  BookOpen,
  Tag,
  GitGraphIcon as Git,
  Layout,
  Book,
  HelpCircle,
  Bug,
  History,
} from "lucide-react"
import { getVersionString } from "@/utils/version"
import { Github } from "lucide-react"

export type ConfigSection =
  | "basic"
  | "appearance"
  | "appearance-colors"
  | "appearance-fonts"
  | "appearance-icons"
  | "localization"
  | "navigation"
  | "privacy"
  | "cookie-consent"
  | "search"
  | "analytics"
  | "social-cards"
  | "colors"
  | "fonts"
  | "icons"
  | "blog"
  | "tags"
  | "versioning"
  | "header-footer"
  | "git-repo"
  | "faq"
  | "changelog"

interface ConfiguratorSidebarProps {
  activeSection: ConfigSection
  onSectionChange: (section: ConfigSection) => void
}

export function ConfiguratorSidebar({ activeSection, onSectionChange }: ConfiguratorSidebarProps) {
  const currentYear = new Date().getFullYear()
  const versionString = getVersionString()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold">Material for MkDocs</h2>
          <p className="text-sm text-muted-foreground">Configuration Tool</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "basic"} onClick={() => onSectionChange("basic")}>
              <AppWindow className="h-4 w-4" />
              <span>Basic Configuration</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "colors"} onClick={() => onSectionChange("colors")}>
              <Palette className="h-4 w-4" />
              <span>Colors</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "fonts"} onClick={() => onSectionChange("fonts")}>
              <Type className="h-4 w-4" />
              <span>Fonts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "icons"} onClick={() => onSectionChange("icons")}>
              <Icons className="h-4 w-4" />
              <span>Icons</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "localization"}
              onClick={() => onSectionChange("localization")}
            >
              <Globe className="h-4 w-4" />
              <span>Localization</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "navigation"} onClick={() => onSectionChange("navigation")}>
              <Navigation className="h-4 w-4" />
              <span>Navigation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "search"} onClick={() => onSectionChange("search")}>
              <Search className="h-4 w-4" />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "privacy"} onClick={() => onSectionChange("privacy")}>
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "cookie-consent"}
              onClick={() => onSectionChange("cookie-consent")}
            >
              <Cookie className="h-4 w-4" />
              <span>Cookie Consent</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "analytics"} onClick={() => onSectionChange("analytics")}>
              <LineChart className="h-4 w-4" />
              <span>Analytics</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "social-cards"}
              onClick={() => onSectionChange("social-cards")}
            >
              <Share2 className="h-4 w-4" />
              <span>Social Cards</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "blog"} onClick={() => onSectionChange("blog")}>
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "tags"} onClick={() => onSectionChange("tags")}>
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "versioning"} onClick={() => onSectionChange("versioning")}>
              <Git className="h-4 w-4" />
              <span>Versioning</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "header-footer"}
              onClick={() => onSectionChange("header-footer")}
            >
              <Layout className="h-4 w-4" />
              <span>Header and Footer</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "git-repo"} onClick={() => onSectionChange("git-repo")}>
              <Git className="h-4 w-4" />
              <span>Git Repository</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Add a divider and the new section */}
        <div className="my-4 border-t border-border"></div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <a
                href="https://squidfunk.github.io/mkdocs-material/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Book className="h-4 w-4" />
                <span>Material Docs</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <a
                href="https://github.com/mocdaniel/mkdocs-material-configurator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "changelog"} onClick={() => onSectionChange("changelog")}>
              <History className="h-4 w-4" />
              <span>Changelog</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeSection === "faq"} onClick={() => onSectionChange("faq")}>
              <HelpCircle className="h-4 w-4" />
              <span>FAQs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <a
                href="https://github.com/mocdaniel/mkdocs-material-configurator/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Bug className="h-4 w-4" />
                <span>Report Issue</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Copyright and version information */}
      <SidebarFooter className="border-t">
        <div className="px-4 py-3 text-xs text-muted-foreground">
          <div className="flex flex-col gap-1">
            <div>
              © {currentYear}{" "}
              <a href="https://dbodky.me" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Daniel Bodky
              </a>
            </div>
            {versionString && <div>{versionString}</div>}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}


"use client";

import { useState } from "react";
import { YamlPreview } from "@/components/yaml-preview";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ConfiguratorSidebar } from "@/components/configurator-sidebar";
import { BasicSection } from "@/components/sections/basic-section";
import { AppearanceColorsSection } from "@/components/sections/appearance-colors-section";
import { AppearanceFontsSection } from "@/components/sections/appearance-fonts-section";
import { AppearanceIconsSection } from "@/components/sections/appearance-icons-section";
import { LocalizationSection } from "@/components/sections/localization-section";
import { NavigationSection } from "@/components/sections/navigation-section";
import { PrivacySection } from "@/components/sections/privacy-section";
import { CookieConsentSection } from "@/components/sections/cookie-consent-section";
import type { MkDocsConfig } from "@/types/mkdocs-config";
// Import the SearchSection component
import { SearchSection } from "@/components/sections/search-section";
// Import the AnalyticsSection component at the top
import { AnalyticsSection } from "@/components/sections/analytics-section";
// Import the SocialCardSection component
import { SocialCardSection } from "@/components/sections/social-card-section";
// Import the BlogSection component at the top
import { BlogSection } from "@/components/sections/blog-section";
// Import the TagsSection component
import { TagsSection } from "@/components/sections/tags-section";
// Import the VersioningSection component
import { VersioningSection } from "@/components/sections/versioning-section";
// Add the import for the HeaderFooterSection component
import { HeaderFooterSection } from "@/components/sections/header-footer-section";
// Add the import for the GitRepoSection component at the top
import { GitRepoSection } from "@/components/sections/git-repo-section";
// Import the FAQ component
import { FAQ } from "@/components/faq";
// Import the Changelog component
import { Changelog } from "@/components/changelog";
// Import the BuyMeCoffee component
import { BuyMeCoffee } from "@/components/buy-me-coffee";

// Update the ConfigSectionType to include "changelog"
export type ConfigSectionType =
  | "basic"
  | "colors"
  | "fonts"
  | "icons"
  | "localization"
  | "navigation"
  | "privacy"
  | "cookie-consent"
  | "search"
  | "analytics"
  | "social-cards"
  | "blog"
  | "tags"
  | "versioning"
  | "header-footer"
  | "git-repo"
  | "faq"
  | "changelog";

export function ConfiguratorLayout() {
  const isMobile = useMobile();
  const [activeSection, setActiveSection] =
    useState<ConfigSectionType>("basic");
  const [config, setConfig] = useState<MkDocsConfig>({
    site_name: "My MkDocs Site",
    theme: {
      name: "material",
      palette: [
        {
          scheme: "default",
          primary: "indigo",
          accent: "indigo",
          toggle: {
            icon: "material/brightness-7",
            name: "Switch to dark mode",
          },
        },
        {
          scheme: "slate",
          primary: "indigo",
          accent: "indigo",
          toggle: {
            icon: "material/brightness-4",
            name: "Switch to light mode",
          },
        },
      ],
      features: [],
      font: {
        text: "Roboto",
        code: "Roboto Mono",
      },
      // Logo and favicon are initialized as undefined
    },
    extra: {
      // Initialize with default cookie consent (disabled by default)
      // consent: {
      //   title: "Cookie consent",
      //   description: "We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. With your consent, you're helping us to make our documentation better."
      // }
    },
  });

  const handleConfigChange = (newConfig: MkDocsConfig) => {
    setConfig(newConfig);
  };

  // Update the renderActiveSection function to handle the "changelog" section
  const renderActiveSection = () => {
    switch (activeSection) {
      case "basic":
        return <BasicSection config={config} onChange={handleConfigChange} />;
      case "colors":
        return (
          <AppearanceColorsSection
            config={config}
            onChange={handleConfigChange}
          />
        );
      case "fonts":
        return (
          <AppearanceFontsSection
            config={config}
            onChange={handleConfigChange}
          />
        );
      case "icons":
        return (
          <AppearanceIconsSection
            config={config}
            onChange={handleConfigChange}
          />
        );
      case "localization":
        return (
          <LocalizationSection config={config} onChange={handleConfigChange} />
        );
      case "navigation":
        return (
          <NavigationSection config={config} onChange={handleConfigChange} />
        );
      case "privacy":
        return <PrivacySection config={config} onChange={handleConfigChange} />;
      case "cookie-consent":
        return (
          <CookieConsentSection config={config} onChange={handleConfigChange} />
        );
      case "search":
        return <SearchSection config={config} onChange={handleConfigChange} />;
      case "analytics":
        return (
          <AnalyticsSection config={config} onChange={handleConfigChange} />
        );
      case "social-cards":
        return (
          <SocialCardSection config={config} onChange={handleConfigChange} />
        );
      case "blog":
        return <BlogSection config={config} onChange={handleConfigChange} />;
      case "tags":
        return <TagsSection config={config} onChange={handleConfigChange} />;
      case "versioning":
        return (
          <VersioningSection config={config} onChange={handleConfigChange} />
        );
      case "header-footer":
        return (
          <HeaderFooterSection config={config} onChange={handleConfigChange} />
        );
      case "git-repo":
        return <GitRepoSection config={config} onChange={handleConfigChange} />;
      case "faq":
        return <FAQ />;
      case "changelog":
        return <Changelog />;
      default:
        return <BasicSection config={config} onChange={handleConfigChange} />;
    }
  };

  return (
    <SidebarProvider>
      <ConfiguratorSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset>
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-3xl font-bold">
                Material for MkDocs Configurator
              </h1>
            </div>
            {!isMobile && <BuyMeCoffee />}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full 2xl:w-1/2">{renderActiveSection()}</div>

            {activeSection !== "faq" && activeSection !== "changelog" ? (
              isMobile ? (
                <>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-20">
                        <Eye className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh]">
                      <div className="pt-6 h-full overflow-auto">
                        <YamlPreview config={config} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <div className="w-full lg:w-1/2 sticky top-4">
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h2 className="text-xl font-semibold mb-4">YAML Preview</h2>
                    <YamlPreview config={config} />
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </SidebarInset>
      {/* Always render the BuyMeCoffee component for mobile at the root level */}
      {isMobile && <BuyMeCoffee />}
    </SidebarProvider>
  );
}

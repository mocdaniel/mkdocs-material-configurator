"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { MkDocsConfig } from "@/types/mkdocs-config";

export function YamlPreview({ config }: { config: MkDocsConfig }) {
  const [yamlContent, setYamlContent] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Convert config object to YAML
    const yaml = convertToYaml(config);
    setYamlContent(yaml);
  }, [config]);

  const convertToYaml = (config: MkDocsConfig): string => {
    let yaml = "";

    // Define default values
    const defaults = {
      theme: {
        name: "material",
        palette: {
          primary: "indigo",
          accent: "indigo",
        },
        font: {
          text: "Roboto",
          code: "Roboto Mono",
        },
        features: [],
      },
      plugins: {
        privacy: {
          enabled: true,
          concurrency: 1,
          cache: true,
          cache_dir: ".cache/plugin/privacy",
          assets: true,
          assets_fetch_dir: "assets/external",
        },
        blog: {
          enabled: true,
          blog_dir: "blog",
          blog_toc: true,
          post_dir: "{blog}/posts",
          post_date_format: "long",
          post_url_date_format: "yyyy/MM/dd",
          post_url_format: "{date}/{slug}",
          post_url_max_categories: 1,
          post_excerpt: "optional",
          post_excerpt_max_authors: 1,
          post_excerpt_max_categories: 5,
          post_excerpt_separator: "<!-- more -->",
          post_readtime: true,
          post_readtime_words_per_minute: 265,
        },
        tags: {
          enabled: true,
          tags: true,
          tags_slugify_separator: "-",
          tags_slugify_format: "tag:{slug}",
          tags_sort_reverse: false,
          tags_name_property: "tags",
          tags_name_variable: "tags",
          listings: true,
          listings_directive: "material/tags",
          listings_sort_reverse: false,
          listings_tags_sort_reverse: false,
        },
      },
    };

    // Helper function to check if a value is different from its default
    const isDifferentFromDefault = (value: any, defaultValue: any): boolean => {
      // Handle undefined or null
      if (value === undefined || value === null) {
        return false;
      }

      // Handle objects
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        // Check if any property is different from default
        return Object.keys(value).some((key) => {
          const defaultObj = defaultValue || {};
          return isDifferentFromDefault(value[key], defaultObj[key]);
        });
      }

      // Handle arrays
      if (Array.isArray(value)) {
        if (!Array.isArray(defaultValue)) return true;
        if (value.length !== defaultValue.length) return true;

        // For simple arrays, check if contents are different
        if (value.length === 0) return false;
        if (typeof value[0] !== "object") {
          return JSON.stringify(value) !== JSON.stringify(defaultValue);
        }

        // For arrays of objects, check if any object has non-default values
        return value.some((item, index) => {
          return isDifferentFromDefault(item, defaultValue[index]);
        });
      }

      // Handle primitives
      return value !== defaultValue;
    };

    // Add site_name (always required)
    yaml += `site_name: ${config.site_name}\n`;

    // Add site_url if present
    if (config.site_url) {
      yaml += `site_url: ${config.site_url}\n`;
    }

    // Add repo_url if present
    if (config.repo_url) {
      yaml += `repo_url: ${config.repo_url}\n`;
    }

    // Add repo_name if present
    if (config.repo_name) {
      yaml += `repo_name: ${config.repo_name}\n`;
    }

    // Add edit_uri if present
    if (config.edit_uri) {
      yaml += `edit_uri: ${config.edit_uri}\n`;
    }

    // Add copyright if present
    if (config.copyright) {
      yaml += `copyright: >\n  ${config.copyright}\n`;
    }

    // Check if search is explicitly disabled or if there are other plugins
    const isSearchDisabled = config.plugins?.some((plugin) => {
      if (typeof plugin === "object" && "search" in plugin) {
        return plugin.search === false;
      }
      return false;
    });

    const hasOtherPlugins = config.plugins?.some((plugin) => {
      if (typeof plugin === "string") {
        return plugin !== "search";
      }
      if (typeof plugin === "object") {
        return !("search" in plugin);
      }
      return false;
    });

    // Add plugins if present or if search is disabled
    if ((config.plugins && config.plugins.length > 0) || isSearchDisabled) {
      yaml += "plugins:\n";

      // If search is not explicitly disabled and there are other plugins, add search explicitly
      if (
        !isSearchDisabled &&
        hasOtherPlugins &&
        !config.plugins?.includes("search")
      ) {
        yaml += "  - search\n";
      }

      // Add all other plugins
      if (config.plugins) {
        config.plugins.forEach((plugin) => {
          if (typeof plugin === "string") {
            yaml += `  - ${plugin}\n`;
          } else {
            // Handle plugin objects
            for (const [pluginName, pluginConfig] of Object.entries(plugin)) {
              // Skip search: false as we've already handled it
              if (pluginName === "search" && pluginConfig === false) {
                yaml += `  - search: false\n`;
                continue;
              }

              yaml += `  - ${pluginName}:\n`;

              // Special handling for privacy plugin
              if (
                pluginName === "privacy" &&
                typeof pluginConfig === "object"
              ) {
                const privacyConfig = pluginConfig as any;
                const defaultPrivacy = defaults.plugins.privacy;

                // Only include enabled if different from default
                if (
                  privacyConfig.enabled !== undefined &&
                  privacyConfig.enabled !== defaultPrivacy.enabled
                ) {
                  yaml += `      enabled: ${privacyConfig.enabled}\n`;
                }

                // Only include concurrency if different from default
                if (
                  privacyConfig.concurrency !== undefined &&
                  privacyConfig.concurrency !== defaultPrivacy.concurrency
                ) {
                  yaml += `      concurrency: ${privacyConfig.concurrency}\n`;
                }

                // Only include cache if different from default
                if (
                  privacyConfig.cache !== undefined &&
                  privacyConfig.cache !== defaultPrivacy.cache
                ) {
                  yaml += `      cache: ${privacyConfig.cache}\n`;
                }

                // Only include cache_dir if different from default
                if (
                  privacyConfig.cache_dir &&
                  privacyConfig.cache_dir !== defaultPrivacy.cache_dir
                ) {
                  yaml += `      cache_dir: ${privacyConfig.cache_dir}\n`;
                }

                // Only include assets if different from default
                if (
                  privacyConfig.assets !== undefined &&
                  privacyConfig.assets !== defaultPrivacy.assets
                ) {
                  yaml += `      assets: ${privacyConfig.assets}\n`;
                }

                // Only include assets_fetch_dir if different from default
                if (
                  privacyConfig.assets_fetch_dir &&
                  privacyConfig.assets_fetch_dir !==
                    defaultPrivacy.assets_fetch_dir
                ) {
                  yaml += `      assets_fetch_dir: ${privacyConfig.assets_fetch_dir}\n`;
                }
              }
              // Special handling for social plugin
              else if (
                pluginName === "social" &&
                typeof pluginConfig === "object"
              ) {
                const socialConfig = pluginConfig as any;

                // Only include cards if it's explicitly set to false (since true is default)
                if (socialConfig.cards === false) {
                  yaml += `      cards: false\n`;
                }

                // Only include cards_dir if it's different from default
                if (
                  socialConfig.cards_dir &&
                  socialConfig.cards_dir !== "assets/images/social"
                ) {
                  yaml += `      cards_dir: ${socialConfig.cards_dir}\n`;
                }
              }
              // Special handling for blog plugin
              else if (
                pluginName === "blog" &&
                typeof pluginConfig === "object"
              ) {
                const blogConfig = pluginConfig as any;
                const defaultBlog = defaults.plugins.blog;

                // Check if all settings match defaults
                const isDefault =
                  (blogConfig.enabled === undefined ||
                    blogConfig.enabled === defaultBlog.enabled) &&
                  (blogConfig.blog_dir === undefined ||
                    blogConfig.blog_dir === defaultBlog.blog_dir) &&
                  (blogConfig.blog_toc === undefined ||
                    blogConfig.blog_toc === defaultBlog.blog_toc) &&
                  (blogConfig.post_dir === undefined ||
                    blogConfig.post_dir === defaultBlog.post_dir) &&
                  (blogConfig.post_date_format === undefined ||
                    blogConfig.post_date_format ===
                      defaultBlog.post_date_format) &&
                  (blogConfig.post_url_date_format === undefined ||
                    blogConfig.post_url_date_format ===
                      defaultBlog.post_url_date_format) &&
                  (blogConfig.post_url_format === undefined ||
                    blogConfig.post_url_format ===
                      defaultBlog.post_url_format) &&
                  (blogConfig.post_url_max_categories === undefined ||
                    blogConfig.post_url_max_categories ===
                      defaultBlog.post_url_max_categories) &&
                  (blogConfig.post_excerpt === undefined ||
                    blogConfig.post_excerpt === defaultBlog.post_excerpt) &&
                  (blogConfig.post_excerpt_max_authors === undefined ||
                    blogConfig.post_excerpt_max_authors ===
                      defaultBlog.post_excerpt_max_authors) &&
                  (blogConfig.post_excerpt_max_categories === undefined ||
                    blogConfig.post_excerpt_max_categories ===
                      defaultBlog.post_excerpt_max_categories) &&
                  (blogConfig.post_excerpt_separator === undefined ||
                    blogConfig.post_excerpt_separator ===
                      defaultBlog.post_excerpt_separator) &&
                  (blogConfig.post_readtime === undefined ||
                    blogConfig.post_readtime === defaultBlog.post_readtime) &&
                  (blogConfig.post_readtime_words_per_minute === undefined ||
                    blogConfig.post_readtime_words_per_minute ===
                      defaultBlog.post_readtime_words_per_minute);

                // If all settings match defaults, don't output any configuration
                if (isDefault) {
                  // Remove the last line which added the plugin name with colon
                  yaml = yaml.replace(
                    `  - ${pluginName}:\n`,
                    `  - ${pluginName}\n`
                  );
                } else {
                  // Only include settings that differ from defaults
                  if (
                    blogConfig.enabled !== undefined &&
                    blogConfig.enabled !== defaultBlog.enabled
                  ) {
                    yaml += `      enabled: ${blogConfig.enabled}\n`;
                  }

                  if (
                    blogConfig.blog_dir !== undefined &&
                    blogConfig.blog_dir !== defaultBlog.blog_dir
                  ) {
                    yaml += `      blog_dir: ${blogConfig.blog_dir}\n`;
                  }

                  if (
                    blogConfig.blog_toc !== undefined &&
                    blogConfig.blog_toc !== defaultBlog.blog_toc
                  ) {
                    yaml += `      blog_toc: ${blogConfig.blog_toc}\n`;
                  }

                  if (
                    blogConfig.post_dir !== undefined &&
                    blogConfig.post_dir !== defaultBlog.post_dir
                  ) {
                    yaml += `      post_dir: ${blogConfig.post_dir}\n`;
                  }

                  if (
                    blogConfig.post_date_format !== undefined &&
                    blogConfig.post_date_format !== defaultBlog.post_date_format
                  ) {
                    yaml += `      post_date_format: ${blogConfig.post_date_format}\n`;
                  }

                  if (
                    blogConfig.post_url_date_format !== undefined &&
                    blogConfig.post_url_date_format !==
                      defaultBlog.post_url_date_format
                  ) {
                    yaml += `      post_url_date_format: ${blogConfig.post_url_date_format}\n`;
                  }

                  if (
                    blogConfig.post_url_format !== undefined &&
                    blogConfig.post_url_format !== defaultBlog.post_url_format
                  ) {
                    yaml += `      post_url_format: ${blogConfig.post_url_format}\n`;
                  }

                  if (
                    blogConfig.post_url_max_categories !== undefined &&
                    blogConfig.post_url_max_categories !==
                      defaultBlog.post_url_max_categories
                  ) {
                    yaml += `      post_url_max_categories: ${blogConfig.post_url_max_categories}\n`;
                  }

                  if (
                    blogConfig.post_excerpt !== undefined &&
                    blogConfig.post_excerpt !== defaultBlog.post_excerpt
                  ) {
                    yaml += `      post_excerpt: ${blogConfig.post_excerpt}\n`;
                  }

                  if (
                    blogConfig.post_excerpt_max_authors !== undefined &&
                    blogConfig.post_excerpt_max_authors !==
                      defaultBlog.post_excerpt_max_authors
                  ) {
                    yaml += `      post_excerpt_max_authors: ${blogConfig.post_excerpt_max_authors}\n`;
                  }

                  if (
                    blogConfig.post_excerpt_max_categories !== undefined &&
                    blogConfig.post_excerpt_max_categories !==
                      defaultBlog.post_excerpt_max_categories
                  ) {
                    yaml += `      post_excerpt_max_categories: ${blogConfig.post_excerpt_max_categories}\n`;
                  }

                  if (
                    blogConfig.post_excerpt_separator !== undefined &&
                    blogConfig.post_excerpt_separator !==
                      defaultBlog.post_excerpt_separator
                  ) {
                    yaml += `      post_excerpt_separator: ${blogConfig.post_excerpt_separator}\n`;
                  }

                  if (
                    blogConfig.post_readtime !== undefined &&
                    blogConfig.post_readtime !== defaultBlog.post_readtime
                  ) {
                    yaml += `      post_readtime: ${blogConfig.post_readtime}\n`;
                  }

                  if (
                    blogConfig.post_readtime_words_per_minute !== undefined &&
                    blogConfig.post_readtime_words_per_minute !==
                      defaultBlog.post_readtime_words_per_minute
                  ) {
                    yaml += `      post_readtime_words_per_minute: ${blogConfig.post_readtime_words_per_minute}\n`;
                  }
                }
              }
              // Special handling for tags plugin
              else if (
                pluginName === "tags" &&
                typeof pluginConfig === "object"
              ) {
                const tagsConfig = pluginConfig as any;
                const defaultTags = defaults.plugins.tags;

                // Check if all settings match defaults
                const isDefault =
                  (tagsConfig.enabled === undefined ||
                    tagsConfig.enabled === defaultTags.enabled) &&
                  (tagsConfig.tags === undefined ||
                    tagsConfig.tags === defaultTags.tags) &&
                  (tagsConfig.tags_slugify_separator === undefined ||
                    tagsConfig.tags_slugify_separator ===
                      defaultTags.tags_slugify_separator) &&
                  (tagsConfig.tags_slugify_format === undefined ||
                    tagsConfig.tags_slugify_format ===
                      defaultTags.tags_slugify_format) &&
                  (tagsConfig.tags_sort_reverse === undefined ||
                    tagsConfig.tags_sort_reverse ===
                      defaultTags.tags_sort_reverse) &&
                  (tagsConfig.tags_name_property === undefined ||
                    tagsConfig.tags_name_property ===
                      defaultTags.tags_name_property) &&
                  (tagsConfig.tags_name_variable === undefined ||
                    tagsConfig.tags_name_variable ===
                      defaultTags.tags_name_variable) &&
                  (!tagsConfig.tags_allowed ||
                    tagsConfig.tags_allowed.length === 0) &&
                  (tagsConfig.listings === undefined ||
                    tagsConfig.listings === defaultTags.listings) &&
                  (tagsConfig.listings_directive === undefined ||
                    tagsConfig.listings_directive ===
                      defaultTags.listings_directive) &&
                  (tagsConfig.listings_sort_reverse === undefined ||
                    tagsConfig.listings_sort_reverse ===
                      defaultTags.listings_sort_reverse) &&
                  (tagsConfig.listings_tags_sort_reverse === undefined ||
                    tagsConfig.listings_tags_sort_reverse ===
                      defaultTags.listings_tags_sort_reverse) &&
                  (!tagsConfig.listings_map ||
                    Object.keys(tagsConfig.listings_map).length === 0);

                // If all settings match defaults, don't output any configuration
                if (isDefault) {
                  // Remove the last line which added the plugin name with colon
                  yaml = yaml.replace(
                    `  - ${pluginName}:\n`,
                    `  - ${pluginName}\n`
                  );
                } else {
                  // Only include settings that differ from defaults
                  if (
                    tagsConfig.enabled !== undefined &&
                    tagsConfig.enabled !== defaultTags.enabled
                  ) {
                    yaml += `      enabled: ${tagsConfig.enabled}\n`;
                  }

                  if (
                    tagsConfig.tags !== undefined &&
                    tagsConfig.tags !== defaultTags.tags
                  ) {
                    yaml += `      tags: ${tagsConfig.tags}\n`;
                  }

                  if (
                    tagsConfig.tags_slugify_separator !== undefined &&
                    tagsConfig.tags_slugify_separator !==
                      defaultTags.tags_slugify_separator
                  ) {
                    yaml += `      tags_slugify_separator: ${tagsConfig.tags_slugify_separator}\n`;
                  }

                  if (
                    tagsConfig.tags_slugify_format !== undefined &&
                    tagsConfig.tags_slugify_format !==
                      defaultTags.tags_slugify_format
                  ) {
                    yaml += `      tags_slugify_format: ${tagsConfig.tags_slugify_format}\n`;
                  }

                  if (
                    tagsConfig.tags_sort_reverse !== undefined &&
                    tagsConfig.tags_sort_reverse !==
                      defaultTags.tags_sort_reverse
                  ) {
                    yaml += `      tags_sort_reverse: ${tagsConfig.tags_sort_reverse}\n`;
                  }

                  if (
                    tagsConfig.tags_name_property !== undefined &&
                    tagsConfig.tags_name_property !==
                      defaultTags.tags_name_property
                  ) {
                    yaml += `      tags_name_property: ${tagsConfig.tags_name_property}\n`;
                  }

                  if (
                    tagsConfig.tags_name_variable !== undefined &&
                    tagsConfig.tags_name_variable !==
                      defaultTags.tags_name_variable
                  ) {
                    yaml += `      tags_name_variable: ${tagsConfig.tags_name_variable}\n`;
                  }

                  // Handle allowed tags list
                  if (
                    tagsConfig.tags_allowed &&
                    tagsConfig.tags_allowed.length > 0
                  ) {
                    yaml += `      tags_allowed:\n`;
                    tagsConfig.tags_allowed.forEach((tag: string) => {
                      yaml += `        - ${tag}\n`;
                    });
                  }

                  // Handle listings settings
                  if (
                    tagsConfig.listings !== undefined &&
                    tagsConfig.listings !== defaultTags.listings
                  ) {
                    yaml += `      listings: ${tagsConfig.listings}\n`;
                  }

                  if (
                    tagsConfig.listings_directive !== undefined &&
                    tagsConfig.listings_directive !==
                      defaultTags.listings_directive
                  ) {
                    yaml += `      listings_directive: ${tagsConfig.listings_directive}\n`;
                  }

                  if (
                    tagsConfig.listings_sort_reverse !== undefined &&
                    tagsConfig.listings_sort_reverse !==
                      defaultTags.listings_sort_reverse
                  ) {
                    yaml += `      listings_sort_reverse: ${tagsConfig.listings_sort_reverse}\n`;
                  }

                  if (
                    tagsConfig.listings_tags_sort_reverse !== undefined &&
                    tagsConfig.listings_tags_sort_reverse !==
                      defaultTags.listings_tags_sort_reverse
                  ) {
                    yaml += `      listings_tags_sort_reverse: ${tagsConfig.listings_tags_sort_reverse}\n`;
                  }

                  // Handle listings map
                  if (
                    tagsConfig.listings_map &&
                    Object.keys(tagsConfig.listings_map).length > 0
                  ) {
                    yaml += `      listings_map:\n`;
                    Object.entries(tagsConfig.listings_map).forEach(
                      ([id, config]) => {
                        yaml += `        ${id}:\n`;
                        const { scope, exclude } = config as {
                          scope: boolean;
                          exclude?: string;
                        };
                        yaml += `          scope: ${scope}\n`;
                        if (exclude) {
                          yaml += `          exclude: ${exclude}\n`;
                        }
                      }
                    );
                  }

                  // Note: We don't handle the Python objects like tags_slugify, tags_sort_by,
                  // listings_sort_by, and listings_tags_sort_by as they require special handling
                  // that's not easily representable in the UI
                }
              }
              // Special handling for RSS plugin
              else if (
                pluginName === "rss" &&
                typeof pluginConfig === "object"
              ) {
                const rssConfig = pluginConfig as any;

                yaml += `      enabled: ${
                  rssConfig.enabled !== undefined ? rssConfig.enabled : true
                }\n`;

                if (rssConfig.match_path) {
                  yaml += `      match_path: ${rssConfig.match_path}\n`;
                }

                if (rssConfig.date_from_meta) {
                  yaml += `      date_from_meta:\n`;
                  if (rssConfig.date_from_meta.as_creation) {
                    yaml += `        as_creation: ${rssConfig.date_from_meta.as_creation}\n`;
                  }
                }

                if (rssConfig.categories && rssConfig.categories.length > 0) {
                  yaml += `      categories:\n`;
                  rssConfig.categories.forEach((category: string) => {
                    yaml += `        - ${category}\n`;
                  });
                }
              }
              // Special handling for git-revision-date-localized plugin
              else if (
                pluginName === "git-revision-date-localized" &&
                typeof pluginConfig === "object"
              ) {
                const revisionConfig = pluginConfig as any;

                // Check if all settings are at default values
                const isDefault =
                  (revisionConfig.enabled === undefined ||
                    revisionConfig.enabled === true) &&
                  (revisionConfig.type === undefined ||
                    revisionConfig.type === "date") &&
                  (revisionConfig.enable_creation_date === undefined ||
                    revisionConfig.enable_creation_date === false) &&
                  (revisionConfig.fallback_to_build_date === undefined ||
                    revisionConfig.fallback_to_build_date === false);

                // If all settings are default, remove the plugin object and add it as a simple string
                if (isDefault) {
                  // Remove the last line which added the plugin name with colon
                  yaml = yaml.replace(
                    `  - ${pluginName}:\n`,
                    `  - ${pluginName}\n`
                  );
                } else {
                  // Only include settings that differ from defaults
                  if (revisionConfig.enabled === false) {
                    yaml += `      enabled: false\n`;
                  }

                  if (revisionConfig.type && revisionConfig.type !== "date") {
                    yaml += `      type: ${revisionConfig.type}\n`;
                  }

                  if (revisionConfig.enable_creation_date === true) {
                    yaml += `      enable_creation_date: true\n`;
                  }

                  if (revisionConfig.fallback_to_build_date === true) {
                    yaml += `      fallback_to_build_date: true\n`;
                  }
                }
              }
              // Special handling for git-committers plugin
              else if (
                pluginName === "git-committers" &&
                typeof pluginConfig === "object"
              ) {
                const committersConfig = pluginConfig as any;

                // Check if all settings are at default values or empty
                const isDefault =
                  (committersConfig.enabled === undefined ||
                    committersConfig.enabled === true) &&
                  (!committersConfig.repository ||
                    committersConfig.repository === "") &&
                  (committersConfig.branch === undefined ||
                    committersConfig.branch === "master");

                // If all settings are default, remove the plugin object and add it as a simple string
                if (isDefault) {
                  // Remove the last line which added the plugin name with colon
                  yaml = yaml.replace(
                    `  - ${pluginName}:\n`,
                    `  - ${pluginName}\n`
                  );
                } else {
                  // Only include settings that differ from defaults
                  if (committersConfig.enabled === false) {
                    yaml += `      enabled: false\n`;
                  }

                  // Repository is required if specified
                  if (committersConfig.repository) {
                    yaml += `      repository: ${committersConfig.repository}\n`;
                  }

                  // Only include branch if it's different from default
                  if (
                    committersConfig.branch &&
                    committersConfig.branch !== "master"
                  ) {
                    yaml += `      branch: ${committersConfig.branch}\n`;
                  }
                }
              } else if (pluginConfig !== false) {
                // Generic handling for other plugin objects
                for (const [key, value] of Object.entries(
                  pluginConfig as object
                )) {
                  yaml += `      ${key}: ${value}\n`;
                }
              }
            }
          }
        });
      }
    }

    // Add theme configuration (always include name)
    yaml += "theme:\n";
    yaml += `  name: ${config.theme.name}\n`;

    // Add logo if present
    if (config.theme.logo) {
      yaml += `  logo: ${config.theme.logo}\n`;
    }

    // Add favicon if present
    if (config.theme.favicon) {
      yaml += `  favicon: ${config.theme.favicon}\n`;
    }

    // Add icon configuration if present
    if (config.theme.icon && Object.keys(config.theme.icon).length > 0) {
      yaml += "  icon:\n";

      // Add each icon configuration
      Object.entries(config.theme.icon).forEach(([key, value]) => {
        if (value) {
          yaml += `    ${key}: ${value}\n`;
        }
      });
    }

    // Add palette(s) if different from default
    if (config.theme.palette) {
      const palettes = Array.isArray(config.theme.palette)
        ? config.theme.palette
        : [config.theme.palette];

      // Check if any palette has non-default values
      const hasNonDefaultPalette = palettes.some((palette) => {
        return isDifferentFromDefault(palette, defaults.theme.palette);
      });

      if (
        hasNonDefaultPalette ||
        palettes.length > 1 ||
        config.theme.automaticMode
      ) {
        yaml += "  palette:\n";

        // Check if automatic mode is enabled
        if (config.theme.automaticMode && palettes.length === 2) {
          // We need to generate three palettes for automatic mode

          // First, add the automatic palette
          yaml += '    - media: "(prefers-color-scheme)"\n';
          yaml += "      toggle:\n";
          yaml += "        icon: material/brightness-auto\n";
          yaml += "        name: Switch to light mode\n";

          // Find light and dark palettes
          const lightPalette = palettes.find(
            (p) => p.scheme === "default" || !p.scheme
          );
          const darkPalette = palettes.find((p) => p.scheme === "slate");

          if (lightPalette) {
            // Add light palette
            yaml += '    - media: "(prefers-color-scheme: light)"\n';
            yaml += `      scheme: ${lightPalette.scheme || "default"}\n`;

            if (
              lightPalette.primary &&
              lightPalette.primary !== defaults.theme.palette.primary
            ) {
              yaml += `      primary: ${lightPalette.primary}\n`;
            }

            if (
              lightPalette.accent &&
              lightPalette.accent !== defaults.theme.palette.accent
            ) {
              yaml += `      accent: ${lightPalette.accent}\n`;
            }

            if (lightPalette.toggle) {
              yaml += "      toggle:\n";
              if (lightPalette.toggle.icon) {
                yaml += `        icon: ${lightPalette.toggle.icon}\n`;
              }
              yaml += "        name: Switch to dark mode\n";
            }
          }

          if (darkPalette) {
            // Add dark palette
            yaml += '    - media: "(prefers-color-scheme: dark)"\n';
            yaml += `      scheme: ${darkPalette.scheme}\n`;

            if (
              darkPalette.primary &&
              darkPalette.primary !== defaults.theme.palette.primary
            ) {
              yaml += `      primary: ${darkPalette.primary}\n`;
            }

            if (
              darkPalette.accent &&
              darkPalette.accent !== defaults.theme.palette.accent
            ) {
              yaml += `      accent: ${darkPalette.accent}\n`;
            }

            if (darkPalette.toggle) {
              yaml += "      toggle:\n";
              if (darkPalette.toggle.icon) {
                yaml += `        icon: ${darkPalette.toggle.icon}\n`;
              }
              yaml += "        name: Switch to system preference\n";
            }
          }
        }
        // Handle multiple palettes (array with more than one item)
        else if (palettes.length > 1) {
          palettes.forEach((palette, index) => {
            yaml += "    - ";

            if (palette.media) {
              yaml += `media: "${palette.media}"\n      `;
            }

            if (palette.scheme) {
              yaml += `scheme: ${palette.scheme}\n`;
            }

            if (
              palette.primary &&
              palette.primary !== defaults.theme.palette.primary
            ) {
              yaml += `      primary: ${palette.primary}\n`;
            }

            if (
              palette.accent &&
              palette.accent !== defaults.theme.palette.accent
            ) {
              yaml += `      accent: ${palette.accent}\n`;
            }

            if (palette.toggle) {
              yaml += "      toggle:\n";
              if (palette.toggle.icon) {
                yaml += `        icon: ${palette.toggle.icon}\n`;
              }
              if (palette.toggle.name) {
                yaml += `        name: ${palette.toggle.name}\n`;
              }
            }
          });
        }
        // Handle single palette (either object or array with one item)
        else {
          const palette = palettes[0];

          // Only include palette properties if they differ from defaults
          const hasNonDefaultProperties =
            palette.scheme ||
            (palette.primary &&
              palette.primary !== defaults.theme.palette.primary) ||
            (palette.accent &&
              palette.accent !== defaults.theme.palette.accent) ||
            palette.media ||
            palette.toggle;

          if (hasNonDefaultProperties) {
            if (palette.scheme) {
              yaml += `    scheme: ${palette.scheme}\n`;
            }

            if (palette.media) {
              yaml += `    media: "${palette.media}"\n`;
            }

            if (
              palette.primary &&
              palette.primary !== defaults.theme.palette.primary
            ) {
              yaml += `    primary: ${palette.primary}\n`;
            }

            if (
              palette.accent &&
              palette.accent !== defaults.theme.palette.accent
            ) {
              yaml += `    accent: ${palette.accent}\n`;
            }

            if (palette.toggle) {
              yaml += "    toggle:\n";
              if (palette.toggle.icon) {
                yaml += `      icon: ${palette.toggle.icon}\n`;
              }
              if (palette.toggle.name) {
                yaml += `      name: ${palette.toggle.name}\n`;
              }
            }
          }
        }
      }
    }

    // Add font configuration if different from default
    if (config.theme.font === false) {
      yaml += "  font: false\n";
    } else if (config.theme.font && typeof config.theme.font === "object") {
      const fontConfig = config.theme.font;
      const defaultFont = defaults.theme.font;

      // Check if any font property is different from default
      const hasNonDefaultFont =
        (fontConfig.text && fontConfig.text !== defaultFont.text) ||
        (fontConfig.code && fontConfig.code !== defaultFont.code);

      if (hasNonDefaultFont) {
        yaml += "  font:\n";

        if (fontConfig.text && fontConfig.text !== defaultFont.text) {
          yaml += `    text: ${fontConfig.text}\n`;
        }

        if (fontConfig.code && fontConfig.code !== defaultFont.code) {
          yaml += `    code: ${fontConfig.code}\n`;
        }
      }
    }

    // Add language configuration
    if (config.theme.language) {
      yaml += `  language: ${config.theme.language}\n`;
    }

    // Add features
    if (config.theme.features && config.theme.features.length > 0) {
      yaml += "  features:\n";
      config.theme.features.forEach((feature) => {
        yaml += `    - ${feature}\n`;
      });
    }

    // Add extra configuration
    if (config.extra && Object.keys(config.extra).length > 0) {
      yaml += "extra:\n";

      // Add homepage if present
      if (config.extra.homepage) {
        yaml += `  homepage: ${config.extra.homepage}\n`;
      }

      // Add generator setting if explicitly set to false
      if (config.extra.generator === false) {
        yaml += `  generator: false\n`;
      }

      // Add social links if present
      if (
        config.extra.social &&
        Array.isArray(config.extra.social) &&
        config.extra.social.length > 0
      ) {
        yaml += "  social:\n";
        config.extra.social.forEach((link: any) => {
          yaml += `    - icon: ${link.icon}\n`;
          yaml += `      link: ${link.link}\n`;
          if (link.name) {
            yaml += `      name: ${link.name}\n`;
          }
        });
      }

      // Add consent configuration if present
      if (config.extra.consent) {
        yaml += "  consent:\n";

        if (config.extra.consent.title) {
          yaml += `    title: ${config.extra.consent.title}\n`;
        }

        if (config.extra.consent.description) {
          yaml += "    description: >-\n";
          // Split description into lines and add proper indentation
          const descriptionLines = config.extra.consent.description.split("\n");
          descriptionLines.forEach((line) => {
            yaml += `      ${line}\n`;
          });
        }

        // Add actions if present
        if (
          config.extra.consent.actions &&
          config.extra.consent.actions.length > 0
        ) {
          yaml += "    actions:\n";
          config.extra.consent.actions.forEach((action) => {
            yaml += `      - ${action}\n`;
          });
        }

        // Add cookies configuration if present
        if (
          config.extra.consent.cookies &&
          Object.keys(config.extra.consent.cookies).length > 0
        ) {
          yaml += "    cookies:\n";

          // Add each cookie configuration
          Object.entries(config.extra.consent.cookies).forEach(
            ([id, cookie]) => {
              yaml += `      ${id}:\n`;
              yaml += `        name: ${cookie.name}\n`;

              if (cookie.checked !== undefined) {
                yaml += `        checked: ${cookie.checked}\n`;
              }
            }
          );
        }
      }

      // Add analytics configuration if present
      if (config.extra?.analytics) {
        yaml += "  analytics:\n";
        yaml += `    provider: ${config.extra.analytics.provider}\n`;
        yaml += `    property: ${config.extra.analytics.property}\n`;

        // Add feedback configuration if present
        if (config.extra.analytics.feedback) {
          yaml += "    feedback:\n";

          if (config.extra.analytics.feedback.title) {
            yaml += `      title: ${config.extra.analytics.feedback.title}\n`;
          }

          // Add ratings if present
          if (
            config.extra.analytics.feedback.ratings &&
            config.extra.analytics.feedback.ratings.length > 0
          ) {
            yaml += "      ratings:\n";

            config.extra.analytics.feedback.ratings.forEach((rating) => {
              yaml += `      - icon: ${rating.icon}\n`;
              yaml += `        name: ${rating.name}\n`;
              yaml += `        data: ${rating.data}\n`;
              yaml += "        note: >-\n";

              // Split note into lines and add proper indentation
              const noteLines = rating.note.split("\n");
              noteLines.forEach((line) => {
                yaml += `          ${line}\n`;
              });
            });
          }
        }
      }

      // Add alternate languages
      if (config.extra.alternate && config.extra.alternate.length > 0) {
        yaml += "  alternate:\n";
        config.extra.alternate.forEach((lang) => {
          yaml += `    - name: ${lang.name}\n`;
          yaml += `      link: ${lang.link}\n`;
          yaml += `      lang: ${lang.lang}\n`;
        });
      }

      // Add versioning configuration if present
      if (config.extra?.version) {
        yaml += "  version:\n";
        yaml += `    provider: ${config.extra.version.provider || "mike"}\n`;

        // Add alias if it's explicitly set to false (since true is default)
        if (config.extra.version.alias === false) {
          yaml += "    alias: false\n";
        } else {
          yaml += "    alias: true\n";
        }

        // Add default if present
        if (config.extra.version.default) {
          yaml += `    default: ${config.extra.version.default}\n`;
        }
      }
    }

    // Make sure copyright is properly included
    if (config.copyright) {
      yaml += `copyright: "${config.copyright}"\n`;
    }

    return yaml;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="bg-background border rounded-md p-4 overflow-auto max-h-[70vh] text-sm">
        <code>{yamlContent}</code>
      </pre>
    </div>
  );
}

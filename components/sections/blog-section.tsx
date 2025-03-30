"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import type { MkDocsConfig } from "@/types/mkdocs-config"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface BlogSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function BlogSection({ config, onChange }: BlogSectionProps) {
  // Check if blog plugin is enabled and get its configuration
  const blogPlugin = config.plugins?.find((plugin) => {
    if (typeof plugin === "object" && "blog" in plugin) {
      return true
    }
    if (typeof plugin === "string") {
      return plugin === "blog"
    }
    return false
  })

  const isBlogEnabled = !!blogPlugin
  const blogConfig = typeof blogPlugin === "object" && "blog" in blogPlugin ? blogPlugin.blog : {}

  // Get RSS plugin configuration
  const rssPlugin = config.plugins?.find((plugin) => {
    if (typeof plugin === "object" && "rss" in plugin) {
      return true
    }
    return false
  })

  const rssConfig = rssPlugin && typeof rssPlugin === "object" ? rssPlugin.rss : undefined

  // Toggle blog plugin
  const toggleBlogPlugin = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    // Remove existing blog plugin if any
    newPlugins = newPlugins.filter((plugin) => {
      if (typeof plugin === "string") {
        return plugin !== "blog"
      }
      if (typeof plugin === "object" && "blog" in plugin) {
        return false
      }
      return true
    })

    if (enabled) {
      // Add blog plugin as a simple string (using defaults)
      newPlugins.push("blog")
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Update blog plugin configuration
  const updateBlogConfig = (key: string, value: any) => {
    const newPlugins = [...(config.plugins || [])]

    // Find the blog plugin
    const blogPluginIndex = newPlugins.findIndex((plugin) => {
      if (typeof plugin === "object" && "blog" in plugin) {
        return true
      }
      return false
    })

    const stringPluginIndex = newPlugins.findIndex((plugin) => plugin === "blog")

    // If blog plugin is a string (using defaults), convert it to an object
    if (stringPluginIndex !== -1) {
      // Replace the string with an object containing the default configuration plus the new value
      newPlugins[stringPluginIndex] = {
        blog: {
          [key]: value,
        },
      }
    }
    // If blog plugin is already an object, update it
    else if (blogPluginIndex !== -1) {
      // Create a new blog plugin object with the updated configuration
      const blogPlugin = newPlugins[blogPluginIndex] as { blog: any }
      const newBlogPlugin = {
        blog: {
          ...blogPlugin.blog,
          [key]: value,
        },
      }

      // Replace the old blog plugin with the new one
      newPlugins[blogPluginIndex] = newBlogPlugin
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Toggle RSS plugin
  const toggleRssPlugin = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    // Find and remove existing RSS plugin if any
    newPlugins = newPlugins.filter((plugin) => {
      if (typeof plugin === "object" && "rss" in plugin) {
        return false
      }
      return true
    })

    if (enabled) {
      // Add RSS plugin with default configuration
      newPlugins.push({
        rss: {
          enabled: true,
          match_path: ".*",
          date_from_meta: {
            as_creation: "date",
          },
          categories: ["categories", "tags"],
        },
      })
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Update RSS plugin configuration
  const updateRssConfig = (key: string, value: any) => {
    const newPlugins = [...(config.plugins || [])]

    // Find the index of the RSS plugin
    const rssPluginIndex = newPlugins.findIndex((plugin) => {
      if (typeof plugin === "object" && "rss" in plugin) {
        return true
      }
      return false
    })

    if (rssPluginIndex !== -1) {
      // Create a new RSS plugin object with the updated configuration
      const rssPlugin = newPlugins[rssPluginIndex] as { rss: any }
      const newRssPlugin = {
        rss: {
          ...rssPlugin.rss,
          [key]: value,
        },
      }

      // Replace the old RSS plugin with the new one
      newPlugins[rssPluginIndex] = newRssPlugin
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog Configuration</CardTitle>
          <CardDescription>Configure blog and RSS settings for your MkDocs site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Blog Plugin Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Blog Plugin</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blog-plugin">Enable Blog Plugin</Label>
                <p className="text-sm text-muted-foreground">Add blogging functionality to your documentation site</p>
              </div>
              <Switch id="blog-plugin" checked={isBlogEnabled} onCheckedChange={toggleBlogPlugin} />
            </div>

            {isBlogEnabled && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="directories">
                  <AccordionTrigger>Directory Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="blog-dir">Blog Directory</Label>
                        <Input
                          id="blog-dir"
                          value={blogConfig.blog_dir || "blog"}
                          onChange={(e) => updateBlogConfig("blog_dir", e.target.value)}
                          placeholder="blog"
                        />
                        <p className="text-xs text-muted-foreground">Directory where blog posts are stored</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-dir">Posts Directory</Label>
                        <Input
                          id="post-dir"
                          value={blogConfig.post_dir || "{blog}/posts"}
                          onChange={(e) => updateBlogConfig("post_dir", e.target.value)}
                          placeholder="{blog}/posts"
                        />
                        <p className="text-xs text-muted-foreground">
                          Directory where individual posts are stored (use {"{blog}"} to reference the blog directory)
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="post-settings">
                  <AccordionTrigger>Post Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="blog-toc">Table of Contents</Label>
                          <p className="text-sm text-muted-foreground">Include a table of contents for blog posts</p>
                        </div>
                        <Switch
                          id="blog-toc"
                          checked={blogConfig.blog_toc !== false}
                          onCheckedChange={(checked) => updateBlogConfig("blog_toc", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-date-format">Post Date Format</Label>
                        <Select
                          value={blogConfig.post_date_format || "long"}
                          onValueChange={(value) => updateBlogConfig("post_date_format", value)}
                        >
                          <SelectTrigger id="post-date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="long">Long (e.g., January 1, 2023)</SelectItem>
                            <SelectItem value="full">Full (e.g., Monday, January 1, 2023)</SelectItem>
                            <SelectItem value="medium">Medium (e.g., Jan 1, 2023)</SelectItem>
                            <SelectItem value="short">Short (e.g., 1/1/23)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Format for displaying post dates</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-url-date-format">URL Date Format</Label>
                        <Input
                          id="post-url-date-format"
                          value={blogConfig.post_url_date_format || "yyyy/MM/dd"}
                          onChange={(e) => updateBlogConfig("post_url_date_format", e.target.value)}
                          placeholder="yyyy/MM/dd"
                        />
                        <p className="text-xs text-muted-foreground">
                          Format for dates in URLs (Babel pattern syntax, no whitespace)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-url-format">URL Format</Label>
                        <Input
                          id="post-url-format"
                          value={blogConfig.post_url_format || "{date}/{slug}"}
                          onChange={(e) => updateBlogConfig("post_url_format", e.target.value)}
                          placeholder="{date}/{slug}"
                        />
                        <p className="text-xs text-muted-foreground">
                          Format for post URLs (available placeholders: {"{categories}"}, {"{date}"}, {"{slug}"},{" "}
                          {"{file}"})
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-url-max-categories">Max Categories in URL</Label>
                        <Input
                          id="post-url-max-categories"
                          type="number"
                          min="0"
                          value={blogConfig.post_url_max_categories || 1}
                          onChange={(e) => updateBlogConfig("post_url_max_categories", Number.parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Maximum number of categories to include in URLs</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="excerpt-settings">
                  <AccordionTrigger>Excerpt Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="post-excerpt">Post Excerpt</Label>
                        <Select
                          value={blogConfig.post_excerpt || "optional"}
                          onValueChange={(value) => updateBlogConfig("post_excerpt", value)}
                        >
                          <SelectTrigger id="post-excerpt">
                            <SelectValue placeholder="Select excerpt requirement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="optional">Optional</SelectItem>
                            <SelectItem value="required">Required</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Whether excerpts are optional or required for posts
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-excerpt-separator">Excerpt Separator</Label>
                        <Input
                          id="post-excerpt-separator"
                          value={blogConfig.post_excerpt_separator || "<!-- more -->"}
                          onChange={(e) => updateBlogConfig("post_excerpt_separator", e.target.value)}
                          placeholder="<!-- more -->"
                        />
                        <p className="text-xs text-muted-foreground">
                          HTML comment used to separate the excerpt from the rest of the post
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-excerpt-max-authors">Max Authors in Excerpt</Label>
                        <Input
                          id="post-excerpt-max-authors"
                          type="number"
                          min="0"
                          value={blogConfig.post_excerpt_max_authors || 1}
                          onChange={(e) =>
                            updateBlogConfig("post_excerpt_max_authors", Number.parseInt(e.target.value))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of authors to display in excerpts
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-excerpt-max-categories">Max Categories in Excerpt</Label>
                        <Input
                          id="post-excerpt-max-categories"
                          type="number"
                          min="0"
                          value={blogConfig.post_excerpt_max_categories || 5}
                          onChange={(e) =>
                            updateBlogConfig("post_excerpt_max_categories", Number.parseInt(e.target.value))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of categories to display in excerpts
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="readtime-settings">
                  <AccordionTrigger>Reading Time Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="post-readtime">Show Reading Time</Label>
                          <p className="text-sm text-muted-foreground">Display estimated reading time for posts</p>
                        </div>
                        <Switch
                          id="post-readtime"
                          checked={blogConfig.post_readtime !== false}
                          onCheckedChange={(checked) => updateBlogConfig("post_readtime", checked)}
                        />
                      </div>

                      {blogConfig.post_readtime !== false && (
                        <div className="space-y-2">
                          <Label htmlFor="post-readtime-words-per-minute">Words Per Minute</Label>
                          <Input
                            id="post-readtime-words-per-minute"
                            type="number"
                            min="1"
                            value={blogConfig.post_readtime_words_per_minute || 265}
                            onChange={(e) =>
                              updateBlogConfig("post_readtime_words_per_minute", Number.parseInt(e.target.value))
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Average reading speed in words per minute for calculating reading time
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>

          <Separator className="my-6" />

          {/* RSS Plugin Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">RSS Plugin</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rss-plugin">Enable RSS Plugin</Label>
                <p className="text-sm text-muted-foreground">Generate an RSS feed for your documentation site</p>
              </div>
              <Switch id="rss-plugin" checked={!!rssConfig} onCheckedChange={toggleRssPlugin} />
            </div>

            {rssConfig && (
              <>
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    The RSS plugin is an external plugin. You can find more information at{" "}
                    <a
                      href="https://guts.github.io/mkdocs-rss-plugin/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      https://guts.github.io/mkdocs-rss-plugin/
                    </a>
                    . The settings below are the only ones officially supported by Material.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="match-path">Match Path</Label>
                    <Input
                      id="match-path"
                      value={rssConfig.match_path || ".*"}
                      onChange={(e) => updateRssConfig("match_path", e.target.value)}
                      placeholder=".*"
                    />
                    <p className="text-xs text-muted-foreground">
                      Regular expression to match which pages to include in the RSS feed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-meta-field">Date Metadata Field</Label>
                    <Input
                      id="date-meta-field"
                      value={rssConfig.date_from_meta?.as_creation || "date"}
                      onChange={(e) =>
                        updateRssConfig("date_from_meta", {
                          ...(rssConfig.date_from_meta || {}),
                          as_creation: e.target.value,
                        })
                      }
                      placeholder="date"
                    />
                    <p className="text-xs text-muted-foreground">
                      Metadata field to use for the creation date of pages
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories</Label>
                    <Input
                      id="categories"
                      value={(rssConfig.categories || ["categories", "tags"]).join(", ")}
                      onChange={(e) => {
                        const categories = e.target.value
                          .split(",")
                          .map((cat) => cat.trim())
                          .filter((cat) => cat)
                        updateRssConfig("categories", categories)
                      }}
                      placeholder="categories, tags"
                    />
                    <p className="text-xs text-muted-foreground">
                      Metadata fields to use for categories in the RSS feed (comma-separated)
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Plus, X, Edit, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"
import type { MkDocsConfig } from "@/types/mkdocs-config"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TagsSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

interface ListingMapItem {
  id: string
  scope: boolean
  exclude?: string
}

export function TagsSection({ config, onChange }: TagsSectionProps) {
  const [newTag, setNewTag] = useState("")
  const [newListingId, setNewListingId] = useState("")
  const [newListingScope, setNewListingScope] = useState(true)
  const [newListingExclude, setNewListingExclude] = useState("")
  const [editingListing, setEditingListing] = useState<ListingMapItem | null>(null)
  const [isAddingListing, setIsAddingListing] = useState(false)
  const [isEditingListing, setIsEditingListing] = useState(false)

  // Check if tags plugin is enabled and get its configuration
  const tagsPlugin = config.plugins?.find((plugin) => {
    if (typeof plugin === "object" && "tags" in plugin) {
      return true
    }
    if (typeof plugin === "string") {
      return plugin === "tags"
    }
    return false
  })

  const isTagsEnabled = !!tagsPlugin
  const tagsConfig = typeof tagsPlugin === "object" && "tags" in tagsPlugin ? tagsPlugin.tags : {}

  // Toggle tags plugin
  const toggleTagsPlugin = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    // Remove existing tags plugin if any
    newPlugins = newPlugins.filter((plugin) => {
      if (typeof plugin === "string") {
        return plugin !== "tags"
      }
      if (typeof plugin === "object" && "tags" in plugin) {
        return false
      }
      return true
    })

    if (enabled) {
      // Add tags plugin as a simple string (using defaults)
      newPlugins.push("tags")
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Update tags plugin configuration
  const updateTagsConfig = (key: string, value: any) => {
    const newPlugins = [...(config.plugins || [])]

    // Find the tags plugin
    const tagsPluginIndex = newPlugins.findIndex((plugin) => {
      if (typeof plugin === "object" && "tags" in plugin) {
        return true
      }
      return false
    })

    const stringPluginIndex = newPlugins.findIndex((plugin) => plugin === "tags")

    // If tags plugin is a string (using defaults), convert it to an object
    if (stringPluginIndex !== -1) {
      // Replace the string with an object containing the default configuration plus the new value
      newPlugins[stringPluginIndex] = {
        tags: {
          [key]: value,
        },
      }
    }
    // If tags plugin is already an object, update it
    else if (tagsPluginIndex !== -1) {
      // Create a new tags plugin object with the updated configuration
      const tagsPlugin = newPlugins[tagsPluginIndex] as { tags: any }
      const newTagsPlugin = {
        tags: {
          ...tagsPlugin.tags,
          [key]: value,
        },
      }

      // Replace the old tags plugin with the new one
      newPlugins[tagsPluginIndex] = newTagsPlugin
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Add a tag to the allowed tags list
  const addAllowedTag = () => {
    if (!newTag.trim()) return

    const currentAllowedTags = tagsConfig.tags_allowed || []
    const updatedAllowedTags = [...currentAllowedTags, newTag.trim()]

    updateTagsConfig("tags_allowed", updatedAllowedTags)
    setNewTag("")
  }

  // Remove a tag from the allowed tags list
  const removeAllowedTag = (tagToRemove: string) => {
    const currentAllowedTags = tagsConfig.tags_allowed || []
    const updatedAllowedTags = currentAllowedTags.filter((tag) => tag !== tagToRemove)

    updateTagsConfig("tags_allowed", updatedAllowedTags)
  }

  // Get listings map as an array of items
  const getListingsMap = (): ListingMapItem[] => {
    if (!tagsConfig.listings_map) return []

    return Object.entries(tagsConfig.listings_map).map(([id, config]) => {
      const { scope, exclude } = config as { scope: boolean; exclude?: string }
      return { id, scope, exclude }
    })
  }

  // Add a new listing to the listings map
  const addListing = () => {
    if (!newListingId.trim()) return

    const currentListingsMap = tagsConfig.listings_map || {}
    const newListingsMap = {
      ...currentListingsMap,
      [newListingId]: {
        scope: newListingScope,
        ...(newListingExclude ? { exclude: newListingExclude } : {}),
      },
    }

    updateTagsConfig("listings_map", newListingsMap)

    // Reset form
    setNewListingId("")
    setNewListingScope(true)
    setNewListingExclude("")
    setIsAddingListing(false)
  }

  // Update an existing listing in the listings map
  const updateListing = () => {
    if (!editingListing) return

    const currentListingsMap = tagsConfig.listings_map || {}
    const newListingsMap = {
      ...currentListingsMap,
      [editingListing.id]: {
        scope: editingListing.scope,
        ...(editingListing.exclude ? { exclude: editingListing.exclude } : {}),
      },
    }

    updateTagsConfig("listings_map", newListingsMap)

    // Reset form
    setEditingListing(null)
    setIsEditingListing(false)
  }

  // Remove a listing from the listings map
  const removeListing = (id: string) => {
    const currentListingsMap = tagsConfig.listings_map || {}
    const newListingsMap = { ...currentListingsMap }

    delete newListingsMap[id]

    updateTagsConfig("listings_map", Object.keys(newListingsMap).length > 0 ? newListingsMap : undefined)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags Configuration</CardTitle>
        <CardDescription>Configure the tags plugin for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tags-plugin">Enable Tags Plugin</Label>
            <p className="text-sm text-muted-foreground">Add tag functionality to your documentation site</p>
          </div>
          <Switch id="tags-plugin" checked={isTagsEnabled} onCheckedChange={toggleTagsPlugin} />
        </div>

        {isTagsEnabled && (
          <>
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                The tags plugin allows you to categorize your pages and create tag-based navigation.
              </AlertDescription>
            </Alert>

            <Accordion type="multiple" collapsible="true" className="w-full" defaultValue={["basic-settings"]}>
              <AccordionItem value="basic-settings">
                <AccordionTrigger>Basic Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tags-enabled">Enable Tags</Label>
                        <p className="text-sm text-muted-foreground">Enable or disable tag functionality</p>
                      </div>
                      <Switch
                        id="tags-enabled"
                        checked={tagsConfig.tags !== false}
                        onCheckedChange={(checked) => updateTagsConfig("tags", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags-name-property">Tags Property Name</Label>
                      <Input
                        id="tags-name-property"
                        value={tagsConfig.tags_name_property || "tags"}
                        onChange={(e) => updateTagsConfig("tags_name_property", e.target.value)}
                        placeholder="tags"
                      />
                      <p className="text-xs text-muted-foreground">
                        The name of the property in front matter that contains tags
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags-name-variable">Tags Variable Name</Label>
                      <Input
                        id="tags-name-variable"
                        value={tagsConfig.tags_name_variable || "tags"}
                        onChange={(e) => updateTagsConfig("tags_name_variable", e.target.value)}
                        placeholder="tags"
                      />
                      <p className="text-xs text-muted-foreground">
                        The name of the variable in templates that contains tags
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="url-settings">
                <AccordionTrigger>URL Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="tags-slugify-separator">Slug Separator</Label>
                      <Input
                        id="tags-slugify-separator"
                        value={tagsConfig.tags_slugify_separator || "-"}
                        onChange={(e) => updateTagsConfig("tags_slugify_separator", e.target.value)}
                        placeholder="-"
                      />
                      <p className="text-xs text-muted-foreground">Character used to separate words in tag slugs</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags-slugify-format">URL Format</Label>
                      <Input
                        id="tags-slugify-format"
                        value={tagsConfig.tags_slugify_format || "tag:{slug}"}
                        onChange={(e) => updateTagsConfig("tags_slugify_format", e.target.value)}
                        placeholder="tag:{slug}"
                      />
                      <p className="text-xs text-muted-foreground">
                        Format for tag URLs (use {"{slug}"} as a placeholder for the tag slug)
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sorting-settings">
                <AccordionTrigger>Sorting Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tags-sort-reverse">Reverse Sort Order</Label>
                        <p className="text-sm text-muted-foreground">Sort tags in reverse order</p>
                      </div>
                      <Switch
                        id="tags-sort-reverse"
                        checked={tagsConfig.tags_sort_reverse === true}
                        onCheckedChange={(checked) => updateTagsConfig("tags_sort_reverse", checked)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="allowed-tags">
                <AccordionTrigger>Allowed Tags</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="tags-allowed">Allowed Tags</Label>
                      <p className="text-sm text-muted-foreground">
                        Specify a list of allowed tags. If empty, all tags are allowed.
                      </p>

                      <div className="flex gap-2">
                        <Input
                          id="new-tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Enter a tag name"
                          className="flex-1"
                        />
                        <Button onClick={addAllowedTag} disabled={!newTag.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      <div className="mt-4 space-y-2">
                        {tagsConfig.tags_allowed && tagsConfig.tags_allowed.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {tagsConfig.tags_allowed.map((tag) => (
                              <div key={tag} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                <span>{tag}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0"
                                  onClick={() => removeAllowedTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No allowed tags specified (all tags are allowed)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="my-6" />

            {/* Listings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Listings</h3>
              <p className="text-sm text-muted-foreground">Configure listings functionality for the tags plugin</p>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="listings-enabled">Enable Listings</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable listings functionality</p>
                </div>
                <Switch
                  id="listings-enabled"
                  checked={tagsConfig.listings !== false}
                  onCheckedChange={(checked) => updateTagsConfig("listings", checked)}
                />
              </div>

              {tagsConfig.listings !== false && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="listings-directive">Listings Directive</Label>
                      <Input
                        id="listings-directive"
                        value={tagsConfig.listings_directive || "material/tags"}
                        onChange={(e) => updateTagsConfig("listings_directive", e.target.value)}
                        placeholder="material/tags"
                      />
                      <p className="text-xs text-muted-foreground">The directive used for listings</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="listings-sort-reverse">Reverse Listings Sort Order</Label>
                        <p className="text-sm text-muted-foreground">Sort listings in reverse order</p>
                      </div>
                      <Switch
                        id="listings-sort-reverse"
                        checked={tagsConfig.listings_sort_reverse === true}
                        onCheckedChange={(checked) => updateTagsConfig("listings_sort_reverse", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="listings-tags-sort-reverse">Reverse Listings Tags Sort Order</Label>
                        <p className="text-sm text-muted-foreground">Sort tags within listings in reverse order</p>
                      </div>
                      <Switch
                        id="listings-tags-sort-reverse"
                        checked={tagsConfig.listings_tags_sort_reverse === true}
                        onCheckedChange={(checked) => updateTagsConfig("listings_tags_sort_reverse", checked)}
                      />
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="listings-map">Listings Map</Label>
                        <Button variant="outline" size="sm" onClick={() => setIsAddingListing(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Listing
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Configure custom listings with specific scopes and exclusions
                      </p>

                      {/* Listings Map Table */}
                      {getListingsMap().length > 0 ? (
                        <div className="border rounded-md overflow-hidden mt-2">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Scope</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Exclude</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {getListingsMap().map((listing) => (
                                <tr key={listing.id}>
                                  <td className="px-4 py-2 text-sm">{listing.id}</td>
                                  <td className="px-4 py-2 text-sm">{listing.scope ? "True" : "False"}</td>
                                  <td className="px-4 py-2 text-sm">{listing.exclude || "-"}</td>
                                  <td className="px-4 py-2 text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => {
                                          setEditingListing(listing)
                                          setIsEditingListing(true)
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-destructive"
                                        onClick={() => removeListing(listing.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center p-4 border border-dashed rounded-md">
                          <p className="text-sm text-muted-foreground">No custom listings configured</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Listing Dialog */}
                  <Dialog open={isAddingListing} onOpenChange={setIsAddingListing}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Custom Listing</DialogTitle>
                        <DialogDescription>
                          Configure a custom listing with specific scope and exclusions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-listing-id">Listing ID</Label>
                          <Input
                            id="new-listing-id"
                            value={newListingId}
                            onChange={(e) => setNewListingId(e.target.value)}
                            placeholder="custom-id"
                          />
                          <p className="text-xs text-muted-foreground">A unique identifier for this listing</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="new-listing-scope">Scope</Label>
                            <p className="text-sm text-muted-foreground">Include pages in scope</p>
                          </div>
                          <Switch
                            id="new-listing-scope"
                            checked={newListingScope}
                            onCheckedChange={setNewListingScope}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-listing-exclude">Exclude</Label>
                          <Input
                            id="new-listing-exclude"
                            value={newListingExclude}
                            onChange={(e) => setNewListingExclude(e.target.value)}
                            placeholder="Internal"
                          />
                          <p className="text-xs text-muted-foreground">Tag to exclude from this listing (optional)</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingListing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addListing} disabled={!newListingId.trim()}>
                          Add Listing
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Listing Dialog */}
                  <Dialog open={isEditingListing} onOpenChange={setIsEditingListing}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Custom Listing</DialogTitle>
                        <DialogDescription>Update the configuration for this custom listing</DialogDescription>
                      </DialogHeader>
                      {editingListing && (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-listing-id">Listing ID</Label>
                            <Input id="edit-listing-id" value={editingListing.id} disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="edit-listing-scope">Scope</Label>
                              <p className="text-sm text-muted-foreground">Include pages in scope</p>
                            </div>
                            <Switch
                              id="edit-listing-scope"
                              checked={editingListing.scope}
                              onCheckedChange={(checked) => setEditingListing({ ...editingListing, scope: checked })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-listing-exclude">Exclude</Label>
                            <Input
                              id="edit-listing-exclude"
                              value={editingListing.exclude || ""}
                              onChange={(e) =>
                                setEditingListing({
                                  ...editingListing,
                                  exclude: e.target.value || undefined,
                                })
                              }
                              placeholder="Internal"
                            />
                            <p className="text-xs text-muted-foreground">Tag to exclude from this listing (optional)</p>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingListing(false)
                            setEditingListing(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={updateListing}>Update Listing</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}


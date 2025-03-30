"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, ExternalLink, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MkDocsConfig } from "@/types/mkdocs-config"
import { IconPicker } from "@/components/icon-picker"

interface GitRepoSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

export function GitRepoSection({ config, onChange }: GitRepoSectionProps) {
  // Repository settings
  const repoUrl = config.repo_url || ""
  const repoName = config.repo_name || ""
  const repoIcon = config.theme?.icon?.repo || ""

  // Code actions settings
  const editIcon = config.theme?.icon?.edit || ""
  const viewIcon = config.theme?.icon?.view || ""
  const editUri = config.edit_uri || ""
  const features = config.theme?.features || []
  const hasEditFeature = features.includes("content.action.edit")
  const hasViewFeature = features.includes("content.action.view")

  // Git revision date plugin settings
  const isGitRevisionEnabled = config.plugins?.some((plugin) => {
    if (typeof plugin === "string") {
      return plugin === "git-revision-date-localized"
    }
    if (typeof plugin === "object" && "git-revision-date-localized" in plugin) {
      return true
    }
    return false
  })

  // Find the git-revision-date-localized plugin configuration
  const gitRevisionPlugin = config.plugins?.find((plugin) => {
    if (typeof plugin === "object" && "git-revision-date-localized" in plugin) {
      return true
    }
    return false
  })

  const gitRevisionConfig =
    gitRevisionPlugin && typeof gitRevisionPlugin === "object" ? gitRevisionPlugin["git-revision-date-localized"] : {}

  const gitRevisionType = gitRevisionConfig?.type || "date"
  const gitRevisionEnableCreationDate = gitRevisionConfig?.enable_creation_date || false
  const gitRevisionFallbackToBuildDate = gitRevisionConfig?.fallback_to_build_date || false

  // Git committers plugin settings
  const isGitCommittersEnabled = config.plugins?.some((plugin) => {
    if (typeof plugin === "string") {
      return plugin === "git-committers"
    }
    if (typeof plugin === "object" && "git-committers" in plugin) {
      return true
    }
    return false
  })

  // Find the git-committers plugin configuration
  const gitCommittersPlugin = config.plugins?.find((plugin) => {
    if (typeof plugin === "object" && "git-committers" in plugin) {
      return true
    }
    return false
  })

  const gitCommittersConfig =
    gitCommittersPlugin && typeof gitCommittersPlugin === "object" ? gitCommittersPlugin["git-committers"] : {}

  const gitCommittersRepository = gitCommittersConfig?.repository || ""
  const gitCommittersBranch = gitCommittersConfig?.branch || "master"

  // Git authors plugin
  const isGitAuthorsEnabled = config.plugins?.some((plugin) => {
    if (typeof plugin === "string") {
      return plugin === "git-authors"
    }
    return false
  })

  // Update repository settings
  const updateRepoUrl = (value: string) => {
    onChange({
      ...config,
      repo_url: value || undefined,
    })
  }

  const updateRepoName = (value: string) => {
    onChange({
      ...config,
      repo_name: value || undefined,
    })
  }

  const updateRepoIcon = (value: string) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        icon: {
          ...(config.theme?.icon || {}),
          repo: value || undefined,
        },
      },
    })
  }

  // Update code actions settings
  const updateEditIcon = (value: string) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        icon: {
          ...(config.theme?.icon || {}),
          edit: value || undefined,
        },
      },
    })
  }

  const updateViewIcon = (value: string) => {
    onChange({
      ...config,
      theme: {
        ...config.theme,
        icon: {
          ...(config.theme?.icon || {}),
          view: value || undefined,
        },
      },
    })
  }

  const updateEditUri = (value: string) => {
    onChange({
      ...config,
      edit_uri: value || undefined,
    })
  }

  const toggleFeature = (feature: string, enabled: boolean) => {
    let newFeatures = [...features]

    if (enabled) {
      if (!newFeatures.includes(feature)) {
        newFeatures.push(feature)
      }
    } else {
      newFeatures = newFeatures.filter((f) => f !== feature)
    }

    onChange({
      ...config,
      theme: {
        ...config.theme,
        features: newFeatures.length > 0 ? newFeatures : undefined,
      },
    })
  }

  // Update git revision date plugin settings
  const toggleGitRevisionPlugin = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    // Remove existing git-revision-date-localized plugin if any
    newPlugins = newPlugins.filter((plugin) => {
      if (typeof plugin === "object" && "git-revision-date-localized" in plugin) {
        return false
      }
      if (typeof plugin === "string" && plugin === "git-revision-date-localized") {
        return false
      }
      return true
    })

    if (enabled) {
      // Add git-revision-date-localized plugin as a simple string (default configuration)
      newPlugins.push("git-revision-date-localized")
    }

    onChange({
      ...config,
      plugins: newPlugins.length > 0 ? newPlugins : undefined,
    })
  }

  const updateGitRevisionConfig = (key: string, value: any) => {
    if (!isGitRevisionEnabled) return

    const newPlugins = [...(config.plugins || [])]

    // Find the git-revision-date-localized plugin index
    let pluginIndex = newPlugins.findIndex((plugin) => {
      if (typeof plugin === "object" && "git-revision-date-localized" in plugin) {
        return true
      }
      return false
    })

    // If plugin is a string, find its index
    let isStringPlugin = false
    if (pluginIndex === -1) {
      pluginIndex = newPlugins.findIndex((plugin) => {
        return typeof plugin === "string" && plugin === "git-revision-date-localized"
      })
      isStringPlugin = pluginIndex !== -1
    }

    if (pluginIndex !== -1) {
      if (isStringPlugin) {
        // Convert string plugin to object with the new setting
        newPlugins[pluginIndex] = {
          "git-revision-date-localized": {
            [key]: value,
          },
        }
      } else {
        // Update existing object plugin
        const plugin = newPlugins[pluginIndex] as { "git-revision-date-localized": any }
        const newPlugin = {
          "git-revision-date-localized": {
            ...plugin["git-revision-date-localized"],
            [key]: value,
          },
        }
        newPlugins[pluginIndex] = newPlugin
      }
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Update git committers plugin settings
  const toggleGitCommittersPlugin = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    // Remove existing git-committers plugin if any
    newPlugins = newPlugins.filter((plugin) => {
      if (typeof plugin === "object" && "git-committers" in plugin) {
        return false
      }
      if (typeof plugin === "string" && plugin === "git-committers") {
        return false
      }
      return true
    })

    if (enabled) {
      // Add git-committers plugin as a simple string (default configuration)
      newPlugins.push("git-committers")
    }

    onChange({
      ...config,
      plugins: newPlugins.length > 0 ? newPlugins : undefined,
    })
  }

  const updateGitCommittersConfig = (key: string, value: any) => {
    if (!isGitCommittersEnabled) return

    const newPlugins = [...(config.plugins || [])]

    // Find the git-committers plugin index
    let pluginIndex = newPlugins.findIndex((plugin) => {
      if (typeof plugin === "object" && "git-committers" in plugin) {
        return true
      }
      return false
    })

    // If plugin is a string, find its index
    let isStringPlugin = false
    if (pluginIndex === -1) {
      pluginIndex = newPlugins.findIndex((plugin) => {
        return typeof plugin === "string" && plugin === "git-committers"
      })
      isStringPlugin = pluginIndex !== -1
    }

    if (pluginIndex !== -1) {
      if (isStringPlugin) {
        // Convert string plugin to object with the new setting
        newPlugins[pluginIndex] = {
          "git-committers": {
            [key]: value,
          },
        }
      } else {
        // Update existing object plugin
        const plugin = newPlugins[pluginIndex] as { "git-committers": any }
        const newPlugin = {
          "git-committers": {
            ...plugin["git-committers"],
            [key]: value,
          },
        }
        newPlugins[pluginIndex] = newPlugin
      }
    }

    onChange({
      ...config,
      plugins: newPlugins,
    })
  }

  // Toggle git-authors plugin
  const toggleGitAuthorsPlugin = (enabled: boolean) => {
    let newPlugins = [...(config.plugins || [])]

    // Remove existing git-authors plugin if any
    newPlugins = newPlugins.filter((plugin) => {
      if (typeof plugin === "string") {
        return plugin !== "git-authors"
      }
      return true
    })

    if (enabled) {
      // Add git-authors plugin
      newPlugins.push("git-authors")
    }

    onChange({
      ...config,
      plugins: newPlugins.length > 0 ? newPlugins : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Git Repository</CardTitle>
        <CardDescription>Configure Git repository integration for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Repository</h3>

          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              value={repoUrl}
              onChange={(e) => updateRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
            />
            <p className="text-xs text-muted-foreground">
              The URL of your Git repository (e.g., GitHub, GitLab, Bitbucket)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo-name">Repository Name</Label>
            <Input
              id="repo-name"
              value={repoName}
              onChange={(e) => updateRepoName(e.target.value)}
              placeholder="username/repository"
            />
            <p className="text-xs text-muted-foreground">
              The name of your repository (optional, detected automatically from URL if not specified)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo-icon">Repository Icon</Label>
            <IconPicker
              value={repoIcon}
              onChange={updateRepoIcon}
              placeholder="Enter icon name (e.g., fontawesome/brands/github)"
            />
            <p className="text-xs text-muted-foreground">
              Custom icon for the repository link (optional, uses generic Git icon by default)
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Code Actions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Code Actions</h3>

          <div className="space-y-2">
            <Label htmlFor="edit-uri">Edit URI</Label>
            <Input
              id="edit-uri"
              value={editUri}
              onChange={(e) => updateEditUri(e.target.value)}
              placeholder="edit/master/docs/"
            />
            <p className="text-xs text-muted-foreground">
              The path to the docs directory in your repository for edit links (optional)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="edit-feature">Enable Edit Button</Label>
              <p className="text-sm text-muted-foreground">Add an edit button to each page</p>
            </div>
            <Switch
              id="edit-feature"
              checked={hasEditFeature}
              onCheckedChange={(checked) => toggleFeature("content.action.edit", checked)}
            />
          </div>

          {hasEditFeature && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="edit-icon">Edit Icon</Label>
              <IconPicker value={editIcon} onChange={updateEditIcon} placeholder="material/pencil" />
              <p className="text-xs text-muted-foreground">
                Custom icon for the edit button (optional, uses pencil icon by default)
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="view-feature">Enable View Source Button</Label>
              <p className="text-sm text-muted-foreground">Add a view source button to each page</p>
            </div>
            <Switch
              id="view-feature"
              checked={hasViewFeature}
              onCheckedChange={(checked) => toggleFeature("content.action.view", checked)}
            />
          </div>

          {hasViewFeature && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="view-icon">View Icon</Label>
              <IconPicker value={viewIcon} onChange={updateViewIcon} placeholder="material/eye" />
              <p className="text-xs text-muted-foreground">
                Custom icon for the view source button (optional, uses eye icon by default)
              </p>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Revisioning Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Revisioning</h3>
            <a
              href="https://squidfunk.github.io/mkdocs-material/setup/adding-a-git-repository/#document-dates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="git-revision-enabled">Enable Revision Date</Label>
              <p className="text-sm text-muted-foreground">Show the last update date for each page</p>
            </div>
            <Switch
              id="git-revision-enabled"
              checked={isGitRevisionEnabled}
              onCheckedChange={toggleGitRevisionPlugin}
            />
          </div>

          {isGitRevisionEnabled && (
            <>
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  This feature requires the <code>git-revision-date-localized</code> plugin. Make sure to install it
                  with:
                  <pre className="mt-2 bg-muted p-2 rounded-md text-xs overflow-x-auto">
                    pip install mkdocs-git-revision-date-localized-plugin
                  </pre>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="git-revision-type">Date Format</Label>
                <Select value={gitRevisionType} onValueChange={(value) => updateGitRevisionConfig("type", value)}>
                  <SelectTrigger id="git-revision-type">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (e.g., Jan 31, 2023)</SelectItem>
                    <SelectItem value="datetime">Datetime (e.g., Jan 31, 2023, 10:00 AM)</SelectItem>
                    <SelectItem value="iso_date">ISO Date (e.g., 2023-01-31)</SelectItem>
                    <SelectItem value="iso_datetime">ISO Datetime (e.g., 2023-01-31 10:00:00)</SelectItem>
                    <SelectItem value="timeago">Relative Time (e.g., 2 months ago)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Format for displaying the revision date</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="git-revision-creation-date">Show Creation Date</Label>
                  <p className="text-sm text-muted-foreground">
                    Show the creation date in addition to the last update date
                  </p>
                </div>
                <Switch
                  id="git-revision-creation-date"
                  checked={gitRevisionEnableCreationDate}
                  onCheckedChange={(checked) => updateGitRevisionConfig("enable_creation_date", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="git-revision-fallback">Fallback to Build Date</Label>
                  <p className="text-sm text-muted-foreground">
                    Use the build date if the revision date cannot be determined
                  </p>
                </div>
                <Switch
                  id="git-revision-fallback"
                  checked={gitRevisionFallbackToBuildDate}
                  onCheckedChange={(checked) => updateGitRevisionConfig("fallback_to_build_date", checked)}
                />
              </div>
            </>
          )}
        </div>

        <Separator className="my-6" />

        {/* Contributors Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Contributors</h3>
            <a
              href="https://squidfunk.github.io/mkdocs-material/setup/adding-a-git-repository/#document-contributors"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="git-committers-enabled">Enable Committers</Label>
              <p className="text-sm text-muted-foreground">Show the contributors for each page</p>
            </div>
            <Switch
              id="git-committers-enabled"
              checked={isGitCommittersEnabled}
              onCheckedChange={toggleGitCommittersPlugin}
            />
          </div>

          {isGitCommittersEnabled && (
            <>
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  This feature requires the <code>git-committers</code> plugin. Make sure to install it with:
                  <pre className="mt-2 bg-muted p-2 rounded-md text-xs overflow-x-auto">
                    pip install mkdocs-git-committers-plugin-2
                  </pre>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="git-committers-repository">Repository URL</Label>
                <Input
                  id="git-committers-repository"
                  value={gitCommittersRepository}
                  onChange={(e) => updateGitCommittersConfig("repository", e.target.value)}
                  placeholder="https://github.com/username/repository"
                />
                <p className="text-xs text-muted-foreground">
                  The URL of your Git repository (required, used to fetch contributor information)
                </p>
              </div>

              {!gitCommittersRepository && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    The repository URL is required for the git-committers plugin to work properly.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="git-committers-branch">Branch</Label>
                <Input
                  id="git-committers-branch"
                  value={gitCommittersBranch}
                  onChange={(e) => updateGitCommittersConfig("branch", e.target.value)}
                  placeholder="master"
                />
                <p className="text-xs text-muted-foreground">
                  The branch to use for fetching contributor information (default: master)
                </p>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="git-authors-enabled">Enable Authors</Label>
              <p className="text-sm text-muted-foreground">Show the authors for each page</p>
            </div>
            <Switch id="git-authors-enabled" checked={isGitAuthorsEnabled} onCheckedChange={toggleGitAuthorsPlugin} />
          </div>

          {isGitAuthorsEnabled && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                This feature requires the <code>git-authors</code> plugin. Make sure to install it with:
                <pre className="mt-2 bg-muted p-2 rounded-md text-xs overflow-x-auto">
                  pip install mkdocs-git-authors-plugin
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


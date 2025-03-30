"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { MkDocsConfig } from "@/types/mkdocs-config"

interface AnalyticsSectionProps {
  config: MkDocsConfig
  onChange: (config: MkDocsConfig) => void
}

interface FeedbackRating {
  icon: string
  name: string
  data: number
  note: string
}

export function AnalyticsSection({ config, onChange }: AnalyticsSectionProps) {
  // Check if analytics is enabled
  const isAnalyticsEnabled = !!config.extra?.analytics

  // Check if feedback is enabled
  const isFeedbackEnabled = !!config.extra?.analytics?.feedback

  // Get property value
  const propertyValue = config.extra?.analytics?.property || ""

  // Get feedback title
  const feedbackTitle = config.extra?.analytics?.feedback?.title || "Was this page helpful?"

  // Get feedback ratings
  const feedbackRatings = config.extra?.analytics?.feedback?.ratings || []

  // State for new rating being added
  const [newRating, setNewRating] = useState<FeedbackRating>({
    icon: "material/emoticon-happy-outline",
    name: "",
    data: 1,
    note: "Thanks for your feedback!",
  })

  // State for editing mode
  const [isAddingRating, setIsAddingRating] = useState(false)

  // Handle analytics toggle
  const handleAnalyticsToggle = (enabled: boolean) => {
    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    if (enabled) {
      // Enable analytics with default values
      newExtra.analytics = {
        provider: "google",
        property: propertyValue || "G-XXXXXXXXXX",
      }
    } else {
      // Remove analytics if disabled
      if (newExtra.analytics) {
        delete newExtra.analytics
      }
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Handle property change
  const handlePropertyChange = (value: string) => {
    if (!isAnalyticsEnabled) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update analytics property
    newExtra.analytics = {
      ...newExtra.analytics,
      provider: "google", // Currently the only supported provider
      property: value,
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Handle feedback toggle
  const handleFeedbackToggle = (enabled: boolean) => {
    if (!isAnalyticsEnabled) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    if (enabled) {
      // Enable feedback with default values
      newExtra.analytics = {
        ...newExtra.analytics,
        feedback: {
          title: "Was this page helpful?",
          ratings: [
            {
              icon: "material/emoticon-happy-outline",
              name: "This page was helpful",
              data: 1,
              note: "Thanks for your feedback!",
            },
            {
              icon: "material/emoticon-sad-outline",
              name: "This page could be improved",
              data: 0,
              note: "Thanks for your feedback! Help us improve this page by using our feedback form.",
            },
          ],
        },
      }
    } else {
      // Remove feedback if disabled
      if (newExtra.analytics?.feedback) {
        const { feedback, ...rest } = newExtra.analytics
        newExtra.analytics = rest
      }
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Handle feedback title change
  const handleFeedbackTitleChange = (value: string) => {
    if (!isAnalyticsEnabled || !isFeedbackEnabled) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update feedback title
    newExtra.analytics = {
      ...newExtra.analytics,
      feedback: {
        ...newExtra.analytics?.feedback,
        title: value,
      },
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Handle adding a new rating
  const handleAddRating = () => {
    if (!isAnalyticsEnabled || !isFeedbackEnabled || !newRating.name) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Add new rating
    const currentRatings = [...(newExtra.analytics?.feedback?.ratings || [])]
    currentRatings.push({ ...newRating })

    // Update feedback ratings
    newExtra.analytics = {
      ...newExtra.analytics,
      feedback: {
        ...newExtra.analytics?.feedback,
        ratings: currentRatings,
      },
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })

    // Reset new rating and exit adding mode
    setNewRating({
      icon: "material/emoticon-happy-outline",
      name: "",
      data: 1,
      note: "Thanks for your feedback!",
    })
    setIsAddingRating(false)
  }

  // Handle removing a rating
  const handleRemoveRating = (index: number) => {
    if (!isAnalyticsEnabled || !isFeedbackEnabled) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Remove rating at index
    const currentRatings = [...(newExtra.analytics?.feedback?.ratings || [])]
    currentRatings.splice(index, 1)

    // Update feedback ratings
    newExtra.analytics = {
      ...newExtra.analytics,
      feedback: {
        ...newExtra.analytics?.feedback,
        ratings: currentRatings,
      },
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  // Handle updating a rating
  const handleUpdateRating = (index: number, field: keyof FeedbackRating, value: string | number) => {
    if (!isAnalyticsEnabled || !isFeedbackEnabled) return

    // Create a new extra object to avoid mutation
    const newExtra = { ...config.extra } || {}

    // Update rating at index
    const currentRatings = [...(newExtra.analytics?.feedback?.ratings || [])]
    currentRatings[index] = {
      ...currentRatings[index],
      [field]: value,
    }

    // Update feedback ratings
    newExtra.analytics = {
      ...newExtra.analytics,
      feedback: {
        ...newExtra.analytics?.feedback,
        ratings: currentRatings,
      },
    }

    onChange({
      ...config,
      extra: Object.keys(newExtra).length > 0 ? newExtra : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Analytics</CardTitle>
        <CardDescription>Configure analytics for your MkDocs site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics-enabled">Enable Google Analytics</Label>
            <p className="text-sm text-muted-foreground">Add Google Analytics to your documentation site</p>
          </div>
          <Switch id="analytics-enabled" checked={isAnalyticsEnabled} onCheckedChange={handleAnalyticsToggle} />
        </div>

        {isAnalyticsEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analytics-property">Measurement ID</Label>
              <Input
                id="analytics-property"
                value={propertyValue}
                onChange={(e) => handlePropertyChange(e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground">Your Google Analytics 4 Measurement ID (starts with G-)</p>
            </div>

            {!propertyValue || propertyValue === "G-XXXXXXXXXX" ? (
              <Alert variant="warning" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please enter your actual Google Analytics Measurement ID to enable analytics.
                </AlertDescription>
              </Alert>
            ) : null}

            <Alert className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
              <AlertDescription>
                Currently only Google Analytics 4 is supported. More providers may be added in the future.
              </AlertDescription>
            </Alert>

            <Separator className="my-6" />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="feedback">
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <h3 className="text-base font-medium">Feedback Widget</h3>
                      <p className="text-sm text-muted-foreground">Add a feedback widget to collect user ratings</p>
                    </div>
                    <Switch
                      id="feedback-enabled"
                      checked={isFeedbackEnabled}
                      onCheckedChange={handleFeedbackToggle}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {isFeedbackEnabled && (
                    <div className="space-y-6 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="feedback-title">Feedback Title</Label>
                        <Input
                          id="feedback-title"
                          value={feedbackTitle}
                          onChange={(e) => handleFeedbackTitleChange(e.target.value)}
                          placeholder="Was this page helpful?"
                        />
                        <p className="text-xs text-muted-foreground">The title displayed above the feedback options</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Feedback Options</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingRating(true)}
                            disabled={isAddingRating}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>

                        {/* Existing ratings */}
                        {feedbackRatings.map((rating, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">Option {index + 1}</h5>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRating(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove option</span>
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`rating-icon-${index}`}>Icon</Label>
                                <Input
                                  id={`rating-icon-${index}`}
                                  value={rating.icon}
                                  onChange={(e) => handleUpdateRating(index, "icon", e.target.value)}
                                  placeholder="material/emoticon-happy-outline"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Material icon name, e.g., material/emoticon-happy-outline
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`rating-name-${index}`}>Label</Label>
                                <Input
                                  id={`rating-name-${index}`}
                                  value={rating.name}
                                  onChange={(e) => handleUpdateRating(index, "name", e.target.value)}
                                  placeholder="This page was helpful"
                                />
                                <p className="text-xs text-muted-foreground">
                                  The text displayed when hovering over the icon
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`rating-data-${index}`}>Data Value</Label>
                                <Input
                                  id={`rating-data-${index}`}
                                  type="number"
                                  min="0"
                                  max="1"
                                  value={rating.data}
                                  onChange={(e) => handleUpdateRating(index, "data", Number.parseInt(e.target.value))}
                                />
                                <p className="text-xs text-muted-foreground">
                                  The value sent to Google Analytics (typically 1 for positive, 0 for negative)
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`rating-note-${index}`}>Thank You Note</Label>
                                <Textarea
                                  id={`rating-note-${index}`}
                                  value={rating.note}
                                  onChange={(e) => handleUpdateRating(index, "note", e.target.value)}
                                  placeholder="Thanks for your feedback!"
                                  rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                  The message displayed after feedback is submitted. HTML is supported.
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {/* Add new rating form */}
                        {isAddingRating && (
                          <Card className="p-4 border-dashed">
                            <div className="space-y-4">
                              <h5 className="font-medium">New Feedback Option</h5>

                              <div className="space-y-2">
                                <Label htmlFor="new-rating-icon">Icon</Label>
                                <Input
                                  id="new-rating-icon"
                                  value={newRating.icon}
                                  onChange={(e) => setNewRating({ ...newRating, icon: e.target.value })}
                                  placeholder="material/emoticon-happy-outline"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Material icon name, e.g., material/emoticon-happy-outline
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="new-rating-name">Label</Label>
                                <Input
                                  id="new-rating-name"
                                  value={newRating.name}
                                  onChange={(e) => setNewRating({ ...newRating, name: e.target.value })}
                                  placeholder="This page was helpful"
                                />
                                <p className="text-xs text-muted-foreground">
                                  The text displayed when hovering over the icon
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="new-rating-data">Data Value</Label>
                                <Input
                                  id="new-rating-data"
                                  type="number"
                                  min="0"
                                  max="1"
                                  value={newRating.data}
                                  onChange={(e) =>
                                    setNewRating({ ...newRating, data: Number.parseInt(e.target.value) })
                                  }
                                />
                                <p className="text-xs text-muted-foreground">
                                  The value sent to Google Analytics (typically 1 for positive, 0 for negative)
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="new-rating-note">Thank You Note</Label>
                                <Textarea
                                  id="new-rating-note"
                                  value={newRating.note}
                                  onChange={(e) => setNewRating({ ...newRating, note: e.target.value })}
                                  placeholder="Thanks for your feedback!"
                                  rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                  The message displayed after feedback is submitted. HTML is supported.
                                </p>
                              </div>

                              <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setIsAddingRating(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddRating} disabled={!newRating.name}>
                                  Add Option
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )}

                        {feedbackRatings.length === 0 && !isAddingRating && (
                          <div className="text-center p-4 border border-dashed rounded-md">
                            <p className="text-sm text-muted-foreground">No feedback options configured yet.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsAddingRating(true)}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {!isAnalyticsEnabled && (
          <p className="text-sm text-muted-foreground">Enable Google Analytics to configure additional features.</p>
        )}
      </CardContent>
    </Card>
  )
}


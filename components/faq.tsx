"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about the Material for MkDocs Configurator.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="what-is" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">
            What is the Material for MkDocs Configurator?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              The Material for MkDocs Configurator is a free, open-source tool that helps you generate configuration
              files for the Material theme for MkDocs.
            </p>
            <p>
              Instead of manually writing YAML configuration or searching through documentation, you can use this visual
              interface to configure your MkDocs Material site and get a ready-to-use{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">mkdocs.yml</code> file.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="versioning" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">How is this tool versioned?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              The Material for MkDocs Configurator uses a versioning scheme that indicates both its own version and the
              supported Material for MkDocs version:
            </p>
            <p className="mb-2">
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                &lt;Configurator Version&gt;-&lt;Material for MkDocs Version&gt;
              </code>
            </p>
            <p className="mb-2">
              For example, <code className="bg-muted px-1 py-0.5 rounded text-sm">v1.0.0-9.6.10</code> means:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>Version 1.0.0 of the Configurator</li>
              <li>Compatible with Material for MkDocs version 9.6.10</li>
            </ul>
            <p>
              You can see the current version at the bottom of the sidebar menu. This helps you know which version of
              Material for MkDocs your configuration will work with.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="who-is-it-for" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">Who is this tool for?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">This tool is designed for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Documentation authors using MkDocs with the Material theme</li>
              <li>Developers who want to quickly set up a documentation site</li>
              <li>Teams looking to standardize their documentation configuration</li>
              <li>Anyone who prefers a visual interface over writing YAML manually</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-use" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">How do I use the generated configuration?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">Once you've configured your settings:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Copy the generated YAML from the preview panel</li>
              <li>
                Create or replace your <code className="bg-muted px-1 py-0.5 rounded text-sm">mkdocs.yml</code> file
                with this content
              </li>
              <li>
                Make sure you have MkDocs and the Material theme installed (
                <code className="bg-muted px-1 py-0.5 rounded text-sm">pip install mkdocs-material</code>)
              </li>
              <li>
                Run <code className="bg-muted px-1 py-0.5 rounded text-sm">mkdocs serve</code> to preview your site
                locally
              </li>
            </ol>
            <p className="mt-2">The configuration is compatible with the latest version of MkDocs Material.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-privacy" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">Does this tool collect or store my data?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              No. The Material for MkDocs Configurator runs entirely in your browser. Your configuration data is not
              sent to any server or stored anywhere outside your browser session.
            </p>
            <p>
              If you refresh the page or close your browser, your configuration will be lost unless you've copied the
              YAML output.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">What are the limitations of this tool?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">While we aim to support all features of MkDocs Material, there are some limitations:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Some advanced or rarely used configurations might not be available through the UI</li>
              <li>Custom plugins beyond those included in Material may not be fully supported</li>
              <li>The tool doesn't validate if your configuration will work with your specific content structure</li>
              <li>
                The configurator is updated periodically, but might not immediately reflect the latest features from
                MkDocs Material
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contribute" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">How can I contribute or report issues?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">This is an open-source project, and contributions are welcome!</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Report bugs or request features through the{" "}
                <a
                  href="https://github.com/mocdaniel/mkdocs-material-configurator/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub issue tracker
                </a>
              </li>
              <li>Submit pull requests to improve the tool</li>
              <li>Share the tool with others who might find it useful</li>
              <li>Star the repository on GitHub to show your support</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="why-created" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">Why was this tool created?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              MkDocs Material is a powerful theme with many configuration options. While its documentation is excellent,
              navigating all the possible settings can be overwhelming, especially for beginners. This tool aims to make
              the configuration process more intuitive and visual, helping users discover features they might not have
              known about and reducing the time spent on configuration.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="official-relation" className="border rounded-lg px-4">
          <AccordionTrigger className="text-lg font-medium">
            Is this an official Material for MkDocs tool?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              No, this is not an official tool created by the Material for MkDocs team. It's a community-created project
              designed to complement the official documentation.
            </p>
            <p>
              For the most authoritative and up-to-date information, always refer to the{" "}
              <a
                href="https://squidfunk.github.io/mkdocs-material/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                official Material for MkDocs documentation
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}


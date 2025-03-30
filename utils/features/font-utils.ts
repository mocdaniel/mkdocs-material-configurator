export interface GoogleFont {
  family: string
  variants: string[]
  category: string
}

// List of popular Google Fonts
export const popularFonts: GoogleFont[] = [
  {
    family: "Roboto",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Open Sans",
    variants: ["300", "400", "600", "700"],
    category: "sans-serif",
  },
  {
    family: "Lato",
    variants: ["300", "400", "700", "900"],
    category: "sans-serif",
  },
  {
    family: "Montserrat",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Roboto Condensed",
    variants: ["300", "400", "700"],
    category: "sans-serif",
  },
  {
    family: "Source Sans Pro",
    variants: ["300", "400", "600", "700"],
    category: "sans-serif",
  },
  {
    family: "Oswald",
    variants: ["300", "400", "700"],
    category: "sans-serif",
  },
  {
    family: "Roboto Mono",
    variants: ["300", "400", "500", "700"],
    category: "monospace",
  },
  {
    family: "Raleway",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Nunito",
    variants: ["300", "400", "600", "700"],
    category: "sans-serif",
  },
  {
    family: "Poppins",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Ubuntu",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Merriweather",
    variants: ["300", "400", "700", "900"],
    category: "serif",
  },
  {
    family: "Fira Code",
    variants: ["300", "400", "500", "700"],
    category: "monospace",
  },
  {
    family: "JetBrains Mono",
    variants: ["300", "400", "500", "700"],
    category: "monospace",
  },
  {
    family: "Source Code Pro",
    variants: ["300", "400", "500", "700"],
    category: "monospace",
  },
  {
    family: "IBM Plex Mono",
    variants: ["300", "400", "500", "700"],
    category: "monospace",
  },
  {
    family: "PT Sans",
    variants: ["400", "700"],
    category: "sans-serif",
  },
  {
    family: "PT Serif",
    variants: ["400", "700"],
    category: "serif",
  },
  {
    family: "Noto Sans",
    variants: ["400", "700"],
    category: "sans-serif",
  },
  {
    family: "Noto Serif",
    variants: ["400", "700"],
    category: "serif",
  },
  {
    family: "Playfair Display",
    variants: ["400", "700", "900"],
    category: "serif",
  },
  {
    family: "Quicksand",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Work Sans",
    variants: ["300", "400", "500", "700"],
    category: "sans-serif",
  },
  {
    family: "Inconsolata",
    variants: ["400", "700"],
    category: "monospace",
  },
  {
    family: "Droid Sans Mono",
    variants: ["400"],
    category: "monospace",
  },
  {
    family: "Space Mono",
    variants: ["400", "700"],
    category: "monospace",
  },
  {
    family: "Anonymous Pro",
    variants: ["400", "700"],
    category: "monospace",
  },
  {
    family: "Courier Prime",
    variants: ["400", "700"],
    category: "monospace",
  },
]

// Helper function to get font URL for loading
export function getFontUrl(fontFamily: string): string {
  // Replace spaces with + for Google Fonts URL
  const formattedFamily = fontFamily.replace(/\s+/g, "+")
  return `https://fonts.googleapis.com/css2?family=${formattedFamily}:wght@400;700&display=swap`
}

// Helper function to filter fonts by category
export function getTextFonts(): GoogleFont[] {
  return popularFonts.filter((font) => font.category !== "monospace")
}

export function getCodeFonts(): GoogleFont[] {
  return popularFonts.filter((font) => font.category === "monospace")
}

// Helper function to get all fonts
export function getAllFonts(): GoogleFont[] {
  return popularFonts
}

// Helper function to preload a batch of fonts
export function preloadFonts(fonts: GoogleFont[]): void {
  fonts.forEach((font) => {
    const link = document.createElement("link")
    link.href = getFontUrl(font.family)
    link.rel = "preload"
    link.as = "style"
    document.head.appendChild(link)
  })
}


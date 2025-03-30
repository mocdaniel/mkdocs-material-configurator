export function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    red: "#EF5552",
    pink: "#E92063",
    purple: "#AB47BD",
    "deep-purple": "#7E56C2",
    indigo: "#4051B5",
    blue: "#2094F3",
    "light-blue": "#05A6F2",
    cyan: "#00BDD6",
    teal: "#009485",
    green: "#4CAE50",
    "light-green": "#8BC34B",
    lime: "#CBDC38",
    yellow: "#FFEC3C",
    amber: "#FFC107",
    orange: "#FFA725",
    "deep-orange": "#FF6E42",
    brown: "#795649",
    grey: "#757575",
    "blue-grey": "#546D78",
    black: "#14151A",
    white: "#FFFFFF",
  }

  return colorMap[colorName] || "#4051B5" // Default to indigo if not found
}

export const colorOptions = [
  { value: "red", label: "Red", hex: "#EF5552" },
  { value: "pink", label: "Pink", hex: "#E92063" },
  { value: "purple", label: "Purple", hex: "#AB47BD" },
  { value: "deep-purple", label: "Deep Purple", hex: "#7E56C2" },
  { value: "indigo", label: "Indigo", hex: "#4051B5" },
  { value: "blue", label: "Blue", hex: "#2094F3" },
  { value: "light-blue", label: "Light Blue", hex: "#05A6F2" },
  { value: "cyan", label: "Cyan", hex: "#00BDD6" },
  { value: "teal", label: "Teal", hex: "#009485" },
  { value: "green", label: "Green", hex: "#4CAE50" },
  { value: "light-green", label: "Light Green", hex: "#8BC34B" },
  { value: "lime", label: "Lime", hex: "#CBDC38" },
  { value: "yellow", label: "Yellow", hex: "#FFEC3C" },
  { value: "amber", label: "Amber", hex: "#FFC107" },
  { value: "orange", label: "Orange", hex: "#FFA725" },
  { value: "deep-orange", label: "Deep Orange", hex: "#FF6E42" },
]


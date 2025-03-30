import type { Language } from "@/types/features/language-config"

// List of languages supported by MkDocs Material
// Source: MkDocs Material schema.json
export const supportedLanguages: Language[] = [
  { code: "custom", name: "Custom", description: "Custom translations" },
  { code: "af", name: "Afrikaans" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "bn", name: "Bengali (Bangla)", nativeName: "বাংলা" },
  { code: "ca", name: "Catalan", nativeName: "Català" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "et", name: "Estonian", nativeName: "Eesti" },
  { code: "fa", name: "Persian (Farsi)", nativeName: "فارسی" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "gl", name: "Galician", nativeName: "Galego" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ka", name: "Georgian", nativeName: "ქართული" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол" },
  { code: "ms", name: "Bahasa Malaysia", nativeName: "Bahasa Melayu" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "nb", name: "Norwegian (Bokmål)", nativeName: "Norsk (Bokmål)" },
  { code: "nn", name: "Norwegian (Nynorsk)", nativeName: "Norsk (Nynorsk)" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "pt-BR", name: "Portuguese (Brazilian)", nativeName: "Português (Brasil)" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "sh", name: "Serbo-Croatian", nativeName: "Srpskohrvatski" },
  { code: "si", name: "Sinhalese", nativeName: "සිංහල" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文 (简体)" },
  { code: "zh-Hant", name: "Chinese (Traditional)", nativeName: "中文 (繁體)" },
  { code: "zh-TW", name: "Chinese (Taiwanese)", nativeName: "中文 (台灣)" },
]

// Helper function to get language by code
export function getLanguageByCode(code: string): Language | undefined {
  return supportedLanguages.find((lang) => lang.code === code)
}

// Helper function to get language display name
export function getLanguageDisplayName(language: Language): string {
  if (language.nativeName) {
    return `${language.name} (${language.nativeName})`
  }
  return language.name
}


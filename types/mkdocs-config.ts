export interface MkDocsConfig {
  site_name: string
  site_url?: string
  site_description?: string
  site_author?: string
  copyright?: string
  repo_url?: string
  repo_name?: string
  edit_uri?: string
  theme: {
    name: string
    palette?: ThemePalette | ThemePalette[]
    features?: string[]
    icon?: {
      logo?: string
      repo?: string
      menu?: string
      alternate?: string
      search?: string
      share?: string
      close?: string
      top?: string
      edit?: string
      view?: string
      admonition?: string
      tag?: string
      previous?: string
      next?: string
    }
    font?:
      | {
          text?: string
          code?: string
        }
      | boolean
    language?: string
    direction?: string
    automaticMode?: boolean // Flag for automatic mode
    logo?: string // Path to the logo
    favicon?: string // Path to the favicon
  }
  nav?: Array<any>
  markdown_extensions?: string[]
  plugins?: Array<
    | string
    | {
        [key: string]: any
        privacy?: {
          enabled: boolean
          concurrency: number
          cache: boolean
          cache_dir: string
          assets: boolean
          assets_fetch_dir: string
        }
        social?: {
          cards?: boolean
          cards_dir?: string
        }
        blog?: {
          enabled?: boolean
          blog_dir?: string
          blog_toc?: boolean
          post_dir?: string
          post_date_format?: string
          post_url_date_format?: string
          post_url_format?: string
          post_url_max_categories?: number
          post_excerpt?: string
          post_excerpt_max_authors?: number
          post_excerpt_max_categories?: number
          post_excerpt_separator?: string
          post_readtime?: boolean
          post_readtime_words_per_minute?: number
        }
        tags?: {
          enabled?: boolean
          tags?: boolean
          tags_slugify_separator?: string
          tags_slugify_format?: string
          tags_sort_reverse?: boolean
          tags_name_property?: string
          tags_name_variable?: string
          tags_allowed?: string[]
          listings?: boolean
          listings_map?: {
            [key: string]: {
              scope: boolean
              exclude?: string
            }
          }
          listings_sort_reverse?: boolean
          listings_tags_sort_reverse?: boolean
          listings_directive?: string
        }
        rss?: {
          enabled?: boolean
          match_path?: string
          date_from_meta?: {
            as_creation?: string
          }
          categories?: string[]
        }
        "git-revision-date-localized"?: {
          enabled?: boolean
          type?: string
          enable_creation_date?: boolean
          fallback_to_build_date?: boolean
        }
        "git-committers"?: {
          enabled?: boolean
          repository: string
          branch?: string
        }
      }
  >
  extra?: {
    alternate?: AlternateLanguage[]
    homepage?: string // Where the logo links to
    consent?: {
      title?: string
      description?: string
      actions?: string[] // Available actions: accept, reject, manage
      cookies?: {
        [key: string]: {
          name: string
          checked?: boolean
        }
      }
    }
    analytics?: {
      provider: string
      property: string
      feedback?: {
        title?: string
        ratings?: Array<{
          icon: string
          name: string
          data: number
          note: string
        }>
      }
    }
    social?: Array<{
      icon: string
      link: string
      name?: string
    }>
    generator?: boolean
    version?: {
      provider?: string
      alias?: boolean
      default?: string
    }
    [key: string]: any
  }
  extra_css?: string[]
  extra_javascript?: string[]
}

export interface ThemePalette {
  scheme?: string
  primary?: string
  accent?: string
  media?: string
  toggle?: {
    icon?: string
    name?: string
  }
}

export interface AlternateLanguage {
  name: string
  link: string
  lang: string
}


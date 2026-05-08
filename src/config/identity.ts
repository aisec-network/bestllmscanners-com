export interface IdentityFont {
  id: string;
  display: string;
  body: string;
  mono: string;
  google_fonts_url: string;
  stack_display: string;
  stack_body: string;
  stack_mono: string;
}

export interface IdentityPalette {
  id: string;
  hue: number;
  neutral_family: string;
  accent: string;
  accent_dark: string;
  surface: string;
  surface_alt: string;
  fg: string;
  fg_muted: string;
  border: string;
  surface_dark: string;
  surface_alt_dark: string;
  fg_dark: string;
  fg_muted_dark: string;
  border_dark: string;
}

export interface IdentityLayout {
  id: "magazine" | "dashboard" | "feed" | "directory" | "longform" | "kiosk";
  component: string;
  component_path: string;
  density: "loose" | "normal" | "dense";
  brief: string;
}

export interface IdentityVoice {
  id: string;
  label_latest: string;
  label_recent: string;
  label_featured: string;
  label_more: string;
  nav_posts: string;
  nav_about: string;
  cta_subscribe: string;
  cta_subscribe_desc: string;
  cta_button: string;
  site_motto: string;
}

export interface Identity {
  font: IdentityFont;
  palette: IdentityPalette;
  layout: IdentityLayout;
  voice: IdentityVoice;
}

export const identity: Identity = {
  "font": {
    "id": "f17_sans_manrope_lora",
    "display": "Manrope",
    "body": "Lora",
    "mono": "JetBrains Mono",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Lora:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
    "stack_display": "Manrope, \"Helvetica Neue\", system-ui, sans-serif",
    "stack_body": "Lora, \"Iowan Old Style\", Georgia, serif",
    "stack_mono": "\"JetBrains Mono\", ui-monospace, monospace"
  },
  "palette": {
    "id": "p06_h135_ink",
    "hue": 135,
    "neutral_family": "ink",
    "accent": "41 174 74",
    "accent_dark": "71 225 109",
    "surface": "255 255 255",
    "surface_alt": "245 245 245",
    "fg": "10 10 10",
    "fg_muted": "80 80 80",
    "border": "220 220 220",
    "surface_dark": "10 10 10",
    "surface_alt_dark": "22 22 22",
    "fg_dark": "240 240 240",
    "fg_muted_dark": "160 160 160",
    "border_dark": "50 50 50"
  },
  "layout": {
    "id": "kiosk",
    "component": "HomeKiosk",
    "component_path": "@components/clusters/HomeKiosk.astro",
    "density": "loose",
    "brief": "Full-bleed alternating sections with tall hero."
  },
  "voice": {
    "id": "v06_dispatch",
    "label_latest": "Recent dispatches",
    "label_recent": "Past dispatches",
    "label_featured": "Lead dispatch",
    "label_more": "Read dispatch",
    "nav_posts": "Dispatches",
    "nav_about": "Masthead",
    "cta_subscribe": "Join the wire",
    "cta_subscribe_desc": "Dispatches when they ship — never on a schedule.",
    "cta_button": "Subscribe",
    "site_motto": "Dispatches from the AI security beat."
  }
} as const;

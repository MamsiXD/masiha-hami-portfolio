# Masiha Hami — Frontend Developer & Portfolio CMS

A bilingual (**English LTR / Persian RTL**) personal portfolio and content management dashboard built with **React**, **JavaScript (JSX)**, **Tailwind CSS**, and **Vite**.

---

## Features

- **Bilingual Localization (`EN` / `FA`)**: Instant switching between English (`dir="ltr"`) and Persian (`dir="rtl"`) layouts, including localized metadata and RTL typography.
- **Dark & Light Themes**: Monochrome theme switching persisted across sessions in `localStorage`.
- **Responsive Design**: Adaptive mobile, tablet, and desktop layouts across both the public portfolio and the admin workspace.
- **100% Local Assets**: Zero external font or icon CDN dependencies — all webfonts (`Yekan Bakh` + `@fontsource/*`) and SVG icons (`src/assets/svg/`) are bundled and served locally.
- **Code-Split & Protected Admin CMS (`/admin`)**:
  - Dedicated login gate (`AdminAuthGuard`) backed by salted 10,000-round SHA-256 credential verification, session expiry (4 hours in `sessionStorage`), and brute-force lockout protection (5 failed attempts / 60-second cooldown).
  - Lazy-loaded admin modules so CMS code is separated from the initial public bundle:
    - `/admin/overview` (alias `/admin`) — Live stats, layout quick-reorder, spotlight toggle, and status summary
    - `/admin/sections` — Layout section visibility toggles, ordering controls, and custom sections
    - `/admin/skills` — Public stack tile toggles and hero orbital skill badges
    - `/admin/projects` — Full project catalog CRUD editor with bilingual metadata
    - `/admin/settings` — Bilingual hero status headlines, contact email, theme/RTL simulation, and state reset

---

## Tech Stack

- **Framework**: React 19 (`JSX`), React Router v7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations & Icons**: Motion, Lucide React, local `SvgIcon` sprite set (`src/assets/svg/`)
- **Build & Tooling**: Vite 8, `esbuild`, `jsconfig.json`

---

## Local Typography & Assets

### Yekan Bakh (`public/assets/fonts/`)

Declared via `@font-face` in `src/index.css` (`font-display: swap`):

| File | Weight |
| --- | --- |
| `YekanBakh-Thin.woff2` | `100` |
| `YekanBakh-Light.woff2` | `300` |
| `YekanBakh-Regular.woff2` | `400` |
| `YekanBakh-SemiBold.woff2` | `600` |
| `YekanBakh-Bold.woff2` | `700` |
| `YekanBakh-ExtraBold.woff2` | `800` |
| `YekanBakh-Black.woff2` | `900` |
| `YekanBakh-ExtraBlack.woff2` | `950` |

### Bundled UI Fonts (`@fontsource/*`)

Imported directly in `src/main.jsx`:
- `@fontsource/plus-jakarta-sans` (300, 400, 500, 600, 700)
- `@fontsource/dm-sans` (400, 500, 700)
- `@fontsource/instrument-serif` (400, 400-italic)
- `@fontsource/jetbrains-mono` (400, 500, 700)
- `@fontsource/vazirmatn` (300, 400, 500, 600, 700)

### Local Visual Assets

- `public/assets/images/` — Local project cover SVGs (`portfolio-cover.svg`, `agency-seo.svg`, `mfe-checkout.svg`, `canvas-shaders.svg`)
- `src/assets/svg/` — Local UI SVG icon library rendered through `src/components/SvgIcon.jsx`

---

## Project Structure

```text
├── index.html
├── jsconfig.json
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       ├── fonts/                 # Yekan Bakh .woff2 webfonts
│       └── images/                # Local SVG cover artwork
└── src/
    ├── App.jsx                    # Public + lazy-loaded /admin routes
    ├── main.jsx                   # App entry point & bundled font imports
    ├── index.css                  # @font-face rules, theme tokens, RTL styles
    ├── assets/svg/                # Local SVG icons
    ├── components/
    │   ├── SvgIcon.jsx
    │   └── admin/
    │       ├── AdminAuthGuard.jsx # Session guard & login screen
    │       └── AdminLayout.jsx    # Responsive CMS shell & navigation
    ├── context/
    │   └── PortfolioContext.jsx   # Global portfolio state & persistence
    ├── data/
    │   └── initialData.js         # Default bilingual portfolio content
    ├── pages/
    │   ├── PortfolioPage.jsx      # Public portfolio page
    │   └── admin/
    │       ├── AdminOverviewPage.jsx
    │       ├── AdminProjectsPage.jsx
    │       ├── AdminSectionsPage.jsx
    │       ├── AdminSettingsPage.jsx
    │       └── AdminSkillsPage.jsx
    └── utils/
        └── adminAuth.js           # Salted SHA-256 verifier & lockout logic
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**

### Clone & Install

```bash
git clone https://github.com/MamsiXD/masiha-hami-portfolio.git
cd masiha-hami-portfolio
npm install
```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server at `http://localhost:3000` |
| `npm run lint` | Runs `esbuild` JavaScript/JSX syntax checks across `vite.config.js` and `src/` |
| `npm run build` | Builds the optimized production bundle into `dist/` |
| `npm run preview` | Serves the production `dist/` build locally for verification |
| `npm run clean` | Removes generated `dist/` build output |

> **Important:** Do not open `index.html` directly via `file://` in a browser. The application uses ES module imports (`<script type="module" src="/src/main.jsx">`), JSX compilation, and client-side routing (`BrowserRouter`), which require an HTTP dev/preview server such as `npm run dev` or `npm run preview`.

---

## Admin Access

The management panel lives at `/admin` (hidden from public navigation links) and persists content edits in browser storage (`localStorage`), with active authentication scoped to `sessionStorage`.

---

## Author

**Masiha Hami** — Frontend Developer
GitHub: [@MamsiXD](https://github.com/MamsiXD)

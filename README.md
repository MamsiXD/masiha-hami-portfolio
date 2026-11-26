# Masiha Hami — Frontend Developer & Portfolio CMS

A bilingual (**English LTR / Persian RTL**) personal portfolio and content management dashboard built with **React**, **JavaScript (JSX)**, **Tailwind CSS**, and **Vite**.

## Features

- **Bilingual Localization**: Instant EN (`LTR`) ↔ FA (`RTL`) switching with local fonts and Yekan Bakh support.
- **Dark & Light Themes**: Smooth monochrome theme switching persisted in `localStorage`.
- **Responsive Design**: Tailored layouts for mobile, tablet, and desktop screens across both the public portfolio and the admin workspace.
- **Local Assets**: All fonts and SVG icons are served locally with zero external Google Fonts dependencies.
- **Protected Admin CMS (`/admin`)**:
  - Layout section visibility & drag-and-drop / reorder control
  - Skills matrix & hero orbital badge controls
  - Live project catalog editor with bilingual metadata
  - Identity, contact inbox, and RTL preview tools

## Local Fonts (Yekan Bakh)

Local Yekan Bakh `.woff2` webfonts are bundled inside `public/assets/fonts/`:
- `YekanBakh-Thin.woff2` (100)
- `YekanBakh-Light.woff2` (300)
- `YekanBakh-Regular.woff2` (400)
- `YekanBakh-SemiBold.woff2` (600)
- `YekanBakh-Bold.woff2` (700)
- `YekanBakh-ExtraBold.woff2` (800)
- `YekanBakh-Black.woff2` (900)
- `YekanBakh-ExtraBlack.woff2` (950)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Syntax-check and build for production
npm run lint
npm run build
```

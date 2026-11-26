# Masiha Hami — Frontend Developer & Portfolio CMS

A bilingual (**English LTR / Persian RTL**) personal portfolio and content management dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

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

Place your local Yekan Bakh font files inside `public/assets/fonts/`:
- `YekanBakh-Light.woff2` (or `.ttf`)
- `YekanBakh-Regular.woff2` (or `.ttf`)
- `YekanBakh-Medium.woff2` (or `.ttf`)
- `YekanBakh-SemiBold.woff2` (or `.ttf`)
- `YekanBakh-Bold.woff2` (or `.ttf`)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```

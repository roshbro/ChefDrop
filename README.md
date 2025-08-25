# ChefDrop – Pop‑Up Chef Discovery (Tempo Starter)

A minimal Vite + React + Tailwind starter you can hand to *Tempo* as the base app.
It includes:
- Home, Discover (filters), Event Details, Submit, Subscribe pages
- Sample event data
- A small Dev Tests panel for utility functions

## Run locally

```bash
npm install
npm run dev
```

Then open the printed localhost URL.

## Build

```bash
npm run build
npm run preview
```

## Notes

- Tailwind is preconfigured (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
- All images are remote Unsplash links.
- Replace the placeholder brand name “ChefDrop” freely.
- The Dev Tests section is optional; remove `<DevTests />` from `App.jsx` if you don’t want it in builds.

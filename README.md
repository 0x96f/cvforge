# CVForge

Privacy-focused, open-source resume builder. Create a resume in your browser, preview it live, and export when you are ready.

## Features

- **Guided editor** - Profile, work history, education, projects, certificates, and skills with live preview
- **Privacy & encryption** - Resume data encrypted in browser local storage
- **Export formats** - JSON (client-side) and PDF (via self-hosted Gotenberg)
- **Open source** - MIT-licensed

## Tech stack

- [SvelteKit](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Gotenberg](https://gotenberg.dev) for PDF generation
- Web Crypto API for client-side storage encryption

## Requirements

- [Node.js](https://nodejs.org) 24+
- [pnpm](https://pnpm.io) 10+ (`corepack enable` to activate via Node)
- [Docker](https://www.docker.com) and Docker Compose (for the containerized setup, or to run Gotenberg locally)

## Getting started

### Docker (app + PDF export)

Runs the production build with Gotenberg included. No local Node install required.

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Gotenberg is available inside the stack on port 3001 for debugging.

### Local development (without Gotenberg)

Use this for UI work, the editor, live preview, and JSON export. **PDF export requires Gotenberg** and will not work in this mode.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Local development (with PDF export)

Start Gotenberg, then run the dev server with `GOTENBERG_URL` pointing at it:

```bash
# Gotenberg only (from this repo's compose file)
docker compose up gotenberg -d

# Or any Gotenberg 8 instance on port 3001
docker run --rm -p 3001:3000 gotenberg/gotenberg:8
```

Copy `.env.example` to `.env` (it sets `GOTENBERG_URL=http://localhost:3001`), or pass the variable inline:

```bash
GOTENBERG_URL=http://localhost:3001 pnpm dev
```

### Production build

```bash
pnpm build
node build
```

Set `PORT` (default `3000`) and `HOST` as needed for `@sveltejs/adapter-node`.

## Environment variables

| Variable                        | Required                  | Description                                              |
| ------------------------------- | ------------------------- | -------------------------------------------------------- |
| `GOTENBERG_URL`                 | Optional                  | Gotenberg base URL. Defaults to `http://gotenberg:3000`. |
| `PUBLIC_STORAGE_ENCRYPTION_KEY` | Recommended in production | Secret used to wrap the per-browser encryption key.      |
| `PUBLIC_GITHUB_URL`             | Optional                  | Repository link in the UI.                               |

## Project structure

```
src/routes/
  +page.svelte              Landing page
  create/+page.svelte        New resume entry
  builder/+page.svelte       Resume editor
  api/export-pdf/            PDF export endpoint (Gotenberg)
src/lib/components/
  ui/                        Shared form controls
  builder/                   Editor, preview, and section forms
src/lib/utils/               Data model, storage, encryption, export
static/fonts/                Resume font files (woff2)
```

## Inspired by

[OpenResume](https://github.com/xitanggg/open-resume) — an open-source resume builder and parser.

## License

MIT

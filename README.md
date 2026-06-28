# Mehar Ali — Portfolio

Personal portfolio website built from resume data, GitHub, and LinkedIn.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages — free)

Live URL: **https://92meharali.github.io**

### One-time setup

1. Create a GitHub repo named **`92meharali.github.io`** (must match your username exactly).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push this project:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/92meharali/92meharali.github.io.git
git push -u origin main
```

GitHub Actions builds `dist/` and publishes automatically on every push to `main`.

### Before first deploy

- Add your photo as `public/profile.jpg`
- Add your CV as `public/resume.pdf` (or run `npm run build:resume` if LaTeX is installed)

### Custom domain later

Repo **Settings → Pages → Custom domain** — works if you buy a `.com` or `.me` later.

## CV download

The sidebar **Download CV** button serves `public/resume.pdf`. Generate it from your LaTeX resume:

```bash
npm run build:resume
```

Requires LaTeX with `fontawesome5` (e.g. `texlive-fonts-extra`).

## Resume source files

LaTeX resumes are kept in the project root:

- `complete_resume.tex` — full one-page resume
- `complete.tex` — ML-focused variant
- `AI research.tex` — AI safety research variant

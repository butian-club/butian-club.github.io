<div align="center">
  <h1>Butian Engineering Club</h1>
  <p>English | <a href="README.zh-Hans.md">简体中文</a></p>
  <p>
    <img src="https://img.shields.io/github/actions/workflow/status/butian-club/butian-club.github.io/deploy.yml?style=flat-square" alt="deployment" />
    <img src="https://img.shields.io/github/last-commit/butian-club/butian-club.github.io?style=flat-square" alt="last commit" />
    <img src="https://img.shields.io/github/languages/top/butian-club/butian-club.github.io?style=flat-square" alt="top language" />
    <img src="https://img.shields.io/github/repo-size/butian-club/butian-club.github.io?style=flat-square" alt="repo size" />
    <img src="https://img.shields.io/github/license/butian-club/butian-club.github.io?style=flat-square" alt="license" />
  </p>
</div>

The official website of the Butian Engineering Club at Hangzhou No. 2 High School.
It presents the club, projects, activity records, and an operating guide for the club's
collaboration platform at [butian-club.github.io](https://butian-club.github.io).

## Features

🚀 **Project showcase** — project data in `src/data/projects.ts` drives both the home-page
selection and the complete project index.

📝 **Activity archive** — Docusaurus blog posts record competitions, outreach, and project
reviews with shared author and tag metadata.

📚 **Operations handbook** — the docs section covers accounts, permissions, tasks,
tickets, documents, notifications, and administration.

🎨 **Shared visual system** — reusable page components and CSS tokens keep light and dark
themes consistent across the site.

## Quick start

```bash
git clone https://github.com/butian-club/butian-club.github.io.git
cd butian-club.github.io
npm install
npm start
```

Open `http://localhost:3000`. Before a pull request, run:

```bash
npm run format
npm run typecheck
npm run build
```

## Common changes

- Add a project in `src/data/projects.ts`; set `featured: true` to show it on the home page.
- Add an activity record under `blog/` and reuse entries from `blog/authors.yml` and
  `blog/tags.yml`.
- Add or revise platform documentation under `docs/`, then update `sidebars.ts` when its
  navigation position changes.
- Change brand or theme tokens at the top of `src/css/custom.css`.

Do not invent missing club information. Teacher names, member lists, contact details,
recruitment dates, and other factual fields remain TODOs until the club confirms them.

## Structure

```text
blog/                               # activities, competitions, and project reviews
docs/                               # collaboration-platform handbook
src/
├── components/                     # shared page and reveal components
├── css/custom.css                  # visual tokens and global styles
├── data/                           # project and organization data
├── lib/i18n.ts                     # interface strings
└── pages/                          # home, about, projects, and join routes
static/                             # logos, icons, and social assets
docusaurus.config.ts                # site, navigation, and deployment settings
sidebars.ts                         # documentation navigation
```

## Deployment

Pushes to `main` are built and published to GitHub Pages by
`.github/workflows/deploy.yml`. The production build output is generated; source changes
belong in `src/`, `docs/`, `blog/`, or `static/`.

## License

Licensed under the [MIT License](LICENSE).

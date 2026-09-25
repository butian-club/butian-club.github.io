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

## Website Introduction

The official website of the Butian Engineering Club at Hangzhou No. 2 High School.
It presents the club, projects, activity records, and an operating guide for the club's
collaboration platform at [butian.club](https://butian.club).

## Website Features

🚀 **Project stories** — the home-page journey draws its milestones from
`src/data/projects.ts`; full reports remain available in the activity archive.

📝 **Activity archive** — Docusaurus blog posts record competitions, outreach, and project
reviews with shared author and tag metadata.

📚 **Operations handbook** — the docs section covers accounts, permissions, chat and AI,
tasks, tickets, documents, notifications, and administration.

🎨 **Shared visual system** — reusable page components and CSS tokens keep light and dark
themes consistent across the site.

## Getting Started

```bash
git clone https://github.com/butian-club/butian-club.github.io.git
cd butian-club.github.io
npm install
npm start
```

Open `http://localhost:3000`. Before a pull request, run:

```bash
npm run format
npm test
npm run typecheck
npm run build
```

## Common Changes

- Add or revise project data in `src/data/projects.ts`. Home-page milestones are selected by
  ID in `src/components/CinematicHome/index.tsx`.
- Add an activity record under `blog/` and reuse entries from `blog/authors.yml` and
  `blog/tags.yml`.
- Add or revise platform documentation under `docs/`, then update `sidebars.ts` when its
  navigation position changes.
- Change brand or theme tokens at the top of `src/css/custom.css`.

Do not invent missing club information. Omit teacher names, member lists, contact details,
recruitment dates, and other factual fields until the club confirms them.

## Project Structure

```bash
butian-club.github.io/
├── blog/                           # Activities, competitions, and project reviews
│   ├── authors.yml                 # Author configuration
│   └── tags.yml                    # Tag configuration
├── docs/                           # Collaboration-platform handbook
├── i18n/                           # Internationalization files
├── src/                            # Source code
│   ├── components/                 # shared page and reveal components
│   ├── css/custom.css              # visual tokens and global styles
│   ├── data/                       # project and organization data
│   ├── lib/i18n.ts                 # interface strings
│   └── pages/                      # home, about, and join routes
├── static/                         # Logos, icons, and social assets
├── docusaurus.config.ts            # Docusaurus configuration
├── LICENSE                         # Code license
├── LICENSE-docs                    # Content license
├── package-lock.json               # Dependency lock file
├── package.json                    # Dependency configuration
├── sidebars.ts                     # Documentation navigation
└── tsconfig.json                   # TypeScript configuration
```

## Site Deployment

Pushes to `main` are built and published to GitHub Pages by
`.github/workflows/deploy.yml`. The production build output is generated; source changes
belong in `src/`, `docs/`, `blog/`, or `static/`.

## License

This project's code is licensed under [MIT License](LICENSE), and this website's content is licensed under [CC BY 4.0](LICENSE-docs).

# Repository instructions

## Project

Official website of the Butian Engineering Club at Hangzhou No.2 High School. It is a
Docusaurus 3.10 site using TypeScript and React 19, deployed to GitHub Pages. Node.js 20 or
newer is required.

## Commands

```bash
npm install
npm start                                      # default dev server
npm start -- --no-open --port 8964             # configured local preview
npm start -- --no-open --locale en --port 8965 # English preview
npm test
npm run typecheck
npm run build
npm run serve
```

Run `npm test`, `npm run typecheck`, and `npm run build` before delivering changes.

## Structure and conventions

- `src/data/projects.ts` is the single source of truth for projects. Add or edit project
  records there; the home page and `/projects` derive from it.
- `src/data/site.ts` owns the club directions and headline statistics.
- Reuse `src/components/ProjectCard` and `src/components/PageHero` instead of recreating
  equivalent UI.
- Global design tokens and light/dark theme behavior live in `src/css/custom.css`.
- Put activity posts in `blog/`, documentation in `docs/`, and register documentation in
  `sidebars.ts`.
- Do not invent missing teachers, members, contact details, recruitment dates, or other club
  facts. Leave the existing TODOs until verified information is available.
- Preserve the bilingual structure when changing user-facing content.
- The collaboration-platform handbook must describe behavior verified in
  `/Users/lailai/GitHub/butian-club-gfssm-website`. Treat its routes, schema,
  services, and tests as implementation evidence; do not preserve an old manual
  claim merely because it appeared in an earlier release.
- When a platform fact changes, update every affected handbook page and the
  bilingual website READMEs in the same change. Extend
  `tests/content-consistency.test.mjs` for facts likely to regress.

## Agent configuration

This `AGENTS.md` file is the runtime-neutral source of repository instructions. `CLAUDE.md`
is only a compatibility import. Claude-specific launch configuration remains in
`.claude/launch.json`; durable project knowledge belongs here.

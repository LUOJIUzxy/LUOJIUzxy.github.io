# README.me · Phoebe

Personal website + notes from therapy. Built with **Astro 7**, **React 19** (interactive islands), **Keystatic** (CMS) and **Markdoc**, stored in a **private GitHub repo**.

The original no-build prototype is kept in [`legacy/`](legacy/) for reference.

## Structure

```
keystatic.config.ts         CMS schema: notes collection + “关于我” singleton
astro.config.mjs            Astro + React + Markdoc + Keystatic, Vercel adapter
src/content.config.ts       Astro content collections (mirror the Keystatic schema)
src/content/notes/*.mdoc    one file per note (frontmatter + Markdoc body)
src/content/site/about.yaml  About section copy
src/components/NotesBrowser.tsx  React island: topic filter + search
src/pages/index.astro       home page
src/pages/notes/[slug].astro   one page per note
src/lib/notes.ts            draft filtering, labels, excerpts
scripts/import-legacy.mjs   import notes from the old localStorage prototype
```

## Write locally

```bash
npm install
npm run dev
```

- Site: http://localhost:4321
- Editor: http://localhost:4321/keystatic. Saving writes `.mdoc` files into `src/content/notes/`. Commit and push to publish.

## Styling

Tailwind CSS v4 (via `@tailwindcss/vite`). Design tokens live in the `@theme` block of `src/styles/global.css`: `bg-canvas`, `bg-surface`, `border-line`, `text-fg` / `text-fg-2` / `text-fg-3`, and the syntax colours `text-kw`, `text-fn`, `text-str`… Note bodies (Markdoc) are styled by the `.prose` rules in the same file. Shared class strings (buttons, chips, badges) are in `src/components/ui.ts`.

## Languages

Chinese is the default and lives at `/`; English mirrors every page under `/en/` (the 中文 / EN switch in the header links between them).

- Interface text for both languages is in `src/i18n.ts`.
- Notes are not translated. Each note has a **语言** field (中文 / English); both language versions list every public note, with a small badge on notes written in the other language.
- The About section has optional English fields in Keystatic (标题 / 介绍段落 / 标签（English）). Left empty, the English page shows the Chinese text.

## Drafts and privacy

Each note has a **状态** field:

| Status | Local dev | Live site | GitHub repo |
|---|---|---|---|
| 草稿 (draft, the default) | shown with a “草稿” badge | **not built** | yes, readable by anyone |
| 公开 (published) | shown | shown | yes |

- **This repo is public** (GitHub Pages user sites on a free account have to be). Drafts are never built into the live site, but every committed `.mdoc` file, drafts included, can be read on GitHub, and stays in the git history even after you delete it.
- To keep a draft fully private, don't commit it: write it locally and only commit once it's set to 公开.
- Anything set to 公开 is public on the live site. Re-read before switching.
- The “写一篇” buttons and writing prompts on the home page appear only in `npm run dev`.

## Deploy (GitHub Pages)

The site is a fully static build served at **https://luojiuzxy.github.io**. `.github/workflows/deploy.yml` builds and publishes it on every push to `main`.

One-time setup:

1. Rename the repo to `LUOJIUzxy.github.io` and make it public (repo Settings → General).
2. Point your local clone at the new name:
   ```bash
   git remote set-url origin git@github.com:LUOJIUzxy/LUOJIUzxy.github.io.git
   ```
3. Repo Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Merge your work into `main` and push. The Actions tab shows the deploy; the site is live a minute or two later.

Writing: Keystatic's editor needs a server, which GitHub Pages doesn't have, so `/keystatic` only exists in `npm run dev`. Write locally, commit, push to `main`.

## Bring over notes from the old prototype

Old notes lived in the browser's localStorage for the address you opened the prototype on.

1. Serve `legacy/` the same way you did before (e.g. `cd legacy && python3 -m http.server 8000`) and open it in the same browser.
2. In the devtools console run `copy(localStorage.getItem('phoebe-slow-notes-v1'))`. Paste the result into `legacy-notes.json` at the project root. The file is git-ignored. Delete it afterwards anyway.
3. Run `npm run import-legacy -- legacy-notes.json`. Files from the old “导出 Markdown” button also work: `npm run import-legacy -- ~/Downloads/*.md`.

Every imported note arrives as a **draft**.

## Notes

- `src/content/notes/example-after-session.mdoc` is an example draft. Delete it in Keystatic whenever you like.
- The full writing outlines (会谈之后 / 日常练习 / 偶尔回看) are shown as help text under the 正文 field in the editor.
- Content is personal experience, not medical advice (the footer says so too).

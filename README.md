# 慢慢 · Phoebe

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

## Drafts and privacy

Each note has a **状态** field:

| Status | Local dev | Public site | Private repo |
|---|---|---|---|
| 草稿 (draft, the default) | shown with a “草稿” badge | **not built** | yes |
| 公开 (published) | shown | shown | yes |

- Drafts never reach the built site. They are still committed to the repo, so anyone you give repo access can read them. Keep the repo private.
- Anything set to 公开 is public on the internet. Re-read before switching.
- The “写一篇” buttons and writing prompts on the home page appear only in `npm run dev`.

## Deploy (Vercel + Keystatic GitHub mode)

1. **Create the private repo and push**
   ```bash
   gh repo create phoebe-slow-notes --private --source . --push
   ```
2. **Import it in Vercel** (Framework: Astro, no other settings needed). Set `site` in `astro.config.mjs` to your domain.
3. **Turn on GitHub mode for Keystatic**, so you can write at `https://your-domain/keystatic` from any device:
   - Add Vercel env vars `PUBLIC_KEYSTATIC_STORAGE=github` and `PUBLIC_KEYSTATIC_GITHUB_REPO=<owner>/phoebe-slow-notes`.
   - Locally, put the same two lines in `.env`, run `npm run dev` and open `/keystatic`. Keystatic walks you through creating a GitHub App and writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env`.
   - Copy those four values into Vercel's env vars. In the GitHub App settings, add `https://your-domain/api/keystatic/github/oauth/callback` as a callback URL. Install the App on the repo only.
   - Redeploy. Only GitHub accounts with write access to the repo can sign in to `/keystatic`. Each save is a commit, and each commit triggers a redeploy.
   - Remove the two `PUBLIC_KEYSTATIC_*` lines from your local `.env` again if you want local mode back for offline writing.

Not using Vercel? Replace `@astrojs/vercel` with `@astrojs/node`, `@astrojs/netlify` or `@astrojs/cloudflare` in `astro.config.mjs`. Only `/keystatic` and `/api/keystatic` need a server. Every other page is static.

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

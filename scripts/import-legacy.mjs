#!/usr/bin/env node
/**
 * Import notes from the old localStorage prototype (legacy/) into Keystatic.
 *
 * Usage:
 *   npm run import-legacy -- <file-or-folder> [...more]
 *
 * Accepts either:
 *   • a .json file holding the localStorage dump, obtained on the OLD site with
 *       copy(localStorage.getItem('phoebe-slow-notes-v1'))
 *     in the browser devtools console, then pasted into e.g. legacy-notes.json
 *   • .md files produced by the old "导出 Markdown" button (or a folder of them)
 *
 * Every imported note is created as a DRAFT. Existing files are never overwritten.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('src/content/notes');
const CATEGORY = { 心理治疗: 'therapy', 生活随记: 'life', 技术与创造: 'making' };

function slugFor(note, i) {
  const ascii = note.title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${note.date}-${ascii || 'note-' + String(i + 1).padStart(2, '0')}`;
}

function escapeMarkdoc(text) {
  return text.replace(/\{%/g, '\\{%');
}

function toMdoc(note) {
  return [
    '---',
    `title: ${JSON.stringify(note.title)}`,
    'status: draft',
    `date: ${note.date}`,
    `category: ${CATEGORY[note.category] ?? 'therapy'}`,
    '---',
    escapeMarkdoc(note.body.trim()),
    '',
  ].join('\n');
}

function fromJson(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const list = typeof data === 'string' ? JSON.parse(data) : data;
  if (!Array.isArray(list)) throw new Error(`${file}: expected an array of notes`);
  return list.filter((n) => n && n.title && n.body && /^\d{4}-\d{2}-\d{2}$/.test(n.date));
}

function fromMarkdown(file) {
  // Format written by legacy/app.js:
  // # title\n\n日期：YYYY-MM-DD\n主题：xxx\n\nbody
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^# (.+)\n\n日期：(\d{4}-\d{2}-\d{2})\n主题：(.+)\n\n([\s\S]*)$/);
  if (!m) {
    console.warn(`skip ${file}: not in the legacy export format`);
    return [];
  }
  return [{ title: m[1].trim(), date: m[2], category: m[3].trim(), body: m[4] }];
}

function collect(p) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) return fs.readdirSync(p).flatMap((f) => collect(path.join(p, f)));
  if (p.endsWith('.json')) return fromJson(p);
  if (p.endsWith('.md')) return fromMarkdown(p);
  return [];
}

const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error('Usage: npm run import-legacy -- <notes.json | note.md | folder> [...]');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let written = 0;
inputs.flatMap(collect).forEach((note, i) => {
  let slug = slugFor(note, i);
  let target = path.join(OUT_DIR, `${slug}.mdoc`);
  for (let n = 2; fs.existsSync(target); n++) target = path.join(OUT_DIR, `${slug}-${n}.mdoc`);
  fs.writeFileSync(target, toMdoc(note));
  console.log(`✓ ${path.relative(process.cwd(), target)}  (${note.title})`);
  written++;
});
console.log(`\nImported ${written} note(s) as drafts. Open /keystatic to review and publish.`);

import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

export const CATEGORY_LABELS: Record<Note['data']['category'], string> = {
  therapy: '心理治疗',
  life: '生活随记',
  making: '技术与创造',
};

/** Drafts are visible in `npm run dev` only — never in a production build. */
export const SHOW_DRAFTS = import.meta.env.DEV;

export async function getVisibleNotes(): Promise<Note[]> {
  const all = await getCollection('notes', ({ data }) => SHOW_DRAFTS || data.status === 'published');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(d: Date, sep = ' / '): string {
  const iso = d.toISOString().slice(0, 10);
  return iso.replaceAll('-', sep);
}

/** Rough plain-text version of a Markdoc body, for excerpts and search. */
export function plainText(markdoc = ''): string {
  return markdoc
    .replace(/\{%[\s\S]*?%\}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerptOf(note: Note, length = 90): string {
  if (note.data.excerpt) return note.data.excerpt;
  const text = plainText(note.body);
  return text.length > length ? text.slice(0, length) + '…' : text;
}

/** Keystatic admin link for creating a note (local dev; shown only when SHOW_DRAFTS). */
export const NEW_NOTE_URL = '/keystatic/collection/notes/create';

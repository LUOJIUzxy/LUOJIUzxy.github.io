import { useMemo, useState } from 'react';
import { chip, draftBadge, langBadge } from './ui';

export interface NoteSummary {
  href: string;
  title: string;
  date: string; // "2026-10-09"
  category: string; // display label
  excerpt: string;
  searchText: string;
  draft: boolean;
  /** BCP-47 tag of the note's own language. */
  lang: string;
  /** Set when the note is written in the other language than the page. */
  langBadge?: string;
}

export interface BrowserStrings {
  all: string;
  filterLabel: string;
  searchPlaceholder: string;
  searchLabel: string;
  noResults: string;
  firstNote: string;
  writeFirst: string;
  comingSoon: string;
}

interface Props {
  notes: NoteSummary[];
  categories: string[];
  t: BrowserStrings;
  /** Show "write" calls-to-action (local dev only). */
  writeUrl?: string;
}

export default function NotesBrowser({ notes, categories, t, writeUrl }: Props) {
  const [filter, setFilter] = useState(t.all);
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter(
      (n) =>
        (filter === t.all || n.category === filter) &&
        (!q || `${n.title} ${n.searchText}`.toLowerCase().includes(q)),
    );
  }, [notes, filter, query, t.all]);

  return (
    <div className="min-w-0 rounded-2xl border border-line bg-frame p-1">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-3 py-2.5">
          <div className="flex flex-wrap gap-1" role="group" aria-label={t.filterLabel}>
            {[t.all, ...categories].map((c) => (
              <button
                key={c}
                type="button"
                className={`min-h-9 rounded-md border px-3 text-sm transition-colors ${
                  filter === c ? 'border-line-strong bg-elevated text-fg' : 'border-transparent text-fg-2 hover:text-fg'
                }`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex h-10 min-w-[180px] flex-[1_1_100%] items-center gap-2 rounded-lg border border-line-strong bg-canvas px-3 text-fg-3 focus-within:border-fn focus-within:ring-1 focus-within:ring-fn/40 sm:ml-auto sm:flex-[0_1_260px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-3"
              type="search"
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <ul className="divide-y divide-line" aria-live="polite">
          {shown.map((n) => (
            <li key={n.href}>
              <a
                className="group flex flex-wrap items-baseline gap-x-7 gap-y-1.5 p-4 transition-colors hover:bg-elevated sm:p-5"
                href={n.href}
              >
                <span className="w-24 font-mono text-[13px] text-fg-3">{n.date}</span>
                <span className="flex min-w-0 flex-[1_1_360px] flex-col gap-1.5" lang={n.lang}>
                  <span className="text-[17px] leading-[1.45] font-medium [overflow-wrap:anywhere] transition-colors group-hover:text-fn">
                    {n.title}
                    {n.draft && <span className={`ml-2.5 ${draftBadge}`}>draft</span>}
                  </span>
                  {n.excerpt && <span className="text-sm leading-[1.65] text-fg-2 [overflow-wrap:anywhere]">{n.excerpt}</span>}
                </span>
                {n.langBadge && <span className={langBadge}>{n.langBadge}</span>}
                <span className={chip}>{n.category}</span>
                <span className="hidden text-fg-3 sm:inline" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        {shown.length === 0 && (
          <div className="px-5 py-7 text-sm text-fg-2">
            {notes.length > 0 ? (
              <p>
                <span className="font-mono text-[13px] text-fg-3">0 results</span> · {t.noResults}
              </p>
            ) : writeUrl ? (
              <p>
                <span className="font-mono text-[13px] text-fg-3">0 notes</span> · {t.firstNote}{' '}
                <a className="text-fn" href={writeUrl}>{t.writeFirst}</a>
              </p>
            ) : (
              <p>
                <span className="font-mono text-[13px] text-fg-3">0 notes</span> · {t.comingSoon}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

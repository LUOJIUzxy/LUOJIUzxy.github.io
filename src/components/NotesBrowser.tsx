import { useMemo, useState } from 'react';

export interface NoteSummary {
  slug: string;
  title: string;
  date: string; // "2026 / 10 / 09"
  category: string; // display label
  excerpt: string;
  searchText: string;
  draft: boolean;
}

interface Props {
  notes: NoteSummary[];
  categories: string[];
  /** Show "write" calls-to-action (local dev only). */
  writeUrl?: string;
}

const ALL = '全部';

export default function NotesBrowser({ notes, categories, writeUrl }: Props) {
  const [filter, setFilter] = useState(ALL);
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter(
      (n) =>
        (filter === ALL || n.category === filter) &&
        (!q || `${n.title} ${n.searchText}`.toLowerCase().includes(q)),
    );
  }, [notes, filter, query]);

  return (
    <div className="frame">
      <div className="frame-inner notes-panel">
        <div className="notes-toolbar">
          <div className="filters" role="group" aria-label="按主题筛选">
            {[ALL, ...categories].map((c) => (
              <button
                key={c}
                type="button"
                className={filter === c ? 'active' : undefined}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="搜索标题和正文"
              aria-label="搜索笔记"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <ul className="note-list" aria-live="polite">
          {shown.map((n) => (
            <li key={n.slug}>
              <a className="note-row" href={`/notes/${n.slug}/`}>
                <span className="note-date">{n.date}</span>
                <span className="note-content">
                  <span className="note-title">
                    {n.title}
                    {n.draft && <span className="draft-badge">draft</span>}
                  </span>
                  {n.excerpt && <span className="note-excerpt">{n.excerpt}</span>}
                </span>
                <span className="chip">{n.category}</span>
                <span className="note-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        {shown.length === 0 && (
          <div className="empty-state">
            {notes.length > 0 ? (
              <p>
                <span className="mono">0 results</span> · 换个主题或关键词试试。
              </p>
            ) : writeUrl ? (
              <p>
                <span className="mono">0 notes</span> · 第一篇，从此刻开始。{' '}
                <a href={writeUrl}>写下第一篇 ↗</a>
              </p>
            ) : (
              <p>
                <span className="mono">0 notes</span> · 第一篇还在路上，过些时候再来看看。
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

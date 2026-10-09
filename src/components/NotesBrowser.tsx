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
    <>
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
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="找一篇笔记"
            aria-label="搜索笔记"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div aria-live="polite">
        {shown.map((n) => (
          <a key={n.slug} className="note-row" href={`/notes/${n.slug}/`}>
            <span className="note-date">{n.date}</span>
            <div className="note-content">
              <span className="note-category">
                {n.category}
                {n.draft && <span className="draft-badge">草稿 · 仅本地可见</span>}
              </span>
              <h3>{n.title}</h3>
              <p>{n.excerpt}</p>
            </div>
            <span className="note-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="empty-state">
          <div className="empty-number">00</div>
          <div>
            {notes.length > 0 ? (
              <>
                <h3>暂时没有匹配的笔记。</h3>
                <p>试试另一个主题，或换一个关键词。</p>
              </>
            ) : writeUrl ? (
              <>
                <h3>第一篇，从此刻开始。</h3>
                <p>一句新的理解、一次小练习，或一个还没想明白的问题，都可以成为笔记的起点。</p>
                <a className="text-button" href={writeUrl}>
                  写下第一篇 <span aria-hidden="true">↗</span>
                </a>
              </>
            ) : (
              <>
                <h3>笔记正在慢慢写。</h3>
                <p>第一篇还在路上，过些时候再来看看。</p>
              </>
            )}
          </div>
          <span className="empty-decoration" aria-hidden="true">
            ✳
          </span>
        </div>
      )}
    </>
  );
}

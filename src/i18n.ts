/**
 * Two locales. Chinese is the default and lives at the root (/, /notes/…);
 * English mirrors every page under /en/. Notes themselves are not translated:
 * each note has a `lang` field and keeps its own language on both sides.
 */
export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export function localeFromPath(path: string): Locale {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
}

/** The same page in another locale: /notes/x/ ⇄ /en/notes/x/. */
export function localizePath(path: string, locale: Locale): string {
  const bare = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return locale === 'en' ? `/en${bare}` : bare;
}

export const homePath = (locale: Locale) => (locale === 'en' ? '/en/' : '/');
export const notePath = (locale: Locale, slug: string) => `${locale === 'en' ? '/en' : ''}/notes/${slug}/`;

const zh = {
  htmlLang: 'zh-CN',
  description: 'Phoebe 的个人网站。记录心理治疗的心得、生活里的观察，以及技术与创作。',
  nav: { notes: '笔记', about: '关于', write: '写一篇', switchTo: 'EN', switchLabel: 'English' },
  footer: { disclaimer: '个人经历与思考 · 不作为诊断或治疗建议' },
  hero: {
    meta: (n: number, d: string | null) => `~/phoebe · ${n} 篇公开${d ? ` · 更新于 ${d}` : ''}`,
    lead: '你好，我是 Phoebe。',
    rest: '软件工程师。这是我的 README：治疗笔记、生活观察，和正在做的东西。',
    read: '读笔记',
    about: '关于我',
  },
  readme: {
    writing: '## 在写什么',
    status: '## 状态',
    published: '公开笔记：',
    updated: '最近更新：',
    drafts: '草稿：只留在本地，不进公开构建',
    copy: '复制 README.me',
    copied: '已复制',
    fallbackTagline: '写代码，也写下生活。',
  },
  notes: {
    lead: '笔记。',
    rest: '按主题筛选，或者直接搜。',
    aside: '只有标成公开的笔记会出现在正式网站上。会谈里的理解，带回日常再看一遍。',
    localNote: '本地预览：草稿也会显示在这里；正式网站只显示状态为“公开”的笔记。',
  },
  prompts: {
    lead: '不知道从哪里写？',
    rest: '借一个提纲开始。',
    aside: '仅本地可见。完整提纲在编辑器“正文”字段的说明里。',
    items: [
      { key: '会谈之后', title: '今天，我带走了什么？', text: '一个有触动的片刻，一个新的理解，一个还想继续聊的问题。' },
      { key: '日常练习', title: '把理解，放进生活。', text: '记录一次与治疗师约定的练习，以及尝试前后的真实感受。' },
      { key: '偶尔回看', title: '有哪些细小的变化？', text: '留意重复出现的主题与变化，也允许有些问题暂时没有答案。' },
    ],
  },
  about: { lead: '关于我。', aside: '这一段在 Keystatic 的「关于我」里编辑。', tags: '标签' },
  article: {
    back: '回到笔记',
    disclaimer: '个人经历与思考，不作为诊断或治疗建议。',
    newer: '← 较新',
    older: '较早 →',
    draft: 'draft · 仅本地可见',
    more: '更多笔记',
  },
  browser: {
    all: '全部',
    filterLabel: '按主题筛选',
    searchPlaceholder: '搜索标题和正文',
    searchLabel: '搜索笔记',
    noResults: '换个主题或关键词试试。',
    firstNote: '第一篇，从此刻开始。',
    writeFirst: '写下第一篇 ↗',
    comingSoon: '第一篇还在路上，过些时候再来看看。',
  },
  /** Badge on a note written in the other language. */
  otherLang: 'EN',
};

export type UI = typeof zh;

const en: UI = {
  htmlLang: 'en',
  description: "Phoebe's personal website: notes from therapy, everyday observations, and things I'm building.",
  nav: { notes: 'Notes', about: 'About', write: 'Write', switchTo: '中文', switchLabel: '中文' },
  footer: { disclaimer: 'Personal experience and reflection · not diagnosis or treatment advice' },
  hero: {
    meta: (n, d) => `~/phoebe · ${n} public${d ? ` · updated ${d}` : ''}`,
    lead: "Hi, I'm Phoebe. ",
    rest: 'Software engineer. This is my README: therapy notes, daily life, and things I build.',
    read: 'Read notes',
    about: 'About me',
  },
  readme: {
    writing: '## Writing about',
    status: '## Status',
    published: 'Public notes: ',
    updated: 'Last updated: ',
    drafts: 'Drafts: local only, never in the public build',
    copy: 'Copy README.me',
    copied: 'Copied',
    fallbackTagline: 'Writing code, and writing down life.',
  },
  notes: {
    lead: 'Notes. ',
    rest: 'Filter by topic, or just search.',
    aside: 'Only notes marked public show up on the live site. Insights from sessions, looked at again in daily life.',
    localNote: 'Local preview: drafts show here too; the live site only shows notes marked public.',
  },
  prompts: {
    lead: 'Not sure where to start? ',
    rest: 'Borrow an outline.',
    aside: 'Local only. The full outlines are in the help text under the editor’s 正文 field.',
    items: [
      { key: 'After a session', title: 'What did I take away today?', text: 'A moment that moved me, a new understanding, a question I want to keep exploring.' },
      { key: 'Daily practice', title: 'Bring the insight into life.', text: 'Record an exercise agreed with my therapist, and how it really felt before and after.' },
      { key: 'Looking back', title: 'What small changes have there been?', text: 'Notice recurring themes and shifts, and let some questions stay open for now.' },
    ],
  },
  about: { lead: 'About. ', aside: 'Edited under 关于我 in Keystatic (English fields).', tags: 'Tags' },
  article: {
    back: 'Back to notes',
    disclaimer: 'Personal experience and reflection, not diagnosis or treatment advice.',
    newer: '← Newer',
    older: 'Older →',
    draft: 'draft · local only',
    more: 'More notes',
  },
  browser: {
    all: 'All',
    filterLabel: 'Filter by topic',
    searchPlaceholder: 'Search titles and text',
    searchLabel: 'Search notes',
    noResults: 'Try another topic or keyword.',
    firstNote: 'Start the first one.',
    writeFirst: 'Write the first note ↗',
    comingSoon: 'The first one is on its way. Check back soon.',
  },
  otherLang: '中文',
};

export const ui: Record<Locale, UI> = { zh, en };

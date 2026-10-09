import { collection, config, fields, singleton } from '@keystatic/core';

/**
 * Storage
 * - `npm run dev` → local: entries are written straight to src/content/**.
 * - Production   → github: /keystatic signs you in with GitHub and commits
 *   to the private repo, which triggers a redeploy.
 */
const storage =
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({
        kind: 'github',
        repo: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}`,
      } as const)
    : ({ kind: 'local' } as const);

export const CATEGORIES = [
  { label: '心理治疗', value: 'therapy' },
  { label: '生活随记', value: 'life' },
  { label: '技术与创造', value: 'making' },
] as const;

const WRITING_PROMPTS = `不知道从哪里写？可以借用一个提纲：
· 会谈之后 — 想记住的片刻 / 我的理解（也可以仍然不确定）/ 和之前相比的不同 / 想带回日常的一件小事 / 下次想继续讨论的问题
· 日常练习 — 与治疗师约定的练习 / 尝试的情境 / 尝试前的想法与感受 / 我实际做了什么 / 尝试后的观察 / 想在下次会谈讨论什么
· 偶尔回看 — 最近反复出现的主题 / 细小的变化 / 什么对我有帮助 / 仍然困难的地方 / 下一阶段想探索什么`;

export default config({
  storage,
  ui: {
    brand: { name: '慢慢 · Phoebe' },
    navigation: { 写作: ['notes'], 网站: ['site'] },
  },
  collections: {
    notes: collection({
      label: '笔记',
      slugField: 'title',
      path: 'src/content/notes/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'date', 'status'],
      schema: {
        title: fields.slug({
          name: { label: '标题', validation: { isRequired: true, length: { max: 120 } } },
          slug: {
            label: '网址片段',
            description: '出现在网址里，例如 after-session-0412。中文标题请手动填英文或拼音。',
          },
        }),
        status: fields.select({
          label: '状态',
          description: '草稿只存在于私有仓库，不会出现在公开网站上。确认愿意公开后再改为“公开”。',
          options: [
            { label: '草稿（不公开）', value: 'draft' },
            { label: '公开', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        date: fields.date({
          label: '日期',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: '主题',
          options: CATEGORIES,
          defaultValue: 'therapy',
        }),
        excerpt: fields.text({
          label: '摘要',
          description: '列表中显示的一两句话。留空则自动截取正文开头。',
          multiline: true,
        }),
        body: fields.markdoc({
          label: '正文',
          description: WRITING_PROMPTS,
        }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: '关于我',
      path: 'src/content/site/about',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: '标题', defaultValue: '写代码，也写下生活。' }),
        paragraphs: fields.array(fields.text({ label: '段落', multiline: true }), {
          label: '介绍段落',
          itemLabel: (props) => props.value.slice(0, 40) || '段落',
        }),
        tags: fields.array(fields.text({ label: '标签' }), {
          label: '标签',
          itemLabel: (props) => props.value || '标签',
        }),
      },
    }),
  },
});

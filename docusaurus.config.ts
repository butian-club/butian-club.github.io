import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// 该文件运行在 Node.js 环境 —— 不要在此使用浏览器端代码（DOM、JSX 等）。

const config: Config = {
  title: '杭州第二中学步天工程社',
  tagline: 'Butian Engineering Club · 把想法变成结构、代码、电路与可验证的结果',
  favicon: 'img/favicon.ico',

  // 提升与即将到来的 Docusaurus v4 的兼容性，并启用 faster（Rspack/SWC）构建管线
  future: {
    v4: true,
    faster: true,
  },

  // 生产环境地址（自定义域名，CNAME 见 static/CNAME）
  url: 'https://butian.club',
  baseUrl: '/',

  // GitHub Pages 部署配置
  organizationName: 'butian-club',
  projectName: 'butian-club.github.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // 双语：简体中文（默认）/ English。文档与博客文章不翻译，回退到中文原文。
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文', htmlLang: 'zh-Hans'},
      en: {label: 'English', htmlLang: 'en'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // TODO: 启用「编辑此页」时，请替换为社团仓库地址
          editUrl:
            'https://github.com/butian-club/butian-club.github.io/tree/main/',
        },
        blog: {
          routeBasePath: 'blog',
          blogTitle: '活动记录',
          blogDescription:
            '步天工程社的活动复盘、比赛记录、项目日志与技术文章。',
          showReadingTime: true,
          blogSidebarTitle: '最近活动',
          blogSidebarCount: 'ALL',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/butian-club/butian-club.github.io/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
        },
      } satisfies Preset.Options,
    ],
  ],

  // 文档 / 博客正文图片点击放大查看
  plugins: ['docusaurus-plugin-image-zoom'],

  themeConfig: {
    zoom: {
      selector: '.markdown img, img[data-zoomable]',
      background: {
        light: 'rgba(238, 242, 248, 0.92)',
        dark: 'rgba(4, 7, 17, 0.92)',
      },
    },
    // TODO: 替换为社团自己的社交分享卡片
    image: 'img/butian-social-card.svg',
    metadata: [
      {
        name: 'keywords',
        content:
          '步天工程社, 杭州第二中学, Butian Engineering Club, 航天, 工程, 学生社团',
      },
      {
        name: 'description',
        content:
          '杭州第二中学步天工程社（Butian Engineering Club）官方网站：以项目驱动的高中工程与航天科技社团。',
      },
    ],
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '步天工程社',
      logo: {
        alt: '步天工程社标志',
        src: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        {to: '/', label: '首页', position: 'left', activeBaseRegex: '^/$'},
        {to: '/about', label: '关于', position: 'left'},
        {to: '/projects', label: '项目', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'knowledgeSidebar',
          position: 'left',
          label: '文档',
        },
        {to: '/blog', label: '博客', position: 'left'},
        {to: '/join', label: '加入我们', position: 'right'},
        {type: 'localeDropdown', position: 'right'},
        {
          href: 'https://github.com/butian-club',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '社团',
          items: [
            {label: '关于我们', to: '/about'},
            {label: '加入我们', to: '/join'},
            {label: '项目', to: '/projects'},
          ],
        },
        {
          title: '内容',
          items: [
            {label: '活动记录', to: '/blog'},
            {label: '知识库', to: '/docs/intro'},
          ],
        },
        {
          title: '更多',
          items: [
            {label: 'GitHub', href: 'https://github.com/butian-club'},
            {
              label: '杭州第二中学',
              href: 'http://www.hz2hs.cn/',
            },
          ],
        },
      ],
      copyright: `<div style="margin-top:0.5rem;opacity:0.85;">杭州第二中学步天工程社 · Butian Engineering Club</div>Copyright © ${new Date().getFullYear()} Hangzhou No.2 High School Butian Engineering Club.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'cpp', 'python'],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

<div align="center">
  <h1>杭州第二中学步天工程社</h1>
  <p><a href="README.md">English</a> | 简体中文</p>
  <p>
    <img src="https://img.shields.io/github/actions/workflow/status/butian-club/butian-club.github.io/deploy.yml?style=flat-square" alt="部署状态" />
    <img src="https://img.shields.io/github/last-commit/butian-club/butian-club.github.io?style=flat-square" alt="最后提交" />
    <img src="https://img.shields.io/github/languages/top/butian-club/butian-club.github.io?style=flat-square" alt="主要语言" />
    <img src="https://img.shields.io/github/repo-size/butian-club/butian-club.github.io?style=flat-square" alt="仓库大小" />
    <img src="https://img.shields.io/github/license/butian-club/butian-club.github.io?style=flat-square" alt="许可证" />
  </p>
</div>

## 网站简介

杭州第二中学步天工程社官方网站。站点位于
[butian-club.github.io](https://butian-club.github.io)，用于介绍社团、展示项目、记录活动，
并提供社团协作平台的操作手册。

## 网站特性

🚀 **项目展示** —— `src/data/projects.ts` 同时驱动首页精选项目与完整项目列表。

📝 **活动档案** —— Docusaurus 博客记录比赛、科普与项目复盘，并复用作者和标签元数据。

📚 **操作手册** —— 文档区覆盖账号、权限、任务、工单、文档、通知与后台管理。

🎨 **统一视觉系统** —— 复用页面组件与 CSS token，保持深浅色主题一致。

## 快速开始

```bash
git clone https://github.com/butian-club/butian-club.github.io.git
cd butian-club.github.io
npm install
npm start
```

打开 `http://localhost:3000`。提交 PR 前运行：

```bash
npm run format
npm run typecheck
npm run build
```

## 常见修改

- 在 `src/data/projects.ts` 添加项目；设置 `featured: true` 后会显示在首页。
- 在 `blog/` 添加活动记录，并复用 `blog/authors.yml` 与 `blog/tags.yml` 中的条目。
- 在 `docs/` 添加或修订平台文档；导航位置变化时同步更新 `sidebars.ts`。
- 在 `src/css/custom.css` 顶部修改品牌色或主题 token。

不要编造尚未确认的社团信息。指导老师、成员名单、联系方式、招新时间等事实字段，
必须由社团确认后再填写。

## 项目结构

```bash
butian-club.github.io/
├── blog/                           # 活动、比赛与项目复盘
│   ├── authors.yml                 # 作者配置
│   └── tags.yml                    # 标签配置
├── docs/                           # 社团协作平台手册
├── i18n/                           # 国际化文件
├── src/                            # 源代码
│   ├── components/                 # 共享页面与动效组件
│   ├── css/custom.css              # 视觉 token 与全局样式
│   ├── data/                       # 项目与社团数据
│   ├── lib/i18n.ts                 # 界面文案
│   └── pages/                      # 首页、关于、项目与加入页面
├── static/                         # Logo、图标与社交媒体素材
├── docusaurus.config.ts            # Docusaurus 配置
├── LICENSE                         # 代码许可协议
├── LICENSE-docs                    # 内容许可协议
├── package-lock.json               # 依赖锁定文件
├── package.json                    # 依赖配置
├── sidebars.ts                     # 文档导航
└── tsconfig.json                   # TypeScript 配置
```

## 网站部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建并发布 GitHub Pages。生产构建产物
由工作流生成，源文件应修改在 `src/`、`docs/`、`blog/` 或 `static/`。

## 许可协议

本项目代码采用 [MIT 许可协议](LICENSE)，本网站内容采用 [知识共享 署名 4.0 国际许可协议](LICENSE-docs)。

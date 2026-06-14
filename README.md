# 杭州第二中学步天工程社官网

The official website of the **Butian Engineering Club, Hangzhou No.2 High School**.

基于 [Docusaurus](https://docusaurus.io/)（最新稳定版 + TypeScript）构建，
部署于 GitHub Pages：<https://butian-club.github.io>。

## 本地开发

```bash
npm install      # 安装依赖
npm start        # 启动本地开发服务器（默认 http://localhost:3000）
npm run build    # 生产环境构建，产物在 build/
npm run serve    # 本地预览构建产物
npm run typecheck # TypeScript 类型检查（可选）
```

## 目录结构

```
.
├── docusaurus.config.ts     # 站点配置：标题、导航栏、页脚、部署参数
├── sidebars.ts              # 知识库（/docs）侧边栏结构
├── blog/                    # 活动记录（/blog）：复盘、日志、比赛、新闻
│   ├── authors.yml          #   作者信息
│   └── tags.yml             #   标签定义
├── docs/                    # 社团知识库（/docs）
│   ├── intro.md             #   知识库总览
│   ├── getting-started/     #   入门指南（上手、工具链）
│   └── standards/           #   规范（项目、安全）
├── src/
│   ├── components/
│   │   ├── home/            # 首页各区块组件（Hero/About/Directions/...）
│   │   ├── ProjectCard/     # 复用的项目卡片
│   │   └── PageHero/        # 内容页统一页眉
│   ├── data/
│   │   ├── projects.ts      # 项目数据（单一可信来源）
│   │   └── site.ts          # 核心方向、数据统计
│   ├── pages/               # 路由页面：index / about / projects / join
│   └── css/custom.css       # 全局设计系统（主题变量、深浅色模式）
└── static/img/              # Logo、社交卡片、favicon 等静态资源
```

## 常见扩展

- **新增项目**：在 [`src/data/projects.ts`](src/data/projects.ts) 追加一条记录；
  首页精选与 `/projects` 列表会自动更新（`featured: true` 进入首页精选）。
- **发布活动**：在 `blog/` 下新增 Markdown / MDX 文章，标签见 `blog/tags.yml`。
- **补充文档**：在 `docs/` 下编写内容，并在 `sidebars.ts` 中登记。
- **调整品牌色 / 主题**：修改 `src/css/custom.css` 顶部的设计令牌。

## 待补充（TODO）

代码中以 **TODO** 标注的位置需由社团补全真实信息，包括：
指导老师与成员名单、联系方式、招新时间、`static/img/favicon.ico` 等。
在信息确认前，请勿填入虚构内容。

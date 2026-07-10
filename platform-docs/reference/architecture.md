---
title: 技术架构与部署
description: 步天工程社协作平台的技术栈、单体全栈架构、预览沙盒数据隔离，以及 Docker + Caddy 的部署与运维方式。
---

# 技术架构与部署

本页面向想了解平台工作原理或负责运维的读者，介绍技术栈、整体架构、预览沙盒的
数据隔离机制，以及部署、更新、备份与安全加固方式。

:::note
这是一个**社团内部工具**，采用单实例部署，够用、好维护为先，并非高并发的公网产品。
文件目前存本地磁盘，但代码里预留了切换到 S3 / MinIO 的适配层。
:::

## 技术栈

| 层次 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router，Turbopack） |
| UI 运行时 | React 19 |
| 语言 | TypeScript |
| 数据层 | Prisma 6 + PostgreSQL |
| 认证 | Auth.js v5（JWT session、Credentials provider） |
| 样式 | Tailwind CSS v4（设计 token 化） |
| 组件 | Radix UI |
| 表格 | TanStack Table |
| 表单与校验 | React Hook Form + Zod |
| Markdown 渲染 | react-markdown + remark-gfm |
| 图标 | lucide-react |

## 整体架构

平台是**单体全栈**应用（不是前后端分离），前端页面与后端逻辑同在一个 Next.js 工程内。

- **业务逻辑主要用 Server Actions**：每个业务域各有一份 `features/*/actions.ts`，文件顶部标注
  `"use server"`。页面通过调用这些 Server Action 完成读写，逻辑直接跑在服务端。
- **少量 API Routes** 用于不适合走 Server Action 的场景：
  - Auth 回调
  - `/api/health` 健康检查
  - 文件上传 / 下载
  - 注册
  - 预览心跳（保持临时预览会话活跃）
- **数据访问在服务端直接用 Prisma 查询 PostgreSQL**，不额外架一层独立后端服务。

```
浏览器
  │  (页面交互)
  ▼
Next.js（App Router，服务端渲染）
  ├── Server Actions（features/*/actions.ts，"use server"）──┐
  └── API Routes（auth 回调 / /api/health / 上传下载 /       │
                  注册 / 预览心跳）──────────────────────────┤
                                                             ▼
                                                    Prisma 6 客户端
                                                             │
                                                             ▼
                                                       PostgreSQL
```

鉴权在服务端逐次强制，每个 Server Action 各自校验，后台布局用 `requireAdmin` 统一拦截，
详见 [角色与权限矩阵](./roles-permissions.md)。

## 数据隔离：预览沙盒

平台支持免注册的「预览版」，让访客在隔离环境里随便操作而不污染正式数据。其实现方式如下：

- 每条业务记录都带一个 `sandboxId` 字段。
- `Sandbox` 表用类型区分不同沙盒：

  | 沙盒类型 | 含义 |
  | --- | --- |
  | `PRODUCTION` | 正式数据 |
  | `TEMPLATE` | 预览模板（临时预览的初始数据来源） |
  | `PREVIEW` | 某次临时预览的独立数据 |

- 通过 Prisma 的 `$extends` 在**查询层自动按当前会话的 `sandboxId` 注入过滤条件**，
  使正式数据与各预览沙盒**完全隔离**——查询天然只能看到本会话所属沙盒的数据，
  不需要每处业务代码手写过滤。

:::tip
预览模式的使用方式（如何进入、临时数据的生命周期）见
[预览模式](../getting-started/preview.md)。
:::

## 部署与运维

### 部署形态

- **Docker + docker-compose**，共两个容器：`web`（应用）与 `postgres`（数据库）。
- **Caddy** 跑在宿主机上，反向代理到 `web`，并自动签发 / 续期 HTTPS 证书。
- **端口收敛**：数据库端口不对外暴露；`web` 只绑定本机（`127.0.0.1`），外部流量一律经 Caddy。

```
Internet ──HTTPS──► Caddy（宿主机，自动证书）
                      │  反向代理
                      ▼
              web 容器（Next.js，仅绑定本机）
                      │
                      ▼
            postgres 容器（端口不对外）
```

### 更新方式（push-to-deploy）

推送到 GitHub `main` 分支后，**GitHub Actions 自动完成整套发布**：

1. 同步代码到服务器
2. 重建镜像
3. 重启容器
4. 跑数据库迁移
5. 健康检查

无需手动登录服务器操作。

### 备份

- **每日自动**执行 `pg_dump` 备份数据库；
- 同时打包上传目录（用户上传的文件）。

### 监控

- 提供公开的 `/api/health` 健康检查接口，供外部探活与 CI 部署校验使用。

### 安全加固

| 层面 | 措施 |
| --- | --- |
| 服务器登录 | SSH 仅密钥登录（禁用密码） |
| 网络 | `ufw` 防火墙 |
| 防爆破 | `fail2ban` |
| 应用侧限流 | 对注册、预览接口限流 |
| 文件授权 | 上传文件按沙盒范围授权，越权访问被拒 |

:::info
以上运维细节针对单实例内部部署。如果未来迁移到对象存储或多实例，需要相应调整文件适配层、
会话与限流策略；当前架构已为文件层预留了切换 S3 / MinIO 的适配点。
:::

想从使用者视角了解平台，可从[协作平台简介](../intro.md)开始。

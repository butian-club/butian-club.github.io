---
title: 技术架构与部署
description: 步天工程社协作平台的技术栈、单体全栈架构，以及仓库内可核验的 Docker、反向代理、发布与备份机制。
---

# 技术架构与部署

本页面向想了解平台工作原理或负责运维的读者，介绍技术栈、整体架构，
以及部署、更新、备份与安全加固方式。

:::note
这是一个**社团内部工具**。当前代码按单实例运行设计：聊天事件总线与限流状态包含进程内实现；
文件写入本地磁盘，并通过 `StorageAdapter` 接口隔离存储实现。仓库尚未包含 S3 / MinIO 适配器。
:::

## 技术栈

| 层次          | 选型                                            |
| ------------- | ----------------------------------------------- |
| 框架          | Next.js 16（App Router，Turbopack）             |
| UI 运行时     | React 19                                        |
| 语言          | TypeScript                                      |
| 数据层        | Prisma 6 + PostgreSQL                           |
| 认证          | Auth.js v5（JWT session、Credentials provider） |
| 样式          | Tailwind CSS v4（设计 token 化）                |
| 组件          | Radix UI                                        |
| 表格与分页    | 项目内自研的 `EntityTable` / `Pagination` 组件  |
| 表单与校验    | React Hook Form + Zod                           |
| Markdown 渲染 | react-markdown + remark-gfm                     |
| 图标          | lucide-react                                    |

## 整体架构

平台是**单体全栈**应用（不是前后端分离），前端页面与后端逻辑同在一个 Next.js 工程内。

- **业务逻辑主要用 Server Actions**：每个业务域各有一份 `features/*/actions.ts`，文件顶部标注
  `"use server"`。页面通过调用这些 Server Action 完成读写，逻辑直接跑在服务端。
- **少量 API Routes** 用于不适合走 Server Action 的场景：
  - Auth 回调
  - `/api/health` 健康检查
  - 文件上传 / 下载
  - 注册
  - 聊天实时推送（**SSE**，Server-Sent Events）
- **聊天的实时性**靠 SSE 长连接 + 服务端的内存事件总线（EventEmitter）广播消息，
  客户端订阅后即时收到新消息与未读更新；符合单实例、够用为先的定位。
- **数据访问在服务端直接用 Prisma 查询 PostgreSQL**，不额外架一层独立后端服务。

```
浏览器
  │  (页面交互)
  ▼
Next.js（App Router，服务端渲染）
  ├── Server Actions（features/*/actions.ts，"use server"）──┐
  └── API Routes（auth 回调 / /api/health / 上传下载 /       │
                  注册 / 聊天推送）──────────────────────────┤
                                                             ▼
                                                    Prisma 6 客户端
                                                             │
                                                             ▼
                                                       PostgreSQL
```

鉴权在服务端逐次强制，每个 Server Action 各自校验，后台布局用 `requireAdmin` 统一拦截，
详见[角色与鉴权](./roles-permissions.md)。

## 部署与运维

### 仓库支持的部署形态

- `docker-compose.yml` 定义 `web` 与 `postgres` 两个服务；应用端口绑定到宿主机回环地址，
  数据库不发布宿主机端口。
- `deploy/` 同时提供 **Caddy 与 Nginx 示例**。生产机最终使用哪一种反向代理、证书和防火墙
  配置属于服务器状态，不能只凭仓库断言。

```
Internet ──HTTPS──► Caddy 或 Nginx（宿主机）
                      │  反向代理到 127.0.0.1:3000
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

仓库提供 `pnpm backup:create`：调用 `pg_dump` 生成数据库转储，并在上传目录存在时一并打包；
`CONFIRM_RESTORE=YES pnpm backup:restore -- <目录>` 用于恢复。仓库没有定时任务配置，因此是否按日
运行必须在生产主机另行核实，不能把“有备份脚本”写成“已每日自动备份”。

### 监控

- 提供公开的 `/api/health` 健康检查接口，供外部探活与 CI 部署校验使用。

### 安全加固

| 层面       | 措施                                                |
| ---------- | --------------------------------------------------- |
| 发布连接   | GitHub Actions 使用部署密钥 SSH，并固定生产主机公钥 |
| 网络边界   | Compose 不公开数据库端口，应用只绑定回环地址        |
| 应用侧限流 | 对注册等敏感接口限流                                |
| 文件授权   | 上传文件按用户权限授权，越权访问被拒                |

:::info
如果未来迁移到对象存储或多实例，需要新增相应的 `StorageAdapter` 实现，并调整聊天事件广播、
限流和文件共享策略。仓库中的反向代理示例与备份脚本也需要结合实际主机配置单独验证。
:::

想从使用者视角了解平台，可从[协作平台简介](./intro.md)开始。

---
title: 管理后台总览
description: 步天工程社协作平台管理后台（/admin）的整体结构、进入条件、各板块导航与权限说明。
---

# 管理后台总览

**管理后台**是平台的「后台驾驶舱」，集中了账号审批、用户与角色、组别、内容管理、
站点设置、操作日志等所有管理能力。它统一挂在 `/admin` 路径下。

- 🔧 访问地址：[https://gfssm.butian.club/admin](https://gfssm.butian.club/admin)
- 仅**管理员（ADMIN）**可进入，成员账号看不到、也进不来（见下文）。

:::caution[这是管理员专属区域]
后台的每一个操作都会直接影响全站数据（谁能登录、任务归谁、首页展示什么等）。
请在动手前确认你清楚每一步的后果，必要时先看 [操作日志](./audit.md)。
:::

## 谁能进、进不来会怎样

进入后台需要同时满足两道守卫：

1. **服务端守卫**：后台页面由服务端 `requireAdmin` 统一校验，非管理员请求会被拦截。
2. **布局拦截**：后台布局在渲染前再次核验管理员身份。

非管理员（成员）访问 `/admin` 下任意页面，都会被重定向到 `/forbidden`（无权限页）。
因此后台入口不会出现在成员的导航里。角色与权限的完整说明见
[角色与权限](../reference/roles-permissions.md)。

## 后台板块导航

| 板块 | 路径 | 作用 | 详见 |
| --- | --- | --- | --- |
| 总览 | `/admin` | 后台首页与快捷入口 | 本页 |
| 账号审批 | `/admin/approvals` | 处理待审批（PENDING）账号 | [账号审批与用户管理](./approvals-users.md) |
| 用户管理 | `/admin/users` | 用户列表、改角色、启用/禁用、分组 | [账号审批与用户管理](./approvals-users.md) |
| 组别管理 | `/admin/groups` | 创建/编辑/归档组别 | [组别管理](./groups.md) |
| 任务 | `/admin/tasks` | 创建/指派/归档任务 | [内容管理](./content.md) |
| 工单 | `/admin/tickets` | 指派/置顶/关闭/评论工单 | [内容管理](./content.md) |
| 文档 | `/admin/documents` | 建/编文档与分类、发布 | [内容管理](./content.md) |
| 公告 | `/admin/announcements` | 发布公告、置顶到首页 | [内容管理](./content.md) |
| 资源/附件 | `/admin/assets` | 管理上传的附件与资源 | [内容管理](./content.md) |
| 比赛倒计时 | `/admin/countdown` | 配置首页倒计时 | [站点设置与倒计时](./settings.md) |
| 站点设置 | `/admin/settings` | 网站名称/注册开关/默认语言与主题等 | [站点设置与倒计时](./settings.md) |
| 操作日志 | `/admin/audit` | 关键操作审计记录 | [操作日志](./audit.md) |

## 权限如何生效

后台不是「进了门就为所欲为」——**每一个服务端操作（action）都会各自校验管理员权限**。
也就是说，即便某个页面被打开，真正执行改角色、审批、发布等动作时仍会二次核验。
各能力对应的权限码（如 `members:manage`、`approvals:manage`、`groups:manage`、
`settings:manage`、`audit:view` 等）见 [角色与权限](../reference/roles-permissions.md)。

## 界面约定

- 后台大量列表（用户、任务、工单、日志等）都使用 **TanStack Table**，
  支持排序、筛选、分页，操作方式在各板块之间保持一致。
- 涉及删除、禁用、拒绝等**不可轻易撤销**的动作，一般会有二次确认。
- 关键操作会被写入 [操作日志](./audit.md)，便于事后追责与排查。

## 建议的上手顺序

1. 先到 [账号审批](./approvals-users.md)，把积压的待审批账号处理掉。
2. 在 [组别管理](./groups.md) 建好比赛需要的组别。
3. 到 [用户管理](./approvals-users.md) 给成员分配角色与组别。
4. 用 [内容管理](./content.md) 铺好任务、文档、公告等内容。
5. 到 [站点设置与倒计时](./settings.md) 配好站点名称、注册开关与比赛倒计时。

:::tip
后台改动只影响真实环境。如果只是想演示或试用，请使用
[预览模式](../getting-started/preview.md) 的隔离沙盒。
:::

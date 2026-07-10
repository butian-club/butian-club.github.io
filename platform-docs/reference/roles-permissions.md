---
title: 角色与权限矩阵
description: 步天工程社协作平台的两个角色（ADMIN / MEMBER）、权限码含义、权限矩阵与服务端鉴权机制。
---

# 角色与权限矩阵

本页是权限系统的参考手册，说明平台里有哪些角色、每个权限码代表什么、谁拥有哪些权限，
以及服务端如何在每次操作时校验权限。

## 角色

平台只有两个角色，每个用户在同一时刻只属于其中之一。

| 角色 | 名称 | 说明 |
| --- | --- | --- |
| `ADMIN` | 管理员 | 拥有全部管理能力，可进入后台 `/admin` 处理审批、成员、组别、内容与设置 |
| `MEMBER` | 成员 | 普通社员，可查看协作内容、维护自己的资料与工作日志、提交工单、参与任务 |

:::info
角色不是一组固定的界面开关，而是对应到一份**权限码（permission code）列表**。
系统的每一处操作都对照权限码来判断是否放行，因此权限矩阵才是最权威的口径。
:::

## 权限码矩阵

下表列出全部权限码在两个角色上的分配情况（✅ 表示拥有，— 表示没有）。

| 权限码 | 含义 | ADMIN | MEMBER |
| --- | --- | :---: | :---: |
| `dashboard:view` | 查看工作台（仪表盘）总览 | ✅ | ✅ |
| `members:view` | 查看成员名录 | ✅ | ✅ |
| `members:manage` | 管理成员（编辑资料、调整角色、启用/禁用等） | ✅ | — |
| `approvals:manage` | 审批注册申请（通过 / 拒绝） | ✅ | — |
| `groups:manage` | 管理组别（创建、编辑、分配成员） | ✅ | — |
| `tasks:view` | 查看任务 | ✅ | ✅ |
| `tasks:manage` | 管理任务（创建、指派、编辑、关闭） | ✅ | — |
| `tickets:view` | 查看工单 | ✅ | ✅ |
| `tickets:manage` | 管理工单（处理、变更状态、以管理员身份回复） | ✅ | — |
| `documents:view` | 查看文档 | ✅ | ✅ |
| `documents:manage` | 管理文档（创建、编辑、删除、分栏编辑） | ✅ | — |
| `announcements:manage` | 管理公告（发布、编辑、下线） | ✅ | — |
| `settings:manage` | 管理站点设置（如「注册需审批」开关等） | ✅ | — |
| `audit:view` | 查看审计日志 | ✅ | — |
| `profile:edit` | 编辑自己的个人资料 | — | ✅ |
| `worklogs:view` | 查看并维护自己的工作日志 | — | ✅ |

### 快速对照

- **ADMIN**：`dashboard:view`、`members:view`、`members:manage`、`approvals:manage`、
  `groups:manage`、`tasks:view`、`tasks:manage`、`tickets:view`、`tickets:manage`、
  `documents:view`、`documents:manage`、`announcements:manage`、`settings:manage`、`audit:view`。
- **MEMBER**：`dashboard:view`、`members:view`、`tasks:view`、`tickets:view`、
  `documents:view`、`profile:edit`、`worklogs:view`。

:::note[关于 `profile:edit` 与 `worklogs:view`]
这两个权限码是「面向本人」的权限：成员用它们编辑自己的资料、维护自己的工作日志。
管理员的权限清单里虽未显式列出这两项，但管理员对成员资料的编辑能力来自更高的
`members:manage`。
:::

## 成员能做什么

即便没有任何 `*:manage` 权限，`MEMBER` 依然可以完成日常协作：

- **查看**任务、工单、文档、成员名录与工作台。
- **编辑自己的资料**（`profile:edit`）与**维护自己的工作日志**（`worklogs:view`）。
- **创建工单**并在工单下**发表评论**（属于成员对自有 / 相关工单的常规操作，不需要 `tickets:manage`）。
- **给任务添加进展**（在被指派或参与的任务上记录进度、上传附件）。

管理员在此之上额外拥有全部管理能力：审批、成员管理、组别、任务与工单的管理、
文档与公告的维护、站点设置与审计日志。各模块的具体用法见
[任务](../guide/tasks.md)、[工单](../guide/tickets.md)、[文档](../guide/documents.md)、
[工作日志](../guide/worklogs.md)、[个人资料](../guide/profile.md)。

## 鉴权机制

权限不是只在前端隐藏按钮，而是在**服务端**逐次强制校验。核心是三个守卫函数：

| 守卫 | 作用 | 不满足时 |
| --- | --- | --- |
| `requireAuth` | 要求已登录（存在有效会话） | 引导至登录页 |
| `requireActiveUser` | 要求账号状态为 `ACTIVE` | 依状态引导（如待审批用户跳转等待页） |
| `requireAdmin` | 要求角色为 `ADMIN` | 引导至 `/forbidden` |

校验规则：

- **每个 Server Action 都各自校验**权限——不依赖前端是否显示入口，直接请求受保护操作同样会被拦下。
- **后台布局用 `requireAdmin` 统一拦截**：非管理员访问 `/admin` 下任意页面都会被引导到 `/forbidden`。
- 账号状态也参与鉴权：只有 `ACTIVE` 用户能正常使用，其余状态会被相应引导，详见
  [账号状态机](./account-states.md)。

:::tip
如果你是管理员却发现某个后台入口点不动，先确认自己的账号状态是否为「已激活」，
再确认角色是否为管理员。两道校验都通过才会放行。管理端总览见
[后台总览](../admin/overview.md)。
:::

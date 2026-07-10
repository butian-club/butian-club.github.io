---
title: 内容管理
description: 管理后台里任务、工单、文档、公告、资源五类内容的管理侧操作——创建、指派、发布、置顶、归档与附件管理。
---

# 内容管理

后台的**内容管理**覆盖任务、工单、文档、公告、资源五大板块。这些页面是各功能的
「**管理侧**」——负责创建、指派、发布、置顶、归档等重活；成员日常怎么用，见
`../guide/` 下对应文档。

| 板块 | 后台路径 | 权限码 | 成员侧文档 |
| --- | --- | --- | --- |
| 任务 | `/admin/tasks` | `tasks:manage` | [任务](../guide/tasks.md) |
| 工单 | `/admin/tickets` | `tickets:manage` | [工单](../guide/tickets.md) |
| 文档 | `/admin/documents` | `documents:manage` | [文档](../guide/documents.md) |
| 公告 | `/admin/announcements` | `announcements:manage` | [公告](../guide/announcements.md) |
| 资源/附件 | `/admin/assets` | — | 见各功能内的附件 |

:::note
这些列表大多使用 **TanStack Table**，支持排序与筛选；每个操作在服务端都会
单独校验管理员权限。
:::

## 任务管理

地址：[https://gfssm.butian.club/admin/tasks](https://gfssm.butian.club/admin/tasks)

管理员在这里**创建、编辑、指派、归档**任务：

1. 新建任务，填写标题、说明等信息。
2. **指派**给具体成员，或直接指派给一个**组别**（整组下派，见 [组别管理](./groups.md)）。
3. 任务推进过程中可编辑内容、调整指派。
4. 完成或作废的任务可**归档**，从活跃列表中收起但保留记录。

成员如何查看、更新任务进度与上传附件，见 [任务](../guide/tasks.md)。

## 工单管理

地址：[https://gfssm.butian.club/admin/tickets](https://gfssm.butian.club/admin/tickets)

工单是成员提交的资源申请 / 问题反馈。管理员在这里处理：

- **指派**：把工单派给负责处理的人。
- **置顶**：把重要工单顶到列表前列。
- **关闭**：处理完毕后关闭工单。
- **评论**：用 Markdown 与提交人沟通、记录处理过程。

成员如何提交与跟进工单，见 [工单](../guide/tickets.md)。

## 文档管理

地址：[https://gfssm.butian.club/admin/documents](https://gfssm.butian.club/admin/documents)

用于沉淀规范、手册、资料。管理员可：

1. **创建 / 编辑文档**，撰写正文内容。
2. 维护**文档分类**，让文档有条理地归类。
3. **发布**文档，使其对成员可见。

成员侧的阅读与检索见 [文档](../guide/documents.md)。

## 公告管理

地址：[https://gfssm.butian.club/admin/announcements](https://gfssm.butian.club/admin/announcements)

用于发布全社通知：

1. **发布公告**，撰写标题与正文。
2. 对重要公告设置**置顶**——置顶公告会展示在**首页**（见 [首页](../guide/dashboard.md)）。
3. 需要时可编辑或撤下公告。

成员侧的查看见 [公告](../guide/announcements.md)。

## 资源 / 附件管理

地址：[https://gfssm.butian.club/admin/assets](https://gfssm.butian.club/admin/assets)

集中管理平台内**上传的附件与资源**（任务、工单、文档等处上传的文件都汇总在此）：

- 查看已上传的资源列表。
- 清理不再需要的附件，控制存储占用。

:::caution
删除资源可能影响引用它的任务、文档等。删除前请确认该附件不再被使用。
:::

## 小结

| 想做的事 | 去哪个板块 |
| --- | --- |
| 给某人 / 某组派活 | 任务管理 `/admin/tasks` |
| 处理成员的申请或反馈 | 工单管理 `/admin/tickets` |
| 写规范、发手册 | 文档管理 `/admin/documents` |
| 发全社通知并顶到首页 | 公告管理 `/admin/announcements` |
| 清理上传的文件 | 资源管理 `/admin/assets` |

所有内容操作都会写入 [操作日志](./audit.md)，可用于追溯改动。

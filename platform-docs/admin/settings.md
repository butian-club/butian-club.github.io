---
title: 站点设置与倒计时
description: 在管理后台配置站点名称、副标题、欢迎语（中英双语）、注册开关、默认语言与主题、品牌主色，以及首页比赛倒计时。
---

# 站点设置与倒计时

**站点设置**决定全站的默认表现——网站叫什么、要不要开放注册、默认什么语言和主题；
**比赛倒计时**则驱动首页的倒数展示。两者都在后台配置，影响每一位访客看到的界面。

- ⚙️ 站点设置：[https://gfssm.butian.club/admin/settings](https://gfssm.butian.club/admin/settings)
- ⏱️ 比赛倒计时：[https://gfssm.butian.club/admin/countdown](https://gfssm.butian.club/admin/countdown)

## 站点设置

地址：[https://gfssm.butian.club/admin/settings](https://gfssm.butian.club/admin/settings)，对应权限码 `settings:manage`。

可配置的项目：

| 设置项 | 键 | 说明 |
| --- | --- | --- |
| 网站名称 | — | 站点主标题，支持**中英双语**两套文案 |
| 网站副标题 | — | 站点副标题/口号，支持**中英双语** |
| 首页欢迎语 | — | 首页问候语，支持**中英双语** |
| 允许公开注册 | `auth.registrationEnabled` | 是否开放新用户自助注册 |
| 注册需审批 | `auth.registrationRequiresApproval` | 新注册是否需管理员审批后才激活 |
| 默认界面语言 | `ui.defaultLocale` | 新访客的默认语言 |
| 默认主题模式 | `theme.defaultMode` | 默认亮/暗色主题 |
| 品牌主色 | `theme.accentColor` | 全站强调色 |

这些设置影响**全站默认表现**，包括登录页、首页、注册开关等。

### 中英双语文案

网站名称、副标题、欢迎语都各有**中文、英文两套**。请两套都填写，
以便不同语言的访客看到匹配的文案；默认展示哪一套由 `ui.defaultLocale` 决定。

### 注册开关的组合效果

两个注册相关开关配合使用，效果如下：

| `registrationEnabled` | `registrationRequiresApproval` | 结果 |
| --- | --- | --- |
| 开 | 开 | 可自助注册，但需管理员审批后才激活（推荐） |
| 开 | 关 | 可自助注册，注册后**直接激活**，不进审批队列 |
| 关 | —— | 关闭公开注册，新账号需由其他方式创建 |

:::caution
关闭「注册需审批」意味着任何人注册后即可登录。比赛季对外开放时，
建议保持**两个开关都开**，把关口留在 [账号审批](./approvals-users.md)。
:::

### 修改站点设置步骤

1. 打开 [https://gfssm.butian.club/admin/settings](https://gfssm.butian.club/admin/settings)。
2. 修改需要调整的字段（记得双语文案两套都填）。
3. 保存。设置随即对全站访客生效。

## 比赛倒计时

地址：[https://gfssm.butian.club/admin/countdown](https://gfssm.butian.club/admin/countdown)。

配置后，**首页会自动倒数**到目标时间，营造比赛氛围、提醒进度。

可配置项：

| 字段 | 说明 |
| --- | --- |
| 比赛名称（中/英） | 倒计时标题，双语 |
| 目标日期时间 | 倒数到的截止时刻 |
| 描述（中/英） | 补充说明，双语 |
| 启用开关 | 是否在首页展示倒计时 |

### 配置倒计时步骤

1. 打开 [https://gfssm.butian.club/admin/countdown](https://gfssm.butian.club/admin/countdown)。
2. 填写比赛名称、**目标日期时间**、描述（中英文各一份）。
3. 打开**启用开关**并保存。
4. 到 [首页](../guide/dashboard.md) 确认倒计时已按预期展示。

:::tip
比赛结束或需要临时隐藏时，把**启用开关**关掉即可，无需删除已填内容，
下次沿用很方便。
:::

:::note
站点设置与倒计时的改动都会记录到 [操作日志](./audit.md)。
:::

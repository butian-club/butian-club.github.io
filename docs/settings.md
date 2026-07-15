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
| 允许公开注册 | `auth.registrationEnabled` | 是否开放注册入口（注册仍需邀请码） |
| 注册需审批（旧） | `auth.registrationRequiresApproval` | 旧版遗留开关；当前的**邀请码注册流程不再使用**它 |
| 默认界面语言 | `ui.defaultLocale` | 新访客的默认语言 |
| 默认主题模式 | `theme.defaultMode` | 默认亮/暗色主题 |
| 品牌主色 | `theme.accentColor` | 全站强调色 |

这些设置影响**全站默认表现**，包括登录页、首页、注册开关等。

### 中英双语文案

网站名称、副标题、欢迎语都各有**中文、英文两套**。请两套都填写，
以便不同语言的访客看到匹配的文案；默认展示哪一套由 `ui.defaultLocale` 决定。

### 注册怎么把关

现在注册的把关点是 **邀请码**，不是审批：

| `registrationEnabled` | 效果 |
| --- | --- |
| 开 | 注册页可用；访客仍需一个**有效邀请码**才能注册，注册后**立即激活** |
| 关 | 注册页提示「当前已关闭公开注册」，新账号只能由管理员另行创建 |

所以要控制谁能进来，主要靠在 [成员目录](./members.md) **发放 / 停用邀请码**（还能限制次数、有效期、预绑定部门）。

:::note
`registrationRequiresApproval` 是早期「注册后审批」设计留下的开关，当前的邀请码注册流程
**不会读取它**——有有效邀请码就直接激活，没有就无法注册。可以忽略这个开关。
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
4. 到 [首页](./dashboard.md) 确认倒计时已按预期展示。

:::tip
比赛结束或需要临时隐藏时，把**启用开关**关掉即可，无需删除已填内容，
下次沿用很方便。
:::

:::note
站点设置与倒计时的改动都会记录到 [操作日志](./audit.md)。
:::

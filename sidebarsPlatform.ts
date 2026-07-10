import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * 「协作平台文档」侧边栏。
 * 覆盖步天工程社协作平台（https://gfssm.butian.club）的使用与管理。
 * 手动维护以保证结构稳定、顺序可控。
 */
const sidebars: SidebarsConfig = {
  platformSidebar: [
    'intro',
    {
      type: 'category',
      label: '快速开始',
      collapsed: false,
      items: [
        'getting-started/access',
        'getting-started/register',
        'getting-started/preview',
      ],
    },
    {
      type: 'category',
      label: '功能指南',
      collapsed: false,
      items: [
        'guide/dashboard',
        'guide/tasks',
        'guide/tickets',
        'guide/documents',
        'guide/announcements',
        'guide/notifications',
        'guide/worklogs',
        'guide/members',
        'guide/profile',
      ],
    },
    {
      type: 'category',
      label: '管理员指南',
      collapsed: true,
      items: [
        'admin/overview',
        'admin/approvals-users',
        'admin/groups',
        'admin/content',
        'admin/settings',
        'admin/audit',
      ],
    },
    {
      type: 'category',
      label: '参考',
      collapsed: true,
      items: [
        'reference/roles-permissions',
        'reference/account-states',
        'reference/architecture',
        'reference/faq',
      ],
    },
  ],
};

export default sidebars;

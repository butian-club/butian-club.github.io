import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * 协作平台文档侧边栏（唯一文档）。
 * 覆盖步天工程社协作平台（https://gfssm.butian.club）的使用与管理。
 * 所有文档扁平放在 docs/ 下，无二级目录；此处手动维护顺序与分组。
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '快速开始',
      collapsed: false,
      items: ['access', 'register'],
    },
    {
      type: 'category',
      label: '功能指南',
      collapsed: false,
      items: [
        'dashboard',
        'chat',
        'notifications',
        'departments',
        'members',
        'tasks',
        'tickets',
        'documents',
        'announcements',
        'profile',
        'worklogs',
      ],
    },
    {
      type: 'category',
      label: '管理员指南',
      collapsed: true,
      items: ['overview', 'content', 'settings', 'audit'],
    },
    {
      type: 'category',
      label: '参考',
      collapsed: true,
      items: ['account-states', 'architecture', 'faq', 'roles-permissions'],
    },
  ],
};

export default sidebars;

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * 社团知识库侧边栏。
 * 手动维护以保证结构稳定、顺序可控。
 */
const sidebars: SidebarsConfig = {
  knowledgeSidebar: [
    'intro',
    {
      type: 'category',
      label: '入门指南',
      collapsed: false,
      items: ['getting-started/new-member', 'getting-started/toolchain'],
    },
    {
      type: 'category',
      label: '规范',
      collapsed: false,
      items: ['standards/project-standards', 'standards/safety'],
    },
    'archive',
  ],
};

export default sidebars;

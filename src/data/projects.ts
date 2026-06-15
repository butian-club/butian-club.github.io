/**
 * 项目数据源（单一可信来源，双语）。
 * 首页「精选项目」与 /projects 列表页均从此读取。
 *
 * 内容依据公开报道；存疑细节（具体队名、奖项、名单）在文中标注待补证。
 * 新增项目：往数组追加一项即可；详情可指向 blog 活动文章或 docs 文档。
 */

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project {
  /** 唯一标识，可用于锚点 / 详情路由 */
  id: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  tagsZh: string[];
  tagsEn: string[];
  status: ProjectStatus;
  /** 是否在首页精选展示 */
  featured?: boolean;
  /** 详情入口（文档 / 活动文章 / 外链）；为空表示暂未提供 */
  detailUrl?: string;
}

export const STATUS_META: Record<
  ProjectStatus,
  {labelZh: string; labelEn: string; tone: 'active' | 'completed' | 'archived'}
> = {
  active: {labelZh: '进行中', labelEn: 'In Progress', tone: 'active'},
  completed: {labelZh: '已完成', labelEn: 'Completed', tone: 'completed'},
  archived: {labelZh: '历史 / 前史', labelEn: 'History', tone: 'archived'},
};

export const projects: Project[] = [
  {
    id: 'gfssm-2025-mars',
    titleZh: '火星熔岩管基地 · GFSSM 2025',
    titleEn: 'Mars Lava-Tube Base · GFSSM 2025',
    summaryZh:
      '天枢、天权两队在 2025 全球未来太空学者大会中国站围绕 2075 年火星基地展开设计；天枢队所在公司「轨道工业」获亚军、天权队所在公司「金乌能源」获季军，天枢队另获资格轮全国最佳提案。',
    summaryEn:
      'Teams Tianshu and Tianquan designed a 2075 Mars base at the 2025 GFSSM China round; Tianshu’s company “Orbital Industries” took 2nd and Tianquan’s “Jinwu Energy” took 3rd, with Tianshu also winning Best Qualifying Proposal.',
    tagsZh: ['太空城市设计', '人居与生保', '运营与商业'],
    tagsEn: ['Settlement Design', 'Habitat & Life Support', 'Operations'],
    status: 'completed',
    featured: true,
    detailUrl: '/blog/gfssm-2025-mars-base',
  },
  {
    id: 'gfssm-2024-venus',
    titleZh: '金星轨道太空城 · GFSSM 2024',
    titleEn: 'Venus-Orbit Space City · GFSSM 2024',
    summaryZh:
      '玉衡、天权两支代表队在 2024 全球未来太空学者大会中国站围绕金星轨道太空城展开设计，自寒假筹备至现场 24 小时极限挑战；两队所在公司均获全国亚军，天权队获「资格轮最佳提案」。',
    summaryEn:
      'Teams Yuheng and Tianquan designed a Venus-orbit space city at the 2024 GFSSM China round — from winter-break preparation to a 24-hour on-site sprint. Both companies took national runner-up; Team Tianquan won "Best Qualifying Proposal".',
    tagsZh: ['太空城市设计', '人居与生保', '运营与商业'],
    tagsEn: ['Settlement Design', 'Habitat & Life Support', 'Operations'],
    status: 'completed',
    featured: false,
    detailUrl: '/blog/gfssm-2024-china-runner-up',
  },
  {
    id: 'panan-outreach-2023',
    titleZh: '磐安航天科普公益 · 2023',
    titleEn: 'Pan’an Outreach Program · 2023',
    summaryZh:
      '2023 年 6 月，步天工程社联合 IF 商社、校志愿者队前往金华磐安县尖山镇中心小学开展结对交流，带去航天科普读物与科学启蒙课程。',
    summaryEn:
      'In June 2023, Butian joined the IF Business Club and the school volunteer team in a paired-exchange visit to Jianshan Central Primary School in Pan’an, Jinhua, bringing space-science books and introductory science lessons.',
    tagsZh: ['科普传播', '公益'],
    tagsEn: ['Outreach', 'Community'],
    status: 'completed',
    featured: false,
    detailUrl: '/blog/panan-outreach-2023',
  },
  {
    id: 'gfssm-2023',
    titleZh: '月球基地 Idun · GFSSM 2023',
    titleEn: 'Lunar Base “Idun” · GFSSM 2023',
    summaryZh:
      '天权、天璇两队在 2023 全球未来太空学者大会设计月球熔岩管基地「Idun」；天权队所在公司「金乌能源」夺得全国冠军、天璇队所在公司「星云科技」获亚军，并分获最佳结构设计、最佳人居设计奖。',
    summaryEn:
      'Teams Tianquan and Tianxuan designed the lunar lava-tube base “Idun” at the 2023 GFSSM; Tianquan’s company “Helio Energy” won the national championship and Tianxuan’s “Nebula Tech” took 2nd, also earning Best Structural Design and Best Habitat Design.',
    tagsZh: ['太空城市设计', '结构与基础设施', '人居与生保'],
    tagsEn: ['Settlement Design', 'Structure & Infrastructure', 'Habitat & Life Support'],
    status: 'completed',
    featured: true,
    detailUrl: '/blog/gfssm-2023-moon-base',
  },
  {
    id: 'issdc-2016-origin',
    titleZh: '水星熔岩管采矿基地 · ISSDC 2016（前史）',
    titleEn: 'Mercury Lava-Tube Mining Base · ISSDC 2016 (Prehistory)',
    summaryZh:
      '杭州第二中学代表队在 2016 国际太空城市设计大赛中国区决赛中，25 小时内完成水星熔岩管内 250 人采矿基地设计，获中国区冠军——步天工程社可追溯的航天工程传统起点。',
    summaryEn:
      'At the 2016 ISSDC China finals, the Hangzhou No.2 High School team designed a 250-person mining base inside a Mercury lava tube in 25 hours and won the China round — the traceable origin of Butian’s aerospace-engineering tradition.',
    tagsZh: ['太空城市设计', '前史'],
    tagsEn: ['Settlement Design', 'Prehistory'],
    status: 'archived',
    featured: true,
    detailUrl: '/blog/issdc-2016-origin',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

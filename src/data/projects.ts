/**
 * 项目数据源（单一可信来源，双语）。
 * 首页航程中的项目记录从此读取。
 *
 * 内容依据公开报道；未经核实的具体队名、奖项或名单不进入展示文案。
 * 新增项目：往数组追加一项即可；详情可指向 blog 活动文章或 docs 文档。
 */

export type ProjectStatus = 'active' | 'completed';

export interface Project {
  /** 唯一标识，可用于锚点 / 详情路由 */
  id: string;
  year: number;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  /** 首页滚动场景使用的精简介绍；详细事实仍由 summary 与活动文章承载。 */
  homeSummaryZh?: string;
  homeSummaryEn?: string;
  tagsZh: string[];
  tagsEn: string[];
  status: ProjectStatus;
  /** 是否在首页精选展示 */
  featured?: boolean;
  /** 详情入口（文档 / 活动文章 / 外链）；为空表示暂未提供 */
  detailUrl?: string;
  /** 已公开的同期影像；首页航程按年份切换，避免跨年借图。 */
  archivePhotos?: [string, string, string];
  /** 原始公开报道，供读者核对照片与事件。 */
  sourceUrl?: string;
}

export const STATUS_META: Record<
  ProjectStatus,
  { labelZh: string; labelEn: string; tone: 'active' | 'completed' }
> = {
  active: { labelZh: '进行中', labelEn: 'In Progress', tone: 'active' },
  completed: { labelZh: '已完成', labelEn: 'Completed', tone: 'completed' },
};

export const projects: Project[] = [
  {
    id: 'gfssm-2026-psyche',
    year: 2026,
    titleZh: '灵神星采矿太空城 · GFSSM 2026',
    titleEn: 'Psyche Mining Settlement · GFSSM 2026',
    summaryZh:
      '天玑、天枢两队在 2026 全球未来太空学者大会围绕 2115 年灵神星采矿太空城展开设计，双双晋级全国决赛；天玑队所在公司「月球快车」获亚军，天枢队所在公司「轨道工业」获季军。天枢队另获资格轮全国最佳提案，姚淑悦获最佳领导者奖。',
    summaryEn:
      'Teams Tianji and Tianshu designed a mining settlement on the asteroid Psyche for the 2026 GFSSM scenario set in 2115. Both reached the national final: Tianji’s company “Lunar Express” took runner-up and Tianshu’s “Orbital Industries” took third. Tianshu also won Best Qualifying Proposal, and Yao Shuyue received the Best Leader award.',
    homeSummaryZh: '天玑、天枢两队设计灵神星采矿太空城；所在公司分获全国亚军、季军。',
    homeSummaryEn: 'Teams Tianji and Tianshu designed a settlement on Psyche; their companies took national 2nd and 3rd place.',
    tagsZh: ['太空城市设计', '结构与基础设施', '运营与商业'],
    tagsEn: ['Settlement Design', 'Structure & Infrastructure', 'Operations'],
    status: 'completed',
    featured: true,
    detailUrl: '/blog/gfssm-2026-psyche',
    archivePhotos: ['/img/archive/2026/design-session.webp', '/img/archive/2026/presentation.webp', '/img/archive/2026/final-stage.webp'],
    sourceUrl: 'https://mp.weixin.qq.com/s/fd5izS_SE9jCA8TegJcDIQ',
  },
  {
    id: 'gfssm-2025-mars',
    year: 2025,
    titleZh: '火星熔岩管基地 · GFSSM 2025',
    titleEn: 'Mars Lava-Tube Base · GFSSM 2025',
    summaryZh:
      '天枢、天权两队在 2025 全球未来太空学者大会中国站围绕 2075 年火星基地展开设计；天枢队所在公司「轨道工业」获亚军、天权队所在公司「金乌能源」获季军，天枢队另获资格轮全国最佳提案。',
    summaryEn:
      'Teams Tianshu and Tianquan designed a 2075 Mars base at the 2025 GFSSM China round; Tianshu’s company “Orbital Industries” took 2nd and Tianquan’s “Jinwu Energy” took 3rd, with Tianshu also winning Best Qualifying Proposal.',
    homeSummaryZh: '天枢、天权两队设计火星基地，所在公司分获全国亚军、季军。',
    homeSummaryEn: 'Teams Tianshu and Tianquan designed a Mars base; their companies took national 2nd and 3rd place.',
    tagsZh: ['太空城市设计', '人居与生保', '运营与商业'],
    tagsEn: ['Settlement Design', 'Habitat & Life Support', 'Operations'],
    status: 'completed',
    featured: true,
    detailUrl: '/blog/gfssm-2025-mars-base',
    archivePhotos: ['/img/archive/2025/collaboration.webp', '/img/archive/2025/awards.webp', '/img/archive/2025/team.webp'],
    sourceUrl: 'https://mp.weixin.qq.com/s/fKn7KF_sS0f8Vkpkwc3K0g',
  },
  {
    id: 'gfssm-2024-venus',
    year: 2024,
    titleZh: '金星任务 · GFSSM 2024',
    titleEn: 'Venus Mission · GFSSM 2024',
    summaryZh:
      '玉衡、天权两队在资格轮设计金星轨道太空城，决赛与跨校伙伴设计金星大气中的漂浮农业城。两队所在公司均获全国亚军，天权队获「资格轮最佳提案」。',
    summaryEn:
      'Teams Yuheng and Tianquan designed a Venus-orbit city in qualification, then worked with students from other schools on a floating agricultural city in Venus’s atmosphere at the final. Both companies took national runner-up; Tianquan won Best Qualifying Proposal.',
    homeSummaryZh: '资格轮设计金星轨道城市，决赛设计大气漂浮农业城；两队所在公司均获亚军。',
    homeSummaryEn: 'From a Venus-orbit city in qualification to a floating agricultural city at the final; both companies took runner-up.',
    tagsZh: ['太空城市设计', '人居与生保', '运营与商业'],
    tagsEn: ['Settlement Design', 'Habitat & Life Support', 'Operations'],
    status: 'completed',
    featured: false,
    detailUrl: '/blog/gfssm-2024-china-runner-up',
    archivePhotos: ['/img/archive/2024/design-session.webp', '/img/archive/2024/structure-study.webp', '/img/archive/2024/team.webp'],
    sourceUrl: 'https://mp.weixin.qq.com/s/i6skuAcCSXxPq8Vqzrnlsw',
  },
  {
    id: 'panan-outreach-2023',
    year: 2023,
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
    year: 2023,
    titleZh: '月球基地 Idun · GFSSM 2023',
    titleEn: 'Lunar Base “Idun” · GFSSM 2023',
    summaryZh:
      '天权、天璇两队在 2023 全球未来太空学者大会设计月球熔岩管基地「Idun」；天权队所在公司「金乌能源」夺得全国冠军、天璇队所在公司「星云科技」获亚军，并分获最佳结构设计、最佳人居设计奖。',
    summaryEn:
      'Teams Tianquan and Tianxuan designed the lunar lava-tube base “Idun” at the 2023 GFSSM; Tianquan’s company “Helio Energy” won the national championship and Tianxuan’s “Nebula Tech” took 2nd, also earning Best Structural Design and Best Habitat Design.',
    homeSummaryZh: '天权、天璇两队设计月球熔岩管基地；所在公司分获全国冠军、亚军。',
    homeSummaryEn: 'Teams Tianquan and Tianxuan designed a lunar lava-tube base; their companies took national 1st and 2nd place.',
    tagsZh: ['太空城市设计', '结构与基础设施', '人居与生保'],
    tagsEn: ['Settlement Design', 'Structure & Infrastructure', 'Habitat & Life Support'],
    status: 'completed',
    featured: true,
    detailUrl: '/blog/gfssm-2023-moon-base',
    archivePhotos: ['/img/archive/2023/preparation.webp', '/img/archive/2023/base-design.webp', '/img/archive/2023/team.webp'],
    sourceUrl: 'https://mp.weixin.qq.com/s/lt37seSK31SGtO3ptq8nvw',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/**
 * 站点级别的展示数据：核心方向、数据统计（双语）。
 *
 * 资料依据：公开报道（2017 求是创新学院、2023 磐安公益、
 * 2024 GFSSM 中国站）。存疑或待校内补证的信息保留 TODO，不做编造。
 *
 * 每条文案内联中英文，组件按当前 locale 用 useT() 选择。
 */

export interface Direction {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
}

// 核心方向对应步天工程社在太空城市/基地设计赛事中的真实系统分工
// （管理、结构、人居、运营、基础设施）与科普公益实践。
export const directions: Direction[] = [
  {
    id: 'settlement',
    nameZh: '太空城市与基地设计',
    nameEn: 'Space Settlement Design',
    descZh:
      '围绕赛事 RFP，在结构、人居、运营等约束下完成一座太空城或地外基地的系统方案——从需求拆解、分工协作到全英文答辩。',
    descEn:
      'Around a competition RFP, deliver a full systems proposal for a space city or off-world base under structural, habitat and operational constraints — from breaking down requirements to defending it in English.',
  },
  {
    id: 'structure',
    nameZh: '结构与基础设施',
    nameEn: 'Structure & Infrastructure',
    descZh:
      '在轨道与地外环境下解决承载、增压、组装与基础设施布局，让庞大的居住系统不只是构想，而是「立得住」的方案。',
    descEn:
      'Solve load-bearing, pressurization, assembly and infrastructure layout in orbital and off-world environments — so a vast habitat is not just an idea, but a design that holds up.',
  },
  {
    id: 'habitat',
    nameZh: '人居与生命保障',
    nameEn: 'Habitat & Life Support',
    descZh:
      '大气循环、生命保障、食品工程与作物筛选——把「让人长期住下去」拆成可计算、可验证的子系统。',
    descEn:
      'Atmosphere cycling, life support, food engineering and crop selection — turning "keep people living here long-term" into computable, verifiable subsystems.',
  },
  {
    id: 'operations',
    nameZh: '运营与商业',
    nameEn: 'Operations & Business',
    descZh:
      '以虚拟航天公司的方式组织：管理、运营、风险与商业论证，让工程方案同时具备可行性与说服力。',
    descEn:
      'Organized as a virtual aerospace company: management, operations, risk and business cases that make an engineering proposal both feasible and convincing.',
  },
  {
    id: 'outreach',
    nameZh: '科普与公益传播',
    nameEn: 'Outreach',
    descZh:
      '把项目讲清楚、传出去——文档复盘、航天科普与结对公益，让积累在社团内外延续。',
    descEn:
      'Explain the work and pass it on — documentation, space-science outreach and community programs that let what we learn live on inside and beyond the club.',
  },
];

export interface Stat {
  id: string;
  /** 数值；TODO 表示尚未统计真实数据 */
  value: string;
  labelZh: string;
  labelEn: string;
  captionZh: string;
  captionEn: string;
}

// 以公开可核验的成绩为主；社团规模等内部数据待补证。
export const stats: Stat[] = [
  {
    id: 'champion',
    value: '2023',
    labelZh: 'GFSSM 全国冠军',
    labelEn: 'GFSSM National Champion',
    captionZh: '月球基地 · 天权队所在公司夺冠',
    captionEn: 'Lunar base · Team Tianquan’s company',
  },
  {
    id: 'finals',
    value: '3',
    labelZh: '连续三届晋级全国决赛',
    labelEn: 'Three Straight National Finals',
    captionZh: '2023 冠军 · 2024 亚军 · 2025 亚+季',
    captionEn: '2023 1st · 2024 2nd · 2025 2nd+3rd',
  },
  {
    id: 'since-fssm',
    value: '2020',
    labelZh: '太空学者大会参赛可追溯至',
    labelEn: 'At the Space Scholars Meet Since',
    captionZh: '未来太空学者大会 FSSM',
    captionEn: 'Future Space Scholars Meet',
  },
];

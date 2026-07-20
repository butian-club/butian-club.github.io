import React, {type ReactNode, useEffect, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useT} from '@site/src/lib/i18n';
import {directions, stats} from '@site/src/data/site';
import {projects} from '@site/src/data/projects';
import styles from './index.module.css';

type GalleryItem = {
  src: string;
  altZh: string;
  altEn: string;
  captionZh: string;
  captionEn: string;
  fit?: 'contain';
};

const galleryItems: GalleryItem[] = [
  {
    src: '/img/projects/2024-gfssm/work-01.jpg',
    altZh: '参赛成员在电脑前整理方案',
    altEn: 'A team member editing the proposal on a laptop',
    captionZh: '方案整理',
    captionEn: 'Proposal editing',
  },
  {
    src: '/img/projects/2024-gfssm/work-02.jpg',
    altZh: '两位参赛成员在现场协作',
    altEn: 'Two team members collaborating on site',
    captionZh: '现场协作',
    captionEn: 'On-site collaboration',
  },
  {
    src: '/img/projects/2024-gfssm/work-03.jpg',
    altZh: '参赛成员共同查看电脑中的设计内容',
    altEn: 'Team members reviewing design work on a laptop',
    captionZh: '设计复核',
    captionEn: 'Design review',
  },
  {
    src: '/img/projects/2024-gfssm/work-04.jpg',
    altZh: '参赛成员在现场推进小组任务',
    altEn: 'Team members working through a group task',
    captionZh: '小组工作',
    captionEn: 'Group work',
  },
  {
    src: '/img/projects/2024-gfssm/presentation-01.jpg',
    altZh: '参赛成员在台上进行英文汇报',
    altEn: 'A team member presenting on stage in English',
    captionZh: '英文答辩',
    captionEn: 'English defense',
  },
  {
    src: '/img/projects/2024-gfssm/presentation-02.jpg',
    altZh: '参赛成员在话筒前介绍团队方案',
    altEn: 'A team member presenting the team proposal',
    captionZh: '方案汇报',
    captionEn: 'Proposal presentation',
  },
  {
    src: '/img/projects/2024-gfssm/management.jpg',
    altZh: '参赛团队进行管理层竞选陈述',
    altEn: 'Participants delivering a management election presentation',
    captionZh: '管理层竞选',
    captionEn: 'Management election',
  },
  {
    src: '/img/projects/2024-gfssm/proposal-structure.jpg',
    altZh: '太空城材料与结构设计提案页面',
    altEn: 'Materials and structures page from the space settlement proposal',
    captionZh: '材料与结构',
    captionEn: 'Materials & structures',
    fit: 'contain',
  },
  {
    src: '/img/projects/2024-gfssm/proposal-life-support.jpg',
    altZh: '太空城生命保障系统提案页面',
    altEn: 'Life-support systems page from the space settlement proposal',
    captionZh: '生命保障系统',
    captionEn: 'Life-support systems',
    fit: 'contain',
  },
  {
    src: '/img/projects/2024-gfssm/proposal-atmosphere.jpg',
    altZh: '太空城大气管理系统提案页面',
    altEn: 'Atmosphere-management page from the space settlement proposal',
    captionZh: '大气管理',
    captionEn: 'Atmosphere management',
    fit: 'contain',
  },
  {
    src: '/img/projects/2024-gfssm/proposal-construction.jpg',
    altZh: '太空城结构与建造方案页面',
    altEn: 'Structure and construction page from the space settlement proposal',
    captionZh: '结构与建造',
    captionEn: 'Structure & construction',
    fit: 'contain',
  },
];

const recentEntries = [
  {
    date: '2025.08.30',
    titleZh: '2025 GFSSM 中国站：火星熔岩管基地',
    titleEn: 'GFSSM China 2025: Mars Lava-Tube Base',
    href: '/blog/gfssm-2025-mars-base',
  },
  {
    date: '2024.08.17',
    titleZh: '2024 GFSSM 中国站：金星轨道太空城',
    titleEn: 'GFSSM China 2024: Venus-Orbit Space City',
    href: '/blog/gfssm-2024-china-runner-up',
  },
  {
    date: '2023.06.10',
    titleZh: '磐安航天科普公益活动',
    titleEn: 'Pan’an Space-Science Outreach',
    href: '/blog/panan-outreach-2023',
  },
];

function Arrow(): ReactNode {
  return <span aria-hidden="true">→</span>;
}

function GalleryImages({duplicate = false}: {duplicate?: boolean}): ReactNode {
  const t = useT();

  return (
    <>
      {galleryItems.map((item, index) => (
        <div className={styles.galleryCell} key={`${duplicate ? 'duplicate' : 'original'}-${item.src}`}>
          <figure className={styles.galleryItem}>
            <img
              className={item.fit === 'contain' ? styles.galleryImageContain : undefined}
              src={item.src}
              alt={duplicate ? '' : t(item.altZh, item.altEn)}
              loading="lazy"
              decoding="async"
            />
            <figcaption className={styles.srOnly}>
              {t(item.captionZh, item.captionEn)}
              {t('，', ', ')}
              {index + 1} / {galleryItems.length}
            </figcaption>
          </figure>
        </div>
      ))}
    </>
  );
}

function LoopingGallery(): ReactNode {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setShouldPlay(entry.isIntersecting),
      {rootMargin: `${window.innerHeight}px 0px`},
    );

    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  const animationStyle = {
    animationPlayState: shouldPlay ? 'running' : 'paused',
  } as const;

  return (
    <div className={styles.galleryViewport} ref={galleryRef}>
      <div className={`${styles.galleryTrack} ${styles.galleryTrackPrimary}`} style={animationStyle}>
        <GalleryImages />
      </div>
      <div
        className={`${styles.galleryTrack} ${styles.galleryTrackSecondary}`}
        style={animationStyle}
        aria-hidden="true">
        <GalleryImages duplicate />
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const t = useT();

  return (
    <Layout
      title={t('首页', 'Home')}
      description={t(
        '杭州第二中学求是创新学院步天工程社官方网站，记录太空城市与基地设计、工程实践及航天科普活动。',
        'The official website of Butian Engineering Club at Hangzhou No.2 High School.',
      )}>
      <main className={styles.home}>
        <header className={styles.hero}>
          <div className={styles.masthead}>
            <span>{t('杭州第二中学 · 求是创新学院', 'HANGZHOU NO.2 HIGH SCHOOL · QIUSHI INNOVATION ACADEMY')}</span>
            <span>{t('官方网站', 'OFFICIAL WEBSITE')}</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>{t('学生工程与航天科技社团', 'STUDENT ENGINEERING & AEROSPACE CLUB')}</p>
              <h1>{t('步天工程社', 'Butian Engineering Club')}</h1>
              <p className={styles.heroIntro}>
                {t(
                  '主要开展太空城市与基地设计、工程实践与航天科普。社团成员以真实任务书为起点，在有限时间内完成系统设计、提案写作与英文答辩。',
                  'We work on space-settlement design, engineering practice and aerospace outreach, developing complete systems proposals from real briefs and defending them in English.',
                )}
              </p>
              <div className={styles.heroLinks}>
                <Link className={styles.textLink} to="/projects">
                  {t('项目档案', 'Project archive')} <Arrow />
                </Link>
                <Link className={styles.textLink} to="/about">
                  {t('社团介绍', 'About the club')} <Arrow />
                </Link>
              </div>
            </div>

            <figure className={styles.heroFigure}>
              <img
                src="/img/projects/2024-gfssm/team.jpg"
                alt={t('步天工程社成员参加 2024 全球未来太空学者大会中国站', 'Butian members at the 2024 GFSSM China round')}
                fetchPriority="high"
              />
              <figcaption>
                <span>{t('2024 GFSSM 中国站', 'GFSSM China 2024')}</span>
                <span>{t('团队合影', 'Team photograph')}</span>
              </figcaption>
            </figure>
          </div>
        </header>

        <section className={styles.archiveSection} aria-labelledby="archive-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>{t('项目档案', 'PROJECT ARCHIVE')}</p>
              <h2 id="archive-title">{t('近期项目', 'Recent projects')}</h2>
            </div>
            <Link className={styles.textLink} to="/projects">
              {t('查看全部', 'View all')} <Arrow />
            </Link>
          </div>

          <div className={styles.projectList}>
            {projects.slice(0, 3).map((project) => (
              <Link className={styles.projectRow} key={project.id} to={project.detailUrl ?? '/projects'}>
                <span className={styles.projectYear}>{project.titleZh.match(/20\d{2}/)?.[0]}</span>
                <div>
                  <h3>{t(project.titleZh, project.titleEn)}</h3>
                  <p>{t(project.summaryZh, project.summaryEn)}</p>
                </div>
                <span className={styles.rowArrow}><Arrow /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.gallerySection} aria-labelledby="gallery-title">
          <div className={styles.galleryHeading}>
            <div>
              <p className={styles.sectionLabel}>{t('现场记录', 'FIELD NOTES')}</p>
              <h2 id="gallery-title">{t('2024 GFSSM 中国站', 'GFSSM China 2024')}</h2>
            </div>
            <p>
              {t(
                '从 24 小时现场设计到提案答辩，记录团队真实的工作过程。',
                'A record of the team’s 24-hour design sprint and final defense.',
              )}
            </p>
          </div>

          <LoopingGallery />

          <p className={styles.sourceNote}>
            {t('图片见', 'Images documented in')}{' '}
            <a href="https://news.qq.com/rain/a/20240817A030S200" target="_blank" rel="noreferrer">
              {t('2024 GFSSM 中国站公开报道', 'the public report on GFSSM China 2024')}
              <span className={styles.srOnly}>{t('（在新标签页中打开）', ' (opens in a new tab)')}</span>
            </a>
            {t('，活动照片由求是创新学院提供。', '; event photographs supplied by Qiushi Innovation Academy.')}
          </p>
        </section>

        <section className={styles.workSection} aria-labelledby="work-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>{t('工作方向', 'AREAS OF WORK')}</p>
              <h2 id="work-title">{t('从设计到传播', 'From design to outreach')}</h2>
            </div>
          </div>

          <div className={styles.directionList}>
            {directions.map((direction, index) => (
              <article className={styles.directionRow} key={direction.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{t(direction.nameZh, direction.nameEn)}</h3>
                <p>{t(direction.descZh, direction.descEn)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.recordSection} aria-labelledby="record-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>{t('公开记录', 'PUBLIC RECORD')}</p>
              <h2 id="record-title">{t('参赛与获奖', 'Competition record')}</h2>
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <article key={stat.id}>
                <strong>{stat.value}</strong>
                <h3>{t(stat.labelZh, stat.labelEn)}</h3>
                <p>{t(stat.captionZh, stat.captionEn)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.notesSection} aria-labelledby="notes-title">
          <div className={styles.notesIntro}>
            <p className={styles.sectionLabel}>{t('社团动态', 'CLUB NOTES')}</p>
            <h2 id="notes-title">{t('近期记录', 'Recent notes')}</h2>
            <p>{t('项目进展、比赛复盘与社团活动。', 'Project updates, competition reviews and club activities.')}</p>
          </div>

          <div className={styles.notesList}>
            {recentEntries.map((entry) => (
              <Link to={entry.href} key={entry.href}>
                <time>{entry.date}</time>
                <span>{t(entry.titleZh, entry.titleEn)}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.joinSection}>
          <div>
            <p className={styles.sectionLabel}>{t('加入步天', 'JOIN BUTIAN')}</p>
            <h2>{t('面向杭州第二中学在校生', 'Open to Hangzhou No.2 High School students')}</h2>
            <p>{t('具体招新时间与方式以当年通知为准。', 'Recruitment dates and details are announced each year.')}</p>
          </div>
          <Link className={styles.joinLink} to="/join">
            {t('查看招新说明', 'Recruitment information')} <Arrow />
          </Link>
        </section>
      </main>
    </Layout>
  );
}

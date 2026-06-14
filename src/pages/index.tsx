import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useT, useIsEn} from '@site/src/lib/i18n';
import {directions, stats} from '@site/src/data/site';
import {featuredProjects, STATUS_META} from '@site/src/data/projects';
import styles from './index.module.css';

const MATURITY: Record<string, number> = {
  settlement: 82,
  structure: 70,
  habitat: 76,
  operations: 64,
  outreach: 58,
};

/** 深空星场背景（去掉行星弧线，保留氛围与冷蓝辉光）。 */
const STARS = [
  [120, 90, 1.2, 0.7], [300, 150, 0.8, 0.5], [520, 70, 1, 0.6], [760, 130, 1.4, 0.8],
  [980, 90, 0.9, 0.5], [1120, 180, 1.1, 0.6], [200, 240, 0.7, 0.4], [640, 220, 1, 0.7],
  [880, 260, 0.8, 0.5], [1050, 320, 1.2, 0.6], [80, 330, 1, 0.5], [420, 300, 0.9, 0.6],
  [700, 360, 0.7, 0.4], [1160, 420, 1, 0.5], [260, 410, 1.1, 0.7], [560, 440, 0.8, 0.4],
  [40, 200, 0.9, 0.5], [980, 470, 0.7, 0.4], [340, 540, 1, 0.5], [820, 560, 0.9, 0.6],
  [150, 470, 0.8, 0.45], [1190, 280, 0.9, 0.5], [470, 600, 0.7, 0.4], [1080, 600, 1, 0.55],
];

function Starfield(): ReactNode {
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="fu-sky" cx="68%" cy="22%" r="95%">
          <stop offset="0%" stopColor="#0c1a30" />
          <stop offset="42%" stopColor="#070d1c" />
          <stop offset="100%" stopColor="#040711" />
        </radialGradient>
      </defs>
      <rect width="1200" height="700" fill="url(#fu-sky)" />
      <g fill="#cfe4ff">
        {STARS.map(([x, y, r, o], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={o} />
        ))}
      </g>
    </svg>
  );
}

export default function Home(): ReactNode {
  const t = useT();
  const isEn = useIsEn();
  return (
    <Layout
      title={t('首页', 'Home')}
      description={t(
        '杭州第二中学步天工程社（Butian Engineering Club）官方网站：以太空城市与基地设计为主线的学生工程与航天科技社团。',
        'Butian Engineering Club at Hangzhou No.2 High School: a student aerospace & engineering club centered on space settlement design.',
      )}>
      <div className={styles.root}>
        <div className={styles.topbar}>
          <span>
            <b>BUTIAN-ENG</b> // {t('浙江省杭州第二中学 · 求是创新学院', 'Qiushi Innovation Academy · Hangzhou No.2 High School')}
          </span>
          <div className={styles.topbarRight}>
            <span>HANGZHOU NO.2 HIGH SCHOOL</span>
            <span>EST. ████</span>
            <span>SYS <b>NOMINAL</b></span>
          </div>
        </div>

        {/* HERO：深空封面 + 工程文本装饰 */}
        <header className={styles.hero}>
          <div className={styles.heroSky}><Starfield /></div>
          <span className={styles.heroGlow} aria-hidden="true" />
          <span className={styles.corner} data-c="tl" aria-hidden="true" />
          <span className={styles.corner} data-c="tr" aria-hidden="true" />
          <span className={styles.corner} data-c="bl" aria-hidden="true" />
          <span className={styles.corner} data-c="br" aria-hidden="true" />
          <span className={styles.rulerCoord} aria-hidden="true">LAT 30.21°N // LON 120.16°E</span>

          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.heroSys}>
                <span className={styles.led} aria-hidden="true" />
                MISSION // BUTIAN ENGINEERING CLUB
              </span>
              <h1 className={styles.heroTitle}>
                {t('步天工程社', 'Butian Engineering Club')}
              </h1>
              <span className={styles.heroEn}>
                {t('Butian Engineering Club', '杭州第二中学步天工程社')}
              </span>
              <div className={styles.heroRule} aria-hidden="true" />
              <p className={styles.heroSlogan}>
                {t(
                  '我们不只讨论航天，也尝试把一座太空城从需求、结构、人居一直做到可验证、可答辩的方案。',
                  'We don’t just talk about space — we take a space city from requirements through structure and habitat to a proposal that can be verified and defended.',
                )}
              </p>
              <div className={styles.heroActions}>
                <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/about">
                  {t('了解我们', 'About Us')} →
                </Link>
                <Link className={`${styles.btn} ${styles.btnGhost}`} to="/join">
                  {t('加入我们', 'Join Us')}
                </Link>
              </div>

              <dl className={styles.hud}>
                <div className={styles.hudCell}>
                  <div className={styles.hudLabel}>DIRECTIONS</div>
                  <div className={styles.hudValue}>05</div>
                </div>
                <div className={styles.hudCell}>
                  <div className={styles.hudLabel}>PROJECTS</div>
                  <div className={styles.hudValue}>04</div>
                </div>
                <div className={styles.hudCell}>
                  <div className={styles.hudLabel}>GFSSM 2024</div>
                  <div className={styles.hudValue}>{t('亚军', '2ND')}</div>
                </div>
                <div className={styles.hudCell}>
                  <div className={styles.hudLabel}>STATUS</div>
                  <div className={styles.hudValue}>RECRUIT</div>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className={styles.wrap}>
          {/* 简介 */}
          <section className={styles.section} aria-labelledby="home-about">
            <div className={styles.sectionHead}>
              <span className={styles.sectionNo}>[ 00 ]</span>
              <h2 id="home-about" className={styles.sectionTitle}>
                {t('社团简介 · ABOUT', 'About the Club · 社团简介')}
              </h2>
              <span className={styles.sectionLine} aria-hidden="true" />
            </div>
            <p className={styles.aboutLead}>
              {t(
                '步天工程社是浙江省杭州第二中学求是创新学院的学生工程与航天科技社团。我们关注航天，但更在意「怎么做出来」——一座太空城要经过结构、人居、运营与商业的反复推敲，经得起 24 小时极限设计和全英文答辩的检验，才算真正被理解。',
                'Butian Engineering Club belongs to the Qiushi Innovation Academy at Hangzhou No.2 High School of Zhejiang Province. We care about space, but more about how it gets built — a space city is only truly understood once it survives the scrutiny of structure, habitat, operations and business, a 24-hour design sprint, and an all-English defense.',
              )}
            </p>
          </section>

          {/* 子系统 / 核心方向 */}
          <section className={styles.section} aria-labelledby="home-dir">
            <div className={styles.sectionHead}>
              <span className={styles.sectionNo}>[ 01 ]</span>
              <h2 id="home-dir" className={styles.sectionTitle}>
                {t('核心方向 · SUBSYSTEMS', 'Core Directions · SUBSYSTEMS')}
              </h2>
              <span className={styles.sectionLine} aria-hidden="true" />
            </div>
            <div className={styles.subsysList}>
              {directions.map((d, i) => (
                <div key={d.id} className={styles.subsysRow}>
                  <span className={styles.subsysIdx}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className={styles.subsysName}>{t(d.nameZh, d.nameEn)}</div>
                    <div className={styles.subsysEn}>{t(d.nameEn, d.nameZh)}</div>
                  </div>
                  <p className={styles.subsysDesc}>{t(d.descZh, d.descEn)}</p>
                  <div className={styles.subsysMeter}>
                    <div className={styles.subsysBar}>
                      <span style={{width: `${MATURITY[d.id] ?? 50}%`}} />
                    </div>
                    <div className={styles.subsysStat}>READINESS {MATURITY[d.id] ?? 50}%</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 项目 */}
          <section className={styles.section} aria-labelledby="home-proj">
            <div className={styles.sectionHead}>
              <span className={styles.sectionNo}>[ 02 ]</span>
              <h2 id="home-proj" className={styles.sectionTitle}>
                {t('精选项目 · PAYLOAD', 'Selected Projects · PAYLOAD')}
              </h2>
              <span className={styles.sectionLine} aria-hidden="true" />
            </div>
            <div className={styles.projGrid}>
              {featuredProjects.map((p) => (
                <Link
                  key={p.id}
                  to={p.detailUrl ?? '/projects'}
                  className={styles.projCard}>
                  <div className={styles.projTop}>
                    <span>ID-{p.id.toUpperCase()}</span>
                    <span className={styles.projStatus}>
                      <span className={`${styles.dot} ${styles[`dot${p.status[0].toUpperCase()}${p.status.slice(1)}`]}`} />
                      {t(STATUS_META[p.status].labelZh, STATUS_META[p.status].labelEn)}
                    </span>
                  </div>
                  <h3 className={styles.projName}>{t(p.titleZh, p.titleEn)}</h3>
                  <p className={styles.projSummary}>{t(p.summaryZh, p.summaryEn)}</p>
                  <div className={styles.projTags}>
                    {(isEn ? p.tagsEn : p.tagsZh).map((tag) => (
                      <span key={tag} className={styles.projTag}>{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.sectionFoot}>
              <Link className={`${styles.btn} ${styles.btnGhost}`} to="/projects">
                {t('查看全部项目', 'View all projects')} →
              </Link>
            </div>
          </section>

          {/* 数据读数 */}
          <section className={styles.section} aria-labelledby="home-stat">
            <div className={styles.sectionHead}>
              <span className={styles.sectionNo}>[ 03 ]</span>
              <h2 id="home-stat" className={styles.sectionTitle}>
                {t('运行数据 · TELEMETRY', 'By the Numbers · TELEMETRY')}
              </h2>
              <span className={styles.sectionLine} aria-hidden="true" />
            </div>
            <div className={styles.console}>
              {stats.map((s) => (
                <div key={s.id} className={styles.consoleCell}>
                  <div className={styles.consoleVal}>{s.value}</div>
                  <div className={styles.consoleLabel}>{t(s.labelZh, s.labelEn)}</div>
                  <div className={styles.consoleCap}>{t(s.captionZh, s.captionEn)}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 加入 */}
          <section className={styles.join} aria-labelledby="home-join">
            <span className={styles.joinGlow} aria-hidden="true" />
            <span className={styles.kicker}>// TRANSMISSION — RECRUITMENT OPEN</span>
            <h2 id="home-join" className={styles.joinTitle}>
              {t('如果你也想把想法做出来', 'If you also want to build your ideas')}
            </h2>
            <p className={styles.joinText}>
              {t(
                '我们欢迎对工程与航天有持续兴趣的同学。不要求你已经会很多，只希望你愿意动手、愿意把问题查清楚、也愿意把过程写下来。',
                'We welcome students with a lasting interest in engineering and space. You don’t need to know a lot already — only to be willing to get your hands dirty, dig into problems, and write the process down.',
              )}
            </p>
            <div className={styles.heroActions}>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/join">
                {t('了解招新', 'About Recruitment')} →
              </Link>
              <Link className={`${styles.btn} ${styles.btnGhost}`} to="/docs/intro">
                {t('查看知识库', 'Knowledge Base')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

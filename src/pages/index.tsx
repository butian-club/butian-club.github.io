import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Reveal from '@site/src/components/Reveal';
import {useT} from '@site/src/lib/i18n';
import {directions, stats} from '@site/src/data/site';
import {featuredProjects} from '@site/src/data/projects';
import ProjectCard from '@site/src/components/ProjectCard';
import styles from './index.module.css';

export default function Home(): ReactNode {
  const t = useT();
  return (
    <Layout
      title={t('首页', 'Home')}
      description={t(
        '杭州第二中学步天工程社（Butian Engineering Club）官方网站：以太空城市与基地设计为主线的学生工程与航天科技社团。',
        'Butian Engineering Club at Hangzhou No.2 High School: a student aerospace & engineering club centered on space settlement design.',
      )}>
      {/* ===== HERO ===== */}
      <header className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <span className={styles.stars} />
          <span className={clsx(styles.aurora, styles.aurora1)} />
          <span className={clsx(styles.aurora, styles.aurora2)} />
          <span className={styles.orbit} />
        </div>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            {t('杭州第二中学 · 求是创新学院', 'Hangzhou No.2 High School · Qiushi Innovation Academy')}
          </p>
          <h1 className={styles.heroTitle}>{t('步天工程社', 'Butian')}</h1>
          <p className={styles.heroTagline}>
            {t(
              '把一座太空城，从需求一直做到可验证、可答辩的方案。',
              'Taking a space city from requirements to a proposal that can be verified and defended.',
            )}
          </p>
          <div className={styles.actions}>
            <Link className={clsx(styles.btn, styles.btnPrimary)} to="/about">
              {t('了解我们', 'About Us')}
            </Link>
            <Link className={clsx(styles.btn, styles.btnGhost)} to="/join">
              {t('加入我们', 'Join Us')}
            </Link>
          </div>
          <ul className={styles.highlights}>
            <li>{t('杭州二中五星级社团', 'Five-star club')}</li>
            <li>{t('GFSSM 2023 全国冠军', 'GFSSM 2023 National Champion')}</li>
            <li>{t('连续三届晋级全国决赛', 'Three straight national finals')}</li>
          </ul>
        </div>
        <span className={styles.scrollCue} aria-hidden="true" />
      </header>

      <main>
        {/* Intro */}
        <section className={clsx(styles.section, styles.intro)}>
          <div className={styles.wrap}>
            <Reveal as="p" className={styles.kicker}>{t('社团简介', 'About')}</Reveal>
            <Reveal as="p" className={styles.introLead} delay={60}>
              {t('我们关注航天，更在意 ', 'We care about space — but more about ')}
              <b>{t('怎么把它做出来', 'how it gets built')}</b>
              {t('。', '.')}
            </Reveal>
            <Reveal as="p" className={styles.introBody} delay={120}>
              {t(
                '步天工程社是浙江省杭州第二中学求是创新学院的学生工程与航天科技社团。一座太空城要经过结构、人居、运营与商业的反复推敲，经得起 24 小时极限设计和全英文答辩的检验，才算真正被理解。',
                'Butian Engineering Club belongs to the Qiushi Innovation Academy at Hangzhou No.2 High School. A space city is only truly understood once it survives structure, habitat, operations and business, a 24-hour design sprint, and an all-English defense.',
              )}
            </Reveal>
          </div>
        </section>

        {/* Directions */}
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <Reveal>
                <p className={styles.kicker}>{t('核心方向', 'What We Do')}</p>
                <h2 className={styles.sectionTitle}>{t('五个协作方向', 'Five directions')}</h2>
              </Reveal>
            </div>
            <div className={styles.dirGrid}>
              {directions.map((d, i) => (
                <Reveal key={d.id} className={styles.dirCard} delay={i * 70}>
                  <div className={styles.dirNum}>{String(i + 1).padStart(2, '0')}</div>
                  <h3 className={styles.dirName}>{t(d.nameZh, d.nameEn)}</h3>
                  <p className={styles.dirEn}>{t(d.nameEn, d.nameZh)}</p>
                  <p className={styles.dirDesc}>{t(d.descZh, d.descEn)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Statement band */}
        <section className={styles.statement}>
          <div className={styles.heroBg} aria-hidden="true">
            <span className={clsx(styles.aurora, styles.aurora2)} />
          </div>
          <div className={styles.wrap}>
            <Reveal as="p" className={styles.statementQuote}>
              {t(
                '不追求一时的声势，只做能被复现的方法、能被延续的记录。',
                'No momentary noise — only methods that reproduce and records that endure.',
              )}
            </Reveal>
            <Reveal as="p" className={styles.statementSub} delay={80}>
              {t('一届接一届，把经验真正沉淀下来。', 'Passed down, cohort after cohort.')}
            </Reveal>
          </div>
        </section>

        {/* Projects */}
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <Reveal>
                <p className={styles.kicker}>{t('精选项目', 'Selected Work')}</p>
                <h2 className={styles.sectionTitle}>{t('我们做过什么', 'What we’ve built')}</h2>
              </Reveal>
              <Reveal delay={60}>
                <Link className={styles.moreLink} to="/projects">
                  {t('查看全部项目', 'All projects')}
                  <span aria-hidden="true"> →</span>
                </Link>
              </Reveal>
            </div>
            <div className={styles.projGrid}>
              {featuredProjects.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={clsx(styles.section, styles.stats)}>
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <Reveal>
                <p className={styles.kicker}>{t('成绩', 'Track Record')}</p>
                <h2 className={styles.sectionTitle}>{t('可核验的战绩', 'By the numbers')}</h2>
              </Reveal>
            </div>
            <div className={styles.statGrid}>
              {stats.map((s, i) => (
                <Reveal key={s.id} className={styles.statCard} delay={i * 70}>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{t(s.labelZh, s.labelEn)}</div>
                  <div className={styles.statCaption}>{t(s.captionZh, s.captionEn)}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.wrap}>
            <Reveal className={styles.cta}>
              <h2 className={styles.ctaTitle}>
                {t('如果你也想把想法做出来', 'If you also want to build your ideas')}
              </h2>
              <p className={styles.ctaText}>
                {t(
                  '不要求你已经会很多，只希望你愿意动手、愿意把问题查清楚、也愿意把过程写下来。',
                  'You don’t need to know a lot already — only to get hands-on, dig into problems, and write the process down.',
                )}
              </p>
              <div className={styles.ctaActions}>
                <Link className={clsx(styles.btn, styles.ctaPrimary)} to="/join">
                  {t('了解招新', 'About Recruitment')}
                </Link>
                <Link className={clsx(styles.btn, styles.ctaGhost)} to="/docs/intro">
                  {t('查看知识库', 'Knowledge Base')}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </Layout>
  );
}

import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
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
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>
            {t('杭州第二中学 · 求是创新学院', 'Hangzhou No.2 High School · Qiushi Innovation Academy')}
          </p>
          <h1 className={styles.heroTitle}>{t('步天工程社', 'Butian Engineering Club')}</h1>
          <p className={styles.heroSub}>{t('Butian Engineering Club', '步天工程社')}</p>
          <p className={styles.heroLead}>
            {t(
              '我们不只讨论航天，也尝试把一座太空城从需求、结构、人居一直做到可验证、可答辩的方案。',
              'We don’t just talk about space — we take a space city from requirements through structure and habitat to a proposal that can be verified and defended.',
            )}
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/about">
              {t('了解我们', 'About Us')}
            </Link>
            <Link className="button button--secondary button--lg" to="/join">
              {t('加入我们', 'Join Us')}
            </Link>
          </div>
          <ul className={styles.highlights}>
            <li>{t('杭州二中五星级社团', 'Five-star club')}</li>
            <li>{t('GFSSM 2023 全国冠军', 'GFSSM 2023 National Champion')}</li>
            <li>{t('连续三届晋级全国决赛', 'Three straight national finals')}</li>
          </ul>
        </div>
      </header>

      <main className={styles.wrap}>
        {/* About */}
        <section className={styles.section}>
          <p className={styles.kicker}>{t('社团简介', 'About')}</p>
          <p className={styles.lead}>
            {t(
              '步天工程社是浙江省杭州第二中学求是创新学院的学生工程与航天科技社团。我们关注航天，但更在意「怎么做出来」——一座太空城要经过结构、人居、运营与商业的反复推敲，经得起 24 小时极限设计和全英文答辩的检验，才算真正被理解。',
              'Butian Engineering Club belongs to the Qiushi Innovation Academy at Hangzhou No.2 High School. We care about space, but more about how it gets built — a space city is only truly understood once it survives structure, habitat, operations and business, a 24-hour design sprint, and an all-English defense.',
            )}
          </p>
        </section>

        {/* Directions */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>{t('核心方向', 'What We Do')}</p>
              <h2 className={styles.sectionTitle}>{t('五个协作方向', 'Five directions')}</h2>
            </div>
          </div>
          <div className={styles.dirGrid}>
            {directions.map((d) => (
              <article key={d.id} className={styles.dirCard}>
                <h3 className={styles.dirName}>{t(d.nameZh, d.nameEn)}</h3>
                <p className={styles.dirEn}>{t(d.nameEn, d.nameZh)}</p>
                <p className={styles.dirDesc}>{t(d.descZh, d.descEn)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>{t('精选项目', 'Selected Work')}</p>
              <h2 className={styles.sectionTitle}>{t('我们做过什么', 'What we’ve built')}</h2>
            </div>
            <Link className={styles.moreLink} to="/projects">
              {t('查看全部项目', 'All projects')}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <div className={styles.projGrid}>
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>{t('成绩', 'Track Record')}</p>
              <h2 className={styles.sectionTitle}>{t('可核验的战绩', 'By the numbers')}</h2>
            </div>
          </div>
          <div className={styles.statGrid}>
            {stats.map((s) => (
              <div key={s.id} className={styles.statCard}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{t(s.labelZh, s.labelEn)}</div>
                <div className={styles.statCaption}>{t(s.captionZh, s.captionEn)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <section className={clsx(styles.section, styles.ctaSection)}>
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>
              {t('如果你也想把想法做出来', 'If you also want to build your ideas')}
            </h2>
            <p className={styles.ctaText}>
              {t(
                '我们欢迎对工程与航天有持续兴趣的同学。不要求你已经会很多，只希望你愿意动手、愿意把问题查清楚、也愿意把过程写下来。',
                'We welcome students with a lasting interest in engineering and space. You don’t need to know a lot already — only to be willing to get your hands dirty, dig into problems, and write the process down.',
              )}
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/join">
                {t('了解招新', 'About Recruitment')}
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                {t('查看知识库', 'Knowledge Base')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

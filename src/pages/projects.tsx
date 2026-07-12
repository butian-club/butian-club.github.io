import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PageHero from '@site/src/components/PageHero';
import ProjectCard from '@site/src/components/ProjectCard';
import {projects, STATUS_META, type ProjectStatus} from '@site/src/data/projects';
import {useT} from '@site/src/lib/i18n';
import styles from './page.module.css';

const ORDER: ProjectStatus[] = ['active', 'completed'];

export default function Projects(): ReactNode {
  const t = useT();
  const counts = ORDER.map((status) => ({
    status,
    items: projects.filter((p) => p.status === status),
  }));

  return (
    <Layout
      title={t('项目', 'Projects')}
      description={t(
        '步天工程社的在研与已完成项目列表。',
        'Butian Engineering Club: ongoing and completed projects.',
      )}>
      <PageHero
        eyebrow="Projects"
        title={t('项目', 'Projects')}
        subtitle={t(
          '我们用项目组织学习。下面是社团目前在研与已完成的工作，内容会持续更新。',
          'We learn through projects. Below is what the club is building and has completed — updated over time.',
        )}
      />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            <span className={styles.filterStat}>
              <strong>{projects.length}</strong> {t('个项目', 'projects')}
            </span>
            {ORDER.map((status) => (
              <span key={status} className={styles.filterStat}>
                {t(STATUS_META[status].labelZh, STATUS_META[status].labelEn)}{' '}
                <strong>
                  {projects.filter((p) => p.status === status).length}
                </strong>
              </span>
            ))}
          </div>

          {counts.map(
            ({status, items}) =>
              items.length > 0 && (
                <section
                  key={status}
                  className={styles.block}
                  aria-labelledby={`group-${status}`}>
                  <h2 id={`group-${status}`} className={styles.blockTitle}>
                    {t(STATUS_META[status].labelZh, STATUS_META[status].labelEn)}
                  </h2>
                  <div className={styles.cardRow}>
                    {items.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        headingLevel="h3"
                      />
                    ))}
                  </div>
                </section>
              ),
          )}

          <p className={styles.note}>
            <strong>{t('想了解某个项目的细节？', 'Want the detail on a project?')}</strong>
            {t('我们会陆续在', 'We’ll keep adding project docs and progress logs in the ')}
            <Link to="/docs/intro">{t('知识库', 'knowledge base')}</Link>
            {t('与', ' and ')}
            <Link to="/blog">{t('活动记录', 'activity log')}</Link>
            {t(
              '中补充项目文档与进展日志。数据结构见 ',
              '. The data lives in ',
            )}
            <code>src/data/projects.ts</code>
            {t('，新增项目只需追加一条记录。', ' — adding a project is just one more entry.')}
          </p>
        </div>
      </main>
    </Layout>
  );
}

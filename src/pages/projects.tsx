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
        title={t('项目档案', 'Project Archive')}
        subtitle={t(
          '收录社团已公开的太空城市与基地设计、工程实践及科普项目。',
          'A public record of the club’s space-settlement design, engineering and outreach projects.',
        )}
      />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            <span className={styles.filterStat}>
              <strong>{projects.length}</strong> {t('个项目', 'projects')}
            </span>
            {counts.filter(({items}) => items.length > 0).map(({status, items}) => (
              <span key={status} className={styles.filterStat}>
                {t(STATUS_META[status].labelZh, STATUS_META[status].labelEn)}{' '}
                <strong>{items.length}</strong>
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
                  <p className={styles.blockEyebrow}>Archive</p>
                  <h2 id={`group-${status}`} className={styles.blockTitle}>
                    {t(STATUS_META[status].labelZh, STATUS_META[status].labelEn)}
                  </h2>
                  <div className={styles.projectList}>
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
            <strong>{t('项目资料：', 'Project material:')}</strong>
            {t('详细报道与复盘见', 'Reports and retrospectives are published in the ')}
            <Link to="/blog">{t('活动记录', 'activity log')}</Link>
            {t('；方法与协作规范见', '; methods and working conventions are kept in the ')}
            <Link to="/docs/intro">{t('知识库', 'knowledge base')}</Link>
            {t('。档案会随资料整理进度更新。', '. The archive is updated as material is reviewed.')}
          </p>
        </div>
      </main>
    </Layout>
  );
}

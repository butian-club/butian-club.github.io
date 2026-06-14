import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {type Project, STATUS_META} from '@site/src/data/projects';
import {useT, useIsEn} from '@site/src/lib/i18n';
import styles from './styles.module.css';

interface ProjectCardProps {
  project: Project;
  /** 标题渲染层级，便于无障碍语义（默认 h3） */
  headingLevel?: 'h2' | 'h3';
}

function StatusBadge({status}: {status: Project['status']}): ReactNode {
  const meta = STATUS_META[status];
  const t = useT();
  return (
    <span className={clsx(styles.badge, styles[`badge_${meta.tone}`])}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {t(meta.labelZh, meta.labelEn)}
    </span>
  );
}

export default function ProjectCard({
  project,
  headingLevel = 'h3',
}: ProjectCardProps): ReactNode {
  const Heading = headingLevel;
  const t = useT();
  const isEn = useIsEn();
  const hasDetail = Boolean(project.detailUrl);
  const title = t(project.titleZh, project.titleEn);

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardId} aria-hidden="true">
          {project.id.toUpperCase()}
        </span>
        <StatusBadge status={project.status} />
      </div>

      <Heading className={styles.cardTitle}>{title}</Heading>
      <p className={styles.cardSummary}>{t(project.summaryZh, project.summaryEn)}</p>

      <ul className={styles.tagList} aria-label={t('技术方向', 'Focus areas')}>
        {(isEn ? project.tagsEn : project.tagsZh).map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>

      <div className={styles.cardFooter}>
        {hasDetail ? (
          <Link
            className={styles.detailLink}
            to={project.detailUrl}
            aria-label={t(`查看项目「${title}」详情`, `View project "${title}"`)}>
            {t('查看详情', 'View details')}
            <span aria-hidden="true"> →</span>
          </Link>
        ) : (
          <span className={styles.detailPending}>
            {t('详情整理中', 'Details coming')}
          </span>
        )}
      </div>
    </article>
  );
}

import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
}

/** 内容页统一的页眉横幅，保持各页面视觉一致。 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: PageHeroProps): ReactNode {
  return (
    <header className={styles.pageHero}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}

import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  image?: {
    src: string;
    alt: string;
    caption?: ReactNode;
  };
}

/** 内容页统一的页眉横幅，保持各页面视觉一致。 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: PageHeroProps): ReactNode {
  return (
    <header className={styles.pageHero}>
      <div className={styles.inner}>
        <div className={styles.masthead}>
          <span>HANGZHOU NO.2 HIGH SCHOOL</span>
          <span>{eyebrow}</span>
        </div>
        <div className={`${styles.content} ${image ? styles.withImage : ''}`}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {image && (
            <figure className={styles.figure}>
              <img src={image.src} alt={image.alt} />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          )}
        </div>
      </div>
    </header>
  );
}

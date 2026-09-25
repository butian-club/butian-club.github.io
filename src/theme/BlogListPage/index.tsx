import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {HtmlClassNameProvider, PageMetadata, ThemeClassNames} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import PageHero from '@site/src/components/PageHero';
import {useT} from '@site/src/lib/i18n';

export default function BlogListPage({metadata, items, sidebar}: Props): ReactNode {
  const t = useT();
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const title = metadata.permalink === '/' ? siteTitle : metadata.blogTitle;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <PageMetadata title={title} description={metadata.blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData metadata={metadata} items={items} sidebar={sidebar} />
      <Layout>
        <PageHero
          eyebrow="Field Notes"
          title={t('活动记录', 'Field Notes')}
          subtitle={t(
            '从任务书到现场，从讨论到答辩。我们把每一次动手、合作与复盘留下来。',
            'From a brief to the room where we present it. These are records of our work, teamwork and what we learned.',
          )}
          image={{
            src: '/img/projects/2024-gfssm/work-04.jpg',
            alt: t('步天工程社成员在 2024 GFSSM 中国站协作', 'Butian members working together at GFSSM China 2024'),
            caption: t('2024 GFSSM 中国站 · 现场记录', 'GFSSM CHINA 2024 · IN THE ROOM'),
          }}
        />
        <div className="container margin-vert--lg">
          <div className="row">
            <BlogSidebar sidebar={sidebar} />
            <main className={clsx('col', hasSidebar ? 'col--7' : 'col--9 col--offset-1')}>
              <BlogPostItems items={items} />
              <BlogListPaginator metadata={metadata} />
            </main>
          </div>
        </div>
      </Layout>
    </HtmlClassNameProvider>
  );
}

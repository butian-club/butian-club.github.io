import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PageHero from '@site/src/components/PageHero';
import {useT} from '@site/src/lib/i18n';
import styles from './page.module.css';

const traits = [
  ['愿意动手，把想法落到方案、模型或文档上。', 'Willing to get hands-on and turn ideas into proposals, models or documents.'],
  ['遇到问题先查资料、读文献，再回到设计上讨论。', 'When stuck, you research and read first, then bring it back to the design.'],
  ['能坚持完成一个项目，而不只是停在兴趣上。', 'You can see a project through, not just stop at interest.'],
  ['愿意记录、可视化并清楚地表达，包括必要时用英文答辩。', 'Willing to document, visualize and present clearly — including an English defense when needed.'],
  ['能和不同方向、甚至不同学校的同学合作，对团队负责。', 'Able to work across directions — even across schools — and be accountable to the team.'],
];

const steps = [
  {
    zh: ['了解社团', '先读一读关于我们与知识库，看看我们在做什么、怎么做事，判断是否合拍。'],
    en: ['Get to know us', 'Read About and the knowledge base first — see what we do and how, and whether it clicks.'],
  },
  {
    zh: ['报名招新', '在招新季通过社团报名渠道提交申请，简单介绍你的兴趣方向与想做的事。'],
    en: ['Apply in recruitment season', 'During recruitment, apply through the club’s channel and briefly share your interests and what you’d like to build.'],
  },
  {
    zh: ['面谈交流', '我们会进行一次轻松的交流，主要聊兴趣和想法，不考你已经会多少。'],
    en: ['A relaxed chat', 'We’ll have an easy conversation about your interests and ideas — not a test of what you already know.'],
  },
  {
    zh: ['加入代表队', '根据你的方向加入一个项目或代表队，从一个小任务开始上手。'],
    en: ['Join a team', 'Based on your direction, join a project or competition team and start from a small task.'],
  },
];

export default function Join(): ReactNode {
  const t = useT();
  return (
    <Layout
      title={t('加入我们', 'Join Us')}
      description={t(
        '步天工程社招新说明、适合人群、成员特质、加入流程与联系方式。',
        'Butian Engineering Club: recruitment, who fits, the traits we look for, how to join, and contacts.',
      )}>
      <PageHero
        eyebrow="Join Us"
        title={t('加入我们', 'Join Us')}
        subtitle={t(
          '不要求你已经会很多，只希望你愿意动手、愿意把问题查清楚、也愿意把过程写下来。',
          'You don’t need to know a lot already — only to be willing to get hands-on, dig into problems, and write the process down.',
        )}
      />
      <main className={styles.page}>
        <div className={`${styles.container} ${styles.narrow}`}>
          <section className={styles.block} aria-labelledby="recruit">
            <p className={styles.blockEyebrow}>Recruitment</p>
            <h2 id="recruit" className={styles.blockTitle}>{t('招新说明', 'Recruitment')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '步天工程社面向杭州第二中学对工程与航天有兴趣的同学招新。我们不挑「已经很厉害」的人，而是找愿意一起把事情做出来的人。',
                  'Butian recruits students at Hangzhou No.2 High School who are interested in engineering and space. We don’t look for people who are “already impressive” — we look for people willing to build things together.',
                )}
              </p>
              <p>
                {t(
                  '加入后，你会和不同方向的同学组成代表队，围绕太空城市与基地设计的真实赛题，经历需求拆解、部门分工、模拟答辩与 24 小时极限设计，学习结构、人居、运营与商业的系统思考，也会参与社团的科普、复盘和知识库建设。',
                  'Once in, you’ll form a team with students from different directions, work on real space-settlement design briefs, and go through requirement breakdown, department roles, mock defenses and 24-hour design sprints — learning systems thinking across structure, habitat, operations and business, and joining the club’s outreach, retrospectives and knowledge base.',
                )}
              </p>
            </div>
            <p className={styles.note}>
              <strong>TODO：</strong>
              {t(
                '具体招新时间、报名表单与名额等信息，将在每届招新季公布。',
                'Exact recruitment dates, the application form and quotas will be announced each recruitment season.',
              )}
            </p>
          </section>

          <section className={styles.block} aria-labelledby="audience">
            <p className={styles.blockEyebrow}>Who We Look For</p>
            <h2 id="audience" className={styles.blockTitle}>
              {t('适合人群与我们希望的成员特质', 'Who Fits & the Traits We Value')}
            </h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '无论你来自哪个方向，只要认同下面这些，我们都欢迎你：',
                  'Whatever your direction, if you share the following, you’re welcome here:',
                )}
              </p>
            </div>
            <ul className={styles.checkList}>
              {traits.map((tr) => (
                <li key={tr[0]}>{t(tr[0], tr[1])}</li>
              ))}
            </ul>
          </section>

          <section className={styles.block} aria-labelledby="process">
            <p className={styles.blockEyebrow}>Process</p>
            <h2 id="process" className={styles.blockTitle}>{t('加入流程', 'How to Join')}</h2>
            <ol className={styles.steps}>
              {steps.map((s) => (
                <li key={s.zh[0]}>
                  <p className={styles.stepTitle}>{t(s.zh[0], s.en[0])}</p>
                  <p className={styles.stepText}>{t(s.zh[1], s.en[1])}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.block} aria-labelledby="contact">
            <p className={styles.blockEyebrow}>Contact</p>
            <h2 id="contact" className={styles.blockTitle}>{t('联系方式', 'Contact')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '有任何关于社团或招新的问题，欢迎通过以下方式联系我们：',
                  'For any questions about the club or recruitment, reach us via:',
                )}
              </p>
            </div>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactLabel}>{t('邮箱 Email', 'Email')}</span>
                <span className={styles.contactValue}>TODO@example.com</span>
              </li>
              <li>
                <span className={styles.contactLabel}>{t('社团位置 Location', 'Location')}</span>
                <span className={styles.contactValue}>
                  {t('杭州第二中学 · TODO 活动室', 'Hangzhou No.2 High School · Room TODO')}
                </span>
              </li>
              <li>
                <span className={styles.contactLabel}>{t('负责人 Contact', 'Contact')}</span>
                <span className={styles.contactValue}>{t('TODO 待补充', 'TODO')}</span>
              </li>
            </ul>
            <p className={styles.note}>
              {t('准备好了吗？先去', 'Ready? Start by getting familiar with our tools and norms in the ')}
              <Link to="/docs/intro"> {t('知识库', 'knowledge base')} </Link>
              {t('熟悉一下我们的工具和规范，会是不错的开始。', ' — a good place to begin.')}
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}

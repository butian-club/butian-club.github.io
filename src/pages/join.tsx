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
        title={t('加入步天', 'Join Butian')}
        subtitle={t(
          '招新面向杭州第二中学在校生。工程、航天、建模或写作经验都不是前置条件。',
          'Recruitment is open to current Hangzhou No.2 High School students. Prior experience in engineering, space science, modeling or writing is not required.',
        )}
        image={{
          src: '/img/projects/2024-gfssm/team.jpg',
          alt: t('步天工程社成员参加 2024 GFSSM 中国站后的团队合影', 'Butian members in a group photo after the 2024 GFSSM China round'),
          caption: t('2024 GFSSM 中国站 · 参赛成员', '2024 GFSSM China · Club members'),
        }}
      />
      <main className={styles.page}>
        <div className={`${styles.container} ${styles.narrow}`}>
          <section className={styles.block} aria-labelledby="recruit">
            <p className={styles.blockEyebrow}>Recruitment</p>
            <h2 id="recruit" className={styles.blockTitle}>{t('招新说明', 'Recruitment')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '步天工程社面向杭州第二中学在校生招新。报名时不设置专业能力门槛；我们更关心你愿不愿意查资料、参与讨论，并把分到的任务做完。',
                  'Butian recruits current students at Hangzhou No.2 High School. There is no specialist skill requirement at application; we care more about whether you are willing to research, join discussions and finish the work you take on.',
                )}
              </p>
              <p>
                {t(
                  '加入后，成员会按项目分工，参与任务书拆解、资料检索、方案评审、提案制作和模拟答辩。根据当年的安排，也可能参与科普活动、项目复盘与知识库整理。',
                  'After joining, members work in project teams on brief analysis, research, design reviews, proposal production and mock defenses. Depending on the year’s program, members may also take part in outreach, project retrospectives and knowledge-base maintenance.',
                )}
              </p>
            </div>
            <p className={styles.note}>
              {t(
                '具体招新时间、名额与报名方式以当年校内通知为准。',
                'Recruitment dates, places and application details follow the school notice issued for that year.',
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
                  '建模、绘画、编程、资料检索与中英文写作经验都会派上用场，但不是报名条件。项目开始后，成员会在具体任务中补齐需要的能力。',
                  'Experience in modeling, drawing, programming, research, or Chinese and English writing is useful, but not required. Members build the skills they need through specific project work.',
                )}
              </p>
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
            <p className={styles.blockEyebrow}>Information</p>
            <h2 id="contact" className={styles.blockTitle}>{t('报名信息', 'Application Information')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '正式招新信息由校内渠道发布。本页不展示尚未确认的个人联系方式。',
                  'Official recruitment information is published through school channels. Unconfirmed personal contact details are not listed here.',
                )}
              </p>
            </div>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactLabel}>{t('招新时间', 'Recruitment')}</span>
                <span className={styles.contactValue}>{t('每学年招新季，以当年通知为准', 'Each school-year recruitment season; see the current notice')}</span>
              </li>
              <li>
                <span className={styles.contactLabel}>{t('报名渠道', 'Application')}</span>
                <span className={styles.contactValue}>{t('校内社团招新通知与现场报名', 'School club notice and on-site application')}</span>
              </li>
              <li>
                <span className={styles.contactLabel}>{t('咨询方式', 'Questions')}</span>
                <span className={styles.contactValue}>{t('社团开放日或招新现场', 'Club open day or recruitment desk')}</span>
              </li>
            </ul>
            <p className={styles.note}>
              {t('报名之前，可以先读', 'Before applying, read ')}
              <Link to="/about">{t('关于步天', 'About Butian')}</Link>
              {t('并浏览', ' and browse the ')}
              <Link to="/projects">{t('项目档案', 'project archive')}</Link>
              {t('，了解社团的工作方式。', ' to understand how the club works.')}
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}

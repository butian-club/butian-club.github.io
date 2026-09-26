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
    zh: ['从兴趣出发', '历史活动里，有天文周、纸飞机比赛，也有社团文化节；用一个具体问题开始探索。'],
    en: ['Start with curiosity', 'Past club activities included Astronomy Week, paper-plane contests and the school club festival. Begin with a question you want to explore.'],
  },
  {
    zh: ['完成试手任务', '在前辈指导下学习工具、查资料、拆解需求，逐步做出第一份可以讨论的成果。'],
    en: ['Try a practice brief', 'Learn tools with older members, research the problem and turn requirements into a first piece of work others can discuss.'],
  },
  {
    zh: ['一起打磨提案', '项目成员分工研究与设计，反复修改资格轮方案，练习向伙伴解释自己的决定。'],
    en: ['Build the proposal together', 'Project members divide research and design work, revise qualifying proposals and learn to explain decisions to teammates.'],
  },
  {
    zh: ['答辩与复盘', '参赛队伍在现场与其他学校的同学合作，在限时挑战后复盘，把经验传给下一届。'],
    en: ['Defend and reflect', 'Competition teams work with students from other schools, then review the timed challenge and pass the lessons to the next cohort.'],
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
          src: '/img/archive/recruitment-2024/club-presentation.webp',
          alt: t('步天工程社历史活动中，同学向大家介绍工程内容', 'A student presenting Butian club work during a past event'),
          caption: t('步天工程社 · 2024 年历史影像', 'Butian Engineering Club · 2024 archive'),
        }}
      />
      <main className={styles.page}>
        <div className={`${styles.container} ${styles.narrow}`}>
          <section className={styles.clubLife} aria-labelledby="club-life">
            <div className={styles.clubLifeCopy}>
              <p className={styles.blockEyebrow}>Beyond the Competition</p>
              <h2 id="club-life" className={styles.blockTitle}>{t('步天不只在赛场。', 'The club lives beyond the final.')}</h2>
              <p>{t(
                '2024 年的社团招新记录里，天文周、纸飞机比赛和社团文化节与太空城市设计并列出现。好奇心可以从一架纸飞机开始，也可以从一张工程图纸开始。',
                'A 2024 recruitment feature describes Astronomy Week, paper-plane contests and the school club festival alongside space-settlement design. Curiosity can begin with a paper plane or an engineering drawing.',
              )}</p>
              <p>{t(
                '这些是历史活动记录，并非本学年的固定日程。每一届的具体项目与开放活动，以当年社团和学校安排为准。',
                'These are historical activities, not a schedule for the current school year. This year’s projects and open events follow the club and school announcements.',
              )}</p>
              <a href="https://mp.weixin.qq.com/s/Ktevde92c1EGj_Av6ZcjYQ" target="_blank" rel="noopener noreferrer">{t('阅读 2024 年社团招新记录 ↗', 'Read the 2024 recruitment feature ↗')}</a>
              <p className={styles.clubLifeSource}>{t('校园社团招新现场的另一篇报道也记录了步天的展位。', 'A separate school report also records Butian at a club recruitment fair.')} <a href="https://mp.weixin.qq.com/s/snHvNkcu2KYEdeh_2sA4Vg" target="_blank" rel="noopener noreferrer">{t('查看报道 ↗', 'View the report ↗')}</a></p>
            </div>
            <figure className={styles.clubLifeImage}>
              <img src="/img/archive/recruitment-2024/paper-plane-activity.webp" alt={t('社团历史活动中的纸飞机比赛现场', 'Paper-plane activity from the club archive')} loading="lazy" />
              <figcaption>{t('社团活动影像 / 2024', 'CLUB ACTIVITY / 2024')}</figcaption>
            </figure>
          </section>
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
                  '历届项目成员会按分工参与任务书拆解、资料检索、方案评审、提案制作和模拟答辩。实际参与方式以当年项目安排为准。',
                  'In past projects, members have divided work across brief analysis, research, design reviews, proposal production and mock defenses. Participation depends on this year’s projects.',
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
            <p className={styles.blockEyebrow}>The Project Journey</p>
            <h2 id="process" className={styles.blockTitle}>{t('从兴趣，到一份经得起推敲的方案', 'From curiosity to a defensible proposal')}</h2>
            <p className={styles.lead}>{t('以下是历届社团项目中的典型路径，具体安排会随年份和项目变化。', 'This is a path seen across past club projects. Specific activities vary by year and project.')}</p>
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
                <span className={styles.contactValue}>{t('以当年校内通知为准', 'See the current school notice')}</span>
              </li>
              <li>
                <span className={styles.contactLabel}>{t('咨询方式', 'Questions')}</span>
                <span className={styles.contactValue}>{t('以当年校内通知为准', 'See the current school notice')}</span>
              </li>
            </ul>
            <p className={styles.note}>
              {t('报名之前，可以先读', 'Before applying, read ')}
              <Link to="/#club-profile">{t('首页的社团介绍', 'the club story on our homepage')}</Link>
              {t('并浏览', ' and browse the ')}
              <Link to="/blog">{t('活动记录', 'activity log')}</Link>
              {t('，了解社团的工作方式。', ' to understand how the club works.')}
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}

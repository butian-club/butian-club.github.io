import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import PageHero from '@site/src/components/PageHero';
import {useT} from '@site/src/lib/i18n';
import styles from './page.module.css';

const culture = [
  {
    zh: ['把问题查清楚', '方案不能凭空想象。从文献检索到科学依据——食物、生命保障、低重力环境——我们尊重事实和数据，而不是声音大小。'],
    en: ['Get to the bottom of it', 'A design can’t be hand-waved. From literature research to scientific grounding — food, life support, low gravity — we respect facts and data over the loudest voice.'],
  },
  {
    zh: ['在真实约束下做设计', '一座太空城要同时回答结构、人居、运营与商业的问题。我们习惯在限定条件和有限时间里，把构想逼成可验证的方案。'],
    en: ['Design under real constraints', 'A space city must answer structure, habitat, operations and business at once. We’re used to forcing an idea into a verifiable proposal within fixed limits and tight time.'],
  },
  {
    zh: ['互相补位', '没有人样样都会。结构、人居、运营、基础设施各有所长，还常常要和来自其他学校的同学临时组队——一个方案需要大家拼起来。'],
    en: ['Cover for each other', 'No one is good at everything. Structure, habitat, operations and infrastructure each have their experts — and we often team up on the spot with students from other schools. A proposal takes all of us.'],
  },
];

const structure = [
  {
    zh: ['所属平台', '步天工程社是杭州第二中学求是创新学院下的学生社团。求是创新学院 2017 年挂牌，整合自创新实验室，被校方称为「二中学生的工程院」。'],
    en: ['Home platform', 'Butian belongs to the Qiushi Innovation Academy at Hangzhou No.2 High School. Launched in 2017 and grown from the Innovation Lab, the academy is called the school’s “college of engineering for students”.'],
  },
  {
    zh: ['部门分工', '在太空城市/基地设计赛事中，我们以虚拟航天公司的方式组织，围绕管理、结构、人居、运营、基础设施五个部门展开协作。'],
    en: ['Department structure', 'For space settlement design competitions we organize as a virtual aerospace company, collaborating across five departments: management, structure, habitat, operations and infrastructure.'],
  },
  {
    zh: ['代表队', '以赛事为单位组建代表队，例如 2024 年 GFSSM 中国站的玉衡队与天权队，两队均晋级全国决赛。'],
    en: ['Competition teams', 'Teams are formed per competition — for example Team Yuheng and Team Tianquan at the 2024 GFSSM China round, both of which advanced to the national final.'],
  },
];

const lineage = [
  {
    zh: ['2016 · 航天工程传统起点', '杭州第二中学代表队首次出征国际太空城市设计大赛（ISSDC），25 小时内完成水星熔岩管 250 人采矿基地设计，获中国区决赛冠军。'],
    en: ['2016 · Where the tradition begins', 'The Hangzhou No.2 High School team made its ISSDC debut, designing a 250-person mining base inside a Mercury lava tube in 25 hours and winning the China finals.'],
  },
  {
    zh: ['2017 · 求是创新学院挂牌', '学校正式成立求是创新学院，把创新实验室与高端创新赛事纳入系统平台，为创新社团提供制度土壤。'],
    en: ['2017 · Qiushi Innovation Academy', 'The school established the Qiushi Innovation Academy, bringing the Innovation Lab and top-tier competitions into a systematic platform — fertile ground for innovation clubs.'],
  },
  {
    zh: ['2023 · 走向科普与公益', '步天工程社联合 IF 商社、校志愿者队前往磐安结对交流，把航天科普带给乡镇小学的孩子。'],
    en: ['2023 · Toward outreach', 'Butian joined the IF Business Club and the school volunteer team in a paired exchange in Pan’an, bringing space science to children at a rural primary school.'],
  },
  {
    zh: ['2024 · GFSSM 中国站全国亚军', '玉衡、天权两支代表队围绕金星轨道太空城设计，晋级全国决赛，两队所在公司均获全国亚军，并收获多项团队与个人荣誉。'],
    en: ['2024 · GFSSM China runner-up', 'Teams Yuheng and Tianquan designed a Venus-orbit space city, advanced to the national final, took national runner-up with their companies, and earned several team and individual honors.'],
  },
];

const fit = [
  ['对工程或航天有持续的好奇心，愿意花时间把一件事做完。', 'A lasting curiosity about engineering or space, and the patience to see something through.'],
  ['不害怕动手查资料、读超出课本的文献，再回到方案上讨论。', 'Not afraid to dig up references and read beyond the textbook, then bring it back to the design.'],
  ['愿意把过程和结果记录、可视化，并用中文乃至英文清楚地讲出来。', 'Willing to document and visualize the process and result, and present it clearly — in Chinese and even English.'],
  ['能和不同方向、甚至不同学校的同学合作，对团队和方案负责。', 'Able to work with students from other directions — even other schools — and take responsibility for the team and the proposal.'],
];

export default function About(): ReactNode {
  const t = useT();
  return (
    <Layout
      title={t('关于我们', 'About Us')}
      description={t(
        '步天工程社的使命、愿景、文化、组织结构、沿革，以及适合加入的人。',
        'Butian Engineering Club: mission, vision, culture, structure, lineage, and who fits in.',
      )}>
      <PageHero
        eyebrow="About"
        title={t('关于步天工程社', 'About Butian')}
        subtitle={t(
          '我们是浙江省杭州第二中学求是创新学院下的学生社团，以太空城市与基地设计为主线，关注的是「怎么把它做出来」。',
          'A student club under the Qiushi Innovation Academy at Hangzhou No.2 High School of Zhejiang Province — centered on space settlement design, focused on how it actually gets built.',
        )}
      />
      <main className={styles.page}>
        <div className={`${styles.container} ${styles.narrow}`}>
          <section className={styles.block} aria-labelledby="mission">
            <p className={styles.blockEyebrow}>Mission</p>
            <h2 id="mission" className={styles.blockTitle}>{t('社团使命', 'Mission')}</h2>
            <p className={styles.lead}>
              {t(
                '让对工程与航天感兴趣的同学，把一座太空城、一个系统方案，从想法一直做到可被验证、可被答辩的结果。',
                'To let students who love engineering and space take a space city — a whole systems proposal — from an idea to a result that can be verified and defended.',
              )}
            </p>
            <div className={styles.prose}>
              <p>
                {t(
                  '我们关注航天，但更在意「怎么做出来」。一个想法要经过结构、人居、运营与商业的反复推敲，经得起 24 小时极限设计和全英文答辩的检验，才算真正被理解。步天工程社存在的意义，是为同学提供一个可以认真做工程的环境：有真实的赛题，有可以请教的人，也有把经验沉淀下来的地方。',
                  'We care about space, but more about how it gets built. An idea must be reworked through structure, habitat, operations and business, and survive a 24-hour sprint and an all-English defense, before it is truly understood. Butian exists to give students a place to do engineering for real: real briefs, people to ask, and somewhere to let experience accumulate.',
                )}
              </p>
            </div>
          </section>

          <section className={styles.block} aria-labelledby="vision">
            <p className={styles.blockEyebrow}>Vision</p>
            <h2 id="vision" className={styles.blockTitle}>{t('社团愿景', 'Vision')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '我们希望步天工程社能成为一个可以长期积累的地方——项目和经验可以一届一届接着做，文档、复盘与方案能传给后来的人，每个认真参与过的成员，都能带走一段真实的工程经历。',
                  'We want Butian to be a place that accumulates over time — where projects and experience pass from one cohort to the next, where documents, retrospectives and proposals reach those who come after, and where everyone who took part seriously leaves with a real engineering experience.',
                )}
              </p>
              <p>
                {t(
                  '我们不追求一时的声势，而是看重能被复现的方法和能被延续的记录。',
                  'We don’t chase momentary noise; we value methods that can be reproduced and records that can be continued.',
                )}
              </p>
            </div>
          </section>

          <section className={styles.block} aria-labelledby="culture">
            <p className={styles.blockEyebrow}>Culture</p>
            <h2 id="culture" className={styles.blockTitle}>{t('社团文化', 'Culture')}</h2>
            <div className={styles.cardRow}>
              {culture.map((c) => (
                <article key={c.zh[0]} className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>{t(c.zh[0], c.en[0])}</h3>
                  <p className={styles.infoCardText}>{t(c.zh[1], c.en[1])}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.block} aria-labelledby="structure">
            <p className={styles.blockEyebrow}>Structure</p>
            <h2 id="structure" className={styles.blockTitle}>{t('组织结构', 'Structure')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '社团依托求是创新学院运转，以赛事代表队为单位组织，按虚拟航天公司的部门分工协作。',
                  'The club runs under the Qiushi Innovation Academy, organized by competition teams and collaborating along the departments of a virtual aerospace company.',
                )}
              </p>
            </div>
            <div className={styles.cardRow}>
              {structure.map((s) => (
                <article key={s.zh[0]} className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>{t(s.zh[0], s.en[0])}</h3>
                  <p className={styles.infoCardText}>{t(s.zh[1], s.en[1])}</p>
                </article>
              ))}
            </div>
            <p className={styles.note}>
              <strong>TODO：</strong>
              {t(
                '社团正式成立时间、首任与历任社长、现任指导教师完整名单等待社团确认后补充。2024 年 GFSSM 代表队指导老师为朱毛奇、邵温馨。',
                'The club’s founding date, founding and past presidents, and the full roster of current advisors await confirmation. The 2024 GFSSM teams were advised by Zhu Maoqi and Shao Wenxin.',
              )}
            </p>
          </section>

          <section className={styles.block} aria-labelledby="lineage">
            <p className={styles.blockEyebrow}>Lineage</p>
            <h2 id="lineage" className={styles.blockTitle}>{t('社团沿革', 'Lineage')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '公开资料勾勒出一条较清晰的脉络。其中 2016–2017 年的太空城市设计成绩，是步天工程社可追溯的航天工程传统；社团以「步天工程社」名义见于公开报道，则从 2023 年起逐渐清晰。',
                  'Public records sketch a fairly clear thread. The 2016–2017 space settlement results form Butian’s traceable aerospace tradition; the club appearing by the name “Butian” in public reporting becomes clear from 2023 onward.',
                )}
              </p>
            </div>
            <ol className={styles.steps}>
              {lineage.map((s) => (
                <li key={s.zh[0]}>
                  <p className={styles.stepTitle}>{t(s.zh[0], s.en[0])}</p>
                  <p className={styles.stepText}>{t(s.zh[1], s.en[1])}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.block} aria-labelledby="fit">
            <p className={styles.blockEyebrow}>Who Fits</p>
            <h2 id="fit" className={styles.blockTitle}>{t('适合加入的人', 'Who Fits')}</h2>
            <div className={styles.prose}>
              <p>
                {t(
                  '我们不设硬性门槛，更看重态度而非起点。如果下面几条里你认同大多数，这里大概率适合你：',
                  'We set no hard bar and value attitude over starting point. If you agree with most of the below, this is probably the place for you:',
                )}
              </p>
            </div>
            <ul className={styles.checkList}>
              {fit.map((item) => (
                <li key={item[0]}>{t(item[0], item[1])}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}

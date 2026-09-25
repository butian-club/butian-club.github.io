import React, {type ReactNode, useRef} from 'react';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useT} from '@site/src/lib/i18n';
import styles from './styles.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const departments = [
  ['管理', 'Management'],
  ['结构', 'Structure'],
  ['人居', 'Habitat'],
  ['运营', 'Operations'],
  ['基础设施', 'Infrastructure'],
];

const lineage = [
  {
    year: '2017',
    zh: ['求是创新学院挂牌', '学校正式成立求是创新学院，把创新实验室与高端创新赛事纳入系统平台，为创新社团提供制度土壤。'],
    en: ['Qiushi Innovation Academy', 'The school established the Qiushi Innovation Academy, bringing the Innovation Lab and top-tier competitions into a systematic platform — fertile ground for innovation clubs.'],
  },
  {
    year: '2020',
    zh: ['初登未来太空学者大会', '据公开报道，杭州第二中学学子在 2020 年未来太空学者大会（FSSM）中获佳绩——这是目前可追溯的最早一届参赛记录；其后天玑队等持续征战。'],
    en: ['First Space Scholars Meet', 'Per public reporting, Hangzhou No.2 High School students did well at the 2020 Future Space Scholars Meet — the earliest appearance we can trace; Team Tianji and others competed in the years after.'],
  },
  {
    year: '2023',
    zh: ['GFSSM 全国冠军，并走向科普', '8 月，天权、天璇两队设计月球基地，天权队所在公司夺得全国冠军、天璇队所在公司获亚军，并分获最佳结构设计、最佳人居设计；6 月，社团还联合 IF 商社、校志愿者队前往磐安开展航天科普公益。'],
    en: ['GFSSM champion, and outreach', 'In August, Teams Tianquan and Tianxuan designed a lunar base — Tianquan’s company won the national championship and Tianxuan’s took 2nd, also earning Best Structural and Best Habitat Design; in June, the club ran a space-science outreach program in Pan’an.'],
  },
  {
    year: '2024',
    zh: ['GFSSM 中国站全国亚军', '玉衡、天权两支代表队围绕金星轨道太空城设计，晋级全国决赛，两队所在公司均获全国亚军，并收获多项团队与个人荣誉。'],
    en: ['GFSSM China runner-up', 'Teams Yuheng and Tianquan designed a Venus-orbit space city, advanced to the national final, took national runner-up with their companies, and earned several team and individual honors.'],
  },
  {
    year: '2025',
    zh: ['火星基地双双登台', '天枢、天权两队晋级全国决赛；天枢队所在公司「轨道工业」获亚军、天权队所在公司「金乌能源」获季军，天枢队另获资格轮全国最佳提案。'],
    en: ['Two podiums for a Mars base', 'Teams Tianshu and Tianquan reached the national final; Tianshu’s company “Orbital Industries” took 2nd and Tianquan’s “Jinwu Energy” took 3rd, with Tianshu also winning Best Qualifying Proposal.'],
  },
];

const fit = [
  ['对工程或航天有持续的好奇心，愿意花时间把一件事做完。', 'A lasting curiosity about engineering or space, and the patience to see something through.'],
  ['不害怕动手查资料、读超出课本的文献，再回到方案上讨论。', 'Not afraid to dig up references and read beyond the textbook, then bring it back to the design.'],
  ['愿意把过程和结果记录、可视化，并用中文乃至英文清楚地讲出来。', 'Willing to document and visualize the process and result, and present it clearly — in Chinese and even English.'],
  ['能和不同方向、甚至不同学校的同学合作，对团队和方案负责。', 'Able to work with students from other directions — even other schools — and take responsibility for the team and the proposal.'],
];

export default function ClubProfile(): ReactNode {
  const t = useT();
  useBrokenLinks().collectAnchor('club-profile');
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(root.querySelector('[data-profile-photo]'),
      {scale: 1.16, clipPath: 'circle(16% at 73% 48%)'},
      {scale: 1, clipPath: 'circle(115% at 73% 48%)', ease: 'none',
        scrollTrigger: {trigger: root.querySelector('[data-profile-intro]'), start: 'top bottom', end: 'bottom top', scrub: true}},
    );
    gsap.utils.toArray<HTMLElement>('[data-profile-reveal]', root).forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0, y: 44, duration: 1.05, ease: 'power3.out',
        scrollTrigger: {trigger: element, start: 'top 90%', once: true},
      });
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 761px)', () => {
      const workflow = root.querySelector<HTMLElement>('[data-profile-workflow]');
      const slides = gsap.utils.toArray<HTMLElement>('[data-workflow-slide]', workflow);
      const orbit = workflow?.querySelector<HTMLElement>('[data-workflow-orbit]');
      const line = workflow?.querySelector<HTMLElement>('[data-workflow-line]');
      if (workflow && slides.length === 3 && orbit && line) {
        gsap.set(slides, {autoAlpha: 0, y: 40});
        gsap.set(slides[0], {autoAlpha: 1, y: 0});
        gsap.set(line, {scaleX: 0});
        const timeline = gsap.timeline({scrollTrigger: {
          trigger: workflow, start: 'top top', end: 'bottom bottom', scrub: 0.55,
        }});
        timeline.to(orbit, {rotation: 55, duration: 3, ease: 'none'}, 0)
          .to(line, {scaleX: 1, duration: 3, ease: 'none'}, 0)
          .to(slides[0], {autoAlpha: 0, y: -42, duration: .3}, .73)
          .fromTo(slides[1], {autoAlpha: 0, y: 46}, {autoAlpha: 1, y: 0, duration: .35}, .9)
          .to(slides[1], {autoAlpha: 0, y: -42, duration: .3}, 1.72)
          .fromTo(slides[2], {autoAlpha: 0, y: 46}, {autoAlpha: 1, y: 0, duration: .35}, 1.9);
      }

      const history = root.querySelector<HTMLElement>('[data-profile-history]');
      const chapters = gsap.utils.toArray<HTMLElement>('[data-history-chapter]', history);
      const historyLine = history?.querySelector<HTMLElement>('[data-history-line]');
      if (history && chapters.length === lineage.length && historyLine) {
        gsap.set(chapters, {autoAlpha: 0, y: 38});
        gsap.set(chapters[0], {autoAlpha: 1, y: 0});
        gsap.set(historyLine, {scaleX: 0});
        const timeline = gsap.timeline({scrollTrigger: {
          trigger: history, start: 'top top', end: 'bottom bottom', scrub: 0.55,
        }});
        const driver = {value: 0};
        timeline.to(driver, {value: 1, duration: 5, ease: 'none'}, 0)
          .to(historyLine, {scaleX: 1, duration: 5, ease: 'none'}, 0);
        for (let index = 1; index < chapters.length; index += 1) {
          timeline.to(chapters[index - 1], {autoAlpha: 0, y: -38, duration: .28}, index - .23)
            .fromTo(chapters[index], {autoAlpha: 0, y: 44}, {autoAlpha: 1, y: 0, duration: .36}, index);
        }
      }
    });
    const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refresh);
      media.revert();
    };
  }, {scope: rootRef});

  return (
    <section id="club-profile" className={styles.profile} ref={rootRef} aria-labelledby="profile-heading">
      <div className={styles.intro} data-profile-intro>
        <div className={styles.introPhoto} data-profile-photo aria-hidden="true">
          <img src="/img/projects/2024-gfssm/work-02.jpg" alt="" loading="lazy" />
        </div>
        <div className={styles.introShade} />
        <div className={styles.introContent} data-profile-reveal>
          <p className={styles.kicker}>08 / THE PEOPLE BEHIND THE MISSION</p>
          <h2 id="profile-heading">{t('把好奇心，', 'Turn curiosity')}<br /><em>{t('变成一份方案。', 'into a proposal.')}</em></h2>
          <p className={styles.introLead}>{t(
            '步天工程社是杭州第二中学求是创新学院的学生社团，主要开展太空城市与基地设计、工程实践及航天科普。',
            'Butian is a student club at the Qiushi Innovation Academy of Hangzhou No.2 High School, focused on space-settlement design, engineering practice and space-science outreach.',
          )}</p>
          <p className={styles.introDetail}>{t(
            '社团以太空城市与基地设计项目组织成员学习。成员从赛事任务书出发，分工研究结构、人居、运营与基础设施，最后完成提案和英文答辩。社团提供资料检索、方案讨论、模拟答辩和项目复盘的场合，并将成熟的方法整理进知识库。',
            'The club organizes learning around space-settlement design projects. Members begin with competition briefs, research structure, habitat, operations and infrastructure in teams, then produce a proposal and defend it in English. The club provides a setting for research, design reviews, mock defenses and retrospectives, with established methods documented in the knowledge base.',
          )}</p>
        </div>
        <span className={styles.introStamp}>{t('真实影像 · 2024 GFSSM 中国站现场协作', 'ARCHIVE PHOTO · GFSSM CHINA 2024 WORKSHOP')}</span>
        <span className={styles.introGhost} aria-hidden="true">BUTIAN</span>
        <span className={styles.edgeNumber} aria-hidden="true">08 / 13</span>
      </div>

      <div className={styles.workflow} data-profile-workflow>
        <div className={styles.workflowStage}>
          <div className={styles.workflowGrid} aria-hidden="true" />
          <div className={styles.workflowHead}>
            <p className={styles.kicker}>09 / HOW WE BUILD</p>
            <p>{t('求是创新学院 · 赛事代表队 · 虚拟航天公司', 'QIUSHI ACADEMY · COMPETITION TEAMS · VIRTUAL AEROSPACE COMPANY')}</p>
          </div>
          <div className={styles.workflowSlides}>
            {culture.map((item, index) => (
              <article className={styles.workflowSlide} data-workflow-slide key={item.zh[0]}>
                <span className={styles.slideNumber}>0{index + 1}<small> / 03</small></span>
                <h2>{t(item.zh[0], item.en[0])}</h2>
                <p>{t(item.zh[1], item.en[1])}</p>
              </article>
            ))}
          </div>
          <div className={styles.workflowDiagram} aria-label={t('五个部门协作构成一份方案', 'Five departments working together on one proposal')}>
            <div className={styles.orbitRings} data-workflow-orbit aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.diagramCore}><span>BUTIAN</span><b>{t('共同方案', 'ONE PROPOSAL')}</b></div>
            {departments.map((department, index) => (
              <span className={`${styles.diagramNode} ${styles['node' + index]}`} key={department[0]}>
                <small>0{index + 1}</small>{t(department[0], department[1])}
              </span>
            ))}
          </div>
          <div className={styles.workflowFoot}>
            <span>{t('方法 / 协作 / 复盘', 'METHOD / COLLABORATION / REVIEW')}</span>
            <i><b data-workflow-line /></i>
            <span>01 — 03</span>
          </div>
        </div>
      </div>

      <div className={styles.structure}>
        <div className={styles.structureHead} data-profile-reveal>
          <p className={styles.kicker}>10 / THE OPERATING SYSTEM</p>
          <h2>{t('五个部门，', 'Five departments.')}<br /><em>{t('一份共同的方案。', 'One shared proposal.')}</em></h2>
          <p>{t(
            '社团依托求是创新学院运转，以赛事代表队为单位组织，按虚拟航天公司的部门分工协作。',
            'The club runs under the Qiushi Innovation Academy, organized by competition teams and collaborating along the departments of a virtual aerospace company.',
          )}</p>
        </div>
        <div className={styles.structureDetail}>
          {structure.map((item, index) => (
            <article key={item.zh[0]} data-profile-reveal>
              <span>0{index + 1} / SYSTEM</span>
              <h3>{t(item.zh[0], item.en[0])}</h3>
              <p>{t(item.zh[1], item.en[1])}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.knowledge}>
        <div className={styles.knowledgePhoto} aria-hidden="true"><img src="/img/projects/2024-gfssm/presentation-01.jpg" alt="" loading="lazy" /></div>
        <div className={styles.knowledgeShade} />
        <div className={styles.knowledgeContent} data-profile-reveal>
          <p className={styles.kicker}>11 / PASS IT FORWARD</p>
          <h2>{t('做过的事，', 'Pass the work')}<br /><em>{t('写下来。', 'forward.')}</em></h2>
          <p>{t(
            '项目结束后，成员会整理提案、分工记录和复盘。可公开的内容进入活动记录与知识库，供下一届成员继续查阅和修订。',
            'After each project, members organize proposals, working notes and retrospectives. Material suitable for publication enters the activity log and knowledge base for future members to consult and revise.',
          )}</p>
          <p>{t(
            '网站只收录已经核实并适合公开的资料；不完整的历史信息会注明来源与范围。',
            'The website only publishes material that has been checked and is suitable for public access; incomplete historical information is labeled with its source and scope.',
          )}</p>
          <div className={styles.knowledgeLinks}>
            <Link to="/blog">{t('阅读活动记录 ↗', 'Explore the activity log ↗')}</Link>
            <Link to="/docs/intro">{t('进入知识库 ↗', 'Open the knowledge base ↗')}</Link>
          </div>
        </div>
        <span className={styles.knowledgeStamp}>{t('现场答辩 / 2024 GFSSM 中国站', 'PRESENTATION / GFSSM CHINA 2024')}</span>
      </div>

      <div className={styles.history} data-profile-history>
        <div className={styles.historyStage}>
          <div className={styles.historyGrid} aria-hidden="true" />
          <div className={styles.historyOrbit} aria-hidden="true" />
          <div className={styles.historyHead}>
            <p className={styles.kicker}>12 / FLIGHT LINEAGE</p>
            <h2>{t('一段仍在延续的航迹。', 'A record still in motion.')}</h2>
            <p>{t(
              '公开资料勾勒出一条较清晰的脉络：从求是创新学院的制度土壤，到社团以「步天工程社」名义见于公开报道并在 2023 年后逐渐清晰。',
              'Public records sketch a fairly clear thread — from the founding of the Qiushi Innovation Academy to the club appearing by the name “Butian” in public reporting, clear from 2023 onward.',
            )}</p>
          </div>
          <div className={styles.historyChapters}>
            {lineage.map((item, index) => (
              <article className={styles.historyChapter} data-history-chapter key={item.year}>
                <span className={styles.historyYear}>{item.year}</span>
                <div className={styles.historyEntry}>
                  <small>0{index + 1} / {t('航迹档案', 'FLIGHT RECORD')}</small>
                  <h3>{t(item.zh[0], item.en[0])}</h3>
                  <p>{t(item.zh[1], item.en[1])}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.historyTrack}>
            <i><b data-history-line /></i>
            <div>{lineage.map((item) => <span key={item.year}>{item.year}</span>)}</div>
          </div>
        </div>
      </div>
      <p className={styles.archiveNote}>
        <strong>{t('档案说明：', 'Archive note:')}</strong>
        {t(
          '社团正式成立时间、首任社长与完整历任名单尚未获得可公开核对的资料。现有记录确认前社长钱焜曾任 2024 GFSSM 天权队队长；朱毛奇、邵温馨老师曾参与相关赛事指导。',
          'A publicly verifiable record of the club’s founding date, founding president and full list of past presidents is not yet available. Existing records confirm that former president Qian Kun captained Team Tianquan at the 2024 GFSSM, and that teachers Zhu Maoqi and Shao Wenxin advised related competition work.',
        )}
      </p>

      <div className={styles.fit}>
        <div className={styles.fitOrbit} aria-hidden="true" />
        <div className={styles.fitHeading} data-profile-reveal>
          <p className={styles.kicker}>13 / THE NEXT CREW</p>
          <h2>{t('从这里，', 'Could your next')}<br /><em>{t('一起出发。', 'chapter start here?')}</em></h2>
          <p>{t(
            '我们不设硬性门槛，更看重态度而非起点。如果下面几条里你认同大多数，这里大概率适合你：',
            'We set no hard bar and value attitude over starting point. If you agree with most of the below, this is probably the place for you:',
          )}</p>
        </div>
        <ol className={styles.fitList}>
          {fit.map((item, index) => (
            <li key={item[0]} data-profile-reveal><span>0{index + 1}</span><p>{t(item[0], item[1])}</p></li>
          ))}
        </ol>
        <Link className={styles.fitLink} to="/join" data-profile-reveal>{t('了解如何加入', 'How to join')} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}

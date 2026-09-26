import React, {type ReactNode, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import {useT} from '@site/src/lib/i18n';
import {projects} from '@site/src/data/projects';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import OrbitalScene from './OrbitalScene';
import styles from './styles.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stops = [
  {at: 0, zh: '离开地球', en: 'Departure'},
  {at: 17, zh: '接住问题', en: 'The brief'},
  {at: 28, zh: '协作设计', en: 'One team'},
  {at: 65, zh: '经得起推敲', en: 'Test the idea'},
  {at: 79, zh: '真实的同伴', en: 'The people'},
  {at: 87, zh: '做过的方案', en: 'Our work'},
  {at: 98, zh: '传给下一程', en: 'Pass it on'},
];

const milestones = ['gfssm-2023', 'gfssm-2024-venus', 'gfssm-2025-mars']
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

export default function CinematicHome(): ReactNode {
  const t = useT();
  useBrokenLinks().collectAnchor('club-profile');
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeStop, setActiveStop] = useState(0);

  useGSAP(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const select = (name: string) => stage.querySelector<HTMLElement>('[data-motion="' + name + '"]');
    const target = (name: string) => select(name)!;
    const driver = {p: 0};

    const timeline = gsap.timeline({
      defaults: {ease: 'none'},
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => '+=' + Math.round(window.innerHeight * 11),
        pin: stage,
        scrub: 0.65,
        anticipatePin: 1,
        refreshPriority: 10,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const value = self.progress * 100;
          const index = stops.reduce((current, stop, position) => value >= stop.at ? position : current, 0);
          setActiveStop((previous) => previous === index ? previous : index);
          stage.style.setProperty('--journey-progress', String(self.progress));
        },
      },
    });

    timeline.to(driver, {
      p: 1,
      duration: 100,
      onUpdate: () => { progressRef.current = driver.p; },
    }, 0);

    timeline
      .fromTo(target('orbital'), {autoAlpha: 1, clipPath: 'circle(0% at 69% 50%)'}, {
        autoAlpha: 1, clipPath: 'circle(100% at 69% 50%)', duration: 10,
      }, 13)
      .to(target('backdrop'), {scale: 1.1, autoAlpha: 0, duration: 2}, 22)
      .to(target('hero'), {autoAlpha: 0, y: -85, scale: 0.92, duration: 7}, 7)
      .fromTo(target('brief'), {autoAlpha: 0, x: 72}, {autoAlpha: 1, x: 0, duration: 5}, 15)
      .fromTo(target('wordmark'), {autoAlpha: 0, scale: 1.4, x: 80}, {autoAlpha: 0.75, scale: 1, x: 0, duration: 8}, 13)
      .to(target('brief'), {autoAlpha: 0, x: -36, duration: 3}, 22)
      .to(target('wordmark'), {autoAlpha: 0, scale: 0.75, duration: 6}, 22)
      .fromTo(target('assembly'), {autoAlpha: 0, y: 34}, {autoAlpha: 1, y: 0, duration: 5}, 25)
      .fromTo(target('system-grid'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 27)
      .fromTo(target('scan-line'), {x: 0}, {x: () => window.innerWidth * 0.8, duration: 18}, 28)
      .to(target('system-grid'), {autoAlpha: 0, duration: 4}, 47)
      .fromTo(target('callout-1'), {autoAlpha: 0, x: -40}, {autoAlpha: 1, x: 0, duration: 4}, 30)
      .to(target('callout-1'), {autoAlpha: 0, x: -35, duration: 4}, 37)
      .fromTo(target('callout-2'), {autoAlpha: 0, x: 40}, {autoAlpha: 1, x: 0, duration: 4}, 36)
      .to(target('callout-2'), {autoAlpha: 0, x: 35, duration: 4}, 43)
      .fromTo(target('callout-3'), {autoAlpha: 0, y: 28}, {autoAlpha: 1, y: 0, duration: 4}, 43)
      .to(target('assembly'), {autoAlpha: 0, y: -38, duration: 5}, 49)
      .to(target('callout-3'), {autoAlpha: 0, y: -28, duration: 4}, 49)
      .fromTo(target('portal'), {autoAlpha: 1, '--portal-radius': '0%'}, {
        autoAlpha: 1, '--portal-radius': '145%', duration: 18,
      }, 52)
      .fromTo(target('portal-image'), {scale: 1.45}, {scale: 1.05, duration: 20}, 52)
      .fromTo(target('habitat-caption'), {autoAlpha: 0, y: 50}, {autoAlpha: 1, y: 0, duration: 5}, 63)
      .to(target('habitat-caption'), {autoAlpha: 0, y: -32, duration: 4}, 72)
      .fromTo(target('reality'), {autoAlpha: 1, clipPath: 'circle(0% at 51% 50%)'}, {
        autoAlpha: 1, clipPath: 'circle(100% at 51% 50%)', duration: 10,
      }, 72)
      .fromTo(target('reality-image'), {scale: 1.28}, {scale: 1, duration: 20}, 72)
      .fromTo(target('reality-frame'), {autoAlpha: 0, x: 80, scale: 0.9}, {
        autoAlpha: 1, x: 0, scale: 1, duration: 9,
      }, 74)
      .to(target('reality-frame'), {x: -24, y: -14, duration: 8}, 82)
      .to(target('portal'), {autoAlpha: 0, duration: 1}, 81)
      .fromTo(target('team-caption'), {autoAlpha: 0, y: 35}, {autoAlpha: 1, y: 0, duration: 5}, 78)
      .to(target('team-caption'), {autoAlpha: 0, y: -25, duration: 4}, 84)
      .fromTo(target('record'), {autoAlpha: 0}, {autoAlpha: 1, duration: 5}, 84)
      .to(target('reality'), {autoAlpha: 0, duration: 4}, 84)
      .fromTo(target('archive-visual'), {autoAlpha: 0, scale: 1.08, x: 80}, {
        autoAlpha: 1, scale: 1, x: 0, duration: 2,
      }, 85)
      .to(target('archive-visual'), {x: -18, y: -9, rotation: -1.5, duration: 2}, 88.5)
      .to(target('archive-visual'), {x: 12, y: 8, rotation: 1.2, duration: 2}, 91.5)
      .fromTo(target('archive-photo-0'), {xPercent: -9, yPercent: 8}, {
        xPercent: 0, yPercent: 0, duration: 10,
      }, 84)
      .fromTo(target('archive-photo-1'), {xPercent: 12, yPercent: -8}, {
        xPercent: 0, yPercent: 0, duration: 10,
      }, 84)
      .fromTo(target('archive-photo-2'), {xPercent: 9, yPercent: 12}, {
        xPercent: 0, yPercent: 0, duration: 10,
      }, 84)
      .fromTo(target('record-0'), {autoAlpha: 0, x: 80}, {autoAlpha: 1, x: 0, duration: 2}, 85)
      .to(target('record-0'), {autoAlpha: 0, x: -70, duration: 1}, 87.5)
      .fromTo(target('record-1'), {autoAlpha: 0, x: 80}, {autoAlpha: 1, x: 0, duration: 1.5}, 88.5)
      .to(target('record-1'), {autoAlpha: 0, x: -70, duration: 1}, 90.5)
      .to(target('archive-visual'), {autoAlpha: 0, x: -55, duration: 2}, 94)
      .fromTo(target('record-2'), {autoAlpha: 0, x: 80}, {autoAlpha: 1, x: 0, duration: 1.5}, 91.5)
      .to(target('record'), {autoAlpha: 0, duration: 2}, 94)
      .fromTo(target('end'), {autoAlpha: 0, y: 70, scale: 0.92}, {
        autoAlpha: 1, y: 0, scale: 1, duration: 4,
      }, 96);
  }, {scope: rootRef});

  return (
    <Layout
      title={t('首页', 'Home')}
      description={t(
        '杭州第二中学步天工程社：以工程设计、协作和表达，探索人类在地外的未来。',
        'Butian Engineering Club at Hangzhou No.2 High School: exploring an off-world future through engineering, collaboration and communication.',
      )}>
      <main id="cinematic-home" className={styles.home}>
        <section id="club-profile" className={styles.journey} ref={rootRef} aria-label={t('步天工程社的航程', 'The Butian journey')}>
          <div className={styles.stage} ref={stageRef}>
            <div className={styles.spaceBackdrop} data-motion="backdrop" aria-hidden="true" />
            <div className={styles.orbitalShell} data-motion="orbital">
              <OrbitalScene className={styles.orbitalScene} progressRef={progressRef} />
            </div>
            <div className={styles.spaceVeil} aria-hidden="true" />
            <div className={styles.reticle} aria-hidden="true"><span /><span /><span /><span /></div>
            <div className={styles.orbitLine} aria-hidden="true" />
            <div className={styles.systemGrid} data-motion="system-grid" aria-hidden="true">
              <span className={styles.scanLine} data-motion="scan-line" />
            </div>

            <div className={styles.hud} aria-hidden="true">
              <div className={styles.hudBrand}><span className={styles.hudDiamond} /> BUTIAN ENGINEERING CLUB</div>
              <div className={styles.hudCoordinates}>30°16′ N &nbsp; 120°11′ E <span>→</span> MARS</div>
              <div className={styles.hudBottom}>
                <span>HANGZHOU NO.2 HIGH SCHOOL</span>
                <span>MISSION LOG / 001—007</span>
              </div>
            </div>

            <div className={styles.heroCopy} data-motion="hero">
              <p className={styles.eyebrow}>{t('杭州第二中学 · 求是创新学院 · 步天工程社', 'HANGZHOU NO.2 HIGH SCHOOL · QIUSHI INNOVATION ACADEMY')}</p>
              <h1>{t('把未来，', 'Build the future')}<br /><em>{t('建在星辰之间。', 'beyond Earth.')}</em></h1>
              <p className={styles.heroLead}>{t(
                '我们是杭州第二中学求是创新学院的学生社团。以太空城市与基地设计为主线，把航天兴趣变成有依据的工程方案。',
                'We are a student club at Hangzhou No.2 High School’s Qiushi Innovation Academy. Space-settlement design turns our interest in space into evidence-based engineering proposals.',
              )}</p>
              <div className={styles.scrollCue}>
                <span className={styles.scrollGlyph} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M12 4v15m-5-5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t('向下滚动，开启航程', 'SCROLL TO BEGIN THE JOURNEY')}
              </div>
            </div>

            <div className={styles.briefCopy} data-motion="brief">
              <div className={styles.signal}><span /> {t('步天工程社 · 从哪里开始', 'BUTIAN · WHERE WE BEGIN')}</div>
              <p className={styles.phaseIndex}>02 / FROM BRIEF TO PROPOSAL</p>
              <h2>{t('先接住问题，', 'First, understand')}<br />{t('再提出未来。', 'the challenge.')}</h2>
              <p>{t(
                '从赛事任务书出发，拆解需求、查找证据、分工设计，最后以一份提案和英文答辩回应约束。',
                'We begin with a competition brief: break down requirements, find evidence, design together, then respond with a proposal and an English defense.',
              )}</p>
            </div>
            <div className={styles.wordmarkGhost} data-motion="wordmark" aria-hidden="true">{t('步天', 'BUTIAN')}</div>

            <div className={styles.assemblyCopy} data-motion="assembly">
              <span className={styles.phaseIndex}>03 / SYSTEMS THINKING</span>
              <h2>{t('五种专长，', 'Five disciplines.')}<br /><em>{t('同一座城市。', 'One shared city.')}</em></h2>
              <p>{t(
                '像一家虚拟航天公司：管理、结构、人居、运营和基础设施各有分工；方案必须在彼此的约束中成立。',
                'Organized like a virtual aerospace company, we connect management, structure, habitat, operations and infrastructure. Every decision has to work with the others.',
              )}</p>
              <small className={styles.conceptNote}>{t('概念视觉 · 非实际方案模型', 'CONCEPT VISUAL · NOT A PROJECT MODEL')}</small>
            </div>
            <div className={styles.calloutLeft} data-motion="callout-1">
              <span className={styles.calloutNumber}>01 / 03</span>
              <b>{t('把问题查清楚', 'RESEARCH FIRST')}</b>
              <small>{t('文献 · 数据 · 依据', 'EVIDENCE · DATA · REASONING')}</small>
            </div>
            <div className={styles.calloutRight} data-motion="callout-2">
              <span className={styles.calloutNumber}>02 / 03</span>
              <b>{t('在约束中设计', 'DESIGN WITH CONSTRAINTS')}</b>
              <small>{t('结构 · 人居 · 运营', 'STRUCTURE · HABITAT · OPERATIONS')}</small>
            </div>
            <div className={styles.calloutBottom} data-motion="callout-3">
              <span className={styles.calloutNumber}>03 / 03</span>
              <b>{t('互相补位，完成答辩', 'DEFEND IT TOGETHER')}</b>
              <small>{t('协作 · 表达 · 复盘', 'TEAMWORK · DEFENSE · REVIEW')}</small>
            </div>

            <div className={styles.portal} data-motion="portal" aria-hidden="true">
              <div className={styles.portalImage} data-motion="portal-image" />
              <div className={styles.portalTint} />
              <div className={styles.portalFrame} />
            </div>
            <div className={styles.habitatCaption} data-motion="habitat-caption">
              <img className={styles.stillImage} src="/img/life-support-concept.jpg" alt={t('地外生命保障空间概念视觉', 'Concept visual of an off-world life-support habitat')} />
              <span className={styles.phaseIndex}>04 / INSIDE THE HABITAT</span>
              <h2>{t('想象必须，', 'Imagination needs')}<br />{t('经得起推敲。', 'to stand up to scrutiny.')}</h2>
              <p>{t(
                '空气、食物、循环与低重力环境，最终都要成为能计算、能讨论、能验证的设计条件。',
                'Air, food, life-support cycles and low gravity become design conditions we can calculate, debate and test.',
              )}</p>
              <small>{t('概念视觉 · 非实际社团项目渲染', 'CONCEPT VISUAL · NOT A PROJECT RENDER')}</small>
            </div>

            <div className={styles.reality} data-motion="reality" aria-hidden="true">
              <div className={styles.realityImage} data-motion="reality-image" />
              <div className={styles.realityTint} />
              <div className={styles.realityFrame} data-motion="reality-frame">
                <img src="/img/projects/2024-gfssm/team.jpg" alt="" />
              </div>
            </div>
            <div className={styles.teamCaption} data-motion="team-caption">
              <img className={styles.stillImage} src="/img/projects/2024-gfssm/team.jpg" alt={t('2024 GFSSM 中国站合影', 'Team at GFSSM China 2024')} />
              <span className={styles.phaseIndex}>05 / BACK ON EARTH</span>
              <h2>{t('图纸背后，', 'Behind the drawings')}<br />{t('是并肩的人。', 'are people together.')}</h2>
              <p>{t(
                '2024 年的现场 24 小时挑战里，代表队边讨论边修改方案。不同方向的同伴，正是在这里互相补位。',
                'In the 2024 on-site 24-hour challenge, our teams debated and revised as they worked. Different strengths became one proposal.',
              )}</p>
              <small>{t('真实影像 · 2024 GFSSM 中国站', 'ARCHIVE PHOTO · GFSSM CHINA 2024')}</small>
            </div>

            <div className={styles.record} data-motion="record">
              <p className={styles.recordEyebrow}>06 / FLIGHT RECORD</p>
              <div className={styles.archiveVisual} data-motion="archive-visual" aria-hidden="true">
                <div className={styles.archivePhoto} data-motion="archive-photo-0">
                  <img src="/img/projects/2024-gfssm/work-02.jpg" alt="" />
                </div>
                <div className={styles.archivePhoto} data-motion="archive-photo-1">
                  <img src="/img/projects/2024-gfssm/presentation-01.jpg" alt="" />
                </div>
                <div className={styles.archivePhoto} data-motion="archive-photo-2">
                  <img src="/img/projects/2024-gfssm/team.jpg" alt="" />
                </div>
                <span>{t('影像档案 / 2024 GFSSM 中国站', 'PHOTO ARCHIVE / GFSSM CHINA 2024')}</span>
              </div>
              {milestones.map((project, index) => (
                <div className={styles.recordEntry} data-motion={'record-' + index} key={project.id}>
                  <span>{2023 + index}</span>
                  <h2>{t(project.titleZh, project.titleEn)}</h2>
                  <p>{t(project.homeSummaryZh ?? project.summaryZh, project.homeSummaryEn ?? project.summaryEn)}</p>
                  {project.detailUrl && <Link to={project.detailUrl}>{t('查看这段航程 ↗', 'Explore this mission ↗')}</Link>}
                </div>
              ))}
              <div className={styles.recordTicks} aria-hidden="true"><i /><i /><i /></div>
            </div>

            <div className={styles.endCopy} data-motion="end">
              <p className={styles.phaseIndex}>07 / PASS IT FORWARD</p>
              <h2>{t('把做过的事，', 'Pass what we learn')}<br /><em>{t('交给下一程。', 'to the next crew.')}</em></h2>
              <p>{t(
                '提案与复盘写进知识库，航天科普也走出赛场。下一次出发，欢迎愿意查证、动手、协作并把想法讲清楚的你。',
                'Proposals and lessons enter our knowledge base; space-science outreach carries the work beyond competitions. If you are ready to research, build, collaborate and explain, join the next crew.',
              )}</p>
              <div className={styles.endActions}>
                <Link className={styles.primaryLink} to="/join">{t('了解如何加入', 'How to join')} <span>↗</span></Link>
                <Link className={styles.secondaryLink} to="/docs/intro">{t('打开知识库', 'Open the knowledge base')} <span>↗</span></Link>
              </div>
            </div>

            <div className={styles.progressRail} aria-label={t('航程进度', 'Journey progress')}>
              <span className={styles.progressLabel}>00{activeStop + 1} / 007</span>
              <div className={styles.progressTrack}><i /></div>
              <span className={styles.progressName}>{t(stops[activeStop].zh, stops[activeStop].en)}</span>
            </div>
          </div>
        </section>
        <div className={styles.afterword}>
          <span>END OF TRANSMISSION · BUTIAN ENGINEERING CLUB</span>
          <Link to="/blog">{t('阅读活动记录 ↗', 'EXPLORE THE ACTIVITY LOG ↗')}</Link>
        </div>
      </main>
    </Layout>
  );
}

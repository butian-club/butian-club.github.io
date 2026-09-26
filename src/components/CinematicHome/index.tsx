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

// One story unit has the same scroll distance throughout the pinned journey.
// The archive and final invitation need enough distance to read while scrolling continuously.
const launchDuration = 22;
const spaceDuration = 137;
const journeyDuration = launchDuration + spaceDuration;
const journeyScreens = 19.9;

const stops = [
  {at: 0, zh: '杭州二中', en: 'Hangzhou No.2 High School'},
  {at: 8, zh: '穿越云层', en: 'Through the clouds'},
  {at: 19, zh: '进入太空', en: 'Into space'},
  {at: launchDuration + 16, zh: '接住问题', en: 'The brief'},
  {at: launchDuration + 29, zh: '协作设计', en: 'One team'},
  {at: launchDuration + 57, zh: '经得起推敲', en: 'Test the idea'},
  {at: launchDuration + 69, zh: '真实的同伴', en: 'The people'},
  {at: launchDuration + 78, zh: '做过的方案', en: 'Our work'},
  {at: launchDuration + 127, zh: '传给下一程', en: 'Pass it on'},
];

const milestones = ['gfssm-2023', 'gfssm-2024-venus', 'gfssm-2025-mars', 'gfssm-2026-psyche']
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

export default function CinematicHome(): ReactNode {
  const t = useT();
  useBrokenLinks().collectAnchor('club-profile');
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const ascentRef = useRef(0);
  const activeStopRef = useRef(0);
  const [activeStop, setActiveStop] = useState(0);
  const activeMissionRef = useRef(0);
  const [activeMission, setActiveMission] = useState(0);
  const mission = milestones[activeMission];

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
        end: () => '+=' + Math.round(window.innerHeight * journeyScreens),
        pin: stage,
        scrub: 0.3,
        anticipatePin: 1,
        refreshPriority: 10,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(driver, {
      p: 1,
      duration: journeyDuration,
      onUpdate: () => {
        const storyTime = driver.p * journeyDuration;
        ascentRef.current = Math.max(0, Math.min(1, storyTime / launchDuration));
        progressRef.current = Math.max(0, Math.min(1, (storyTime - launchDuration) / spaceDuration));
        const index = stops.reduce((current, stop, position) => storyTime >= stop.at ? position : current, 0);
        if (activeStopRef.current !== index) {
          activeStopRef.current = index;
          setActiveStop(index);
        }
        const missionIndex = Math.max(0, Math.min(milestones.length - 1, Math.floor((storyTime - launchDuration - 77) / 11.5)));
        if (activeMissionRef.current !== missionIndex) {
          activeMissionRef.current = missionIndex;
          setActiveMission(missionIndex);
        }
        stage.style.setProperty('--journey-progress', String(driver.p));
      },
    }, 0);

    timeline
      .to(target('launch-copy'), {autoAlpha: 0, y: -40, duration: 4}, 3)
      .to(target('campus-credit'), {autoAlpha: 0, duration: 3}, 4)
      .to(target('launch-vignette'), {autoAlpha: 0, duration: 5}, 5)
      .fromTo(target('space-veil'), {autoAlpha: 0}, {autoAlpha: 1, duration: 9}, 24)
      .fromTo(target('reticle'), {autoAlpha: 0}, {autoAlpha: .34, duration: 6}, 23)
      .fromTo(target('orbit-line'), {autoAlpha: 0}, {autoAlpha: 1, duration: 6}, 23);

    const spaceTimeline = gsap.timeline({defaults: {ease: 'none'}});
    spaceTimeline
      .to(target('backdrop'), {scale: 1.1, autoAlpha: 0, duration: 2}, 22)
      .fromTo(target('hero'), {autoAlpha: 0}, {autoAlpha: 1, duration: 4}, 0)
      .to(target('hero'), {autoAlpha: 0, y: '-=85', scale: 0.92, duration: 7}, 7)
      .fromTo(target('brief'), {autoAlpha: 0, x: 72}, {autoAlpha: 1, x: 0, duration: 5}, 14)
      .fromTo(target('wordmark'), {autoAlpha: 0, scale: 1.4, x: 80}, {autoAlpha: 0.75, scale: 1, x: 0, duration: 9}, 12)
      .to(target('brief'), {autoAlpha: 0, x: -36, duration: 3}, 23)
      .to(target('wordmark'), {autoAlpha: 0, scale: 0.75, duration: 5}, 23)
      .fromTo(target('assembly'), {autoAlpha: 0, y: 34}, {autoAlpha: 1, y: 0, duration: 4}, 25)
      .fromTo(target('system-grid'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 27)
      .fromTo(target('scan-line'), {x: 0}, {x: () => window.innerWidth * 0.8, duration: 19}, 26)
      .to(target('system-grid'), {autoAlpha: 0, duration: 4}, 46)
      .fromTo(target('callout-1'), {autoAlpha: 0, x: -40}, {autoAlpha: 1, x: 0, duration: 4}, 29)
      .to(target('callout-1'), {autoAlpha: 0, x: -35, duration: 4}, 35)
      .fromTo(target('callout-2'), {autoAlpha: 0, x: 40}, {autoAlpha: 1, x: 0, duration: 4}, 36)
      .to(target('callout-2'), {autoAlpha: 0, x: 35, duration: 4}, 42)
      .fromTo(target('callout-3'), {autoAlpha: 0, y: 28}, {autoAlpha: 1, y: 0, duration: 4}, 42)
      .to(target('assembly'), {autoAlpha: 0, y: -38, duration: 4}, 48)
      .to(target('callout-3'), {autoAlpha: 0, y: -28, duration: 4}, 49)
      .fromTo(target('portal'), {autoAlpha: 1, '--portal-radius': '0%'}, {
        autoAlpha: 1, '--portal-radius': '145%', duration: 16,
      }, 47)
      .fromTo(target('portal-image'), {scale: 1.45}, {scale: 1.05, duration: 18}, 47)
      .fromTo(target('habitat-caption'), {autoAlpha: 0, y: 50}, {autoAlpha: 1, y: 0, duration: 4}, 56)
      .to(target('habitat-caption'), {autoAlpha: 0, y: -32, duration: 3}, 63)
      .fromTo(target('reality'), {autoAlpha: 1, clipPath: 'circle(0% at 51% 50%)'}, {
        autoAlpha: 1, clipPath: 'circle(100% at 51% 50%)', duration: 9,
      }, 64)
      .fromTo(target('reality-image'), {scale: 1.28}, {scale: 1, duration: 18}, 64)
      .fromTo(target('reality-frame'), {autoAlpha: 0, x: 80, scale: 0.9}, {
        autoAlpha: 1, x: 0, scale: 1, duration: 7,
      }, 66)
      .to(target('reality-frame'), {x: -24, y: -14, duration: 8}, 72)
      .to(target('portal'), {autoAlpha: 0, duration: 1}, 74)
      .fromTo(target('team-caption'), {autoAlpha: 0, y: 35}, {autoAlpha: 1, y: 0, duration: 4}, 68)
      .to(target('team-caption'), {autoAlpha: 0, y: -25, duration: 3}, 74)
      .fromTo(target('record'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 75)
      .to(target('reality'), {autoAlpha: 0, duration: 3}, 75)
      .fromTo(target('archive-visual'), {autoAlpha: 0, scale: 1.08, x: 80}, {
        autoAlpha: 1, scale: 1, x: 0, duration: 2,
      }, 76)
      .to(target('archive-visual'), {x: -18, y: -9, rotation: -1.5, duration: 5}, 88.5)
      .to(target('archive-visual'), {x: 12, y: 8, rotation: 1.2, duration: 5}, 100)
      .fromTo(target('archive-photo-0'), {xPercent: -9, yPercent: 8}, {
        xPercent: 0, yPercent: 0, duration: 36,
      }, 76)
      .fromTo(target('archive-photo-1'), {xPercent: 12, yPercent: -8}, {
        xPercent: 0, yPercent: 0, duration: 36,
      }, 76)
      .fromTo(target('archive-photo-2'), {xPercent: 9, yPercent: 12}, {
        xPercent: 0, yPercent: 0, duration: 36,
      }, 76)
      .to(target('archive-visual'), {autoAlpha: 0, scale: .92, x: -55, duration: 2.5}, 117.5)
      .fromTo(target('record-future-backdrop'), {autoAlpha: 0}, {autoAlpha: 1, duration: 2.5}, 117.5)
      .fromTo(target('record-future'), {autoAlpha: 0, scale: .8, rotation: -15}, {
        autoAlpha: 1, scale: 1, rotation: 0, duration: 3,
      }, 117.5)
      .to(target('record'), {autoAlpha: 0, duration: 2.2}, 123.8)
      .fromTo(target('end'), {autoAlpha: 0, y: 70, scale: 0.92}, {
        autoAlpha: 1, y: 0, scale: 1, duration: 4,
      }, 124.8);

    milestones.forEach((_, index) => {
      const at = 77 + index * 11.5;
      spaceTimeline.fromTo(target('record-' + index), {autoAlpha: 0, x: 80}, {
        autoAlpha: 1, x: 0, duration: 1.6,
      }, at);
      if (index < milestones.length - 1) {
        spaceTimeline.to(target('record-' + index), {autoAlpha: 0, x: -70, duration: 1.2}, at + 9.5);
      }
    });
    timeline.add(spaceTimeline, launchDuration);
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
            <div className={styles.orbitalShell}>
              <OrbitalScene className={styles.orbitalScene} progressRef={progressRef} ascentRef={ascentRef} />
            </div>
            <div className={styles.spaceVeil} data-motion="space-veil" aria-hidden="true" />
            <div className={styles.launchVignette} data-motion="launch-vignette" aria-hidden="true" />
            <div className={styles.reticle} data-motion="reticle" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className={styles.orbitLine} data-motion="orbit-line" aria-hidden="true" />
            <div className={styles.systemGrid} data-motion="system-grid" aria-hidden="true">
              <span className={styles.scanLine} data-motion="scan-line" />
            </div>

            <div className={styles.hud} aria-hidden="true">
              <div className={styles.hudBrand}><span className={styles.hudDiamond} /> BUTIAN ENGINEERING CLUB</div>
              <div className={styles.hudCoordinates}>30°10′42″ N &nbsp; 120°07′59″ E <span>→</span> DEEP SPACE</div>
              <div className={styles.hudBottom}>
                <span>HANGZHOU NO.2 HIGH SCHOOL</span>
                <span>MISSION LOG / 001—009</span>
              </div>
            </div>

            <div className={styles.launchCopy} data-motion="launch-copy">
              <p className={styles.eyebrow}>{t('起点 · 杭州二中', 'ORIGIN · HANGZHOU NO.2 HIGH SCHOOL')}</p>
              <h1>{t('从杭州二中，', 'From Hangzhou No.2,')}<br /><em>{t('飞向星辰。', 'toward the stars.')}</em></h1>
              <p className={styles.launchLead}>{t(
                '步天工程社的航程，从这里开始。我们把对太空的好奇，带进一次次讨论、设计与验证。',
                'Butian’s journey begins here. We take our curiosity about space into each discussion, design and test.',
              )}</p>
              <div className={styles.scrollCue}>
                <span className={styles.scrollGlyph} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M12 4v15m-5-5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                {t('向下滚动，开始升空', 'SCROLL TO LIFT OFF')}
              </div>
            </div>
            <p className={styles.campusCredit} data-motion="campus-credit">{t('实景影像 / 杭州二中', 'ACTUAL CAMPUS / HANGZHOU NO.2 HIGH SCHOOL')}</p>

            <div className={styles.heroCopy} data-motion="hero">
              <p className={styles.eyebrow}>{t('杭州第二中学 · 求是创新学院 · 步天工程社', 'HANGZHOU NO.2 HIGH SCHOOL · QIUSHI INNOVATION ACADEMY')}</p>
              <h2>{t('把未来，', 'Build the future')}<br /><em>{t('建在星辰之间。', 'beyond Earth.')}</em></h2>
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
                <img src="/img/archive/2026/final-stage.webp" alt="" />
              </div>
            </div>
            <div className={styles.teamCaption} data-motion="team-caption">
              <img className={styles.stillImage} src="/img/archive/2026/final-stage.webp" alt={t('2026 GFSSM 步天两支代表队合影', 'Butian teams at GFSSM 2026')} />
              <span className={styles.phaseIndex}>05 / BACK ON EARTH</span>
              <h2>{t('图纸背后，', 'Behind the drawings')}<br />{t('是并肩的人。', 'are people together.')}</h2>
              <p>{t(
                '2026 年的 24 小时挑战里，两支代表队与来自各地的伙伴反复讨论、修改方案。不同专长，最终汇入同一份提案。',
                'In the 2026 24-hour challenge, our teams debated and revised proposals with students from across the world. Different strengths came together in one design.',
              )}</p>
              <small>{t('真实影像 · 2026 GFSSM 决赛', 'ARCHIVE PHOTO · GFSSM 2026 FINAL')}</small>
            </div>

            <div className={styles.record} data-motion="record">
              <div className={styles.recordFutureBackdrop} data-motion="record-future-backdrop" aria-hidden="true" />
              <p className={styles.recordEyebrow}>06 / FLIGHT RECORD</p>
              <div className={styles.archiveVisual} data-motion="archive-visual" aria-hidden="true">
                <div className={styles.archivePhoto} data-motion="archive-photo-0" data-label={`${mission.year} / 01`}>
                  <img key={`${mission.id}-0`} src={mission.archivePhotos?.[0]} alt="" />
                </div>
                <div className={styles.archivePhoto} data-motion="archive-photo-1" data-label={`${mission.year} / 02`}>
                  <img key={`${mission.id}-1`} src={mission.archivePhotos?.[1]} alt="" />
                </div>
                <div className={styles.archivePhoto} data-motion="archive-photo-2" data-label={`${mission.year} / 03`}>
                  <img key={`${mission.id}-2`} src={mission.archivePhotos?.[2]} alt="" />
                </div>
                <span>{t(`影像档案 / ${mission.year} GFSSM`, `PHOTO ARCHIVE / GFSSM ${mission.year}`)}</span>
              </div>
              <div className={styles.recordFuture} data-motion="record-future" aria-hidden="true">
                <i /><i />
                <span>SCENARIO / 2115</span>
                <strong>2115</strong>
                <small>{t('灵神星 · 采矿太空城', 'PSYCHE · MINING SETTLEMENT')}</small>
              </div>
              {milestones.map((project, index) => (
                <div className={styles.recordEntry} data-motion={'record-' + index} key={project.id}>
                  <span>{project.year}</span>
                  <h2>{t(project.titleZh, project.titleEn)}</h2>
                  <p>{t(project.homeSummaryZh ?? project.summaryZh, project.homeSummaryEn ?? project.summaryEn)}</p>
                  {project.detailUrl && <Link to={project.detailUrl}>{t('查看这段航程 ↗', 'Explore this mission ↗')}</Link>}
                  {project.sourceUrl && <a className={styles.sourceLink} href={project.sourceUrl} target="_blank" rel="noopener noreferrer">{t('原始报道 ↗', 'Original report ↗')}</a>}
                </div>
              ))}
              <div className={styles.recordTicks} aria-hidden="true">{milestones.map((project) => <i key={project.id} />)}</div>
            </div>

            <div className={styles.endCopy} data-motion="end">
              <p className={styles.phaseIndex}>07 / PASS IT FORWARD</p>
              <h2>{t('把做过的事，', 'Pass what we learn')}<br /><em>{t('交给下一程。', 'to the next crew.')}</em></h2>
              <p>{t(
                '提案与复盘写进知识库，航天科普走出赛场；天文周、纸飞机比赛也曾让更多同学走近工程。下一次出发，欢迎愿意查证、动手、协作并把想法讲清楚的你。',
                'Proposals and lessons enter our knowledge base. Outreach, Astronomy Week and paper-plane activities have brought more students close to engineering. If you are ready to research, build, collaborate and explain, join the next crew.',
              )}</p>
              <div className={styles.endActions}>
                <Link className={styles.primaryLink} to="/join">{t('了解如何加入', 'How to join')} <span>↗</span></Link>
                <Link className={styles.secondaryLink} to="/docs/intro">{t('打开知识库', 'Open the knowledge base')} <span>↗</span></Link>
              </div>
            </div>

            <div className={styles.progressRail} aria-label={t('航程进度', 'Journey progress')}>
              <span className={styles.progressLabel}>{String(activeStop + 1).padStart(3, '0')} / 009</span>
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

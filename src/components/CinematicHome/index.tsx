import React, {type ReactNode, useRef} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import {useT} from '@site/src/lib/i18n';
import {projects} from '@site/src/data/projects';
import {competitionRoles} from '@site/src/data/site';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import OrbitalScene from './OrbitalScene';
import styles from './styles.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One story unit has the same scroll distance throughout the pinned journey.
// The archive and final invitation need enough distance to read while scrolling continuously.
const launchDuration = 22;
const spaceDuration = 143;
const journeyDuration = launchDuration + spaceDuration;
const journeyScreens = 20.65;

const stops = [
  {at: 0, zh: '杭州二中', en: 'Hangzhou No.2 High School'},
  {at: 8, zh: '穿越云层', en: 'Through the clouds'},
  {at: 19, zh: '进入太空', en: 'Into space'},
  {at: launchDuration + 16, zh: '接住问题', en: 'The brief'},
  {at: launchDuration + 29, zh: '协作设计', en: 'One team'},
  {at: launchDuration + 57, zh: '经得起推敲', en: 'Test the idea'},
  {at: launchDuration + 69, zh: '真实的同伴', en: 'The people'},
  {at: launchDuration + 78, zh: '做过的方案', en: 'Our work'},
  {at: launchDuration + 133, zh: '传给下一程', en: 'Pass it on'},
];

const milestones = ['gfssm-2023', 'gfssm-2024-venus', 'gfssm-2025-mars', 'gfssm-2026-psyche']
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

function StoryHeading({first, second, accent = false}: {first: string; second: string; accent?: boolean}): ReactNode {
  return <h2>
    <span className={styles.headlineMask}><span>{first}</span></span>
    <span className={styles.headlineMask}><span>{accent ? <em>{second}</em> : second}</span></span>
  </h2>;
}

export default function CinematicHome(): ReactNode {
  const t = useT();
  useBrokenLinks().collectAnchor('club-profile');
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const ascentRef = useRef(0);
  const activeStopRef = useRef(0);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const progressNameRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const select = (name: string) => stage.querySelector<HTMLElement>('[data-motion="' + name + '"]');
    const target = (name: string) => select(name)!;
    const travel = (desktop: number, mobile: number) => () => window.innerWidth <= 600 ? mobile : desktop;
    const driver = {p: 0};

    const timeline = gsap.timeline({
      defaults: {ease: 'none'},
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => '+=' + Math.round(window.innerHeight * journeyScreens),
        pin: stage,
        // Keep the image close to wheel and keyboard input; a long scrub makes
        // the pinned scene feel as if it is catching up after the user stops.
        scrub: 0.22,
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
          if (progressLabelRef.current) progressLabelRef.current.textContent = `${String(index + 1).padStart(3, '0')} / 009`;
          if (progressNameRef.current) progressNameRef.current.textContent = t(stops[index].zh, stops[index].en);
        }
        stage.style.setProperty('--journey-progress', String(driver.p));
      },
    }, 0);

    timeline
      .fromTo(target('launch-copy'), {y: 0}, {y: -52, duration: 7, ease: 'none'}, 0)
      .to(target('launch-copy'), {autoAlpha: 0, duration: 4, ease: 'power1.inOut'}, 3)
      .to(target('campus-credit'), {autoAlpha: 0, duration: 3}, 4)
      .to(target('launch-vignette'), {autoAlpha: 0, duration: 5}, 5)
      .fromTo(target('cloud-copy'), {autoAlpha: 0}, {autoAlpha: 1, duration: 2.8, ease: 'power1.inOut'}, 7)
      .fromTo(target('cloud-copy'), {y: 28}, {y: -38, duration: 9.8, ease: 'none'}, 7)
      .to(target('cloud-copy'), {autoAlpha: 0, duration: 2.8, ease: 'power1.inOut'}, 14)
      .fromTo(target('edge-copy'), {autoAlpha: 0}, {autoAlpha: 1, duration: 2.8, ease: 'power1.inOut'}, 16)
      .fromTo(target('edge-copy'), {y: 28}, {y: -38, duration: 7, ease: 'none'}, 16)
      .to(target('edge-copy'), {autoAlpha: 0, duration: 3, ease: 'power1.inOut'}, 20)
      .fromTo(target('space-veil'), {autoAlpha: 0}, {autoAlpha: 1, duration: 9}, 24)
      .fromTo(target('reticle'), {autoAlpha: 0}, {autoAlpha: .34, duration: 6}, 23)
      .fromTo(target('orbit-line'), {autoAlpha: 0}, {autoAlpha: 1, duration: 6}, 23);

    const spaceTimeline = gsap.timeline({defaults: {ease: 'none'}});
    spaceTimeline
      .to(target('backdrop'), {scale: 1.1, autoAlpha: 0, duration: 2}, 22)
      .fromTo(target('hero'), {autoAlpha: 0}, {autoAlpha: 1, duration: 4, ease: 'power1.inOut'}, 0)
      .fromTo(target('hero'), {y: 26}, {y: -83, duration: 14, ease: 'none'}, 0)
      .to(target('hero'), {autoAlpha: 0, scale: 0.96, duration: 4, ease: 'power1.inOut'}, 8)
      .fromTo(target('brief'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3, ease: 'power1.inOut'}, 10)
      .fromTo(target('brief'), {x: 56, y: 16}, {x: -42, y: -20, duration: 16, ease: 'none'}, 10)
      .fromTo(target('wordmark'), {autoAlpha: 0, scale: 1.4, x: 80}, {autoAlpha: 0.75, scale: 1, x: 0, duration: 9}, 12)
      .to(target('brief'), {autoAlpha: 0, duration: 3, ease: 'power1.inOut'}, 21)
      .to(target('wordmark'), {autoAlpha: 0, scale: 0.75, duration: 5}, 23)
      .fromTo(target('assembly'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3, ease: 'power1.inOut'}, 22)
      .fromTo(target('assembly'), {y: 22, scale: .985}, {y: -40, scale: 1, duration: 30, ease: 'none'}, 22)
      .fromTo(target('system-grid'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 27)
      .fromTo(target('scan-line'), {x: 0}, {x: () => window.innerWidth * 0.8, duration: 19}, 26)
      .to(target('system-grid'), {autoAlpha: 0, duration: 4}, 46)
      .fromTo(target('systems-rail'), {autoAlpha: 0, y: 24}, {autoAlpha: 1, y: 0, duration: 3, ease: 'power2.out'}, 27)
      .fromTo(target('systems-fill'), {scaleX: 0}, {scaleX: 1, duration: 22, ease: 'none'}, 27)
      .to(target('systems-rail'), {autoAlpha: 0, y: -16, duration: 2, ease: 'power2.in'}, 48)
      .to(target('assembly'), {autoAlpha: 0, duration: 4, ease: 'power1.inOut'}, 48)
      .fromTo(target('portal'), {autoAlpha: 1, '--portal-radius': '0%'}, {
        autoAlpha: 1, '--portal-radius': '145%', duration: 16, ease: 'power1.out',
      }, 47)
      .fromTo(target('portal-image'), {scale: 1.45, xPercent: -2, yPercent: 2}, {
        scale: 1.05, xPercent: 1, yPercent: -1, duration: 18, ease: 'none',
      }, 47)
      .fromTo(target('habitat-caption'), {autoAlpha: 0}, {autoAlpha: 1, duration: 4, ease: 'power1.inOut'}, 53.5)
      .fromTo(target('habitat-caption'), {y: 35}, {y: -32, duration: 11, ease: 'none'}, 53.5)
      .to(target('habitat-caption'), {autoAlpha: 0, duration: 3, ease: 'power1.inOut'}, 61.5)
      .fromTo(target('reality'), {autoAlpha: 0}, {autoAlpha: 1, duration: 5, ease: 'power2.inOut'}, 63)
      .to(target('portal'), {autoAlpha: 0, duration: 5, ease: 'power2.inOut'}, 63)
      .fromTo(target('reality-image'), {scale: 1.18}, {scale: 1, duration: 18, ease: 'power1.out'}, 63)
      .fromTo(target('reality-frame'), {autoAlpha: 0, x: 80, scale: 0.9}, {
        autoAlpha: 1, x: 0, scale: 1, duration: 7, ease: 'power2.out',
      }, 66)
      .to(target('reality-frame'), {x: -24, y: -14, duration: 8}, 72)
      .fromTo(target('team-caption'), {autoAlpha: 0}, {autoAlpha: 1, duration: 4, ease: 'power1.inOut'}, 68)
      .fromTo(target('team-caption'), {y: 26}, {y: -25, duration: 9, ease: 'none'}, 68)
      .to(target('team-caption'), {autoAlpha: 0, duration: 3, ease: 'power1.inOut'}, 74)
      .fromTo(target('record'), {autoAlpha: 0}, {autoAlpha: 1, duration: 3}, 74)
      .to(target('reality'), {autoAlpha: 0, duration: 3}, 74)
      .fromTo(target('archive-progress'), {scaleX: 0}, {scaleX: 1, duration: 34.5, ease: 'none'}, 77)
      .fromTo(target('record-future-backdrop'), {autoAlpha: 0}, {autoAlpha: 1, duration: 2.5}, 123)
      .fromTo(target('record-future'), {autoAlpha: 0, scale: .8, rotation: -15}, {
        autoAlpha: 1, scale: 1, rotation: 0, duration: 3,
      }, 123)
      .to(target('record'), {autoAlpha: 0, duration: 2.2}, 129.3)
      .fromTo(target('end'), {autoAlpha: 0}, {autoAlpha: 1, duration: 4, ease: 'power1.inOut'}, 130.3)
      .fromTo(target('end'), {y: 35, scale: .98}, {y: -20, scale: 1, duration: 12.7, ease: 'none'}, 130.3);

    competitionRoles.forEach((_, index) => {
      const node = target(`system-node-${index}`);
      const at = 29 + index * 4.2;
      spaceTimeline.to(node, {autoAlpha: 1, y: -5, duration: 2.1, ease: 'power2.out'}, at);
      spaceTimeline.to(node, {autoAlpha: .48, y: 0, duration: 1.7, ease: 'power2.inOut'}, at + 3);
    });

    const revealHeading = (name: string, at: number, duration: number, track: gsap.core.Timeline) => {
      const lines = target(name).querySelectorAll<HTMLElement>(`.${styles.headlineMask} > span`);
      if (lines.length) track.fromTo(lines, {yPercent: 108}, {
        yPercent: 0, duration, stagger: .55, ease: 'power3.out',
      }, at);
    };
    revealHeading('cloud-copy', 7.2, 2.7, timeline);
    revealHeading('edge-copy', 16.2, 2.7, timeline);

    const headingReveals: Array<[string, number, number]> = [
      ['hero', 0.5, 3.8],
      ['brief', 10.4, 4],
      ['assembly', 22.3, 3.5],
      ['habitat-caption', 53.9, 3.4],
      ['team-caption', 68.4, 3.3],
      ['end', 130.7, 3.8],
    ];
    headingReveals.forEach(([name, at, duration]) => revealHeading(name, at, duration, spaceTimeline));

    milestones.forEach((_, index) => {
      const at = 77 + index * 11.5;
      spaceTimeline.to(target(`archive-node-${index}`), {
        opacity: 1, y: -5, duration: 1.8, ease: 'power2.out',
      }, at);
      const entrance = index === 0 ? at - 1.4 : at - 2.2;
      const entranceDuration = index === 0 ? 2.6 : 2;
      const exit = index < milestones.length - 1 ? at + 9.3 : 123;
      const textEntrance = index === 0 ? at - .8 : at - 1.3;
      const archive = target('archive-visual-' + index);
      const cards = archive.querySelectorAll(`.${styles.archivePhoto}`);
      const photos = archive.querySelectorAll('img');
      spaceTimeline.fromTo(archive, {
        autoAlpha: 0, x: travel(125, 24), y: travel(24, 5), z: travel(-360, -70),
        scale: .92, rotationY: travel(-14, -4),
      }, {
        autoAlpha: 1, x: travel(20, 5), y: travel(8, 2), z: 0,
        scale: 1, rotationY: 0,
        duration: entranceDuration, ease: 'power2.out',
      }, entrance);
      spaceTimeline.fromTo(cards, {
        autoAlpha: 0, y: travel(85, 28), rotation: (photo: number) => [-3, 2, -2][photo % 3],
      }, {
        autoAlpha: 1, y: 0, rotation: 0, duration: entranceDuration,
        stagger: .16, ease: 'power2.out',
      }, entrance);
      spaceTimeline.to(archive, {
        x: travel(-35, -7), y: travel(-17, -4), z: travel(75, 10),
        scale: 1.02, rotationY: travel(4, 2),
        duration: exit - (entrance + entranceDuration), ease: 'none',
      }, entrance + entranceDuration);
      spaceTimeline.fromTo(photos, {
        x: (photo: number) => [22, -24, 28][photo % 3],
        y: (photo: number) => [-18, 20, 15][photo % 3],
        scale: travel(1.12, 1.04),
      }, {
        x: 0, y: 0, scale: 1, duration: 4, stagger: .18, ease: 'power2.out',
      }, entrance);
      spaceTimeline.to(photos, {
        yPercent: travel(-9, -3), scale: travel(1.08, 1.03),
        duration: exit - (entrance + 4.4), ease: 'none',
      }, entrance + 4.4);
      spaceTimeline.to(archive, {
        autoAlpha: 0, x: travel(-125, -25), y: travel(-30, -8), z: travel(260, 60),
        scale: 1.1, rotationY: travel(12, 4),
        duration: index < milestones.length - 1 ? .85 : 2, ease: 'power2.in',
      },
        exit);
      spaceTimeline.to(cards, {
        autoAlpha: 0, y: travel(-90, -30), rotation: (photo: number) => [-2, 3, -3][photo % 3],
        duration: index < milestones.length - 1 ? .7 : 1.8,
        stagger: .08, ease: 'power2.in',
      }, exit);
      spaceTimeline.fromTo(target('record-' + index), {autoAlpha: 0, x: travel(100, 34), y: 28, scale: .96}, {
        autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 2.4, ease: 'power2.out',
      }, textEntrance);
      spaceTimeline.to(target('record-' + index), {
        x: travel(-22, -8), y: -11, duration: exit - (textEntrance + 2.4), ease: 'none',
      }, textEntrance + 2.4);
      if (index < milestones.length - 1) {
        spaceTimeline.to(target('record-' + index), {
          autoAlpha: 0, x: travel(-95, -25), y: -22, scale: 1.035,
          duration: 1.1, ease: 'power2.inOut',
        }, exit);
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

            <div className={styles.ascentCaption} data-motion="cloud-copy">
              <span className={styles.phaseIndex}>FLIGHT / ABOVE THE CLOUDS</span>
              <StoryHeading first={t('视野越开阔，', 'A wider horizon.')} second={t('问题越具体。', 'Sharper questions.')} accent />
              <p>{t('从好奇出发，向更远处寻找工程的答案。', 'Curiosity leads us toward questions we can solve together.')}</p>
            </div>
            <div className={styles.ascentCaption} data-motion="edge-copy">
              <span className={styles.phaseIndex}>FLIGHT / INTO ORBIT</span>
              <StoryHeading first={t('越过云层，', 'Beyond the clouds.')} second={t('抵达新的视角。', 'A new perspective.')} accent />
              <p>{t('下一站，是把想象变成可以推敲的设计。', 'The next step is turning imagination into a design we can test.')}</p>
            </div>

            <div className={styles.heroCopy} data-motion="hero">
              <p className={styles.eyebrow}>{t('杭州第二中学 · 求是创新学院 · 步天工程社', 'HANGZHOU NO.2 HIGH SCHOOL · QIUSHI INNOVATION ACADEMY')}</p>
              <StoryHeading first={t('把未来，', 'Build the future')} second={t('建在星辰之间。', 'beyond Earth.')} accent />
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
              <StoryHeading first={t('先接住问题，', 'First, understand')} second={t('再提出未来。', 'the challenge.')} />
              <p>{t(
                '从赛事任务书出发，拆解需求、查找证据、分工设计，最后以一份提案和英文答辩回应约束。',
                'We begin with a competition brief: break down requirements, find evidence, design together, then respond with a proposal and an English defense.',
              )}</p>
            </div>
            <div className={styles.wordmarkGhost} data-motion="wordmark" aria-hidden="true">{t('步天', 'BUTIAN')}</div>

            <div className={styles.assemblyCopy} data-motion="assembly">
              <span className={styles.phaseIndex}>03 / SYSTEMS THINKING</span>
              <StoryHeading first={t('五种专长，', 'Five disciplines.')} second={t('同一座城市。', 'One shared city.')} accent />
              <p>{t(
                '像一家虚拟航天公司：管理、结构、人居、运营和基础设施各有分工；方案必须在彼此的约束中成立。',
                'Organized like a virtual aerospace company, we connect management, structure, habitat, operations and infrastructure. Every decision has to work with the others.',
              )}</p>
              <small className={styles.conceptNote}>{t('概念视觉 · 非实际方案模型', 'CONCEPT VISUAL · NOT A PROJECT MODEL')}</small>
            </div>
            <div className={styles.systemsRail} data-motion="systems-rail" aria-hidden="true">
              <div className={styles.systemsHeading}>
                <span>{t('协同系统', 'INTERCONNECTED SYSTEMS')}</span>
                <span>01 — 05</span>
              </div>
              <div className={styles.systemsTrack}><i data-motion="systems-fill" /></div>
              <div className={styles.systemsNodes}>
                {competitionRoles.map((role, index) => (
                  <div className={styles.systemsNode} data-motion={`system-node-${index}`} key={role.id}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <strong><span className={styles.roleFull}>{t(role.nameZh, role.nameEn)}</span><span className={styles.roleCompact}>{t(role.nameZh, role.shortEn)}</span></strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.portal} data-motion="portal" aria-hidden="true">
              <div className={styles.portalImage} data-motion="portal-image" />
              <div className={styles.portalTint} />
              <div className={styles.portalFrame} />
            </div>
            <div className={styles.habitatCaption} data-motion="habitat-caption">
              <img className={styles.stillImage} src="/img/life-support-concept.jpg" alt={t('地外生命保障空间概念视觉', 'Concept visual of an off-world life-support habitat')} />
              <span className={styles.phaseIndex}>04 / INSIDE THE HABITAT</span>
              <StoryHeading first={t('想象必须，', 'Imagination needs')} second={t('经得起推敲。', 'to stand up to scrutiny.')} />
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
              <StoryHeading first={t('图纸背后，', 'Behind the drawings')} second={t('是并肩的人。', 'are people together.')} />
              <p>{t(
                '2026 年的 24 小时挑战里，两支代表队与来自各地的伙伴反复讨论、修改方案。不同专长，最终汇入同一份提案。',
                'In the 2026 24-hour challenge, our teams debated and revised proposals with students from across the world. Different strengths came together in one design.',
              )}</p>
              <small>{t('真实影像 · 2026 GFSSM 决赛', 'ARCHIVE PHOTO · GFSSM 2026 FINAL')}</small>
            </div>

            <div className={styles.record} data-motion="record">
              <div className={styles.recordFutureBackdrop} data-motion="record-future-backdrop" aria-hidden="true" />
              <p className={styles.recordEyebrow}>06 / FLIGHT RECORD</p>
              {milestones.map((project, index) => (
                <div className={styles.archiveVisual} data-motion={`archive-visual-${index}`} aria-hidden="true" key={project.id}>
                  {project.archivePhotos?.map((photo, photoIndex) => (
                    <div className={styles.archivePhoto} data-label={`${project.year} / 0${photoIndex + 1}`} key={photo}>
                      <img src={photo} alt="" />
                    </div>
                  ))}
                </div>
              ))}
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
              <div className={styles.recordChronology} aria-hidden="true">
                <div className={styles.chronologyHeading}><span>{t('步天航程档案', 'BUTIAN FLIGHT ARCHIVE')}</span><span>GFSSM / 2023—2026</span></div>
                <div className={styles.chronologyTrack}><i data-motion="archive-progress" /></div>
                <div className={styles.chronologyYears}>{milestones.map((project, index) => (
                  <span data-motion={`archive-node-${index}`} key={project.id}>{project.year}</span>
                ))}</div>
              </div>
            </div>

            <div className={styles.endCopy} data-motion="end">
              <p className={styles.phaseIndex}>07 / PASS IT FORWARD</p>
              <StoryHeading first={t('把做过的事，', 'Pass what we learn')} second={t('交给下一程。', 'to the next crew.')} accent />
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
              <span className={styles.progressLabel} ref={progressLabelRef}>001 / 009</span>
              <div className={styles.progressTrack}><i /></div>
              <span className={styles.progressName} ref={progressNameRef}>{t(stops[0].zh, stops[0].en)}</span>
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

import React, {type MouseEvent, type ReactNode, useEffect, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useT} from '@site/src/lib/i18n';
import {projects} from '@site/src/data/projects';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import OrbitalScene from './OrbitalScene';
import ClubProfile from '@site/src/components/ClubProfile';
import styles from './styles.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stops = [
  {at: 0, zh: '离开地球', en: 'Departure'},
  {at: 17, zh: '认识步天', en: 'Who we are'},
  {at: 28, zh: '协作成形', en: 'How we work'},
  {at: 65, zh: '验证想象', en: 'Grounded ideas'},
  {at: 79, zh: '一起完成', en: 'The people'},
  {at: 87, zh: '留下航迹', en: 'Our record'},
  {at: 98, zh: '继续出发', en: 'What comes next'},
];

const milestones = ['gfssm-2023', 'gfssm-2024-venus', 'gfssm-2025-mars']
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

function scrollToClubProfile(): void {
  const profile = document.getElementById('club-profile');
  if (!profile) return;
  window.scrollTo({top: window.scrollY + profile.getBoundingClientRect().top, behavior: 'instant'});
}

export default function CinematicHome(): ReactNode {
  const t = useT();
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeStop, setActiveStop] = useState(0);

  useEffect(() => {
    if (window.location.hash !== '#club-profile') return;
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToClubProfile();
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  const openClubProfile = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState(null, '', '#club-profile');
    ScrollTrigger.refresh();
    scrollToClubProfile();
  };

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
        <section className={styles.journey} ref={rootRef} aria-label={t('步天工程社的航程', 'The Butian journey')}>
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
                '我们是杭州第二中学求是创新学院的学生社团。用太空城市与基地设计组织学习，也把工程实践与航天科普带到真实世界。',
                'We are a student club at Hangzhou No.2 High School’s Qiushi Innovation Academy. We learn through space-settlement design, engineering practice and space-science outreach.',
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
              <div className={styles.signal}><span /> {t('步天工程社 · 我们做什么', 'BUTIAN · WHAT WE DO')}</div>
              <p className={styles.phaseIndex}>02 / FROM BRIEF TO PROPOSAL</p>
              <h2>{t('从一份任务书，', 'From a brief')}<br />{t('走向一座太空城。', 'to a place to live.')}</h2>
              <p>{t(
                '我们从赛事任务书出发，分工研究结构、人居、运营与基础设施，最后把想象汇成有依据的提案，并用英文答辩。',
                'Starting with a competition brief, we research structure, habitat, operations and infrastructure, then turn our ideas into an evidence-based proposal and defend it in English.',
              )}</p>
            </div>
            <div className={styles.wordmarkGhost} data-motion="wordmark" aria-hidden="true">{t('步天', 'BUTIAN')}</div>

            <div className={styles.assemblyCopy} data-motion="assembly">
              <span className={styles.phaseIndex}>03 / SYSTEMS THINKING</span>
              <h2>{t('一座基地，', 'A settlement takes')}<br /><em>{t('需要一支队伍。', 'a whole team.')}</em></h2>
              <p>{t(
                '管理、结构、人居、运营与基础设施各有分工，也必须彼此衔接。',
                'Management, structure, habitat, operations and infrastructure each have a role. The design only works when they connect.',
              )}</p>
              <small className={styles.conceptNote}>{t('概念视觉 · 非实际方案模型', 'CONCEPT VISUAL · NOT A PROJECT MODEL')}</small>
            </div>
            <div className={styles.calloutLeft} data-motion="callout-1">
              <span className={styles.calloutNumber}>01 / 03</span>
              <b>{t('先把问题查清楚', 'RESEARCH FIRST')}</b>
              <small>{t('文献 · 数据 · 依据', 'EVIDENCE · DATA · REASONING')}</small>
            </div>
            <div className={styles.calloutRight} data-motion="callout-2">
              <span className={styles.calloutNumber}>02 / 03</span>
              <b>{t('在约束中做设计', 'DESIGN WITH CONSTRAINTS')}</b>
              <small>{t('结构 · 人居 · 运营', 'STRUCTURE · HABITAT · OPERATIONS')}</small>
            </div>
            <div className={styles.calloutBottom} data-motion="callout-3">
              <span className={styles.calloutNumber}>03 / 03</span>
              <b>{t('让不同的人互相补位', 'BUILD IT TOGETHER')}</b>
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
                '从文献检索、方案讨论到模拟答辩，空气、食物与循环都要成为可以计算和讨论的问题。',
                'From research and design reviews to mock defenses, air, food and life-support cycles must become questions we can calculate and debate.',
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
              <h2>{t('没有人，', 'No one builds')}<br />{t('能独自建造未来。', 'the future alone.')}</h2>
              <p>{t(
                '不同方向的同伴彼此补位。图纸背后，是一次次讨论、分工与现场 24 小时协作。',
                'Members with different strengths cover for each other. Behind every plan are debates, shared work and a 24-hour on-site design sprint.',
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
                  <p>{t(project.summaryZh, project.summaryEn)}</p>
                  {project.detailUrl && <Link to={project.detailUrl}>{t('查看这段航程 ↗', 'Explore this mission ↗')}</Link>}
                </div>
              ))}
              <div className={styles.recordTicks} aria-hidden="true"><i /><i /><i /></div>
            </div>

            <div className={styles.endCopy} data-motion="end">
              <p className={styles.phaseIndex}>07 / NEXT ORBIT</p>
              <h2>{t('未来还没写完。', 'The future is')}<br /><em>{t('一起动手建造。', 'still being built.')}</em></h2>
              <p>{t(
                '好奇工程与航天，愿意查资料、动手，并把想法讲清楚？下一段航程，期待你的加入。做过的方案和复盘，也会留给后来的人。',
                'Curious about engineering and space? Ready to research, build and explain your ideas? Join the next mission. We keep our proposals and lessons for those who come after us.',
              )}</p>
              <div className={styles.endActions}>
                <Link className={styles.primaryLink} to="/#club-profile" onClick={openClubProfile}>{t('继续认识步天', 'Meet the club')} <span>↓</span></Link>
                <Link className={styles.secondaryLink} to="/join">{t('了解如何加入', 'How to join')} <span>↗</span></Link>
              </div>
            </div>

            <div className={styles.progressRail} aria-label={t('航程进度', 'Journey progress')}>
              <span className={styles.progressLabel}>00{activeStop + 1} / 007</span>
              <div className={styles.progressTrack}><i /></div>
              <span className={styles.progressName}>{t(stops[activeStop].zh, stops[activeStop].en)}</span>
            </div>
          </div>
        </section>
        <ClubProfile />
        <div className={styles.afterword}>
          <span>END OF TRANSMISSION · BUTIAN ENGINEERING CLUB</span>
          <Link to="/blog">{t('阅读活动记录 ↗', 'EXPLORE THE ACTIVITY LOG ↗')}</Link>
        </div>
      </main>
    </Layout>
  );
}

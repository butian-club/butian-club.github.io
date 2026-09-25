import React, {type ReactNode, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
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
  {at: 13, zh: '任务坐标', en: 'The mission'},
  {at: 28, zh: '拆解未来', en: 'The system'},
  {at: 51, zh: '穿越舱门', en: 'The habitat'},
  {at: 72, zh: '回到现场', en: 'The people'},
  {at: 84, zh: '航迹', en: 'The record'},
  {at: 97, zh: '继续向前', en: 'Next orbit'},
];

const milestones = ['gfssm-2023', 'gfssm-2024-venus', 'gfssm-2025-mars']
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

export default function CinematicHome(): ReactNode {
  const t = useT();
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
      .to(target('hero'), {autoAlpha: 0, y: -85, scale: 0.9, duration: 10}, 7)
      .fromTo(target('brief'), {autoAlpha: 0, x: 72}, {autoAlpha: 1, x: 0, duration: 7}, 14)
      .fromTo(target('year'), {autoAlpha: 0, scale: 1.4, x: 80}, {autoAlpha: 0.84, scale: 1, x: 0, duration: 8}, 13)
      .to(target('brief'), {autoAlpha: 0, x: -36, duration: 5}, 22)
      .to(target('year'), {autoAlpha: 0, scale: 0.75, duration: 6}, 22)
      .fromTo(target('assembly'), {autoAlpha: 0, y: 34}, {autoAlpha: 1, y: 0, duration: 6}, 23)
      .fromTo(target('callout-1'), {autoAlpha: 0, x: -40}, {autoAlpha: 1, x: 0, duration: 4}, 30)
      .to(target('callout-1'), {autoAlpha: 0, x: -35, duration: 4}, 37)
      .fromTo(target('callout-2'), {autoAlpha: 0, x: 40}, {autoAlpha: 1, x: 0, duration: 4}, 36)
      .to(target('callout-2'), {autoAlpha: 0, x: 35, duration: 4}, 43)
      .fromTo(target('callout-3'), {autoAlpha: 0, y: 28}, {autoAlpha: 1, y: 0, duration: 4}, 43)
      .to(target('assembly'), {autoAlpha: 0, y: -38, duration: 5}, 49)
      .to(target('callout-3'), {autoAlpha: 0, y: -28, duration: 4}, 49)
      .fromTo(target('portal'), {autoAlpha: 1, clipPath: 'circle(0% at 51% 50%)'}, {
        autoAlpha: 1, clipPath: 'circle(100% at 51% 50%)', duration: 18,
      }, 52)
      .fromTo(target('portal-image'), {scale: 1.45}, {scale: 1.05, duration: 20}, 52)
      .fromTo(target('habitat-caption'), {autoAlpha: 0, y: 50}, {autoAlpha: 1, y: 0, duration: 5}, 63)
      .to(target('habitat-caption'), {autoAlpha: 0, y: -32, duration: 4}, 70)
      .fromTo(target('reality'), {autoAlpha: 1, clipPath: 'circle(0% at 51% 50%)'}, {
        autoAlpha: 1, clipPath: 'circle(100% at 51% 50%)', duration: 10,
      }, 72)
      .fromTo(target('reality-image'), {scale: 1.28}, {scale: 1, duration: 20}, 72)
      .to(target('portal'), {autoAlpha: 0, duration: 1}, 81)
      .fromTo(target('team-caption'), {autoAlpha: 0, y: 35}, {autoAlpha: 1, y: 0, duration: 5}, 78)
      .to(target('team-caption'), {autoAlpha: 0, y: -25, duration: 4}, 84)
      .fromTo(target('record'), {autoAlpha: 0}, {autoAlpha: 1, duration: 5}, 84)
      .to(target('reality'), {autoAlpha: 0, duration: 4}, 84)
      .fromTo(target('archive-visual'), {autoAlpha: 0, scale: 1.12, x: 120}, {
        autoAlpha: 1, scale: 1, x: 0, duration: 5,
      }, 84)
      .fromTo(target('archive-photo-0'), {xPercent: 18, yPercent: 15, rotation: -10}, {
        xPercent: 0, yPercent: 0, rotation: -5, duration: 10,
      }, 84)
      .fromTo(target('archive-photo-1'), {xPercent: -18, yPercent: -10, rotation: 12}, {
        xPercent: 0, yPercent: 0, rotation: 5, duration: 10,
      }, 84)
      .fromTo(target('archive-photo-2'), {xPercent: 15, yPercent: -20, rotation: -13}, {
        xPercent: 0, yPercent: 0, rotation: -4, duration: 10,
      }, 84)
      .fromTo(target('record-0'), {autoAlpha: 0, x: 80}, {autoAlpha: 1, x: 0, duration: 2}, 85)
      .to(target('record-0'), {autoAlpha: 0, x: -70, duration: 2}, 88)
      .fromTo(target('record-1'), {autoAlpha: 0, x: 80}, {autoAlpha: 1, x: 0, duration: 2}, 88)
      .to(target('record-1'), {autoAlpha: 0, x: -70, duration: 2}, 91)
      .fromTo(target('record-2'), {autoAlpha: 0, x: 80}, {autoAlpha: 1, x: 0, duration: 2}, 91)
      .to(target('record'), {autoAlpha: 0, duration: 3}, 94)
      .fromTo(target('end'), {autoAlpha: 0, y: 70, scale: 0.92}, {
        autoAlpha: 1, y: 0, scale: 1, duration: 5,
      }, 95);
  }, {scope: rootRef});

  return (
    <Layout
      title={t('首页', 'Home')}
      description={t(
        '杭州第二中学步天工程社：以工程设计、协作和表达，探索人类在地外的未来。',
        'Butian Engineering Club at Hangzhou No.2 High School: exploring an off-world future through engineering, collaboration and communication.',
      )}>
      <main className={styles.home}>
        <section className={styles.journey} ref={rootRef} aria-label={t('步天工程社的航程', 'The Butian journey')}>
          <div className={styles.stage} ref={stageRef}>
            <div className={styles.spaceBackdrop} data-motion="backdrop" aria-hidden="true" />
            <div className={styles.orbitalShell} data-motion="orbital">
              <OrbitalScene className={styles.orbitalScene} progressRef={progressRef} />
            </div>
            <div className={styles.spaceVeil} aria-hidden="true" />
            <div className={styles.reticle} aria-hidden="true"><span /><span /><span /><span /></div>
            <div className={styles.orbitLine} aria-hidden="true" />

            <div className={styles.hud} aria-hidden="true">
              <div className={styles.hudBrand}><span className={styles.hudDiamond} /> BUTIAN ENGINEERING CLUB</div>
              <div className={styles.hudCoordinates}>30°16′ N &nbsp; 120°11′ E <span>→</span> MARS</div>
              <div className={styles.hudBottom}>
                <span>HANGZHOU NO.2 HIGH SCHOOL</span>
                <span>MISSION LOG / 001—007</span>
              </div>
            </div>

            <div className={styles.heroCopy} data-motion="hero">
              <p className={styles.eyebrow}>{t('杭州第二中学 · 步天工程社', 'HANGZHOU NO.2 HIGH SCHOOL · BUTIAN')}</p>
              <h1>{t('把未来，', 'Build the future')}<br /><em>{t('建在星辰之间。', 'beyond Earth.')}</em></h1>
              <p className={styles.heroLead}>{t(
                '从一张设计图，到一座能让人生活的地外基地。我们用工程、协作与想象，把遥远的问题拉到眼前。',
                'From a drawing to a place where people could live. We bring distant questions into focus through engineering, collaboration and imagination.',
              )}</p>
              <div className={styles.scrollCue}><span className={styles.scrollGlyph}>↓</span>{t('向下滚动，开启航程', 'SCROLL TO BEGIN THE JOURNEY')}</div>
            </div>

            <div className={styles.briefCopy} data-motion="brief">
              <div className={styles.signal}><span /> {t('任务已接收', 'MISSION RECEIVED')}</div>
              <p className={styles.phaseIndex}>02 / THE BRIEF</p>
              <h2>{t('如果要在火星住下去，', 'What would it take')}<br />{t('先解决什么？', 'to live on Mars?')}</h2>
              <p>{t(
                '2025 年，步天社两支队伍以 2075 年火星基地为题，完成从结构、人居到运营的系统设计。',
                'In 2025, two Butian teams designed a 2075 Mars base, connecting structure, habitat and operations into one system.',
              )}</p>
            </div>
            <div className={styles.yearGhost} data-motion="year" aria-hidden="true">2075</div>

            <div className={styles.assemblyCopy} data-motion="assembly">
              <span className={styles.phaseIndex}>03 / SYSTEMS THINKING</span>
              <h2>{t('一座基地，', 'A settlement is')}<br /><em>{t('不止一张图。', 'a living system.')}</em></h2>
              <p>{t(
                '让每个模块先独立成立，再让它们共同运转。',
                'Design each module to work, then make them work together.',
              )}</p>
              <small className={styles.conceptNote}>{t('概念视觉 · 非实际方案模型', 'CONCEPT VISUAL · NOT A PROJECT MODEL')}</small>
            </div>
            <div className={styles.calloutLeft} data-motion="callout-1">
              <span className={styles.calloutNumber}>01 / 03</span>
              <b>{t('结构与基础设施', 'STRUCTURE')}</b>
              <small>{t('承载 · 增压 · 组装', 'LOAD · PRESSURE · ASSEMBLY')}</small>
            </div>
            <div className={styles.calloutRight} data-motion="callout-2">
              <span className={styles.calloutNumber}>02 / 03</span>
              <b>{t('人居与生命保障', 'HABITAT')}</b>
              <small>{t('空气 · 食物 · 循环', 'AIR · FOOD · CYCLES')}</small>
            </div>
            <div className={styles.calloutBottom} data-motion="callout-3">
              <span className={styles.calloutNumber}>03 / 03</span>
              <b>{t('运营与协作', 'OPERATIONS')}</b>
              <small>{t('风险 · 资源 · 答辩', 'RISK · RESOURCES · DEFENSE')}</small>
            </div>

            <div className={styles.portal} data-motion="portal" aria-hidden="true">
              <div className={styles.portalImage} data-motion="portal-image" />
              <div className={styles.portalTint} />
              <div className={styles.portalFrame} />
            </div>
            <div className={styles.habitatCaption} data-motion="habitat-caption">
              <img className={styles.stillImage} src="/img/life-support-concept.jpg" alt={t('地外生命保障空间概念视觉', 'Concept visual of an off-world life-support habitat')} />
              <span className={styles.phaseIndex}>04 / INSIDE THE HABITAT</span>
              <h2>{t('真正的难题，', 'The real question:')}<br />{t('是让生命延续。', 'can life continue?')}</h2>
              <p>{t(
                '大气循环、食物工程和生命保障，必须被算清楚，才能让“住下去”成为可能。',
                'Atmosphere, food and life support must be worked out before living there becomes possible.',
              )}</p>
              <small>{t('概念视觉 · 非实际社团项目渲染', 'CONCEPT VISUAL · NOT A PROJECT RENDER')}</small>
            </div>

            <div className={styles.reality} data-motion="reality" aria-hidden="true">
              <div className={styles.realityImage} data-motion="reality-image" />
              <div className={styles.realityTint} />
            </div>
            <div className={styles.teamCaption} data-motion="team-caption">
              <img className={styles.stillImage} src="/img/projects/2024-gfssm/team.jpg" alt={t('2024 GFSSM 中国站合影', 'Team at GFSSM China 2024')} />
              <span className={styles.phaseIndex}>05 / BACK ON EARTH</span>
              <h2>{t('这一切，', 'The future is built')}<br />{t('由此刻的我们开始。', 'by people here, now.')}</h2>
              <p>{t(
                '图纸背后，是一次次讨论、分工和现场 24 小时协作。',
                'Behind the plans: debates, different disciplines and a 24-hour on-site design sprint.',
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
              <h2>{t('下一站，', 'The next orbit')}<br /><em>{t('继续向未知出发。', 'starts with us.')}</em></h2>
              <p>{t(
                '在步天，未来是一项可以一起动手完成的工程。',
                'At Butian, the future is something we can build together.',
              )}</p>
              <div className={styles.endActions}>
                <Link className={styles.primaryLink} to="/projects">{t('探索我们的项目', 'Explore our projects')} <span>↗</span></Link>
                <Link className={styles.secondaryLink} to="/about">{t('了解步天', 'Meet Butian')} <span>↗</span></Link>
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
          <Link to="/projects">{t('进入项目档案 ↗', 'OPEN PROJECT ARCHIVE ↗')}</Link>
        </div>
      </main>
    </Layout>
  );
}

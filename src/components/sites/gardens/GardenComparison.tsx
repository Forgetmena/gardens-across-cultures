"use client";

import Image from 'next/image';
import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react';
import { comparisonDimensions, evidenceLabels, exhibitionAssets, type ExhibitionLanguage } from '@/lib/gardens/content';
import { createComparisonController, type ComparisonController } from '@/lib/gardens/comparison-controller';
import { backgroundAsset, backgroundPhotos, focusAsset, focusProfiles, type GardenSide } from '@/lib/gardens/comparison-focus';

interface Controls {
  language: ExhibitionLanguage;
  stillMode: boolean;
  onLanguageChange: () => void;
  onStillChange: () => void;
}
interface Props extends Controls {
  Photo: ComponentType<{ id: 'CN-01' | 'UK-01'; language: ExhibitionLanguage; onFailed?: () => void }>;
  Credit: ComponentType<{ id: 'CN-01' | 'UK-01'; language: ExhibitionLanguage }>;
  Sources: ComponentType<{ ids: readonly string[]; language: ExhibitionLanguage }>;
  Tools: ComponentType<Controls>;
}
const sourceIds = ['CS-01', 'CS-02', 'CS-03', 'CS-04'];

export function GardenComparison({ Photo, Credit, Sources, Tools, ...props }: Props) {
  const { language, stillMode } = props;
  const [selected, setSelected] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState<number | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [artFallback, setArtFallback] = useState(false);
  const [armed, setArmed] = useState(false);
  const root = useRef<HTMLElement>(null);
  const controller = useRef<ComparisonController | null>(null);
  const dimension = displayed === null ? null : comparisonDimensions[displayed];
  useEffect(() => {
    if (!root.current) return;
    try {
      controller.current = createComparisonController(root.current, index => { setDisplayed(index); if (index === null) setSelected(null); });
      root.current.classList.add('c-observation-ready');
    } catch (error) { root.current.classList.remove('c-observation-ready'); root.current.dataset.controllerError = String(error); }
    return () => { controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => controller.current?.setLanguage(language), [language]);
  useEffect(() => controller.current?.setStill(stillMode), [stillMode]);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setArmed(true); observer.disconnect(); }
    }, { rootMargin: '1200px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  function select(index: number) {
    setSelected(index);
    if (controller.current) controller.current.select(index);
    else setDisplayed(index);
  }
  function original() { controller.current?.reset(); setSelected(null); setDisplayed(null); }
  const initialStyle = { '--comparison-split': '50%', '--comparison-cn': .5, '--comparison-uk': .5 } as CSSProperties;
  return <section className="c-compare c-observation s04-v3" id="compare" ref={root} aria-labelledby="compare-title" data-photo-failed={imageFailed || undefined} style={initialStyle}>
    <Atmospheres armed={armed} failed={imageFailed} />
    <div className="c-section-top"><p className="g-kicker"><span>04</span><i aria-hidden="true" />{language === 'zh' ? '对照 · 两次观看' : 'ONE QUESTION · TWO VIEWS'}</p><Tools {...props} /></div>
    <header className="c-compare-heading"><h2 id="compare-title" tabIndex={-1} data-culture-reveal="title">{language === 'zh' ? '同一片自然，两种观看。' : 'Nature, seen in two ways.'}</h2><p data-culture-reveal="body">{language === 'zh' ? '先看原始摄影。移动分界，再选一个问题，让眼前的景重新展开。' : 'Begin with the photographs. Move the boundary, then choose a question and let another reading emerge.'}</p></header>
    <div className="c-dimension-picker" role="group" aria-label={language === 'zh' ? '选择观察维度' : 'Choose an observation dimension'}>{comparisonDimensions.map((item, i) => <button key={item.id} type="button" aria-pressed={i === selected} onClick={() => select(i)}><span>0{i + 1}</span>{item.title[language]}</button>)}</div>
    <h3 className="s04-focus-question">{dimension?.question[language] ?? (language === 'zh' ? '先看整体，再选择一个观看问题。' : 'Look at the whole, then choose a question.')}</h3>
    <div className="c-compare-instrument">
      <div className="c-garden-names"><span>{language === 'zh' ? '苏州 · 网师园' : 'SUZHOU · MASTER-OF-NETS'}</span><span>WILTSHIRE · STOURHEAD</span></div>
      <div className="s04-observation-board">
      <div className="c-compare-frame" data-culture-reveal="image">
        <div className="c-compare-layer c-compare-uk"><Photo id="UK-01" language={language} onFailed={() => setImageFailed(true)} /><MutedPhoto side="uk" /><FocusedDetails side="uk" armed={armed} failed={imageFailed} onFallback={() => setArtFallback(true)} /></div>
        <div className="c-compare-layer c-compare-cn"><Photo id="CN-01" language={language} onFailed={() => setImageFailed(true)} /><MutedPhoto side="cn" /><FocusedDetails side="cn" armed={armed} failed={imageFailed} onFallback={() => setArtFallback(true)} /></div>
        <div className="c-divider" aria-hidden="true"><span>↔</span><i /></div>
        <input className="c-compare-range" type="range" min={0} max={100} step="any" defaultValue={50} aria-label={language === 'zh' ? '两园画面分界，向右增加苏州画面' : 'Garden image boundary, move right to reveal more Suzhou'} aria-describedby="comparison-help" />
      </div>
      <Leaders index={displayed} />
      <div className="c-dimension-reading s04-annotations">
        <div className="c-reading-pair s04-note-pair">{(['cn','uk'] as const).map(side => <article key={side} className={`s04-curator-note s04-note-${side}`} style={{'--note-y': `${focusProfiles[side][displayed ?? 0].noteY}%`,'--note-anchor':focusProfiles[side][displayed ?? 0].point[0]/100} as CSSProperties}>
          <p className="c-overline">{side === 'cn' ? (language === 'zh' ? '网师园' : 'MASTER-OF-NETS') : 'STOURHEAD'}</p>
          <h4>{dimension?.[side].keyword[language] ?? (language === 'zh' ? '先看整体' : 'Look at the whole')}</h4>
          <p>{dimension?.[side].text[language] ?? (language === 'zh' ? '拖动一线，观察两幅真实园景。选择主题后，注释将从具体的景物出发。' : 'Move the boundary between two real views. Choose a theme to follow a particular relationship in each photograph.')}</p>
        </article>)}</div>
      </div>
      </div>
      {imageFailed && <p className="c-image-status" role="status">{language === 'zh' ? '摄影暂未完整载入，策展视觉已关闭。文字与完整阅读仍可使用。' : 'A photograph is unavailable; interpretive layers are disabled. Notes and the complete reading remain available.'}</p>}
      <div className="c-range-controls"><span id="comparison-help">{language === 'zh' ? '拖动视线 / 方向键 ±5% / ESC 回到摄影' : 'DRAG / ARROW KEYS ±5% / ESC FOR PHOTOGRAPHS'}</span><output className="c-split-output" aria-live="off">50% / 50%</output><div>{[0, 50, 100].map(value => <button key={value} type="button" data-split-preset={value} aria-pressed={value === 50} aria-label={language === 'zh' ? `苏州 ${value}%，Stourhead ${100 - value}%` : `Suzhou ${value} percent, Stourhead ${100 - value} percent`} onClick={() => controller.current?.setSplit(value)}>{value === 0 ? 'UK' : value === 100 ? 'CN' : '½'}</button>)}</div></div>
      <div className="c-visual-disclosure"><span>{artFallback ? (language === 'zh' ? '艺术层暂缺时显示摄影聚焦降级，不作为最终艺术素材。' : 'An unavailable art layer falls back to a focused photo detail, not finished artwork.') : (language === 'zh' ? 'AI 艺术化局部 · 基于真实摄影的策展表达，非史料' : 'AI ART STUDIES · INTERPRETATIONS OF REAL PHOTOGRAPHS, NOT HISTORICAL EVIDENCE')}</span><button type="button" onClick={original}>{language === 'zh' ? '只看原始摄影' : 'Photographs only'}</button></div>
      <div className="c-comparison-credits"><Credit id="CN-01" language={language} /><Credit id="UK-01" language={language} /></div>
    </div>
    <p className="c-overline s04-evidence-kind">{dimension ? evidenceLabels[dimension.evidence][language] : (language === 'zh' ? '原始摄影 · 等待你的观察' : 'ORIGINAL PHOTOGRAPHS · YOUR OBSERVATION BEGINS HERE')}</p>
    <p className="c-comparison-notice">{language === 'zh' ? '两张真实照片，来自不同园林与机位。局部绘图为本展的解释性表达，不增加或改写真实建筑，也不表示地形、尺度或年代对齐。两个案例不代表两国园林的全部。' : 'Real photographs from different gardens and viewpoints. Local drawings are interpretations for this exhibition; they add no buildings and imply no alignment of geography, scale or period. Neither case represents every garden in its country.'}</p>
    <details className="c-parallel-reading"><summary>{language === 'zh' ? '展开完整双图与七个观察问题' : 'Read both complete photographs and all seven questions'}</summary><div className="c-static-pair">{(['CN-01', 'UK-01'] as const).map(id => <figure key={id}><Photo id={id} language={language} /><figcaption>{exhibitionAssets[id].caption[language]}<Credit id={id} language={language} /></figcaption></figure>)}</div>{comparisonDimensions.map(item => <article key={item.id}><h3>{item.title[language]} · {item.question[language]}</h3><p>{language === 'zh' ? '网师园：' : 'Master-of-Nets: '}{item.cn.text[language]}</p><p>Stourhead: {item.uk.text[language]}</p></article>)}<Sources ids={sourceIds} language={language} /></details>
  </section>;
}

function MutedPhoto({ side }: { side: GardenSide }) {
  return <Image className="s04-muted-photo" src={exhibitionAssets[side === 'cn' ? 'CN-01' : 'UK-01'].src} width={1280} height={960} alt="" unoptimized loading="eager" />;
}

function FocusedDetails({ side, armed, failed, onFallback }: { side: GardenSide; armed: boolean; failed: boolean; onFallback: () => void }) {
  return <div className="c-interpretations" hidden={failed} aria-hidden="true">{focusProfiles[side].map((profile, i) => {
    const [x,y,w,h] = profile.box;
    const style = {'--crop-x':`${x}%`,'--crop-y':`${y}%`,'--crop-w':`${w}%`,'--crop-h':`${h}%`,'--focus-scale':profile.scale,'--lift-x':`${profile.shift[0]}%`,'--lift-y':`${profile.shift[1]}%`} as CSSProperties;
    return <div key={i} className="c-study-layer s04-detail-layer" data-study-index={i} style={style}>
      <div className="s04-focus-window">
        <Image className="s04-focus-photo" src={exhibitionAssets[side === 'cn' ? 'CN-01' : 'UK-01'].src} alt="" width={1280} height={960} unoptimized loading="eager" style={{width:`${10000/w}%`,height:`${10000/h}%`,left:`${-x/w*100}%`,top:`${-y/h*100}%`}} />
        {armed && <Image className="s04-focus-art" src={focusAsset(side,i)} alt="" width={1200} height={900} unoptimized loading="eager" onError={event => { event.currentTarget.style.visibility='hidden'; onFallback(); }} />}
      </div>
    </div>;
  })}</div>;
}

function Atmospheres({ armed, failed }: { armed: boolean; failed: boolean }) {
  return <div className="s04-atmospheres" hidden={failed} aria-hidden="true">{comparisonDimensions.map((item,i)=><div className="c-study-layer s04-mood" key={item.id} data-study-index={i}>
    {(['cn','uk'] as const).map(side => <MoodImage key={side} side={side} background={focusProfiles[side][i].background} armed={armed} />)}
  </div>)}</div>;
}

function MoodImage({ side, background, armed }: { side: GardenSide; background: number; armed: boolean }) {
  const [fallback,setFallback] = useState(false);
  return armed && <Image className={`s04-mood-image s04-mood-${side}`} src={fallback ? backgroundPhotos[side][background] : backgroundAsset(side,background)} alt="" width={1280} height={960} unoptimized loading="eager" data-fallback={fallback || undefined} onError={()=>setFallback(true)} />;
}

function Leaders({ index }: { index: number | null }) {
  return <svg className="s04-leaders" viewBox="0 0 1000 750" preserveAspectRatio="none" aria-hidden="true">{index !== null && (['cn','uk'] as const).map(side=>{
    const p=focusProfiles[side][index];
    const x=(16+p.point[0]*.68)*10;
    const y=p.point[1]*7.5;
    const end=side==='cn'?140:860;
    const noteY=p.noteY*7.5+45;
    const desktop=`M${x} ${y} L${side==='cn'?x-24:x+24} ${y} L${end} ${noteY}`;
    const mobile=`M${p.point[0]*10} ${y} L${side==='cn'?250:750} 735 L${side==='cn'?250:750} 805`;
    return <g key={side} className={`s04-leader-${side}`} style={{'--note-anchor':p.point[0]/100} as CSSProperties}><path className="s04-leader-desktop s04-leader-halo" d={desktop} pathLength={1000}/><path className="s04-leader-desktop" d={desktop} pathLength={1000}/><path className="s04-leader-mobile s04-leader-halo" d={mobile} pathLength={1000}/><path className="s04-leader-mobile" d={mobile} pathLength={1000}/></g>;
  })}</svg>;
}

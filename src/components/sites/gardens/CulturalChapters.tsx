"use client";

import Image from 'next/image';
import { GardenComparison } from './GardenComparison';
import { useState } from 'react';
import { culturalStops, evidenceLabels, contentSourceCatalog, exhibitionAssets, photographCredits, type ExhibitionLanguage } from '@/lib/gardens/content';

interface Props {
  language: ExhibitionLanguage;
  stillMode: boolean;
  onLanguageChange: () => void;
  onStillChange: () => void;
}
type PhotoId = 'CN-01' | 'CN-03' | 'UK-01' | 'UK-03';

function Photograph({ id, language, onFailed }: { id: PhotoId; language: ExhibitionLanguage; onFailed?: () => void }) {
  const [failed, setFailed] = useState(false);
  const asset = exhibitionAssets[id];
  return failed ? <p className="c-image-fallback">{asset.alt[language]}<span>{language === 'zh' ? '图像暂未载入，仍可继续阅读。' : 'The image is unavailable. You can continue reading.'}</span></p>
    : <Image src={asset.src} alt={asset.alt[language]} width={id === 'CN-03' ? 1800 : id === 'UK-03' ? 1800 : 1280} height={id === 'CN-03' ? 2400 : id === 'UK-03' ? 1100 : 960} unoptimized loading="eager" sizes="(max-width:767px) 90vw, 70vw" onError={() => { setFailed(true); onFailed?.(); }} />;
}

function Credit({ id, language }: { id: PhotoId; language: ExhibitionLanguage }) {
  const asset = exhibitionAssets[id];
  const credit = photographCredits[asset.creditId];
  return <span className="c-credit"><a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.creator}</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a><span>{language === 'zh' ? '等比例缩放，保留完整构图' : 'Resized proportionally; full composition retained'}</span></span>;
}

function Sources({ ids, language }: { ids: readonly string[]; language: ExhibitionLanguage }) {
  return <details className="c-sources"><summary>{language === 'zh' ? '资料与范围' : 'Sources & scope'}</summary><ul>{ids.map(id => {
    const source = contentSourceCatalog.find(item => item.id === id);
    return source && <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.label[language]} ↗</a></li>;
  })}</ul></details>;
}

export function CulturalChapters(props: Props) {
  const { language } = props;
  return <>
    <section className="c-context" id="culture" aria-labelledby="culture-title">
      <span id="journey-end" className="c-anchor" tabIndex={-1} />
      <div className="c-section-top"><p className="g-kicker"><span>03</span><i aria-hidden="true" />{language === 'zh' ? '寄意 · 解释' : 'THE MAKING OF A VIEW'}</p><Tools {...props} /></div>
      <header className="c-context-heading">
        <p className="c-overline" data-culture-reveal="title">{language === 'zh' ? '从观看，走向理解' : 'FROM LOOKING TO UNDERSTANDING'}</p>
        <h2 id="culture-title" tabIndex={-1} data-culture-reveal="title">{language === 'zh' ? <>景为何<br />如此展开？</> : <>Why is the view<br />composed this way?</>}</h2>
        <p data-culture-reveal="body">{language === 'zh' ? '同样是人工经营的风景，园林的尺度、图像传统与历史用途，会影响人如何接近它。' : 'Both are cultivated landscapes. Their scale, visual traditions and historical purposes shape how we encounter them.'}</p>
      </header>
      <div className="c-evidence-pair">
        <figure className="c-window-study"><div className="c-study-image" data-culture-reveal="image"><Photograph id="CN-03" language={language} /></div><figcaption data-culture-reveal="body"><span className="c-overline">{language === 'zh' ? '画面观察 · 网师园' : 'IN THE PHOTOGRAPH · SUZHOU'}</span><p>{language === 'zh' ? '一道圆窗，让山石进入室内的层次。' : 'A round opening brings garden rocks into the layers of a room.'}</p><Credit id="CN-03" language={language} /></figcaption></figure>
        <div className="c-between" aria-hidden="true"><span>{language === 'zh' ? '位置' : 'SETTING'}</span><i /><span>{language === 'zh' ? '图像' : 'IMAGES'}</span><i /><span>{language === 'zh' ? '使用' : 'USE'}</span></div>
        <figure className="c-lake-study"><div className="c-study-image" data-culture-reveal="image"><Photograph id="UK-03" language={language} /></div><figcaption data-culture-reveal="body"><span className="c-overline">{language === 'zh' ? '画面观察 · STOURHEAD' : 'IN THE PHOTOGRAPH · STOURHEAD'}</span><p>{language === 'zh' ? '树荫、桥与湖面，让视线由近而远。' : 'Shade, bridge and lake lead the eye from near to far.'}</p><Credit id="UK-03" language={language} /></figcaption></figure>
      </div>
      <div className="c-context-notes">
        {culturalStops.map((stop, i) => <article className="c-context-note" key={stop.id} id={`culture-${stop.id}`}>
          <span className="c-idea-word" aria-hidden="true" data-culture-reveal="title">{stop.word[language]}</span>
          <div><p className="c-overline" data-culture-reveal="title">0{i + 1} / {evidenceLabels[stop.kind][language]}</p><h3 data-culture-reveal="title">{stop.title[language]}</h3><div data-culture-reveal="body"><p>{stop.text[language]}</p><Sources ids={stop.sourceIds} language={language} /></div></div>
        </article>)}
        <p className="c-scope-note" data-culture-reveal="body">{language === 'zh' ? '框景可从开口与景物的关系中辨认；借景还须结合场地边界与资料，不能将所有窗景都称作借景。照片呈现今天的一个视点，历史语境与策展解读分别标示。' : 'A framed view can be read from the relationship between an opening and its scene. Borrowed scenery also requires evidence about the site and its boundaries: not every window view is a borrowed view. Photographs, historical context and curatorial readings are distinguished here.'}</p>
      </div>
      <p className="c-bridge" data-culture-reveal="title">{language === 'zh' ? '带着同一个问题，再把两幅景放在一起。' : 'Carry one question into both views.'}<span aria-hidden="true">↓</span></p>
    </section>
    <Comparison {...props} />
  </>;
}

function Tools({ language, stillMode, onLanguageChange, onStillChange }: Props) {
  return <div className="c-tools"><a href="#culture">03</a><a href="#compare">04</a><button type="button" onClick={onStillChange} aria-pressed={stillMode}>{language === 'zh' ? '静览' : 'Still viewing'}</button><button type="button" onClick={onLanguageChange} aria-label={language === 'zh' ? '比较章节切换为英文' : 'Switch cultural chapters to Chinese'}>{language === 'zh' ? 'EN' : '中文'}</button></div>;
}

function Comparison(props: Props) {
  return <GardenComparison {...props} Photo={Photograph} Credit={Credit} Sources={Sources} Tools={Tools} />;
}

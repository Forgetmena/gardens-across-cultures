"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { contentSourceCatalog, evidenceLabels, exhibitionAssets, photographCredits, type ExhibitionLanguage } from '@/lib/gardens/content';
import { sharedChapter } from '@/lib/gardens/shared-content';

interface Props {
  language: ExhibitionLanguage;
  stillMode: boolean;
  onLanguageChange: () => void;
  onStillChange: () => void;
}

export function SharedQuestions({ language, stillMode, onLanguageChange, onStillChange }: Props) {
  const root = useRef<HTMLElement>(null);
  const reading = useRef<{ element: HTMLElement; top: number } | null>(null);
  function changeLanguage() {
    const candidates = [...(root.current?.querySelectorAll<HTMLElement>('[data-shared-anchor]') ?? [])];
    const visible = candidates.map(element => ({ element, top: element.getBoundingClientRect().top })).filter(item => item.top < innerHeight && item.element.getBoundingClientRect().bottom > 0);
    reading.current = visible.sort((a, b) => Math.abs(a.top) - Math.abs(b.top))[0] ?? null;
    onLanguageChange();
  }
  // Settle once after the parent's whole-exhibition language/layout refresh.
  // This is a cancellable one-frame correction, not a scroll animation loop.
  useEffect(() => {
    if (!reading.current) return;
    const { element, top } = reading.current;
    reading.current = null;
    const frame = requestAnimationFrame(() => window.scrollBy(0, element.getBoundingClientRect().top - top));
    return () => cancelAnimationFrame(frame);
  }, [language]);
  return <section id="shared" ref={root} className="s05-shared" aria-labelledby="shared-title">
    <div className="s05-threshold" aria-hidden="true"><i /></div>
    <div className="s05-top" data-shared-anchor>
      <p className="g-kicker"><span>05</span><i aria-hidden="true" />{language === 'zh' ? '共境 · 共同提问' : 'SHARED QUESTIONS'}</p>
      <div className="s05-tools"><a href="#compare" aria-label={language === 'zh' ? '回看 04 对照' : 'Return to 04 Comparison'}>04 ↗</a><button type="button" onClick={onStillChange} aria-pressed={stillMode}>{language === 'zh' ? '静览' : 'Still viewing'}</button><button type="button" onClick={changeLanguage} aria-label={language === 'zh' ? '共境章节切换为英文' : 'Switch shared questions to Chinese'}>{language === 'zh' ? 'EN' : '中文'}</button></div>
    </div>
    <header className="s05-heading" data-shared-anchor>
      <p className="s05-overline" data-shared-reveal="title">{language === 'zh' ? '从差异，走向共同提问' : 'BEYOND DIFFERENCE'}</p>
      <h2 id="shared-title" tabIndex={-1} data-shared-reveal="title">{language === 'zh' ? <>不同的路径，<br />也在回答一些<span className="s05-title-tail">相近的问题。</span></> : sharedChapter.title.en}</h2>
      <p className="s05-intro" data-shared-reveal="body">{sharedChapter.intro[language]}</p>
    </header>
    <div className="s05-recollection" data-shared-anchor>
      <svg className="s05-waterline" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true" data-shared-reveal="line"><path pathLength="1" d="M500 0 V42 Q500 74 462 74 H300 Q280 74 280 97 V300 Q280 320 305 320 H910" /></svg>
      <SharedPhoto id="CN-01" language={language} />
      <SharedPhoto id="UK-01" language={language} />
    </div>
    <p className="s05-scope" data-shared-reveal="body">{sharedChapter.scope[language]}</p>
    <div className="s05-questions">
      {sharedChapter.questions.map((item, i) => <article key={item.id} id={`shared-${item.id}`} className="s05-question" data-shared-anchor>
        <span className="s05-number" aria-hidden="true" data-shared-reveal="title">0{i + 1}</span>
        <div className="s05-question-content">
          <p className="s05-overline" data-shared-reveal="title">{evidenceLabels[item.kind][language]}</p>
          <h3 data-shared-reveal="title">{item.title[language]}</h3>
          <p className="s05-body" data-shared-reveal="body">{item.text[language]}</p>
          <p className="s05-open-question" data-shared-reveal="question">{item.question[language]}</p>
          {item.sourceIds.length > 0 && <details className="s05-sources" data-shared-reveal="source"><summary>{language === 'zh' ? '历史语境 · 资料与范围' : 'HISTORICAL CONTEXT · SOURCES & SCOPE'}</summary><p>{language === 'zh' ? '资料支持两园的营造、变迁与维护语境；段末的问题属于本展策展提问。' : 'These sources support the gardens’ making, changes and care. The closing question is a curatorial invitation.'}</p><ul>{item.sourceIds.map(id => {
            const source = contentSourceCatalog.find(entry => entry.id === id);
            return source && <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.label[language]} ↗</a></li>;
          })}</ul></details>}
        </div>
      </article>)}
    </div>
    <div id="shared-exit" className="s05-exit" data-shared-anchor aria-hidden="true"><i data-shared-reveal="line" /></div>
  </section>;
}

function SharedPhoto({ id, language }: { id: 'CN-01' | 'UK-01'; language: ExhibitionLanguage }) {
  const [failed, setFailed] = useState(false);
  const asset = exhibitionAssets[id];
  const credit = photographCredits[asset.creditId];
  return <figure className={`s05-photo s05-photo-${id === 'CN-01' ? 'cn' : 'uk'}`}>
    <div className="s05-photo-surface" data-shared-reveal="image">
      {failed ? <p className="s05-image-fallback" role="status">{asset.alt[language]}<span>{language === 'zh' ? '摄影暂未载入，仍可继续阅读。' : 'The photograph is unavailable. You can continue reading.'}</span></p> : <Image src={asset.src} width={1280} height={960} alt={asset.alt[language]} unoptimized loading="eager" sizes="(max-width:767px) 78vw, 32vw" onError={() => setFailed(true)} />}
    </div>
    <figcaption data-shared-reveal="source"><p>{language === 'zh' ? (id === 'CN-01' ? '回看 · 网师园的池岸与厅堂' : '回看 · Stourhead 的湖面与神庙') : (id === 'CN-01' ? 'REVISITING · POOL & HALL, SUZHOU' : 'REVISITING · LAKE & TEMPLE, STOURHEAD')}</p><span><a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.creator}</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a></span><span>{language === 'zh' ? '真实摄影 · 完整构图，文件未改' : 'Real photograph · full composition, file unchanged'}</span></figcaption>
  </figure>;
}

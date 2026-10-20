"use client";

import { useEffect, useRef, type MouseEvent } from 'react';
import { contentSourceCatalog, photographCredits, type ExhibitionLanguage } from '@/lib/gardens/content';
import { closingChapter } from '@/lib/gardens/closing-content';

interface Props {
  language: ExhibitionLanguage;
  stillMode: boolean;
  onLanguageChange: () => void;
  onStillChange: () => void;
  onReturn: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function ClosingChapter({ language, stillMode, onLanguageChange, onStillChange, onReturn }: Props) {
  const root = useRef<HTMLElement>(null);
  const reading = useRef<{ element: HTMLElement; top: number } | null>(null);
  function changeLanguage() {
    const anchors = [...(root.current?.querySelectorAll<HTMLElement>('[data-closing-anchor]') ?? [])];
    reading.current = anchors.map(element => ({ element, top: element.getBoundingClientRect().top }))
      .filter(item => item.top < innerHeight && item.element.getBoundingClientRect().bottom > 0)
      .sort((a,b) => Math.abs(a.top) - Math.abs(b.top))[0] ?? null;
    onLanguageChange();
  }
  useEffect(() => {
    const saved = reading.current;
    reading.current = null;
    if (!saved) return;
    const frame = requestAnimationFrame(() => window.scrollBy(0, saved.element.getBoundingClientRect().top - saved.top));
    return () => cancelAnimationFrame(frame);
  }, [language]);
  function returnToEntrance(event: MouseEvent<HTMLAnchorElement>) {
    onReturn(event);
    const title = document.getElementById('exhibition-title');
    if (title) {
      // Temporary focus target; no changes to the approved entrance markup or layout.
      const previous = title.getAttribute('tabindex');
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
      title.addEventListener('blur', () => {
        if (previous === null) title.removeAttribute('tabindex');
        else title.setAttribute('tabindex', previous);
      }, { once: true });
    }
  }
  return <section id="credits" ref={root} className="s06-closing" aria-labelledby="closing-title">
    <div className="s06-top" data-closing-anchor>
      <p className="g-kicker"><span>06</span><i aria-hidden="true" />{language === 'zh' ? '留记' : 'A VIEW TO CARRY'}</p>
      <div className="s06-tools"><a href="#shared" aria-label={language === 'zh' ? '回到 05 共境' : 'Return to 05 Shared questions'}>05 ↗</a><button type="button" onClick={onStillChange} aria-pressed={stillMode}>{language === 'zh' ? '静览' : 'Still viewing'}</button><button type="button" onClick={changeLanguage} aria-label={language === 'zh' ? '留记章节切换为英文' : 'Switch closing chapter to Chinese'}>{language === 'zh' ? 'EN' : '中文'}</button></div>
    </div>
    <div className="s06-room">
      <p className="s06-name" data-culture-reveal="title"><span lang="zh-CN">一园两境</span><span lang="en">Gardens Across Cultures</span></p>
      <svg className="s06-window-echo" viewBox="0 0 360 160" fill="none" aria-hidden="true" data-culture-reveal="title"><path d="M46 128V68a46 46 0 0 1 92 0v60M20 128h218c35 0 50 14 91 14" /></svg>
      <div className="s06-reflection" data-closing-anchor>
        <p className="s06-evidence" data-culture-reveal="title">{closingChapter.evidence[language]}</p>
        <h2 id="closing-title" tabIndex={-1} data-culture-reveal="title">{language === 'zh' ? <>两座园林，<span className="s06-title-second">两种观看方式。</span></> : closingChapter.first.en}</h2>
        <p className="s06-final-thought" data-culture-reveal="body">{closingChapter.reflection[language]}</p>
        <nav className="s06-actions" aria-label={language === 'zh' ? '展览结尾' : 'At the end of the exhibition'} data-culture-reveal="body"><a className="s06-return" href="#entrance" onClick={returnToEntrance}>{closingChapter.returnLabel[language]}<span aria-hidden="true">↗</span></a><a href="#exhibition-sources">{closingChapter.sourcesLabel[language]}<span aria-hidden="true">↓</span></a></nav>
      </div>
    </div>
    <div id="exhibition-sources" className="s06-source-index" data-closing-anchor>
      <details>
        <summary>{language === 'zh' ? '资料、图像与制作说明' : 'Sources, images & production notes'}<span aria-hidden="true">＋</span></summary>
        <div className="s06-source-content">
          <div><h3>{language === 'zh' ? '历史资料' : 'Historical sources'}</h3><p>{language === 'zh' ? '历史语境依据以下资料。照片观察与策展解释分别标示；两处案例不代表两国园林的全部。' : 'These sources inform the historical context. Photographic observations and curatorial interpretations are labelled separately. Neither case represents every garden in its country.'}</p><ul>{contentSourceCatalog.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.label[language]} ↗</a></li>)}</ul></div>
          <div><h3>{language === 'zh' ? '真实摄影与授权' : 'Photographs & permissions'}</h3><ul>{Object.values(photographCredits).map(credit => <li key={credit.assetId}><span className="s06-asset-id">{credit.assetId}</span><a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.creator}</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a></li>)}</ul><p>{language === 'zh' ? '照片均为已登记的网师园或 Stourhead 摄影。本地文件等比例缩放；各章节图注另列显示裁切与原始来源，照片各自的许可持续适用。' : 'Registered photographs show the Master-of-Nets Garden or Stourhead. Local files are resized proportionally; chapter credits describe display crops and link to the originals. Each photograph retains its own licence.'}</p></div>
          <div><h3>{language === 'zh' ? '艺术表达与字体' : 'Artwork & type'}</h3><p>{language === 'zh' ? '入口水彩为 AI 辅助艺术意象。比较章节的局部绘画与淡背景，是基于真实摄影的 AI 策展表达，用于提示观看重点，不作为历史照片或建筑测绘。参考摄影的作者、来源及许可见上方记录。' : 'The entrance watercolor is an AI-assisted artistic interpretation. Painted details and atmospheric backgrounds in the comparison chapter are AI interpretations based on real photographs. They guide attention, rather than serve as historical photographs or measured drawings. Reference-photo authors, sources and licences are listed above.'}</p><p><a href="/sites/gardens/fonts/NotoSerifSC-OFL.txt" target="_blank" rel="noreferrer">Noto Serif SC · SIL OFL 1.1</a><br /><a href="/sites/gardens/fonts/CormorantGaramond-OFL.txt" target="_blank" rel="noreferrer">Cormorant Garamond · SIL OFL 1.1</a></p></div>
          <div><h3>{language === 'zh' ? '关于本展' : 'About the exhibition'}</h3><p>{language === 'zh' ? '《跨文化交际与国际智慧》课程双语网页作品，以网师园与 Stourhead 为案例，用英语介绍中国园林，并练习理解不同的观看方式。先观察具体景物，再了解历史语境，最后提出自己的解释：这是本展邀请观众尝试的跨文化理解方法。展览正文为当代策展写作；结尾短句不归于历史人物。' : 'A bilingual web exhibition for Intercultural Communication and International Wisdom. The Master-of-Nets Garden and Stourhead introduce Chinese garden culture in English and invite reflection on different ways of seeing. Observe a detail, learn its context, then offer an interpretation: this is the approach to intercultural understanding proposed here. The texts are contemporary curatorial writing; the closing reflection is not a historical quotation.'}</p></div>
        </div>
      </details>
    </div>
  </section>;
}

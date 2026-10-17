"use client";

import Image from "next/image";
import { useState } from "react";
import { exhibitionAssets, exhibitionChapters, gardenCases, gardenJourneyNotice, gardenJourneyViews, photographCredits, type ExhibitionLanguage } from "@/lib/gardens/content";

type JourneyView = (typeof gardenJourneyViews)[number];

interface JourneySceneProps {
  language: ExhibitionLanguage;
  stillMode: boolean;
  onLanguageChange: () => void;
  onStillChange: () => void;
}

/** One semantic set of photographs serves both the sticky and sequential layouts. */
export function JourneyScene({ language, stillMode, onLanguageChange, onStillChange }: JourneySceneProps) {
  const chapter = exhibitionChapters[2];
  return (
    <>
      <section className="g-path" id="journey" aria-labelledby="journey-title">
        <header className="g-path-intro">
          <p className="g-kicker"><span>02</span><i aria-hidden="true" />{language === "zh" ? "游径 · 移步换景" : "VIEWS IN MOTION"}</p>
          <h2 id="journey-title" className="g-path-heading" tabIndex={-1}>{chapter.title[language]}</h2>
          <p>{chapter.standfirst[language]}</p>
          <a className="g-path-skip" href="#journey-end">{language === "zh" ? "跳过换景" : "Skip the sequence"} <span aria-hidden="true">↓</span></a>
        </header>
        <div className="g-path-track">
          <div className="g-path-stage">
            <div className="g-path-toolbar">
              <span className="g-path-brand" lang="zh-CN">一园两境 <span lang="en">/ Gardens Across Cultures</span></span>
              <ol className="g-path-steps" aria-label={language === "zh" ? "观看次序" : "Viewing sequence"}>
                {gardenJourneyViews.map((view, index) => <li key={view.id} data-path-step={index}><span>{String(index + 1).padStart(2, "0")}</span> {view.label[language]}</li>)}
              </ol>
              <div className="g-path-tools">
                <button type="button" onClick={onStillChange} aria-pressed={stillMode}>{language === "zh" ? "静览" : "Still viewing"}</button>
                <button type="button" onClick={onLanguageChange} aria-label={language === "zh" ? "Switch journey to English" : "游径切换为中文"}>{language === "zh" ? "EN" : "中文"}</button>
              </div>
            </div>
            <div className="g-path-scenes">
              {gardenJourneyViews.map((view, index) => <PathView key={view.id} view={view} index={index} language={language} />)}
            </div>
            <div className="g-path-bottom">
              <p>{gardenJourneyNotice[language]}</p>
              <a className="g-path-scroll-note" href="#journey-end">{language === "zh" ? "继续阅读" : "CONTINUE READING"} <span aria-hidden="true">↓</span></a>
              <div className="g-path-progress" aria-hidden="true"><i /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PathView({ view, index, language }: { view: JourneyView; index: number; language: ExhibitionLanguage }) {
  const [failed, setFailed] = useState(false);
  const asset = exhibitionAssets[view.assetId];
  const credit = photographCredits[asset.creditId];
  const garden = gardenCases[view.caseId];
  return (
    <article className="g-path-scene" id={`journey-${view.id}`} data-path-scene={index} data-asset={view.assetId} aria-labelledby={`path-title-${view.id}`}>
      <div className="g-path-text">
        <div className="g-path-label">
          <p className="g-path-place">{garden.location[language]}</p>
          <h3 id={`path-title-${view.id}`}><span className="g-path-number">{String(index + 1).padStart(2, "0")}</span><span lang={language === "zh" ? "zh-CN" : "en"}>{view.label[language]}</span></h3>
          <p className="g-path-garden">{garden.name[language]}</p>
        </div>
        <p className="g-path-reflection"><span>{view.text[language]}</span></p>
      </div>
      <figure className="g-path-figure">
        <div className={`g-path-image-shell${failed ? " is-failed" : ""}`}>
          <div className="g-path-image-plane">
            {!failed ? <Image src={asset.src} alt={asset.alt[language]} width={1800} height={view.assetId === "CN-03" ? 2400 : view.assetId === "UK-03" ? 1100 : 1350} unoptimized loading={index === 0 ? "eager" : "lazy"} sizes="(max-width: 767px) 90vw, 64vw" onError={() => setFailed(true)} />
              : <p className="g-path-image-fallback">{asset.alt[language]}<span>{language === "zh" ? "图像暂未载入，展签与后续阅读仍可使用。" : "The image is unavailable. Captions and the rest of the exhibition remain readable."}</span></p>}
          </div>
          <div className="g-path-veil" aria-hidden="true" />
          <div className="g-path-frame" aria-hidden="true" />
        </div>
        <figcaption className="g-path-caption">
          <span className="g-path-caption-text">{asset.caption[language]}</span>
          <span className="g-path-credit"><a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.creator}</a><span aria-hidden="true"> · </span><a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a></span>
          <span className="g-path-change">{view.assetId === "CN-03" ? (language === "zh" ? "等比例缩放 · 保留完整构图" : "Resized proportionally · full composition retained") : (language === "zh" ? "等比例缩放 · 画框内裁切显示" : "Resized proportionally · cropped within the display frame")}</span>
        </figcaption>
      </figure>
    </article>
  );
}

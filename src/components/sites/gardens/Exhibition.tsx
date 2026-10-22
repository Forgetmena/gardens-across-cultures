"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { contentSourceCatalog, exhibitionAssets, exhibitionChapters, gardenCases, photographCredits, type ExhibitionLanguage } from "@/lib/gardens/content";
import { createEntranceJourney, type EntranceJourney } from "@/lib/gardens/entrance-journey";
import { JourneyScene } from "./JourneyScene";
import { CulturalChapters } from "./CulturalChapters";
import { SharedQuestions } from "./SharedQuestions";
import { ClosingChapter } from "./ClosingChapter";

const artworkLayers = ["back", "water", "foreground"] as const;

function Landscape({ language }: { language: ExhibitionLanguage }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`g-landscape${failed ? " is-failed" : ""}`} role="img" aria-label={language === "zh" ? "原创水彩山水艺术意象" : "Original watercolor landscape illustration"}>
      {artworkLayers.map((layer) => (
        <Image key={layer} className={`g-art-layer g-art-${layer}`} src={`/sites/gardens/art/ART-01-${layer}.webp`} alt="" width={1536} height={1024} unoptimized loading="eager" onError={() => setFailed(true)} />
      ))}
      {failed && <span className="g-art-fallback">{language === "zh" ? "山水画暂未载入，仍可入园" : "The illustration is unavailable. You can still enter."}</span>}
    </div>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export function Exhibition() {
  const [language, setLanguage] = useState<ExhibitionLanguage>("en");
  const [stillMode, setStillMode] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const journey = useRef<EntranceJourney | null>(null);
  const s00 = exhibitionChapters[0];
  const s01 = exhibitionChapters[1];

  useEffect(() => {
    if (!root.current) return;
    try {
      journey.current = createEntranceJourney(root.current);
    } catch {
      root.current.classList.remove("g-journey-ready");
    }
    return () => { journey.current?.dispose(); journey.current = null; };
  }, []);
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    journey.current?.refresh();
  }, [language]);
  useEffect(() => {
    root.current?.classList.toggle("is-still", stillMode);
    journey.current?.setStill(stillMode);
  }, [stillMode]);

  function enterGarden(event: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (journey.current) journey.current.enter();
    else {
      document.getElementById("portraits")?.scrollIntoView({ behavior: "auto" });
      document.getElementById("portraits-title")?.focus({ preventScroll: true });
    }
  }

  function jumpToGallery(event: MouseEvent<HTMLAnchorElement>) {
    if (!journey.current) return;
    event.preventDefault();
    journey.current.jumpToGallery();
  }

  function returnToEntrance(event: MouseEvent<HTMLAnchorElement>) {
    if (!journey.current) return;
    event.preventDefault();
    journey.current.returnToStart();
  }
  function spaceToEnter(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === " ") enterGarden(event);
  }

  return (
    <div className="g-exhibition" ref={root}>
      <a className="g-skip" href="#portraits" onClick={jumpToGallery}>{language === "zh" ? "跳至园林介绍" : "Skip to the gardens"}</a>
      <main>
      <div className="g-entry-track">
      <div className="g-entry-stage">
      <header className="g-header">
        <a className="g-wordmark" href="#entrance" onClick={returnToEntrance} aria-label={language === "zh" ? "一园两境，回到入口" : "Gardens Across Cultures, return to the entrance"}>
          <span className="g-logo-circle" aria-hidden="true" /><span lang="zh-CN">一园两境</span>
        </a>
        <nav className="g-nav" aria-label={language === "zh" ? "展览导航" : "Exhibition navigation"}>
          <a href="#portraits" onClick={jumpToGallery}><span className="g-nav-index">01</span> {language === "zh" ? "双景" : "Two gardens"} <Arrow diagonal /></a>
          <span className="g-nav-rule" aria-hidden="true" />
          <button type="button" className="g-language" aria-label={language === "zh" ? "Switch to English" : "切换为中文"} onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>
            <span lang="zh-CN" className={language === "zh" ? "is-current" : ""}>中</span><span aria-hidden="true"> / </span><span lang="en" className={language === "en" ? "is-current" : ""}>EN</span>
          </button>
        </nav>
      </header>
        <section className="g-hero" id="entrance" aria-labelledby="exhibition-title">
          <div className="g-hero-grid">
            <div className="g-hero-copy">
              <p className="g-kicker"><span>00</span><i aria-hidden="true" />{language === "zh" ? "园境之间" : "BETWEEN TWO WORLDS"}</p>
              <h1 id="exhibition-title"><span className="g-title-cn" lang="zh-CN">{s00.title.zh}</span><span className="g-title-en" lang="en">Gardens Across<br /> Cultures</span></h1>
              <p className="g-hero-intro">{s00.standfirst[language]}</p>
              <a className="g-enter" href="#portraits" onClick={enterGarden} onKeyDown={spaceToEnter}><span>{language === "zh" ? "入园" : "Enter the exhibition"}</span><span className="g-enter-arrow"><Arrow /></span></a>
            </div>
            <div className="g-art-column">
              <span className="g-art-side" aria-hidden="true">{language === "zh" ? "以窗为界 · 以水相连" : "FRAMED VIEWS · SHARED WATERS"}</span>
              <a className="g-gate" href="#portraits" onClick={enterGarden} onKeyDown={spaceToEnter} aria-label={language === "zh" ? "穿过月洞门，进入园林展览" : "Enter the garden exhibition through the moon gate"}>
                <div className="g-art-clip"><Landscape language={language} /></div>
                <Image className="g-gate-outline" src="/sites/gardens/art/ART-02-moon-gate.svg" alt="" width={1000} height={1000} unoptimized />
                <span className="g-gate-prompt" aria-hidden="true">{language === "zh" ? "由此入境" : "STEP INSIDE"} <Arrow /></span>
              </a>
              <p className="g-art-caption">{language === "zh" ? "山水意象 · 原创水彩" : "LANDSCAPE STUDY · ORIGINAL WATERCOLOR"}</p>
            </div>
          </div>
          <div className="g-hero-bottom">
            <p>{language === "zh" ? "一场关于自然、艺术与文化的对望" : "An encounter with nature, art and culture"}</p>
            <a href="#portraits" onClick={jumpToGallery}>{language === "zh" ? "向下探索" : "Scroll to discover"}<span aria-hidden="true">↓</span></a>
            <span className="g-edition">{language === "zh" ? "跨文化交际与国际智慧" : "INTERCULTURAL COMMUNICATION"}</span>
          </div>
        </section>
        <div className="g-transition-world" aria-hidden="true">
          <div className="g-world-paper" />
          <div className="g-world-paint"><Landscape language={language} /></div>
          <JourneyPhoto id="CN-01" language={language} />
          <JourneyPhoto id="UK-01" language={language} />
          <div className="g-world-mist" />
        </div>
      </div>
      </div>
        <section id="portraits" className="g-portraits" aria-labelledby="portraits-title">
          <div className="g-section-heading">
            <p className="g-kicker"><span>01</span><i aria-hidden="true" />{language === "zh" ? "双景" : "TWO GARDENS"}</p>
            <h2 id="portraits-title" tabIndex={-1}>{s01.title[language]}</h2>
            <p>{s01.standfirst[language]}</p>
          </div>
          <div className="g-diptych"><GardenPortrait language={language} side="suzhou" /><GardenPortrait language={language} side="stourhead" /></div>
          <p className="g-case-note">{language === "zh" ? "两座园林是理解两种造景传统的入口。个案的差异，始终与它的地点、年代和使用者相连。" : "These gardens offer two ways into the art of landscape. Each belongs to a particular place, period and community of makers and users."}</p>
        </section>
        <JourneyScene language={language} stillMode={stillMode} onLanguageChange={() => setLanguage(language === "zh" ? "en" : "zh")} onStillChange={() => setStillMode(!stillMode)} />
        <CulturalChapters language={language} stillMode={stillMode} onLanguageChange={() => setLanguage(language === "zh" ? "en" : "zh")} onStillChange={() => setStillMode(!stillMode)} />
        <SharedQuestions language={language} stillMode={stillMode} onLanguageChange={() => setLanguage(language === "zh" ? "en" : "zh")} onStillChange={() => setStillMode(!stillMode)} />
        <ClosingChapter language={language} stillMode={stillMode} onLanguageChange={() => setLanguage(language === "zh" ? "en" : "zh")} onStillChange={() => setStillMode(!stillMode)} onReturn={returnToEntrance} />
      </main>
      <footer className="g-footer">
        <a className="g-wordmark" href="#entrance" onClick={returnToEntrance}><span lang="zh-CN">一园两境</span><span className="g-footer-en" lang="en">Gardens Across Cultures</span></a>
        <button className="g-still-toggle" type="button" aria-pressed={stillMode} onClick={() => setStillMode(!stillMode)}>{language === "zh" ? "静览模式" : "Still viewing"}<span aria-hidden="true"> {stillMode ? "○" : "↝"}</span></button>
        <a href="#entrance" onClick={returnToEntrance}>{language === "zh" ? "回到入口" : "Back to the entrance"} ↑</a>
      </footer>
    </div>
  );
}

function JourneyPhoto({ id, language }: { id: "CN-01" | "UK-01"; language: ExhibitionLanguage }) {
  const [failed, setFailed] = useState(false);
  const asset = exhibitionAssets[id];
  return (
    <div className={`g-world-photo${failed ? " is-failed" : ""}`} data-asset={id}>
      {!failed && <Image src={asset.src} alt="" width={1280} height={960} unoptimized loading="eager" onError={() => setFailed(true)} />}
      {failed && <p>{asset.alt[language]}</p>}
      <span>{id === "CN-01" ? (language === "zh" ? "苏州 · 网师园" : "SUZHOU · MASTER-OF-NETS") : (language === "zh" ? "威尔特郡 · Stourhead" : "WILTSHIRE · STOURHEAD")}</span>
    </div>
  );
}

function GardenPortrait({ language, side }: { language: ExhibitionLanguage; side: "suzhou" | "stourhead" }) {
  const [failed, setFailed] = useState(false);
  const garden = gardenCases[side];
  const asset = exhibitionAssets[garden.heroAssetId];
  const credit = photographCredits[asset.creditId];
  const paragraph = exhibitionChapters[1].paragraphs[side === "suzhou" ? 0 : 1];
  const cleanText = paragraph.text[language].replace(/\[CS-[^\]]+\]/g, "");
  return (
    <article className={`g-portrait g-portrait-${side}`}>
      <figure>
        <div className="g-photo">
          {!failed ? <Image src={asset.src} alt={asset.alt[language]} width={1280} height={960} unoptimized onError={() => setFailed(true)} sizes="(max-width: 767px) 90vw, 42vw" /> : <p className="g-photo-fallback">{asset.alt[language]}<br />{language === "zh" ? "图片暂未载入" : "Photograph unavailable"}</p>}
        </div>
        <figcaption data-scroll-reveal="caption"><span>{asset.caption[language]}</span></figcaption>
      </figure>
      <div className="g-portrait-copy">
        <div className="g-portrait-identity" data-scroll-reveal="identity">
          <p className="g-location"><span>{side === "suzhou" ? "31°17′N · 120°38′E" : "51°06′N · 02°19′W"}</span><span>{garden.location[language]}</span></p>
          <h3>{garden.name[language]}</h3>
        </div>
        <p className="g-portrait-body" data-scroll-reveal="body">{cleanText}</p>
        <div className="g-sources" data-scroll-reveal="source"><span>{language === "zh" ? "资料与图像授权" : "Sources & image credit"}</span>{paragraph.sourceIds.map((id, index) => {
          const source = contentSourceCatalog.find((item) => item.id === id);
          return source && <a key={id} href={source.url} target="_blank" rel="noreferrer" aria-label={source.label[language]}>[{index + 1}]</a>;
        })}<span className="g-photo-credit"><a href={credit.sourceUrl} target="_blank" rel="noreferrer">{side === "suzhou" ? "Chinatravelsavvy / China Travel Guide" : credit.creator}</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a></span><span className="g-resize-note">{language === "zh" ? "Commons 等比例缩图 · 未作其他修改" : "Resized by Commons · no further image edits"}</span></div>
      </div>
    </article>
  );
}

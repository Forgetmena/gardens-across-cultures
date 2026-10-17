import { comparisonDimensions, culturalStops } from "./cultural-content";
import { sharedChapter } from "./shared-content";
import { closingChapter } from "./closing-content";
export { sharedChapter } from "./shared-content";
export { comparisonDimensions, culturalStops, evidenceLabels } from "./cultural-content";

/** Curated bilingual copy and stable identifiers for the Gardens Across Cultures exhibition. */

export type ExhibitionLanguage = "zh" | "en";

export const gardenCases = {
  suzhou: {
    id: "CASE-CN-WANGSHI",
    name: {
      zh: "苏州网师园",
      en: "The Master-of-Nets Garden",
    },
    location: {
      zh: "苏州，中国",
      en: "Suzhou, China",
    },
    sourceIds: ["CS-01", "CS-02"],
    heroAssetId: "CN-01",
  },
  stourhead: {
    id: "CASE-UK-STOURHEAD",
    name: {
      zh: "Stourhead 风景园林",
      en: "Stourhead Landscape Garden",
    },
    location: {
      zh: "威尔特郡，英格兰",
      en: "Wiltshire, England",
    },
    sourceIds: ["CS-03", "CS-04"],
    heroAssetId: "UK-01",
  },
} as const;

export const contentSourceCatalog = [
  {
    id: "CS-01",
    label: {
      zh: "UNESCO：苏州古典园林名录",
      en: "UNESCO: Classical Gardens of Suzhou",
    },
    url: "https://whc.unesco.org/en/list/813",
  },
  {
    id: "CS-02",
    label: {
      zh: "UNESCO：苏州古典园林提名资料",
      en: "UNESCO: Classical Gardens of Suzhou nomination document",
    },
    url: "https://whc.unesco.org/document/154344",
  },
  {
    id: "CS-03",
    label: {
      zh: "National Trust：Stourhead 花园史",
      en: "National Trust: History of the garden at Stourhead",
    },
    url: "https://www.nationaltrust.org.uk/visit/wiltshire/stourhead/history-of-the-garden-at-stourhead",
  },
  {
    id: "CS-04",
    label: {
      zh: "National Trust：Stourhead 庄园史",
      en: "National Trust: History of Stourhead",
    },
    url: "https://www.nationaltrust.org.uk/visit/wiltshire/stourhead/history-of-stourhead-house",
  },
] as const;

export const photographCredits = {
  "IMG-CN-01": {
    assetId: "CN-01",
    title: "Master of Nets Garden 1.jpg",
    creator: "Chinatravelsavvy / ChinaTravelSavvy.Com - China Travel Guide",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Master_of_Nets_Garden_1.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    changes: "Wikimedia Commons resized the source image to 1280×960; no further local image edits.",
  },
  "IMG-UK-01": {
    assetId: "UK-01",
    title: "GardenLake ApolloTemple Stourhead.jpg",
    creator: "Martinvl",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:GardenLake_ApolloTemple_Stourhead.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    changes: "Wikimedia Commons resized the source image to 1280×960; no further local image edits.",
  },
  "IMG-CN-02": {
    assetId: "CN-02",
    title: "Masterofnetsgarden window.JPG",
    creator: "Kramer1123",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Masterofnetsgarden_window.JPG",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    changes: "Resized to 1800×1350 and re-encoded as JPEG (quality 87); no crop or color edits.",
  },
  "IMG-CN-03": {
    assetId: "CN-03",
    title: "苏州网师园小山丛桂轩 2026-05-22.jpg",
    creator: "Hehua",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:%E8%8B%8F%E5%B7%9E%E7%BD%91%E5%B8%88%E5%9B%AD%E5%B0%8F%E5%B1%B1%E4%B8%9B%E6%A1%82%E8%BD%A9_2026-05-22.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    changes: "Resized from 3048×4064 to 1800×2400 and re-encoded as JPEG (quality 87); no crop or color edits.",
  },
  "IMG-UK-02": {
    assetId: "UK-02",
    title: "Stourhead path - geograph.org.uk - 8267629.jpg",
    creator: "Oscar Taylor",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Stourhead_path_-_geograph.org.uk_-_8267629.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    changes: "Resized to 1800×1350 and re-encoded as JPEG (quality 87); no crop or color edits.",
  },
  "IMG-UK-03": {
    assetId: "UK-03",
    title: "Garden Lake, Stourhead - geograph.org.uk - 7188357.jpg",
    creator: "Derek Harper",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Garden_Lake,_Stourhead_-_geograph.org.uk_-_7188357.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    changes: "Resized to 1800×1100 and re-encoded as JPEG (quality 87); no crop or color edits.",
  },
} as const;

export const exhibitionAssets = {
  "CN-01": {
    status: "ready",
    src: "/sites/gardens/photos/CN-01-master-of-nets-main.jpg",
    alt: {
      zh: "苏州网师园的池塘、山石与对岸厅堂倒影。",
      en: "The pool, rocks and reflected hall across the water at the Master-of-Nets Garden in Suzhou.",
    },
    caption: {
      zh: "网师园池塘与临水厅堂。",
      en: "The pool and waterside hall at the Master-of-Nets Garden.",
    },
    creditId: "IMG-CN-01",
  },
  "CN-02": {
    status: "ready",
    src: "/sites/gardens/photos/CN-02-wangshi-window.jpg",
    alt: {
      zh: "从网师园亭内透过深色木窗望向庭院中的树木、山石与园路。",
      en: "From a shaded pavilion at the Master-of-Nets Garden, a dark timber window frames trees, rocks and a garden path.",
    },
    caption: {
      zh: "网师园内由木窗望向庭院，窗框将山石、树木与园路收于一景。",
      en: "A framed garden view through a timber window at the Master-of-Nets Garden.",
    },
    creditId: "IMG-CN-02",
    role: "Near view through a dark timber window; foliage, rocks and a path sit within the frame.",
  },
  "CN-03": {
    status: "ready",
    src: "/sites/gardens/photos/CN-03-wangshi-xiaoshan-window.jpg",
    alt: {
      zh: "网师园小山丛桂轩内景，木构花窗中央的圆洞框住窗外湖石，前景为条案。",
      en: "Inside Xiaoshan Conggui Pavilion at the Master-of-Nets Garden in Suzhou, a timber lattice window frames garden rocks through a central circular opening.",
    },
    caption: {
      zh: "小山丛桂轩花窗中的湖石圆景。",
      en: "Garden rocks framed by the circular opening of a timber window at Xiaoshan Conggui Pavilion.",
    },
    creditId: "IMG-CN-03",
    role: "Turn: dark pavilion interior, layered timber frames and a circular flower-window opening onto rocks; selected for a centered mask reveal.",
  },
  "CN-04": {
    status: "needed",
    src: null,
    role: "A documented pavilion, studio or inscribed architectural detail for the culture chapter.",
  },
  "UK-01": {
    status: "ready",
    src: "/sites/gardens/photos/UK-01-stourhead-lake-apollo.jpg",
    alt: {
      zh: "英格兰 Stourhead 湖景与右侧树林中的阿波罗神庙。",
      en: "The lake at Stourhead and the Temple of Apollo among the trees to the right.",
    },
    caption: {
      zh: "从南侧望向 Stourhead 湖面与阿波罗神庙。",
      en: "The garden lake and Temple of Apollo, viewed from the south at Stourhead.",
    },
    creditId: "IMG-UK-01",
  },
  "UK-02": {
    status: "ready",
    src: "/sites/gardens/photos/UK-02-stourhead-path.jpg",
    alt: {
      zh: "Stourhead 园路在林下沿湖岸延伸，树枝构成上方前景。",
      en: "A path at Stourhead runs beneath trees beside the lake, with branches forming a foreground canopy.",
    },
    caption: {
      zh: "Stourhead 湖岸林下的园路。",
      en: "A lakeside path beneath the trees at Stourhead.",
    },
    creditId: "IMG-UK-02",
    role: "Verified path-side view with an overhanging canopy and the lake opening beside the route.",
  },
  "UK-03": {
    status: "ready",
    src: "/sites/gardens/photos/UK-03-stourhead-bridge-lake.jpg",
    alt: {
      zh: "透过 Stourhead 树荫望向湖面，石桥横跨近处水道，远岸被林木围合。",
      en: "Through the trees at Stourhead, a stone bridge crosses the near water while woodland frames the lake beyond.",
    },
    caption: {
      zh: "Stourhead 湖面、石桥与树荫构成的视景。",
      en: "The lake, stone bridge and tree-framed view at Stourhead.",
    },
    creditId: "IMG-UK-03",
    role: "A tree-framed lake view with a stone bridge in the foreground and the far bank beyond.",
  },
  "UK-04": {
    status: "needed",
    src: null,
    role: "A clearly located garden building or cultural detail, such as the grotto or a temple.",
  },
  "ART-01": {
    status: "ready-for-review",
    src: "/sites/gardens/art/ART-01-water.webp",
    layers: ["/sites/gardens/art/ART-01-back.webp", "/sites/gardens/art/ART-01-water.webp", "/sites/gardens/art/ART-01-foreground.webp"],
    role: "Three original, transparent watercolor-like landscape layers; an artistic interpretation, not documentary evidence.",
  },
  "ART-02": {
    status: "ready-for-review",
    src: "/sites/gardens/art/ART-02-moon-gate.svg",
    role: "An original vector moon-gate outline used as the entrance frame.",
  },
  "TEX-01": {
    status: "optional",
    src: null,
    role: "A subtle paper-grain texture; omit if the CSS paper color already reads well.",
  },
} as const;

/** S02 editorial viewing order. These camera positions are not a surveyed route. */
export const gardenJourneyViews = [
  {
    id: "cn-near", assetId: "CN-02", caseId: "suzhou", label: { zh: "近", en: "Near" },
    text: {
      zh: "木窗把庭院视线收束在石与树之间。庭院没有全部显露，目光先从暗处穿过一个边界。",
      en: "A timber window gathers rocks and trees into a view. The garden is not given all at once: the eye passes from a shaded interior through a carefully framed opening.",
    },
  },
  {
    id: "cn-turn", assetId: "CN-03", caseId: "suzhou", label: { zh: "转", en: "Turn" },
    text: {
      zh: "圆窗、题匾与山石重新组织视线。转身之后，风景不是一下铺开，而是在框景与陈设之间逐渐显现。",
      en: "The round opening, inscribed plaque and rocks redirect the eye. After a turn, the view unfolds gradually, through the window frame and the furnishings of the room.",
    },
  },
  {
    id: "uk-walk", assetId: "UK-02", caseId: "stourhead", label: { zh: "行", en: "Walk" },
    text: {
      zh: "园路沿林缘和湖岸延伸。沿画面中的路径望去，树干与枝条使视野时收时放，水面逐渐进入视线。",
      en: "The path follows woodland and water. Looking along it, trunks and branches gather the foreground while the lake begins to open beside the route.",
    },
  },
  {
    id: "uk-open", assetId: "UK-03", caseId: "stourhead", label: { zh: "开", en: "Open" },
    text: {
      zh: "树荫、石桥与湖面形成层次。由近处的遮挡向远岸望去，水面与建筑让视野逐渐开阔。两座园林都安排了观看，边界与尺度却各有不同。",
      en: "Shade, bridge and lake make a layered view. Beyond the foreground, water and a distant building give the scene its scale. Both gardens compose the act of looking, with different boundaries and different measures of space.",
    },
  },
] as const;

export const gardenJourneyNotice = {
  zh: "以不同机位的案例照片组织观看，不代表连续的实地步行路线。",
  en: "A viewing sequence of photographs from different positions, not a continuous walking route.",
} as const;

export const exhibitionChapters = [
  {
    id: "S00",
    slug: "entrance",
    title: {
      zh: "一园两境",
      en: "Gardens Across Cultures",
    },
    standfirst: {
      zh: "循一条水线，看两种造景。",
      en: "Follow the water. Discover two ways of shaping a garden.",
    },
    paragraphs: [],
    sourceIds: [],
    assetIds: ["ART-01", "ART-02", "TEX-01"],
  },
  {
    id: "S01",
    slug: "portraits",
    title: {
      zh: "两座园林，两种尺度",
      en: "Two Gardens, Two Scales",
    },
    standfirst: {
      zh: "从苏州的一方水院，走向英格兰的湖畔园景。",
      en: "From a courtyard pool in Suzhou to a designed lake landscape in England.",
    },
    paragraphs: [
      {
        id: "S01-CN",
        text: {
          zh: "网师园是联合国教科文组织“苏州古典园林”遗产地的一部分。申报材料记载，园路从数重住宅院落通向庭园；池塘、环池回廊、亭馆与书斋在紧凑的空间里彼此联系。园名承接南宋“渔隐”的意象，宋宗元于十八世纪晚期营建网师园。[CS-01, CS-02]",
          en: "The Master-of-Nets Garden forms part of the UNESCO-listed Classical Gardens of Suzhou. Its nomination describes residential courts leading to a garden arranged around a pool, with covered walks, pavilions and studios. The name recalls a twelfth-century “Fisherman’s Retreat”; Song Zongyuan shaped the garden in the late eighteenth century.[CS-01, CS-02]",
        },
        assetIds: ["CN-01"],
        sourceIds: ["CS-01", "CS-02"],
      },
      {
        id: "S01-UK",
        text: {
          zh: "Stourhead 由 Henry Hoare II 在十八世纪营建，并于 1740 年代开放。人工湖、林木与古典式建筑共同组成庄园风景；欧洲旅行、古典建筑和风景画为设计提供了灵感。之后的主人仍不断改变建筑与种植。[CS-03, CS-04]",
          en: "Henry Hoare II shaped Stourhead in the eighteenth century; it opened in the 1740s. An artificial lake, woodland and classical buildings form its estate landscape. European travel, classical architecture and landscape painting informed the design, which later generations continued to change.[CS-03, CS-04]",
        },
        assetIds: ["UK-01"],
        sourceIds: ["CS-03", "CS-04"],
      },
    ],
    sourceIds: ["CS-01", "CS-02", "CS-03", "CS-04"],
    assetIds: ["CN-01", "UK-01"],
  },
  {
    id: "S02",
    slug: "journey",
    title: {
      zh: "景，随脚步展开",
      en: "A View Unfolds with Each Step",
    },
    standfirst: {
      zh: "近看、转身、望远：视线的变化，让空间逐渐显现。",
      en: "Look closer, turn, then look out. A garden changes as the view opens.",
    },
    sequence: [
      {
        id: "NEAR",
        title: { zh: "近 / Near", en: "Near" },
        copy: {
          zh: "网师园的木窗把庭院视线收束在石与树之间；Stourhead 的园路沿林缘和湖岸延伸。",
          en: "At the Master-of-Nets Garden, a timber window frames rocks and trees. At Stourhead, a path runs beneath the woodland beside the lake.",
        },
        assetIds: ["CN-02", "UK-02"],
      },
      {
        id: "TURN",
        title: { zh: "转 / Turn", en: "Turn" },
        copy: {
          zh: "圆窗、题匾与室内陈设重新组织视线。转身之后，网师园窗外的湖石不是一下铺开，而是在木格、圆洞与庭中陈设之间逐渐显现；Stourhead 的树影和石桥则把视线引向湖面。两地照片是并置阅读，并非连续游线。",
          en: "A round window, inscribed plaque and interior furnishings redirect the eye. At the Master-of-Nets Garden, rocks beyond do not appear all at once; they emerge through layers of timber lattice, the circular opening and the room's furnishings. At Stourhead, shade and a stone bridge guide the gaze toward the lake. The photographs invite comparison; they do not depict a continuous walk.",
        },
        assetIds: ["CN-03", "UK-03"],
        sourceIds: ["CS-02", "CS-03"],
      },
      {
        id: "OPEN",
        title: { zh: "开 / Open", en: "Open" },
        copy: {
          zh: "当遮挡退开，池水、湖面与远处建筑成为画面的尺度。两种园林都安排了观看；展开方式来自不同的场地与历史。",
          en: "As the foreground recedes, pool or lake and distant buildings give the view its scale. Both gardens shape how we look, each in response to its own site and history.",
        },
        assetIds: ["CN-01", "UK-01"],
        sourceIds: ["CS-02", "CS-03"],
      },
    ],
    paragraphs: [],
    sourceIds: ["CS-02", "CS-03"],
    assetIds: ["CN-01", "CN-02", "CN-03", "UK-01", "UK-02", "UK-03"],
  },
  {
    id: "S03",
    slug: "culture",
    title: {
      zh: "景为何如此展开？",
      en: "Why is the view composed this way?",
    },
    standfirst: {
      zh: "同样是人工经营的风景，园林的尺度、图像传统与历史用途，会影响人如何接近它。",
      en: "Both are cultivated landscapes. Their scale, visual traditions and historical purposes shape how we encounter them.",
    },
    paragraphs: culturalStops.map(stop => ({ id: `S03-${stop.id}`, text: stop.text, sourceIds: stop.sourceIds, assetIds: [] })),
    sourceIds: ["CS-02", "CS-03", "CS-04"],
    assetIds: ["CN-03", "UK-03"],
  },
  {
    id: "S04",
    slug: "compare",
    title: {
      zh: "同一片自然，两种观看。",
      en: "Nature, seen in two ways.",
    },
    standfirst: {
      zh: "拖动分界线，在两处真实园景之间比较视线、边界与文化联想。",
      en: "Move the divider to compare sightlines, boundaries and cultural references across two real gardens.",
    },
    notice: {
      zh: "两图来自不同园林与拍摄位置；本工具并置画面，不表示空间尺度或机位相同。",
      en: "These photographs show different gardens from different viewpoints. The comparison does not imply equal scale or matching camera positions.",
    },
    dimensions: comparisonDimensions.map(item => ({ id: item.id, title: item.title, notes: item.question, sourceIds: ["CS-01", "CS-02", "CS-03", "CS-04"] })),
    paragraphs: [],
    sourceIds: ["CS-02", "CS-03", "CS-04"],
    assetIds: ["CN-01", "UK-01"],
  },
  {
    id: "S05",
    slug: "shared",
    title: sharedChapter.title,
    standfirst: sharedChapter.intro,
    paragraphs: sharedChapter.questions.map(item => ({ id: `S05-${item.id}`, text: item.text, assetIds: item.assetIds, sourceIds: item.sourceIds })),
    sourceIds: ["CS-02", "CS-03"],
    assetIds: ["CN-01", "UK-01"],
  },
  {
    id: "S06",
    slug: "credits",
    title: closingChapter.title,
    standfirst: closingChapter.reflection,
    paragraphs: [],
    sourceIds: ["CS-01", "CS-02", "CS-03", "CS-04"],
    assetIds: ["CN-01", "CN-02", "CN-03", "UK-01", "UK-02", "UK-03", "ART-01", "ART-02", "TEX-01"],
  },
] as const;

export type ExhibitionChapter = (typeof exhibitionChapters)[number];


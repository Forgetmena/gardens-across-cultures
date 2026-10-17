import type { ExhibitionLanguage } from './content';

type Bilingual = Record<ExhibitionLanguage, string>;
export interface ComparisonDimension {
  id: string;
  title: Bilingual;
  question: Bilingual;
  cn: { keyword: Bilingual; text: Bilingual; point: readonly [number, number] };
  uk: { keyword: Bilingual; text: Bilingual; point: readonly [number, number] };
  evidence: 'observation' | 'interpretation' | 'context';
}

/** Historical context is kept apart from observations of the photographs. */
export const culturalStops = [
  {
    id: 'setting', title: { zh: '位置与尺度', en: 'Setting & scale' }, word: { zh: '境', en: 'Setting' }, kind: 'context', sourceIds: ['CS-01', 'CS-02', 'CS-03'],
    text: { zh: '网师园的住宅、回廊与池塘相连，把层层视景组织在紧凑的城市园居之中。Stourhead 则在十八世纪庄园中围绕人工湖营造风景。场地与生活条件，为观看提供了不同的尺度。', en: 'Residence, covered walk and pool form a compact urban ensemble at the Master-of-Nets Garden. At Stourhead, an artificial lake anchors an eighteenth-century estate landscape. Different settings and ways of living give each view its measure.' },
  },
  {
    id: 'imagination', title: { zh: '图像与想象', en: 'Images & imagination' }, word: { zh: '意', en: 'Imagination' }, kind: 'context', sourceIds: ['CS-01', 'CS-03', 'CS-04'],
    text: { zh: '苏州古典园林将文学、绘画与造园工艺相联系。Stourhead 的营造也有多种艺术资源：欧洲旅行、古典文本与收藏的风景画。两种观看，都在具体的文化经验中被塑造。', en: 'Suzhou’s garden tradition brings literature, painting and garden craft together. Stourhead drew on several resources too: European travel, classical texts and collected landscape paintings. Each way of looking has its own cultural history.' },
  },
  {
    id: 'movement', title: { zh: '行走与停留', en: 'Movement & pause' }, word: { zh: '游', en: 'Movement' }, kind: 'interpretation', sourceIds: ['CS-02', 'CS-03'],
    text: { zh: '回看刚才的圆窗与湖岸：一处让视线穿过层层开口，一处让园路串起林木与水面。我们把它们读成两种观看的节奏；这不意味着中国园林没有远景，或 Stourhead 没有遮挡与转折。', en: 'Recall the window and the lakeside path: one leads the eye through layered openings; the other connects woodland and water through movement. We read these as two rhythms of looking, without denying distant views in Suzhou or concealment and turns at Stourhead.' },
  },
] as const;

export const comparisonDimensions: readonly ComparisonDimension[] = [
  { id: 'space', title: { zh: '空间组织', en: 'Space' }, question: { zh: '什么，让一幅景有了层次？', en: 'What gives a view its layers?' }, evidence: 'observation',
    cn: { keyword: { zh: '围合', en: 'Enclosure' }, text: { zh: '池岸、山石与相接的厅堂，将近处的水院围成层层空间。', en: 'Pool edge, rocks and connected halls gather the courtyard into layers.' }, point: [72, 44] },
    uk: { keyword: { zh: '展开', en: 'Outlook' }, text: { zh: '前景树干、湖面与远岸相互错落，近处神庙构成观看的侧缘。', en: 'Foreground trunks, the lake and the far bank recede in depth, with the temple at the edge of the view.' }, point: [50, 52] } },
  { id: 'view', title: { zh: '观看方式', en: 'Looking' }, question: { zh: '目光，先经过什么？', en: 'What does the eye pass through first?' }, evidence: 'observation',
    cn: { keyword: { zh: '层叠', en: 'Layers' }, text: { zh: '枝条遮住部分屋面，视线穿过前景，再抵达对岸厅堂。', en: 'Branches partially screen the roofs; the eye passes through them towards the hall across the pool.' }, point: [32, 28] },
    uk: { keyword: { zh: '远近', en: 'Depth' }, text: { zh: '树干和垂枝同样框住远景。开敞与遮挡，在这里并不互相排斥。', en: 'A trunk and hanging branches frame the distance here too. Openness and screening coexist.' }, point: [25, 30] } },
  { id: 'architecture', title: { zh: '建筑与自然', en: 'Built & growing' }, question: { zh: '建筑，是边界还是观看的位置？', en: 'Is a building an edge, or a place to look from?' }, evidence: 'observation',
    cn: { keyword: { zh: '临水', en: 'At the water' }, text: { zh: '厅堂紧邻池岸，开口、栏杆与山石共同组织水边的视线。', en: 'The hall meets the pool: openings, railings and rocks organise the waterside view.' }, point: [69, 45] },
    uk: { keyword: { zh: '入景', en: 'In the view' }, text: { zh: '阿波罗神庙占据近处一侧，石柱与树木一起围出湖景。', en: 'The Temple of Apollo occupies the near side; columns and trees frame the lake together.' }, point: [84, 49] } },
  { id: 'water', title: { zh: '水体', en: 'Water' }, question: { zh: '水面，把哪些景物连在一起？', en: 'What does the water bring together?' }, evidence: 'observation',
    cn: { keyword: { zh: '映照', en: 'Reflection' }, text: { zh: '池水把屋面、山石与树影带入同一幅倒影，邻近的景物在水中相遇。', en: 'The pool gathers roofs, rocks and branches into a shared reflection.' }, point: [39, 75] },
    uk: { keyword: { zh: '联结', en: 'Connection' }, text: { zh: '湖面在枝叶之间显露，把近处神庙与远岸林木放入同一视域。', en: 'The lake appears between branches, bringing the nearby temple and distant woodland into one field of view.' }, point: [51, 54] } },
  { id: 'path', title: { zh: '路径', en: 'Paths' }, question: { zh: '身体移动时，风景怎样改变？', en: 'How might movement change the view?' }, evidence: 'interpretation',
    cn: { keyword: { zh: '循岸', en: 'Along the edge' }, text: { zh: '沿池的石径与回廊提示不同的停留位置。照片只呈现其中一个视点。', en: 'The stone path and covered walk suggest places to pause by the pool. This photograph records just one viewpoint.' }, point: [21, 53] },
    uk: { keyword: { zh: '循湖', en: 'Beside the lake' }, text: { zh: '前景园路沿水延伸，可联想到刚才的林下行走；两张照片并非连续游线。', en: 'The foreground path recalls the woodland walk seen earlier. These photographs are not a continuous route.' }, point: [44, 74] } },
  { id: 'human-nature', title: { zh: '人与自然', en: 'People & nature' }, question: { zh: '看似自然的地方，留下了哪些人的选择？', en: 'Where do human choices shape what seems natural?' }, evidence: 'interpretation',
    cn: { keyword: { zh: '经营', en: 'Composing' }, text: { zh: '左侧已有的访客，为岸石与厅堂提供了身体尺度。人在路径中接近水面，观看也受到营造边界的引导。', en: 'The existing visitor gives rocks and halls a bodily scale. The path brings a person close to the water, within the boundaries of a designed space.' }, point: [83, 58] },
    uk: { keyword: { zh: '营造', en: 'Making' }, text: { zh: '神庙的柱与入口、沿水园路，提供了身体可感知的尺度。看似自然的庄园风景，也包含建造与维护的选择。', en: 'Columns, an entrance and the waterside path suggest a bodily scale. The apparently natural estate landscape also contains choices about building and care.' }, point: [66, 58] } },
  { id: 'aesthetic', title: { zh: '审美表达', en: 'Art & ideas' }, question: { zh: '风景，承载了怎样的想象？', en: 'What kinds of imagination does a landscape hold?' }, evidence: 'context',
    cn: { keyword: { zh: '诗画', en: 'Poetry & painting' }, text: { zh: '苏州园林与文学、绘画和工艺相联系。眼前格局，是进入这一传统的一个具体入口。', en: 'Suzhou gardens connect literature, painting and craft. This particular ensemble offers one way into that wider tradition.' }, point: [58, 43] },
    uk: { keyword: { zh: '古典意象', en: 'Classical imagination' }, text: { zh: '古典式神庙让人回到 Stourhead 的旅行、收藏与风景画语境。', en: 'The classical temple recalls Stourhead’s setting of travel, collecting and landscape painting.' }, point: [86, 39] } },
];

export const evidenceLabels = {
  context: { zh: '历史语境', en: 'Historical context' },
  observation: { zh: '画面观察', en: 'In the photograph' },
  interpretation: { zh: '策展解读', en: 'Curatorial reading' },
} as const;

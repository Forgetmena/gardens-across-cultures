/** S05: open curatorial questions, not definitions of national cultures. */
export const sharedChapter = {
  title: { zh: '不同的路径，也在回答一些相近的问题。', en: 'Different paths can ask related questions.' },
  intro: { zh: '把差异留在眼中，再向两处园林提出相同的问题。', en: 'Keep their differences in view. Then bring a shared question to each place.' },
  scope: { zh: '以下是对网师园与 Stourhead 的策展提问，不是两种文化的统一答案。相近的问题，并不抹去各自的历史。', en: 'These are curatorial questions about the Master-of-Nets Garden and Stourhead, not answers for two whole cultures. A shared question leaves room for different histories.' },
  questions: [
    {
      id: 'visible',
      kind: 'observation',
      title: { zh: '自然如何被看见？', en: 'How is nature made visible?' },
      text: { zh: '回看这两幅照片：枝条、建筑与水面都参与安排视线。它们以不同的层次组织风景，也都让观看有了起点与停顿。', en: 'Return to these two photographs. Branches, buildings and water shape where the eye travels. Their layers differ, yet each gives looking a place to begin—and a reason to pause.' },
      question: { zh: '眼前的景，还有什么尚未进入你的视线？', en: 'What remains outside the view you first noticed?' },
      sourceIds: [],
      assetIds: ['CN-01', 'UK-01'],
    },
    {
      id: 'cultivated',
      kind: 'context',
      title: { zh: '人工如何与自然相处？', en: 'How does design meet nature?' },
      text: { zh: '这两处园林都经历了营造与持续维护。池岸、建筑、人工湖与种植，让自然经验有了具体形式；人为经营，并不只有一种接近自然的方式。', en: 'Both gardens have been made and maintained over time. Pool edges, buildings, an artificial lake and planting give encounters with nature a particular form. Cultivation offers more than one way of meeting the natural world.' },
      question: { zh: '当风景看似自然，你会注意哪些人的选择？', en: 'When a landscape feels natural, which human choices become visible?' },
      sourceIds: ['CS-02', 'CS-03', 'CS-04'],
      assetIds: [],
    },
    {
      id: 'time',
      kind: 'interpretation',
      title: { zh: '观看需要多少时间？', en: 'How much time does looking require?' },
      text: { zh: '窗前停留，沿岸行走，再回头看。对这两个案例的观看，不必停在一张全景里。位置与时间改变了眼前的关系，每个人也可以留下不同的观看节奏。', en: 'Pause at an opening, walk beside water, look back. Neither garden need be understood in a single panorama. Position and time change the relationships we notice; each visitor can bring a different pace.' },
      question: { zh: '你愿意为一处风景，停留多久？', en: 'How long would you give a view?' },
      sourceIds: [],
      assetIds: ['CN-02', 'CN-03', 'UK-02', 'UK-03'],
    },
  ],
} as const;

/** Percentage coordinates refer to the unchanged 4:3 CN-01 / UK-01 photographs. */
export type GardenSide = 'cn' | 'uk';
export interface FocusProfile {
  box: readonly [number, number, number, number];
  point: readonly [number, number];
  noteY: number;
  shift: readonly [number, number];
  scale: number;
  background: number;
}
export const focusProfiles: Record<GardenSide, readonly FocusProfile[]> = {
  cn: [
    { box:[8,18,62,54],point:[37,43],noteY:13,shift:[-5,-1],scale:1.10,background:1 },
    { box:[23,25,34,30],point:[40,42],noteY:53,shift:[-3,0],scale:1.14,background:0 },
    { box:[25,24,45,38],point:[42,43],noteY:9,shift:[-4,0],scale:1.12,background:2 },
    { box:[6,53,62,42],point:[34,71],noteY:34,shift:[0,-1],scale:1.10,background:1 },
    { box:[0,43,30,16],point:[15,51],noteY:56,shift:[0,-2],scale:1.14,background:0 },
    { box:[7,42,20,19],point:[14,50],noteY:16,shift:[0,0],scale:1.18,background:2 },
    { box:[10,12,72,75],point:[38,46],noteY:7,shift:[-4,-1],scale:1.08,background:1 },
  ],
  uk: [
    { box:[22,18,65,61],point:[61,47],noteY:53,shift:[5,-1],scale:1.10,background:2 },
    { box:[17,12,54,52],point:[57,43],noteY:8,shift:[5,0],scale:1.12,background:0 },
    { box:[64,12,36,84],point:[82,46],noteY:55,shift:[0,0],scale:1.10,background:2 },
    { box:[32,39,37,25],point:[56,52],noteY:10,shift:[8,-1],scale:1.14,background:1 },
    { box:[18,70,53,13],point:[56,75],noteY:47,shift:[10,-2],scale:1.15,background:0 },
    { box:[63,43,33,47],point:[80,62],noteY:12,shift:[0,0],scale:1.13,background:2 },
    { box:[20,9,80,83],point:[77,45],noteY:10,shift:[0,-1],scale:1.08,background:1 },
  ],
};

export const backgroundPhotos = {
  cn: ['/sites/gardens/photos/CN-02-wangshi-window.jpg','/sites/gardens/photos/CN-01-master-of-nets-main.jpg','/sites/gardens/photos/CN-03-wangshi-xiaoshan-window.jpg'],
  uk: ['/sites/gardens/photos/UK-02-stourhead-path.jpg','/sites/gardens/photos/UK-03-stourhead-bridge-lake.jpg','/sites/gardens/photos/UK-01-stourhead-lake-apollo.jpg'],
} as const;

export function focusAsset(side: GardenSide, index: number) {
  return `/sites/gardens/art/s04-3/S04-${side.toUpperCase()}-O${index + 1}-focus.webp`;
}

export function backgroundAsset(side: GardenSide, index: number) {
  return `/sites/gardens/art/s04-3/S04-${side.toUpperCase()}-BG-0${index + 1}.webp`;
}

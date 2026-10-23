const imageGeometry = {
  a: { width: 879, height: 1283, longestSideCm: 38 },
  b: { width: 1777, height: 1225, longestSideCm: 38 },
  c: { width: 785, height: 1213, longestSideCm: 38 },
  d: { width: 1785, height: 1264, longestSideCm: 34 },
  e: { width: 946, height: 1247, longestSideCm: 36 },
  f: { width: 1901, height: 1313, longestSideCm: 38 },
  g: { width: 865, height: 1243, longestSideCm: 38 },
  h: { width: 1902, height: 1189, longestSideCm: 38 },
};

// Editable titles and media paths. Never substitute a thumbnail for a fullImage.
export const series = {
  title: 'Not That Scary Ⅱ',
  subtitle: 'ETCHING SERIES · 2026 · 8 WORKS',
  introduction: null, // Add the artist's supplied English statement here; do not invent it.
  works: [
    { id: 'a', chineseTitle: '飞升', englishTitle: 'Upward Mobility', dimensions: '26 × 38 cm', medium: 'Etching', year: 2026 },
    { id: 'b', chineseTitle: '全家福', englishTitle: 'Family Portrait', dimensions: '26 × 38 cm', medium: 'Etching', year: 2026 },
    { id: 'c', chineseTitle: '安于流动', englishTitle: 'Comfortably Adrift', dimensions: '26 × 38 cm', medium: 'Etching', year: 2026 },
    { id: 'd', chineseTitle: '都在一起', englishTitle: 'All Together', dimensions: '23.5 × 34 cm', medium: 'Etching', year: 2026 },
    { id: 'e', chineseTitle: '行面', englishTitle: 'The Face of Moving Forward', dimensions: '23.5 × 36 cm', medium: 'Etching', year: 2026 },
    { id: 'f', chineseTitle: '雾', englishTitle: 'Fog', dimensions: '26 × 38 cm', medium: 'Etching', year: 2026 },
    { id: 'g', chineseTitle: '来、来', englishTitle: 'Come, Come', dimensions: '23.5 × 38 cm', medium: 'Etching', year: 2026 },
    { id: 'h', chineseTitle: '止一令', englishTitle: 'Dis-order', dimensions: '23.5 × 38 cm', medium: 'Etching', year: 2026 },
  ].map(work => ({
    ...work,
    ...imageGeometry[work.id],
    thumbnail: `../../public/images/not-that-scary-ii/${work.id}.jpg`,
    fullImage: null, // Set only after the real high-resolution file is uploaded.
    plannedFullImage: `../../public/images/not-that-scary-ii/full/${work.id}.jpg`,
  })),
};

// Viewing order is an independent editorial sequence, not a sort of image filenames.
export const viewingOrder = ['g', 'b', 'a', 'd', 'c', 'h', 'e', 'f'];

// Placement coordinates are authored on a 1200-unit field. Both schemes use the
// same physical long-edge scale (340 units per 38cm), never crop, and remain drafts.
export const overviewLayouts = [
  {
    id: 'a', label: '方案 A', name: '开放星座', englishName: 'Open Field',
    description: '疏朗的非对称场域：以明亮的《全家福》和竖向的《来、来》展开，将较重的灰黑分散到中段与右下方。',
    width: 1200, height: 1435, pixelsPerCm: 340 / 38,
    placements: [
      { id: 'b', x: 75, y: 60 }, { id: 'g', x: 755, y: 10 },
      { id: 'e', x: 330, y: 380 }, { id: 'f', x: 780, y: 440 },
      { id: 'c', x: 30, y: 720 }, { id: 'h', x: 480, y: 835 },
      { id: 'd', x: 75, y: 1170 }, { id: 'a', x: 920, y: 950 },
    ],
    decoration: { x: 580, y: 180 },
  },
  {
    id: 'b', label: '方案 B', name: '错页对话', englishName: 'Offset Folios',
    description: '沿错开的横竖组合缓慢向下观看：船形与电话、屋顶与拱形、黑色人形与浅色室内、深色图面与雾景互相呼应。',
    width: 1200, height: 1565, pixelsPerCm: 340 / 38,
    placements: [
      { id: 'g', x: 70, y: 80 }, { id: 'h', x: 620, y: 10 },
      { id: 'c', x: 850, y: 360 }, { id: 'd', x: 280, y: 470 },
      { id: 'a', x: 100, y: 835 }, { id: 'b', x: 665, y: 800 },
      { id: 'e', x: 820, y: 1190 }, { id: 'f', x: 260, y: 1270 },
    ],
    decoration: { x: 540, y: 230 },
  },
];

// Current static composition. Historical studies above are data only, not rendered.
export const staticLayout = {
  width: 1000,
  height: 1090,
  pixelsPerCm: 300 / 38,
  placements: [
    { id: 'b', x: 0, y: 20 },
    { id: 'g', x: 370, y: 0 },
    { id: 'h', x: 700, y: 60 },
    { id: 'e', x: 45, y: 300 },
    { id: 'd', x: 350, y: 370 },
    { id: 'c', x: 745, y: 325 },
    { id: 'f', x: 160, y: 700 },
    { id: 'a', x: 690, y: 710 },
  ],
  decorations: [
    { type: 'star', x: 650, y: 610 },
    { type: 'line', x: 70, y: 660 },
    { type: 'line', x: 535, y: 985 },
    { type: 'line', x: 550, y: 680 },
    { type: 'star', x: 945, y: 820 },
    { type: 'star', x: 540, y: 850 },
  ],
};

// Only artist-supplied watermarked WebPs belong here; never PDFs or demo pages.
// Projects without approved uploaded content retain empty page arrays.
// Each entry: { file: '01.webp', width: 1985, height: 2807, alt: 'Approved description' }.
export const researchProjects = {
  'art-brut-and-naive-art': {
    displayTitle: 'Art Brut and Naïve Art',
    fullTitle: 'Art Brut and Naïve Art: Challenging the Canon, Expanding Expression',
    type: 'RESEARCH ESSAY',
    template: 'portrait',
    introduction: null,
    imageDirectory: 'public/images/art-brut-and-naive-art/pages/',
    pages: [],
  },
  'moments-in-between': {
    displayTitle: 'Moments in Between',
    fullTitle: 'Moments in Between',
    type: 'Exhibition Proposal',
    template: 'landscape',
    introduction: null,
    imageDirectory: 'public/images/research/exhibition-proposal/pages/',
    pages: [
      { file: '01.webp', alt: 'Moments in Between — page 1', width: 5500, height: 2750 },
      { file: '02.webp', alt: 'Moments in Between — page 2', width: 5500, height: 2750 },
      { file: '03.webp', alt: 'Moments in Between — page 3', width: 5500, height: 2750 },
      { file: '04.webp', alt: 'Moments in Between — page 4', width: 5500, height: 2750 },
      { file: '05.webp', alt: 'Moments in Between — page 5', width: 5500, height: 2750 },
      { file: '06.webp', alt: 'Moments in Between — page 6', width: 5500, height: 2750 },
      { file: '07.webp', alt: 'Moments in Between — page 7', width: 5500, height: 2750 },
      { file: '08.webp', alt: 'Moments in Between — page 8', width: 5500, height: 2750 },
      { file: '09.webp', alt: 'Moments in Between — page 9', width: 5500, height: 2750 },
      { file: '10.webp', alt: 'Moments in Between — page 10', width: 5500, height: 2750 },
      { file: '11.webp', alt: 'Moments in Between — page 11', width: 5500, height: 2750 },
      { file: '12.webp', alt: 'Moments in Between — page 12', width: 5500, height: 2750 },
    ],
  },
  'at-that-time-this-moment': {
    displayTitle: 'At That Time, This Moment',
    fullTitle: 'At That Time, This Moment',
    type: 'EXHIBITION REVIEW',
    template: 'portrait',
    introduction: null,
    imageDirectory: 'public/images/at-that-time-this-moment/pages/',
    pages: [],
  },
  'printmaking-aesthetic-education': {
    displayTitle: "The Value of Printmaking in Children's Aesthetic Education",
    fullTitle: "The Value of Printmaking in Children's Aesthetic Education",
    type: 'PUBLISHED ARTICLE · CHINESE',
    template: 'portrait',
    introduction: null,
    imageDirectory: 'public/images/printmaking-aesthetic-education/pages/',
    pages: [],
  },
};

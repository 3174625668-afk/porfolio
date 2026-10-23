// Phase one: no real PDFs, test pages or invented introductions are public.
// After visual approval, add only processed watermarked WebPs to pages.
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
    type: 'CURATORIAL PROPOSAL',
    template: 'portrait',
    introduction: null,
    imageDirectory: 'public/images/moments-in-between/pages/',
    pages: [],
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

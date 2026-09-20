export const projectFacts = {
  projectName: "Shivalik Presente",
  displayName: "Shivalik Présenté",
  developerName: "Shivalik Group",
  location: "GIFT City, Gandhinagar, Gujarat",
  totalResidences: 54,
  simplexResidences: 51,
  duplexPenthouses: 3,
  internalHeight: "Approximately 4 metres",
  fourBhkArea: { minimum: 6_300, maximum: 7_100, publishedBasis: "RA" },
  sixBhkArea: { minimum: 12_280, maximum: 13_730, publishedBasis: "RA" },
  lastReviewed: "2026-09-20",
  sources: {
    officialProject: "https://shivalikgroup.com/projects/presente",
    officialPocketDocument: "https://www.shivalikgroup.com/Shivalik_Pocket.pdf",
    gujaratRera: "https://gujrera.gujarat.gov.in/",
  },
} as const;

const formatArea = (value: number) => new Intl.NumberFormat("en-IN").format(value);

export const fourBhkAreaLabel = `${formatArea(projectFacts.fourBhkArea.minimum)}–${formatArea(projectFacts.fourBhkArea.maximum)} sq. ft. ${projectFacts.fourBhkArea.publishedBasis}`;
export const sixBhkAreaLabel = `${formatArea(projectFacts.sixBhkArea.minimum)}–${formatArea(projectFacts.sixBhkArea.maximum)} sq. ft. ${projectFacts.sixBhkArea.publishedBasis}`;

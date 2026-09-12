export type SeoFaq = { question: string; answer: string };

export const projectFaqs: SeoFaq[] = [
  {
    question: "What is Shivalik Présenté in GIFT City?",
    answer:
      "Shivalik Présenté is a low-density riverfront residential collection in GIFT City, Gandhinagar. The project information currently describes 54 homes across three residential expressions.",
  },
  {
    question: "Where is Shivalik Présenté located?",
    answer:
      "The project is located in GIFT City, Gandhinagar, within the wider Ahmedabad–Gandhinagar region. Buyers should request the current site location and visit the approach roads before deciding.",
  },
  {
    question: "Which configurations are available at Shivalik Présenté?",
    answer:
      "The currently stated collection includes 4 BHK residences and a limited number of 6 BHK duplex penthouses. Availability, floor, orientation and the exact area should be confirmed for the specific home offered.",
  },
  {
    question: "Does Shivalik Présenté offer 5 BHK apartments?",
    answer:
      "A 5 BHK configuration is not part of the currently stated offering on this website. Buyers comparing 4 BHK and 5 BHK luxury apartments in Gandhinagar can evaluate the 4 BHK residences or ask whether a 6 BHK duplex penthouse better fits their space requirements.",
  },
  {
    question: "What are the stated sizes of the residences?",
    answer:
      "The 4 BHK residences are stated at approximately 6,300–7,100 sq. ft., while the 6 BHK duplex penthouses are stated at approximately 12,250–13,700 sq. ft. Confirm the measurement basis and exact unit plan in current official documents.",
  },
  {
    question: "Is ‘Shivalik Present’ the same project as Shivalik Présenté?",
    answer:
      "People sometimes search for Shivalik Present or Shivalik Presente, but the project name used here is Shivalik Présenté. The GIFT City location and exact unit details should always be verified before enquiry or booking.",
  },
  {
    question: "How can I request the latest price and floor plan?",
    answer:
      "Use the project enquiry form to request current availability, price guidance and the relevant floor plan. Because inventory and commercial terms can change, confirm every detail for the dated offer you receive.",
  },
];

export const guideFaqs: Record<string, SeoFaq[]> = {
  "luxury-apartments-gift-city": [
    {
      question: "Which luxury apartment configurations are available at Shivalik Présenté in GIFT City?",
      answer:
        "The currently stated options are large-format 4 BHK residences and limited 6 BHK duplex penthouses. A 5 BHK configuration is not currently listed on this website.",
    },
    {
      question: "How should buyers compare luxury apartments in GIFT City?",
      answer:
        "Compare the exact unit plan, usable room sizes, area definition, privacy, orientation, parking, building services, maintenance and complete acquisition cost. The luxury label alone does not make two homes directly comparable.",
    },
    {
      question: "Are all Shivalik Présenté residences riverfront-facing?",
      answer:
        "Riverfront-facing residences are a stated project feature. Buyers should still verify the outlook, orientation and possible surrounding development for the exact tower, floor and home being considered.",
    },
    {
      question: "How can I get the current Shivalik Présenté price?",
      answer:
        "Request a dated, unit-specific commercial offer through the enquiry form. It should identify the residence, area basis, parking, taxes, payment schedule and other applicable charges.",
    },
  ],
  "4-bhk-apartments-gift-city": [
    {
      question: "What is the stated size of a 4 BHK residence at Shivalik Présenté?",
      answer:
        "The current project information states an approximate range of 6,300–7,100 sq. ft. Ask for the exact plan and area statement because the basis of measurement matters when comparing large homes.",
    },
    {
      question: "What privacy features should a 4 BHK buyer check?",
      answer:
        "Shivalik Présenté states private lift foyers and no-common-wall planning. Also inspect access control, service movement, lift sharing, door positions, shafts and acoustic specifications.",
    },
    {
      question: "Is a 4 BHK suitable for buyers searching for a 5 BHK in GIFT City?",
      answer:
        "Bedroom count should be compared with usable area and household needs. Shivalik Présenté does not currently list a 5 BHK; its stated choices are a large-format 4 BHK and a 6 BHK duplex penthouse.",
    },
    {
      question: "What documents should be checked before buying?",
      answer:
        "Have an independent qualified adviser review the exact unit details, title and approvals, agreement, payment schedule, specifications, parking, taxes and possession terms before making a payment.",
    },
  ],
  "4-bhk-apartments-gandhinagar": [
    {
      question: "Where can I find luxury 4 BHK apartments in Gandhinagar near GIFT City?",
      answer:
        "Shivalik Présenté is positioned in GIFT City, Gandhinagar and currently includes large-format 4 BHK riverfront residences. Compare its exact location and unit plan with other shortlisted Gandhinagar homes.",
    },
    {
      question: "Does Shivalik Présenté have 4 BHK or 5 BHK homes?",
      answer:
        "The currently stated project mix includes 4 BHK residences and 6 BHK duplex penthouses, not a 5 BHK configuration. Buyers needing five bedrooms should compare usable planning rather than assuming configuration labels are equivalent.",
    },
    {
      question: "What makes a 4 BHK apartment ultra-luxury?",
      answer:
        "Useful space, privacy, arrival experience, ceiling volume, outlook, specifications, building operations and long-term maintenance matter more than a marketing label. Each point should be checked against the exact residence.",
    },
    {
      question: "Should I compare carpet area or total advertised area?",
      answer:
        "Request every applicable area definition together with dimensioned plans. Room sizes, circulation, decks, storage and service areas show how much of the advertised area supports everyday use.",
    },
  ],
};

export const guideSeoOverrides: Record<
  string,
  { title: string; description: string; h1: string; intro: string }
> = {
  "4-bhk-apartments-gandhinagar": {
    title: "4 BHK Luxury Apartments in Gandhinagar | Shivalik Présenté",
    description:
      "Explore Shivalik Présenté 4 BHK luxury apartments in GIFT City, Gandhinagar, with riverfront views, private lift foyers and no-common-wall planning.",
    h1: "Luxury 4 BHK apartments in Gandhinagar at GIFT City.",
    intro:
      "Explore how Shivalik Présenté’s large-format 4 BHK riverfront residences compare for space, privacy, location and long-term family use.",
  },
  "luxury-apartments-gift-city": {
    title: "Luxury Apartments in GIFT City | Shivalik Présenté",
    description:
      "Explore Shivalik Présenté luxury apartments in GIFT City, Gandhinagar: large 4 BHK riverfront residences and limited 6 BHK duplex penthouses.",
    h1: "Luxury apartments in GIFT City at Shivalik Présenté.",
    intro:
      "A buyer-focused guide to the project’s 4 BHK residences, 6 BHK duplex penthouses, riverfront setting, privacy features and details to verify.",
  },
};

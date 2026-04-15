export type RestrictionType =
  | "CTS"
  | "CTA"
  | "CTD"
  | "MinSA"
  | "MinST"
  | "MaxSA"
  | "MaxST";

export type DayRestriction = {
  type: RestrictionType | "None";
  value?: number;    // for Min/Max types — e.g. 2 means "2 nights"
  isDirty?: boolean; // unpublished change
};

export type HotelRestriction = {
  hotelId: string;               // matches hotel name in RatesTable
  hotelName: string;
  restrictions: DayRestriction[]; // 7 elements, one per day
};

export const DAYS = [
  "Thu, 05/07",
  "Fri, 05/08",
  "Sat, 05/09",
  "Sun, 05/10",
  "Mon, 05/11",
  "Tue, 05/12",
  "Wed, 05/13",
] as const;

export type DayLabel = (typeof DAYS)[number];

export const HOTEL_NAMES = [
  // Default visible (first 10)
  "Hotel de Crillon",
  "Maison du Soleil",
  "The Grand Harbour",
  "Villa Rosso Milano",
  "The Clocktower Prague",
  "Nomad House Berlin",
  "Hotel Sacher Wien",
  "Palácio Belmonte",
  "Caldera Bay Resort",
  "St. Moritz Palace",
  // Additional (visible in settings picker but not on table by default)
  "Le Bristol Paris",
  "Four Seasons Florence",
  "Hotel Arts Barcelona",
  "The Savoy London",
  "Grand Hotel Stockholm",
  "Park Hyatt Istanbul",
  "Baur au Lac Zürich",
  "Radisson Blu Warsaw",
  "Meriton Suites Dublin",
  "Hotel de Rome Berlin",
];

// Days: Thu(0) Fri(1) Sat(2) Sun(3) Mon(4) Tue(5) Wed(6)
export const HOTEL_RESTRICTIONS: HotelRestriction[] = [
  {
    hotelId: "Hotel de Crillon",
    hotelName: "Hotel de Crillon",
    restrictions: [
      { type: "None" },
      { type: "MinSA", value: 2 },
      { type: "MinSA", value: 2 },
      { type: "CTS" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Maison du Soleil",
    hotelName: "Maison du Soleil",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "MinST", value: 2 },
      { type: "MinST", value: 2 },
      { type: "CTA" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "The Grand Harbour",
    hotelName: "The Grand Harbour",
    restrictions: [
      { type: "None" },
      { type: "MinST", value: 3 },
      { type: "MinST", value: 3 },
      { type: "MinST", value: 3 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Villa Rosso Milano",
    hotelName: "Villa Rosso Milano",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "The Clocktower Prague",
    hotelName: "The Clocktower Prague",
    restrictions: [
      { type: "None" },
      { type: "MinSA", value: 2 },
      { type: "MinSA", value: 2 },
      { type: "CTS" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Nomad House Berlin",
    hotelName: "Nomad House Berlin",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "CTA" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Hotel Sacher Wien",
    hotelName: "Hotel Sacher Wien",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "MinSA", value: 2 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Palácio Belmonte",
    hotelName: "Palácio Belmonte",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Caldera Bay Resort",
    hotelName: "Caldera Bay Resort",
    restrictions: [
      { type: "None" },
      { type: "MinSA", value: 3 },
      { type: "MinSA", value: 3 },
      { type: "CTS" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "St. Moritz Palace",
    hotelName: "St. Moritz Palace",
    restrictions: [
      { type: "None" },
      { type: "MinST", value: 2 },
      { type: "MinST", value: 2 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Le Bristol Paris",
    hotelName: "Le Bristol Paris",
    restrictions: [
      { type: "None" },
      { type: "MinSA", value: 2 },
      { type: "MinSA", value: 2 },
      { type: "None" },
      { type: "CTA" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Four Seasons Florence",
    hotelName: "Four Seasons Florence",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "MinST", value: 3 },
      { type: "MinST", value: 3 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Hotel Arts Barcelona",
    hotelName: "Hotel Arts Barcelona",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "CTS" },
      { type: "CTS" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "The Savoy London",
    hotelName: "The Savoy London",
    restrictions: [
      { type: "None" },
      { type: "MinSA", value: 2 },
      { type: "MinSA", value: 3 },
      { type: "MinSA", value: 3 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Grand Hotel Stockholm",
    hotelName: "Grand Hotel Stockholm",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Park Hyatt Istanbul",
    hotelName: "Park Hyatt Istanbul",
    restrictions: [
      { type: "CTA" },
      { type: "CTA" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Baur au Lac Zürich",
    hotelName: "Baur au Lac Zürich",
    restrictions: [
      { type: "None" },
      { type: "MinST", value: 2 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Radisson Blu Warsaw",
    hotelName: "Radisson Blu Warsaw",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "CTD" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Meriton Suites Dublin",
    hotelName: "Meriton Suites Dublin",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "MinSA", value: 2 },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
  {
    hotelId: "Hotel de Rome Berlin",
    hotelName: "Hotel de Rome Berlin",
    restrictions: [
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
      { type: "None" },
    ],
  },
];

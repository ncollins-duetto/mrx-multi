"use client";

import { Fragment, useState } from "react";
import { DayRestriction, HOTEL_RESTRICTIONS } from "@/lib/restrictionData";
import RestrictionCell from "@/components/restrictions/RestrictionCell";

// ── Types (local, mirroring RatesTable) ──────────────────────────────────────
type CurrentIcon = "lock" | "unlock";
type RecommendedIcon = "plane" | "equals" | null;
type HotelType = "plane" | "standard";

type DayRate = {
  currentIcon: CurrentIcon;
  currentValue: string;
  recommendedIcon: RecommendedIcon;
  recommendedValue: string;
  committedOccupancy: number;
  demandOccupancy: string;
  competitorAverage: string;
};

type Hotel = {
  name: string;
  hotelType: HotelType;
  rates: DayRate[];
};

const DAYS = [
  "Thu, 05/07",
  "Fri, 05/08",
  "Sat, 05/09",
  "Sun, 05/10",
  "Mon, 05/11",
  "Tue, 05/12",
  "Wed, 05/13",
];

const HOTELS: Hotel[] = [
  {
    name: "Hotel de Crillon",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "$289.00", recommendedIcon: "plane", recommendedValue: "$310.00", committedOccupancy: 42, demandOccupancy: "68%", competitorAverage: "$295.00" },
      { currentIcon: "lock",   currentValue: "$289.00", recommendedIcon: "plane", recommendedValue: "$325.00", committedOccupancy: 51, demandOccupancy: "74%", competitorAverage: "$310.00" },
      { currentIcon: "unlock", currentValue: "$340.00", recommendedIcon: "plane", recommendedValue: "$340.00", committedOccupancy: 67, demandOccupancy: "82%", competitorAverage: "$330.00" },
      { currentIcon: "unlock", currentValue: "$340.00", recommendedIcon: "plane", recommendedValue: "$355.00", committedOccupancy: 70, demandOccupancy: "85%", competitorAverage: "$335.00" },
      { currentIcon: "unlock", currentValue: "$199.00", recommendedIcon: "plane", recommendedValue: "$199.00", committedOccupancy: 28, demandOccupancy: "41%", competitorAverage: "$210.00" },
      { currentIcon: "unlock", currentValue: "$199.00", recommendedIcon: "plane", recommendedValue: "$215.00", committedOccupancy: 33, demandOccupancy: "47%", competitorAverage: "$215.00" },
      { currentIcon: "lock",   currentValue: "$249.00", recommendedIcon: "plane", recommendedValue: "$249.00", committedOccupancy: 39, demandOccupancy: "55%", competitorAverage: "$245.00" },
    ],
  },
  {
    name: "Maison du Soleil",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€175.00", recommendedIcon: null,     recommendedValue: "€175.00", committedOccupancy: 18, demandOccupancy: "32%", competitorAverage: "€180.00" },
      { currentIcon: "unlock", currentValue: "€175.00", recommendedIcon: "equals", recommendedValue: "€175.00", committedOccupancy: 22, demandOccupancy: "38%", competitorAverage: "€188.00" },
      { currentIcon: "unlock", currentValue: "€220.00", recommendedIcon: "equals", recommendedValue: "€220.00", committedOccupancy: 35, demandOccupancy: "59%", competitorAverage: "€215.00" },
      { currentIcon: "unlock", currentValue: "€220.00", recommendedIcon: null,     recommendedValue: "€235.00", committedOccupancy: 40, demandOccupancy: "63%", competitorAverage: "€218.00" },
      { currentIcon: "unlock", currentValue: "€155.00", recommendedIcon: null,     recommendedValue: "€155.00", committedOccupancy: 12, demandOccupancy: "24%", competitorAverage: "€160.00" },
      { currentIcon: "unlock", currentValue: "€155.00", recommendedIcon: "equals", recommendedValue: "€155.00", committedOccupancy: 14, demandOccupancy: "27%", competitorAverage: "€158.00" },
      { currentIcon: "unlock", currentValue: "€168.00", recommendedIcon: "equals", recommendedValue: "€168.00", committedOccupancy: 19, demandOccupancy: "35%", competitorAverage: "€170.00" },
    ],
  },
  {
    name: "The Grand Harbour",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "$129.00", recommendedIcon: "plane", recommendedValue: "$145.00", committedOccupancy: 55, demandOccupancy: "71%", competitorAverage: "$138.00" },
      { currentIcon: "lock",   currentValue: "$129.00", recommendedIcon: "plane", recommendedValue: "$155.00", committedOccupancy: 62, demandOccupancy: "79%", competitorAverage: "$148.00" },
      { currentIcon: "lock",   currentValue: "$159.00", recommendedIcon: "plane", recommendedValue: "$159.00", committedOccupancy: 74, demandOccupancy: "88%", competitorAverage: "$155.00" },
      { currentIcon: "unlock", currentValue: "$159.00", recommendedIcon: "plane", recommendedValue: "$175.00", committedOccupancy: 78, demandOccupancy: "91%", competitorAverage: "$162.00" },
      { currentIcon: "unlock", currentValue: "$109.00", recommendedIcon: "plane", recommendedValue: "$109.00", committedOccupancy: 31, demandOccupancy: "44%", competitorAverage: "$115.00" },
      { currentIcon: "unlock", currentValue: "$109.00", recommendedIcon: "plane", recommendedValue: "$109.00", committedOccupancy: 36, demandOccupancy: "49%", competitorAverage: "$112.00" },
      { currentIcon: "unlock", currentValue: "$119.00", recommendedIcon: "plane", recommendedValue: "$128.00", committedOccupancy: 44, demandOccupancy: "60%", competitorAverage: "$122.00" },
    ],
  },
  {
    name: "Villa Rosso Milano",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€310.00", recommendedIcon: "equals", recommendedValue: "€310.00", committedOccupancy: 29, demandOccupancy: "45%", competitorAverage: "€320.00" },
      { currentIcon: "unlock", currentValue: "€310.00", recommendedIcon: null,     recommendedValue: "€335.00", committedOccupancy: 38, demandOccupancy: "57%", competitorAverage: "€330.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "equals", recommendedValue: "€380.00", committedOccupancy: 52, demandOccupancy: "70%", competitorAverage: "€370.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "equals", recommendedValue: "€380.00", committedOccupancy: 58, demandOccupancy: "75%", competitorAverage: "€375.00" },
      { currentIcon: "lock",   currentValue: "€265.00", recommendedIcon: null,     recommendedValue: "€280.00", committedOccupancy: 21, demandOccupancy: "36%", competitorAverage: "€275.00" },
      { currentIcon: "lock",   currentValue: "€265.00", recommendedIcon: "equals", recommendedValue: "€265.00", committedOccupancy: 25, demandOccupancy: "40%", competitorAverage: "€270.00" },
      { currentIcon: "unlock", currentValue: "€290.00", recommendedIcon: null,     recommendedValue: "€305.00", committedOccupancy: 32, demandOccupancy: "50%", competitorAverage: "€298.00" },
    ],
  },
  {
    name: "The Clocktower Prague",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "$215.00", recommendedIcon: "plane", recommendedValue: "$215.00", committedOccupancy: 47, demandOccupancy: "62%", competitorAverage: "$220.00" },
      { currentIcon: "lock",   currentValue: "$215.00", recommendedIcon: "plane", recommendedValue: "$235.00", committedOccupancy: 55, demandOccupancy: "71%", competitorAverage: "$228.00" },
      { currentIcon: "lock",   currentValue: "$260.00", recommendedIcon: "plane", recommendedValue: "$260.00", committedOccupancy: 69, demandOccupancy: "83%", competitorAverage: "$255.00" },
      { currentIcon: "lock",   currentValue: "$260.00", recommendedIcon: "plane", recommendedValue: "$280.00", committedOccupancy: 73, demandOccupancy: "87%", competitorAverage: "$268.00" },
      { currentIcon: "unlock", currentValue: "$175.00", recommendedIcon: "plane", recommendedValue: "$175.00", committedOccupancy: 30, demandOccupancy: "43%", competitorAverage: "$180.00" },
      { currentIcon: "unlock", currentValue: "$175.00", recommendedIcon: "plane", recommendedValue: "$188.00", committedOccupancy: 34, demandOccupancy: "48%", competitorAverage: "$185.00" },
      { currentIcon: "unlock", currentValue: "$198.00", recommendedIcon: "plane", recommendedValue: "$198.00", committedOccupancy: 41, demandOccupancy: "57%", competitorAverage: "$195.00" },
    ],
  },
  {
    name: "Nomad House Berlin",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€89.00",  recommendedIcon: null,     recommendedValue: "€89.00",  committedOccupancy: 61, demandOccupancy: "78%", competitorAverage: "€92.00" },
      { currentIcon: "unlock", currentValue: "€89.00",  recommendedIcon: null,     recommendedValue: "€98.00",  committedOccupancy: 68, demandOccupancy: "84%", competitorAverage: "€98.00" },
      { currentIcon: "unlock", currentValue: "€110.00", recommendedIcon: "equals", recommendedValue: "€110.00", committedOccupancy: 80, demandOccupancy: "93%", competitorAverage: "€108.00" },
      { currentIcon: "lock",   currentValue: "€110.00", recommendedIcon: "equals", recommendedValue: "€110.00", committedOccupancy: 82, demandOccupancy: "95%", competitorAverage: "€112.00" },
      { currentIcon: "unlock", currentValue: "€72.00",  recommendedIcon: "equals", recommendedValue: "€72.00",  committedOccupancy: 44, demandOccupancy: "58%", competitorAverage: "€75.00" },
      { currentIcon: "unlock", currentValue: "€72.00",  recommendedIcon: null,     recommendedValue: "€72.00",  committedOccupancy: 48, demandOccupancy: "62%", competitorAverage: "€74.00" },
      { currentIcon: "unlock", currentValue: "€82.00",  recommendedIcon: null,     recommendedValue: "€90.00",  committedOccupancy: 55, demandOccupancy: "70%", competitorAverage: "€85.00" },
    ],
  },
  {
    name: "Hotel Sacher Wien",
    hotelType: "plane",
    rates: [
      { currentIcon: "unlock", currentValue: "¥28,000", recommendedIcon: "plane", recommendedValue: "¥31,000", committedOccupancy: 36, demandOccupancy: "52%", competitorAverage: "¥29,500" },
      { currentIcon: "unlock", currentValue: "¥28,000", recommendedIcon: "plane", recommendedValue: "¥33,000", committedOccupancy: 44, demandOccupancy: "60%", competitorAverage: "¥31,000" },
      { currentIcon: "unlock", currentValue: "¥35,000", recommendedIcon: "plane", recommendedValue: "¥35,000", committedOccupancy: 59, demandOccupancy: "76%", competitorAverage: "¥34,000" },
      { currentIcon: "unlock", currentValue: "¥35,000", recommendedIcon: "plane", recommendedValue: "¥38,000", committedOccupancy: 63, demandOccupancy: "80%", competitorAverage: "¥34,500" },
      { currentIcon: "unlock", currentValue: "¥22,000", recommendedIcon: "plane", recommendedValue: "¥24,500", committedOccupancy: 20, demandOccupancy: "34%", competitorAverage: "¥23,000" },
      { currentIcon: "unlock", currentValue: "¥22,000", recommendedIcon: "plane", recommendedValue: "¥22,000", committedOccupancy: 24, demandOccupancy: "38%", competitorAverage: "¥22,500" },
      { currentIcon: "lock",   currentValue: "¥25,000", recommendedIcon: "plane", recommendedValue: "¥27,500", committedOccupancy: 31, demandOccupancy: "47%", competitorAverage: "¥26,000" },
    ],
  },
  {
    name: "Palácio Belmonte",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "$165.00", recommendedIcon: "equals", recommendedValue: "$165.00", committedOccupancy: 25, demandOccupancy: "39%", competitorAverage: "$170.00" },
      { currentIcon: "unlock", currentValue: "$165.00", recommendedIcon: null,     recommendedValue: "$180.00", committedOccupancy: 30, demandOccupancy: "45%", competitorAverage: "$175.00" },
      { currentIcon: "unlock", currentValue: "$195.00", recommendedIcon: "equals", recommendedValue: "$195.00", committedOccupancy: 48, demandOccupancy: "65%", competitorAverage: "$190.00" },
      { currentIcon: "lock",   currentValue: "$195.00", recommendedIcon: null,     recommendedValue: "$210.00", committedOccupancy: 52, demandOccupancy: "70%", competitorAverage: "$200.00" },
      { currentIcon: "unlock", currentValue: "$138.00", recommendedIcon: "equals", recommendedValue: "$138.00", committedOccupancy: 17, demandOccupancy: "29%", competitorAverage: "$142.00" },
      { currentIcon: "unlock", currentValue: "$138.00", recommendedIcon: null,     recommendedValue: "$138.00", committedOccupancy: 19, demandOccupancy: "32%", competitorAverage: "$140.00" },
      { currentIcon: "unlock", currentValue: "$148.00", recommendedIcon: null,     recommendedValue: "$158.00", committedOccupancy: 27, demandOccupancy: "42%", competitorAverage: "$152.00" },
    ],
  },
  {
    name: "Caldera Bay Resort",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "€445.00", recommendedIcon: "plane", recommendedValue: "€480.00", committedOccupancy: 33, demandOccupancy: "51%", competitorAverage: "€460.00" },
      { currentIcon: "lock",   currentValue: "€445.00", recommendedIcon: "plane", recommendedValue: "€510.00", committedOccupancy: 41, demandOccupancy: "62%", competitorAverage: "€490.00" },
      { currentIcon: "lock",   currentValue: "€520.00", recommendedIcon: "plane", recommendedValue: "€520.00", committedOccupancy: 57, demandOccupancy: "75%", competitorAverage: "€510.00" },
      { currentIcon: "lock",   currentValue: "€520.00", recommendedIcon: "plane", recommendedValue: "€555.00", committedOccupancy: 62, demandOccupancy: "80%", competitorAverage: "€530.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "plane", recommendedValue: "€400.00", committedOccupancy: 22, demandOccupancy: "37%", competitorAverage: "€390.00" },
      { currentIcon: "unlock", currentValue: "€380.00", recommendedIcon: "plane", recommendedValue: "€380.00", committedOccupancy: 26, demandOccupancy: "42%", competitorAverage: "€385.00" },
      { currentIcon: "unlock", currentValue: "€415.00", recommendedIcon: "plane", recommendedValue: "€435.00", committedOccupancy: 35, demandOccupancy: "53%", competitorAverage: "€425.00" },
    ],
  },
  {
    name: "St. Moritz Palace",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "CHF 620", recommendedIcon: null,     recommendedValue: "CHF 620", committedOccupancy: 28, demandOccupancy: "44%", competitorAverage: "CHF 640" },
      { currentIcon: "unlock", currentValue: "CHF 620", recommendedIcon: null,     recommendedValue: "CHF 660", committedOccupancy: 36, demandOccupancy: "55%", competitorAverage: "CHF 670" },
      { currentIcon: "unlock", currentValue: "CHF 750", recommendedIcon: "equals", recommendedValue: "CHF 750", committedOccupancy: 50, demandOccupancy: "70%", competitorAverage: "CHF 735" },
      { currentIcon: "unlock", currentValue: "CHF 750", recommendedIcon: null,     recommendedValue: "CHF 790", committedOccupancy: 55, demandOccupancy: "76%", competitorAverage: "CHF 760" },
      { currentIcon: "unlock", currentValue: "CHF 520", recommendedIcon: "equals", recommendedValue: "CHF 520", committedOccupancy: 18, demandOccupancy: "31%", competitorAverage: "CHF 530" },
      { currentIcon: "unlock", currentValue: "CHF 520", recommendedIcon: "equals", recommendedValue: "CHF 520", committedOccupancy: 22, demandOccupancy: "36%", competitorAverage: "CHF 525" },
      { currentIcon: "lock",   currentValue: "CHF 575", recommendedIcon: null,     recommendedValue: "CHF 610", committedOccupancy: 30, demandOccupancy: "48%", competitorAverage: "CHF 590" },
    ],
  },
  {
    name: "Le Bristol Paris",
    hotelType: "plane",
    rates: [
      { currentIcon: "unlock", currentValue: "€490.00", recommendedIcon: "plane", recommendedValue: "€520.00", committedOccupancy: 44, demandOccupancy: "61%", competitorAverage: "€505.00" },
      { currentIcon: "lock",   currentValue: "€490.00", recommendedIcon: "plane", recommendedValue: "€545.00", committedOccupancy: 53, demandOccupancy: "72%", competitorAverage: "€530.00" },
      { currentIcon: "lock",   currentValue: "€580.00", recommendedIcon: "plane", recommendedValue: "€580.00", committedOccupancy: 69, demandOccupancy: "84%", competitorAverage: "€565.00" },
      { currentIcon: "unlock", currentValue: "€580.00", recommendedIcon: "plane", recommendedValue: "€610.00", committedOccupancy: 72, demandOccupancy: "87%", competitorAverage: "€595.00" },
      { currentIcon: "unlock", currentValue: "€395.00", recommendedIcon: null,    recommendedValue: "€395.00", committedOccupancy: 29, demandOccupancy: "43%", competitorAverage: "€410.00" },
      { currentIcon: "unlock", currentValue: "€395.00", recommendedIcon: "plane", recommendedValue: "€420.00", committedOccupancy: 35, demandOccupancy: "50%", competitorAverage: "€415.00" },
      { currentIcon: "unlock", currentValue: "€430.00", recommendedIcon: null,    recommendedValue: "€455.00", committedOccupancy: 42, demandOccupancy: "59%", competitorAverage: "€440.00" },
    ],
  },
  {
    name: "Four Seasons Florence",
    hotelType: "plane",
    rates: [
      { currentIcon: "unlock", currentValue: "€620.00", recommendedIcon: "plane", recommendedValue: "€655.00", committedOccupancy: 38, demandOccupancy: "56%", competitorAverage: "€635.00" },
      { currentIcon: "unlock", currentValue: "€620.00", recommendedIcon: "plane", recommendedValue: "€685.00", committedOccupancy: 47, demandOccupancy: "67%", competitorAverage: "€660.00" },
      { currentIcon: "lock",   currentValue: "€750.00", recommendedIcon: "plane", recommendedValue: "€750.00", committedOccupancy: 63, demandOccupancy: "80%", competitorAverage: "€730.00" },
      { currentIcon: "lock",   currentValue: "€750.00", recommendedIcon: "plane", recommendedValue: "€790.00", committedOccupancy: 68, demandOccupancy: "85%", competitorAverage: "€755.00" },
      { currentIcon: "unlock", currentValue: "€510.00", recommendedIcon: null,    recommendedValue: "€510.00", committedOccupancy: 24, demandOccupancy: "38%", competitorAverage: "€525.00" },
      { currentIcon: "unlock", currentValue: "€510.00", recommendedIcon: "equals",recommendedValue: "€510.00", committedOccupancy: 28, demandOccupancy: "43%", competitorAverage: "€520.00" },
      { currentIcon: "unlock", currentValue: "€555.00", recommendedIcon: null,    recommendedValue: "€580.00", committedOccupancy: 36, demandOccupancy: "53%", competitorAverage: "€565.00" },
    ],
  },
  {
    name: "Hotel Arts Barcelona",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€285.00", recommendedIcon: "equals", recommendedValue: "€285.00", committedOccupancy: 52, demandOccupancy: "68%", competitorAverage: "€295.00" },
      { currentIcon: "unlock", currentValue: "€285.00", recommendedIcon: null,     recommendedValue: "€310.00", committedOccupancy: 60, demandOccupancy: "77%", competitorAverage: "€305.00" },
      { currentIcon: "lock",   currentValue: "€340.00", recommendedIcon: "equals", recommendedValue: "€340.00", committedOccupancy: 75, demandOccupancy: "89%", competitorAverage: "€330.00" },
      { currentIcon: "lock",   currentValue: "€340.00", recommendedIcon: null,     recommendedValue: "€360.00", committedOccupancy: 79, demandOccupancy: "92%", competitorAverage: "€345.00" },
      { currentIcon: "unlock", currentValue: "€220.00", recommendedIcon: "equals", recommendedValue: "€220.00", committedOccupancy: 33, demandOccupancy: "47%", competitorAverage: "€228.00" },
      { currentIcon: "unlock", currentValue: "€220.00", recommendedIcon: null,     recommendedValue: "€235.00", committedOccupancy: 39, demandOccupancy: "54%", competitorAverage: "€230.00" },
      { currentIcon: "unlock", currentValue: "€248.00", recommendedIcon: "equals", recommendedValue: "€248.00", committedOccupancy: 46, demandOccupancy: "63%", competitorAverage: "€252.00" },
    ],
  },
  {
    name: "The Savoy London",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "£595.00", recommendedIcon: "plane", recommendedValue: "£630.00", committedOccupancy: 48, demandOccupancy: "64%", competitorAverage: "£610.00" },
      { currentIcon: "lock",   currentValue: "£595.00", recommendedIcon: "plane", recommendedValue: "£660.00", committedOccupancy: 57, demandOccupancy: "74%", competitorAverage: "£640.00" },
      { currentIcon: "lock",   currentValue: "£695.00", recommendedIcon: "plane", recommendedValue: "£695.00", committedOccupancy: 72, demandOccupancy: "87%", competitorAverage: "£680.00" },
      { currentIcon: "lock",   currentValue: "£695.00", recommendedIcon: "plane", recommendedValue: "£730.00", committedOccupancy: 76, demandOccupancy: "90%", competitorAverage: "£705.00" },
      { currentIcon: "unlock", currentValue: "£480.00", recommendedIcon: null,    recommendedValue: "£480.00", committedOccupancy: 31, demandOccupancy: "46%", competitorAverage: "£495.00" },
      { currentIcon: "unlock", currentValue: "£480.00", recommendedIcon: "plane", recommendedValue: "£505.00", committedOccupancy: 37, demandOccupancy: "52%", competitorAverage: "£498.00" },
      { currentIcon: "unlock", currentValue: "£520.00", recommendedIcon: null,    recommendedValue: "£548.00", committedOccupancy: 44, demandOccupancy: "61%", competitorAverage: "£530.00" },
    ],
  },
  {
    name: "Grand Hotel Stockholm",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "SEK 3,800", recommendedIcon: "equals", recommendedValue: "SEK 3,800", committedOccupancy: 22, demandOccupancy: "35%", competitorAverage: "SEK 3,950" },
      { currentIcon: "unlock", currentValue: "SEK 3,800", recommendedIcon: null,     recommendedValue: "SEK 4,100", committedOccupancy: 31, demandOccupancy: "47%", competitorAverage: "SEK 4,050" },
      { currentIcon: "unlock", currentValue: "SEK 4,500", recommendedIcon: "equals", recommendedValue: "SEK 4,500", committedOccupancy: 46, demandOccupancy: "63%", competitorAverage: "SEK 4,400" },
      { currentIcon: "unlock", currentValue: "SEK 4,500", recommendedIcon: null,     recommendedValue: "SEK 4,750", committedOccupancy: 50, demandOccupancy: "68%", competitorAverage: "SEK 4,550" },
      { currentIcon: "unlock", currentValue: "SEK 3,100", recommendedIcon: "equals", recommendedValue: "SEK 3,100", committedOccupancy: 15, demandOccupancy: "27%", competitorAverage: "SEK 3,200" },
      { currentIcon: "unlock", currentValue: "SEK 3,100", recommendedIcon: null,     recommendedValue: "SEK 3,250", committedOccupancy: 18, demandOccupancy: "31%", competitorAverage: "SEK 3,180" },
      { currentIcon: "unlock", currentValue: "SEK 3,400", recommendedIcon: "equals", recommendedValue: "SEK 3,400", committedOccupancy: 26, demandOccupancy: "40%", competitorAverage: "SEK 3,450" },
    ],
  },
  {
    name: "Park Hyatt Istanbul",
    hotelType: "plane",
    rates: [
      { currentIcon: "lock",   currentValue: "₺18,500", recommendedIcon: "plane", recommendedValue: "₺19,800", committedOccupancy: 41, demandOccupancy: "58%", competitorAverage: "₺19,200" },
      { currentIcon: "lock",   currentValue: "₺18,500", recommendedIcon: "plane", recommendedValue: "₺21,000", committedOccupancy: 50, demandOccupancy: "67%", competitorAverage: "₺20,500" },
      { currentIcon: "unlock", currentValue: "₺22,000", recommendedIcon: "plane", recommendedValue: "₺22,000", committedOccupancy: 64, demandOccupancy: "81%", competitorAverage: "₺21,500" },
      { currentIcon: "unlock", currentValue: "₺22,000", recommendedIcon: "plane", recommendedValue: "₺23,500", committedOccupancy: 68, demandOccupancy: "85%", competitorAverage: "₺22,800" },
      { currentIcon: "unlock", currentValue: "₺14,500", recommendedIcon: null,    recommendedValue: "₺14,500", committedOccupancy: 26, demandOccupancy: "40%", competitorAverage: "₺15,000" },
      { currentIcon: "unlock", currentValue: "₺14,500", recommendedIcon: "plane", recommendedValue: "₺15,500", committedOccupancy: 30, demandOccupancy: "45%", competitorAverage: "₺15,200" },
      { currentIcon: "unlock", currentValue: "₺16,000", recommendedIcon: null,    recommendedValue: "₺17,000", committedOccupancy: 37, demandOccupancy: "54%", competitorAverage: "₺16,500" },
    ],
  },
  {
    name: "Baur au Lac Zürich",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "CHF 890", recommendedIcon: null,     recommendedValue: "CHF 890",  committedOccupancy: 30, demandOccupancy: "46%", competitorAverage: "CHF 920" },
      { currentIcon: "unlock", currentValue: "CHF 890", recommendedIcon: "equals", recommendedValue: "CHF 890",  committedOccupancy: 38, demandOccupancy: "56%", competitorAverage: "CHF 910" },
      { currentIcon: "unlock", currentValue: "CHF 980", recommendedIcon: "equals", recommendedValue: "CHF 980",  committedOccupancy: 54, demandOccupancy: "72%", competitorAverage: "CHF 960" },
      { currentIcon: "unlock", currentValue: "CHF 980", recommendedIcon: null,     recommendedValue: "CHF 1,040",committedOccupancy: 59, demandOccupancy: "77%", competitorAverage: "CHF 1,000" },
      { currentIcon: "unlock", currentValue: "CHF 720", recommendedIcon: "equals", recommendedValue: "CHF 720",  committedOccupancy: 20, demandOccupancy: "33%", competitorAverage: "CHF 740" },
      { currentIcon: "unlock", currentValue: "CHF 720", recommendedIcon: null,     recommendedValue: "CHF 750",  committedOccupancy: 24, demandOccupancy: "38%", competitorAverage: "CHF 738" },
      { currentIcon: "unlock", currentValue: "CHF 790", recommendedIcon: "equals", recommendedValue: "CHF 790",  committedOccupancy: 32, demandOccupancy: "49%", competitorAverage: "CHF 800" },
    ],
  },
  {
    name: "Radisson Blu Warsaw",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "PLN 680", recommendedIcon: "equals", recommendedValue: "PLN 680", committedOccupancy: 45, demandOccupancy: "61%", competitorAverage: "PLN 710" },
      { currentIcon: "unlock", currentValue: "PLN 680", recommendedIcon: null,     recommendedValue: "PLN 730", committedOccupancy: 54, demandOccupancy: "71%", competitorAverage: "PLN 720" },
      { currentIcon: "lock",   currentValue: "PLN 820", recommendedIcon: "equals", recommendedValue: "PLN 820", committedOccupancy: 68, demandOccupancy: "84%", competitorAverage: "PLN 800" },
      { currentIcon: "lock",   currentValue: "PLN 820", recommendedIcon: null,     recommendedValue: "PLN 870", committedOccupancy: 73, demandOccupancy: "88%", competitorAverage: "PLN 840" },
      { currentIcon: "unlock", currentValue: "PLN 540", recommendedIcon: "equals", recommendedValue: "PLN 540", committedOccupancy: 30, demandOccupancy: "45%", competitorAverage: "PLN 560" },
      { currentIcon: "unlock", currentValue: "PLN 540", recommendedIcon: null,     recommendedValue: "PLN 560", committedOccupancy: 35, demandOccupancy: "50%", competitorAverage: "PLN 555" },
      { currentIcon: "unlock", currentValue: "PLN 595", recommendedIcon: "equals", recommendedValue: "PLN 595", committedOccupancy: 42, demandOccupancy: "58%", competitorAverage: "PLN 605" },
    ],
  },
  {
    name: "Meriton Suites Dublin",
    hotelType: "standard",
    rates: [
      { currentIcon: "unlock", currentValue: "€195.00", recommendedIcon: "equals", recommendedValue: "€195.00", committedOccupancy: 35, demandOccupancy: "50%", competitorAverage: "€200.00" },
      { currentIcon: "unlock", currentValue: "€195.00", recommendedIcon: null,     recommendedValue: "€210.00", committedOccupancy: 43, demandOccupancy: "60%", competitorAverage: "€208.00" },
      { currentIcon: "unlock", currentValue: "€240.00", recommendedIcon: "equals", recommendedValue: "€240.00", committedOccupancy: 58, demandOccupancy: "75%", competitorAverage: "€235.00" },
      { currentIcon: "unlock", currentValue: "€240.00", recommendedIcon: null,     recommendedValue: "€258.00", committedOccupancy: 62, demandOccupancy: "79%", competitorAverage: "€248.00" },
      { currentIcon: "unlock", currentValue: "€158.00", recommendedIcon: "equals", recommendedValue: "€158.00", committedOccupancy: 21, demandOccupancy: "34%", competitorAverage: "€163.00" },
      { currentIcon: "unlock", currentValue: "€158.00", recommendedIcon: null,     recommendedValue: "€168.00", committedOccupancy: 25, demandOccupancy: "39%", competitorAverage: "€162.00" },
      { currentIcon: "unlock", currentValue: "€172.00", recommendedIcon: "equals", recommendedValue: "€172.00", committedOccupancy: 33, demandOccupancy: "48%", competitorAverage: "€176.00" },
    ],
  },
  {
    name: "Hotel de Rome Berlin",
    hotelType: "plane",
    rates: [
      { currentIcon: "unlock", currentValue: "€310.00", recommendedIcon: "plane", recommendedValue: "€335.00", committedOccupancy: 40, demandOccupancy: "57%", competitorAverage: "€320.00" },
      { currentIcon: "unlock", currentValue: "€310.00", recommendedIcon: "plane", recommendedValue: "€355.00", committedOccupancy: 49, demandOccupancy: "67%", competitorAverage: "€345.00" },
      { currentIcon: "lock",   currentValue: "€375.00", recommendedIcon: "plane", recommendedValue: "€375.00", committedOccupancy: 64, demandOccupancy: "82%", competitorAverage: "€365.00" },
      { currentIcon: "lock",   currentValue: "€375.00", recommendedIcon: "plane", recommendedValue: "€398.00", committedOccupancy: 69, demandOccupancy: "86%", competitorAverage: "€380.00" },
      { currentIcon: "unlock", currentValue: "€248.00", recommendedIcon: null,    recommendedValue: "€248.00", committedOccupancy: 26, demandOccupancy: "40%", competitorAverage: "€255.00" },
      { currentIcon: "unlock", currentValue: "€248.00", recommendedIcon: "plane", recommendedValue: "€265.00", committedOccupancy: 31, demandOccupancy: "46%", competitorAverage: "€260.00" },
      { currentIcon: "unlock", currentValue: "€272.00", recommendedIcon: null,    recommendedValue: "€290.00", committedOccupancy: 39, demandOccupancy: "56%", competitorAverage: "€278.00" },
    ],
  },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const DATE_HEADER_BG  = "#d4e4f5";
const SUBHEADER_BG    = "#e4dff5";
const HOTEL_COL_BG    = "#ece8f8";
const BORDER_THIN     = "#dde1e2";
const BORDER_THICK    = "#dde1e2";
const RATE_COL_WIDTH     = "124px";
const OVERRIDE_COL_WIDTH = "124px";
const RESTR_COL_WIDTH    = "124px";
const EXP_COL_WIDTH      = "124px";
const PRIMARY_TEXT    = "#1a2533";
const CELL_TEXT       = "#1a2533";
const SUBHEADER_TEXT  = "#4f5b60";
const DATE_HEADER_TEXT = "#1e3a5f";

function thickBorder(side: "right" | "left" = "right") {
  return side === "right"
    ? { borderRight: `2px solid ${BORDER_THICK}` }
    : { borderLeft: `2px solid ${BORDER_THICK}` };
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function LockedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#006461">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function UnlockedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006461" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function EqualsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4f5b60">
      <path d="M19 10H5v2h14v-2zm0 4H5v2h14v-2z" />
    </svg>
  );
}

function ChevronIcon({ left = false }: { left?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={DATE_HEADER_TEXT} style={left ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#006461" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CheckboxCheckedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#006461">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function CheckboxUncheckedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa5ab" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  );
}

function SmallChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="#006461">
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

// ── Expanded column definitions ───────────────────────────────────────────────
const ALL_EXPANDED_COLS = [
  { key: "committedOcc",  label: "Committed Occ." },
  { key: "demandOcc",     label: "Demand Occ." },
  { key: "competitorAvg", label: "Competitor Avg." },
];

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  dirtyRestrictions: Map<string, DayRestriction>;
  showRestrictions?: boolean;
  visibleHotels?: string[];
  visibleColumns?: string[];
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function RatesTableWithRestrictions({
  dirtyRestrictions,
  showRestrictions = true,
  visibleHotels,
  visibleColumns = ["committedOcc", "demandOcc", "competitorAvg"],
}: Props) {
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Accepted recommendations: all null-icon cells start accepted (checked)
  const [acceptedRecs, setAcceptedRecs] = useState<Set<string>>(() => {
    const s = new Set<string>();
    HOTELS.forEach((hotel) => {
      hotel.rates.forEach((rate, i) => {
        if (rate.recommendedIcon === null) s.add(`${hotel.name}:${i}`);
      });
    });
    return s;
  });

  function toggleRec(hotelName: string, dayIdx: number) {
    const key = `${hotelName}:${dayIdx}`;
    setAcceptedRecs((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  // Filter hotels by visible selection; preserve seed order
  const displayedHotels = visibleHotels
    ? HOTELS.filter((h) => visibleHotels.includes(h.name))
    : HOTELS;

  // Build a lookup map from restriction seed data
  const restrictionMap = new Map(
    HOTEL_RESTRICTIONS.map((h) => [h.hotelId, h.restrictions])
  );

  function toggleDay(day: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  function getRestriction(hotelId: string, dayIdx: number): DayRestriction {
    const dirtyKey = `${hotelId}:${dayIdx}`;
    if (dirtyRestrictions.has(dirtyKey)) {
      return dirtyRestrictions.get(dirtyKey)!;
    }
    return restrictionMap.get(hotelId)?.[dayIdx] ?? { type: "None" };
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[13px]" style={{ minWidth: "1100px" }}>
        <thead>
          {/* Row 1: Hotel + date group headers */}
          <tr>
            <th
              className="text-left px-4 py-2 font-semibold border-b sticky left-0 z-20"
              style={{
                width: "180px",
                borderColor: BORDER_THIN,
                color: PRIMARY_TEXT,
                backgroundColor: "#ffffff",
                ...thickBorder(),
              }}
              rowSpan={2}
            >
              Hotel
            </th>
            {DAYS.map((day, di) => {
              const expanded = expandedDays.has(day);
              const isLast = di === DAYS.length - 1;
              const dayBg = di % 2 === 0 ? DATE_HEADER_BG : SUBHEADER_BG;
              const visExpCols = ALL_EXPANDED_COLS.filter((c) => visibleColumns.includes(c.key));
              const expColCount = expanded ? visExpCols.length : 0;
              const baseColCount = 3 + (showRestrictions ? 1 : 0);
              return (
                <th
                  key={day}
                  colSpan={baseColCount + expColCount}
                  className="text-center px-2 py-1.5 font-normal border-b text-[12px]"
                  style={{
                    backgroundColor: dayBg,
                    borderColor: BORDER_THIN,
                    color: DATE_HEADER_TEXT,
                    ...(isLast ? { borderRight: `1px solid ${BORDER_THIN}` } : thickBorder()),
                  }}
                >
                  <button
                    className="flex items-center justify-center gap-1 w-full cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                    <ChevronIcon left={expanded} />
                  </button>
                </th>
              );
            })}
          </tr>

          {/* Row 2: Current / Recommended / Restrictions (+ expanded cols) */}
          <tr>
            {DAYS.map((day, di) => {
              const expanded = expandedDays.has(day);
              const isLast = di === DAYS.length - 1;
              const sectionEndBorder = isLast
                ? { borderRight: `1px solid ${BORDER_THIN}` }
                : thickBorder();
              const dayBg = di % 2 === 0 ? DATE_HEADER_BG : SUBHEADER_BG;
              const visExpCols2 = ALL_EXPANDED_COLS.filter((c) => visibleColumns.includes(c.key));
              const hasExpCols = expanded && visExpCols2.length > 0;
              return (
                <Fragment key={day}>
                  {/* Current */}
                  <th
                    className="text-right px-3 py-1 font-normal border-b text-[12px]"
                    style={{
                      backgroundColor: dayBg,
                      borderRight: `1px solid ${BORDER_THIN}`,
                      color: SUBHEADER_TEXT,
                      width: RATE_COL_WIDTH,
                      minWidth: RATE_COL_WIDTH,
                    }}
                  >
                    Current
                  </th>
                  {/* Recommended */}
                  <th
                    className="text-right px-3 py-1 font-normal border-b text-[12px]"
                    style={{
                      backgroundColor: dayBg,
                      color: SUBHEADER_TEXT,
                      width: RATE_COL_WIDTH,
                      minWidth: RATE_COL_WIDTH,
                      borderRight: `1px solid ${BORDER_THIN}`,
                    }}
                  >
                    Recommended
                  </th>
                  {/* Override */}
                  <th
                    className="text-right px-3 py-1 font-normal border-b text-[12px]"
                    style={{
                      backgroundColor: dayBg,
                      color: SUBHEADER_TEXT,
                      width: OVERRIDE_COL_WIDTH,
                      minWidth: OVERRIDE_COL_WIDTH,
                      ...(!showRestrictions && !hasExpCols ? sectionEndBorder : { borderRight: `1px solid ${BORDER_THIN}` }),
                    }}
                  >
                    Override
                  </th>
                  {/* Restrictions — conditional */}
                  {showRestrictions && (
                    <th
                      className="text-center px-3 py-1 font-normal border-b text-[12px]"
                      style={{
                        backgroundColor: dayBg,
                        color: SUBHEADER_TEXT,
                        width: RESTR_COL_WIDTH,
                        minWidth: RESTR_COL_WIDTH,
                        ...(!hasExpCols ? sectionEndBorder : { borderRight: `1px solid ${BORDER_THIN}` }),
                      }}
                    >
                      Restrictions
                    </th>
                  )}
                  {/* Expanded columns — only those in visibleColumns */}
                  {hasExpCols && visExpCols2.map((col, idx) => {
                    const isLastExpCol = idx === visExpCols2.length - 1;
                    return (
                      <th
                        key={col.key}
                        className="text-right px-3 py-1 font-normal border-b text-[12px]"
                        style={{
                          backgroundColor: dayBg,
                          color: SUBHEADER_TEXT,
                          width: EXP_COL_WIDTH,
                          minWidth: EXP_COL_WIDTH,
                          ...(isLastExpCol ? sectionEndBorder : { borderRight: `1px solid ${BORDER_THIN}` }),
                        }}
                      >
                        {col.label}
                      </th>
                    );
                  })}
                </Fragment>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {displayedHotels.map((hotel) => {
            const isSelected = selectedHotel === hotel.name;
            const rowBg = isSelected ? "#eaf1fb" : "#ffffff";
            return (
              <tr
                key={hotel.name}
                onClick={() => setSelectedHotel(isSelected ? null : hotel.name)}
                className="group cursor-pointer hover:brightness-[0.97] transition-all"
                style={{ backgroundColor: rowBg }}
              >
                {/* Hotel name */}
                <td
                  className="px-4 py-2 border-b sticky left-0 z-10"
                  style={{
                    color: PRIMARY_TEXT,
                    backgroundColor: HOTEL_COL_BG,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    maxWidth: "180px",
                    borderBottom: `1px solid ${BORDER_THIN}`,
                    ...thickBorder(),
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="truncate flex-1">{hotel.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <ExternalLinkIcon />
                    </span>
                  </span>
                </td>

                {/* Rate + restriction cells */}
                {hotel.rates.map((rate, i) => {
                  const day = DAYS[i];
                  const expanded = expandedDays.has(day);
                  const isLast = i === DAYS.length - 1;
                  const sectionEndBorder = isLast
                    ? { borderRight: `1px solid ${BORDER_THIN}` }
                    : thickBorder();
                  const restriction = getRestriction(hotel.name, i);
                  const seedRestriction = restrictionMap.get(hotel.name)?.[i];
                  const originalRestriction =
                    restriction.type === "None" && restriction.isDirty
                      ? seedRestriction
                      : undefined;
                  const visExpColsBody = ALL_EXPANDED_COLS.filter((c) => visibleColumns.includes(c.key));
                  const hasExpColsBody = expanded && visExpColsBody.length > 0;
                  const cellValues: Record<string, string> = {
                    committedOcc: `${rate.committedOccupancy}%`,
                    demandOcc: rate.demandOccupancy,
                    competitorAvg: rate.competitorAverage,
                  };

                  return (
                    <Fragment key={i}>
                      {/* Current */}
                      <td
                        className="px-3 py-2 border-b"
                        style={{
                          borderColor: BORDER_THIN,
                          borderRight: `1px solid ${BORDER_THIN}`,
                          color: CELL_TEXT,
                          width: RATE_COL_WIDTH,
                          minWidth: RATE_COL_WIDTH,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 shrink-0 flex justify-center">
                            {rate.currentIcon === "lock" ? <LockedIcon /> : <UnlockedIcon />}
                          </span>
                          <span className="flex-1 text-right">{rate.currentValue}</span>
                        </span>
                      </td>

                      {/* Recommended */}
                      {(() => {
                        // Override always follows Recommended, so always thin right border
                        const recRightBorder = { borderRight: `1px solid ${BORDER_THIN}` };

                        if (rate.recommendedIcon === null) {
                          const accepted = acceptedRecs.has(`${hotel.name}:${i}`);
                          return (
                            <td
                              className="px-3 py-2 border-b"
                              style={{
                                width: RATE_COL_WIDTH,
                                minWidth: RATE_COL_WIDTH,
                                whiteSpace: "nowrap",
                                borderBottom: `1px solid ${BORDER_THIN}`,
                                ...recRightBorder,
                                backgroundColor: accepted ? "#daf0ec" : undefined,
                              }}
                              onClick={(e) => { e.stopPropagation(); toggleRec(hotel.name, i); }}
                            >
                              <span className="flex items-center gap-1.5 cursor-pointer">
                                <span className="w-4 shrink-0 flex justify-center">
                                  {accepted ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />}
                                </span>
                                <span className="flex-1 text-right" style={{ color: accepted ? "#065f46" : CELL_TEXT }}>
                                  {rate.recommendedValue}
                                </span>
                                {accepted && <SmallChevronDown />}
                              </span>
                            </td>
                          );
                        }

                        return (
                          <td
                            className="px-3 py-2 border-b"
                            style={{
                              color: CELL_TEXT,
                              width: RATE_COL_WIDTH,
                              minWidth: RATE_COL_WIDTH,
                              whiteSpace: "nowrap",
                              borderBottom: `1px solid ${BORDER_THIN}`,
                              ...recRightBorder,
                            }}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="w-4 shrink-0 flex justify-center">
                                {rate.recommendedIcon === "plane" && <PlaneIcon />}
                                {rate.recommendedIcon === "equals" && <EqualsIcon />}
                              </span>
                              <span className="flex-1 text-right">{rate.recommendedValue}</span>
                            </span>
                          </td>
                        );
                      })()}

                      {/* Override */}
                      <td
                        className="px-3 py-2 border-b"
                        style={{
                          width: OVERRIDE_COL_WIDTH,
                          minWidth: OVERRIDE_COL_WIDTH,
                          whiteSpace: "nowrap",
                          borderBottom: `1px solid ${BORDER_THIN}`,
                          ...(!showRestrictions && !hasExpColsBody ? sectionEndBorder : { borderRight: `1px solid ${BORDER_THIN}` }),
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          className="border rounded px-1 py-1 text-[13px] text-right w-full"
                          style={{ borderColor: BORDER_THIN, color: CELL_TEXT }}
                          placeholder=""
                        />
                      </td>

                      {/* Restrictions — conditional */}
                      {showRestrictions && (
                        <td
                          className="px-3 py-2 border-b text-center"
                          style={{
                            color: CELL_TEXT,
                            width: RESTR_COL_WIDTH,
                            minWidth: RESTR_COL_WIDTH,
                            borderBottom: `1px solid ${BORDER_THIN}`,
                            backgroundColor: restriction.isDirty ? "#daf0ec" : undefined,
                            ...(!hasExpColsBody ? sectionEndBorder : { borderRight: `1px solid ${BORDER_THIN}` }),
                          }}
                        >
                          <RestrictionCell restriction={restriction} originalRestriction={originalRestriction} />
                        </td>
                      )}

                      {/* Expanded columns — only those in visibleColumns */}
                      {hasExpColsBody && visExpColsBody.map((col, idx) => {
                        const isLastExpCol = idx === visExpColsBody.length - 1;
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2 border-b text-right"
                            style={{
                              color: CELL_TEXT,
                              width: EXP_COL_WIDTH,
                              minWidth: EXP_COL_WIDTH,
                              whiteSpace: "nowrap",
                              borderBottom: `1px solid ${BORDER_THIN}`,
                              ...(isLastExpCol ? sectionEndBorder : { borderRight: `1px solid ${BORDER_THIN}` }),
                            }}
                          >
                            {cellValues[col.key]}
                          </td>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


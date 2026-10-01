// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search, Globe, Sparkles, ShieldCheck, AlertTriangle, CheckCircle2,
  ChevronRight, Plus, Trash2, Share2, Download, ExternalLink, Compass,
  ArrowLeftRight, MapPin, Calendar, Layers, UserCheck, Sun, Moon,
  Smartphone, Monitor, Info, X, Check, SlidersHorizontal, FileText,
  Plane, Clock, Award, HelpCircle, RefreshCw
} from 'lucide-react';

const BRAND = {
  deepPlum: '#241246',
  royalPurple: '#4A2585',
  magenta: '#8A3B8F',
  sunsetOrange: '#EF7D3C',
  teal: '#12A99C',
  paper: '#FBF9FF',
  ink: '#221A3A',
};

const VISA_CATEGORIES = {
  visa_free: {
    id: 'visa_free',
    label: 'Visa Free',
    shortLabel: 'Visa Free',
    easeRank: 60,
    color: BRAND.teal,
    bgLight: 'rgba(18, 169, 156, 0.14)',
    borderLight: 'rgba(18, 169, 156, 0.4)',
  },
  eta: {
    id: 'eta',
    label: 'eTA / Electronic Auth',
    shortLabel: 'eTA / ESTA',
    easeRank: 50,
    color: BRAND.magenta,
    bgLight: 'rgba(138, 59, 143, 0.14)',
    borderLight: 'rgba(138, 59, 143, 0.4)',
  },
  visa_on_arrival: {
    id: 'visa_on_arrival',
    label: 'Visa on Arrival',
    shortLabel: 'VoA',
    easeRank: 40,
    color: BRAND.sunsetOrange,
    bgLight: 'rgba(239, 125, 60, 0.15)',
    borderLight: 'rgba(239, 125, 60, 0.45)',
  },
  evisa: {
    id: 'evisa',
    label: 'eVisa',
    shortLabel: 'eVisa',
    easeRank: 30,
    color: BRAND.magenta,
    bgLight: 'rgba(138, 59, 143, 0.14)',
    borderLight: 'rgba(138, 59, 143, 0.4)',
  },
  special: {
    id: 'special',
    label: 'Special / Transit Permit',
    shortLabel: 'Special',
    easeRank: 20,
    color: BRAND.royalPurple,
    bgLight: 'rgba(74, 37, 133, 0.15)',
    borderLight: 'rgba(74, 37, 133, 0.4)',
  },
  visa_required: {
    id: 'visa_required',
    label: 'Visa Required',
    shortLabel: 'Embassy Visa',
    easeRank: 10,
    color: BRAND.deepPlum,
    bgLight: 'rgba(36, 18, 70, 0.12)',
    borderLight: 'rgba(36, 18, 70, 0.35)',
  },
  banned: {
    id: 'banned',
    label: 'Entry Restricted',
    shortLabel: 'Restricted',
    easeRank: 0,
    color: '#991B1B',
    bgLight: 'rgba(153, 27, 27, 0.15)',
    borderLight: 'rgba(153, 27, 27, 0.4)',
  },
};

const BOOSTER_ISSUERS = [
  { id: 'US', name: 'United States', flagCode: 'us' },
  { id: 'SCHENGEN', name: 'Schengen / EU', flagCode: 'eu' },
  { id: 'UK', name: 'United Kingdom', flagCode: 'gb' },
  { id: 'CA', name: 'Canada', flagCode: 'ca' },
  { id: 'AU', name: 'Australia', flagCode: 'au' },
  { id: 'JP', name: 'Japan', flagCode: 'jp' },
  { id: 'IE', name: 'Ireland', flagCode: 'ie' },
];

const BOOSTER_DOC_KINDS = [
  // 1. United States
  {
    id: 'us_b1_b2',
    issuer: 'US',
    flagCode: 'us',
    title: 'US B1/B2 Visitor Visa',
    shortTitle: 'US B1/B2 Visa',
    isResidence: false,
    note: 'Multi-purpose tourist/business sticker visa in passport.',
  },
  {
    id: 'us_f_j_h_l_o',
    issuer: 'US',
    flagCode: 'us',
    title: 'US F / J / H / L / O Study or Work Visa',
    shortTitle: 'US Work/Study Visa',
    isResidence: false,
    note: 'Valid nonimmigrant student, exchange, or employment visa stamp.',
  },
  {
    id: 'us_c1_transit',
    issuer: 'US',
    flagCode: 'us',
    title: 'US C-1/C-2/C-3 Transit Visa',
    shortTitle: 'US C-1 Transit',
    isResidence: false,
    isTransitWarning: true,
    note: 'Warning: Mexico, Costa Rica, Panama & Colombia explicitly exclude C-1 transit visas.',
  },
  {
    id: 'us_green_card',
    issuer: 'US',
    flagCode: 'us',
    title: 'US Permanent Resident (Green Card I-551)',
    shortTitle: 'US Green Card',
    isResidence: true,
    note: 'Unlocks Canada, Mexico, Central America, Caribbean & UAE (for eligible nationalities).',
  },
  // 2. United Kingdom
  {
    id: 'uk_standard_visitor',
    issuer: 'UK',
    flagCode: 'gb',
    title: 'UK Standard Visitor Visa',
    shortTitle: 'UK Visitor Visa',
    isResidence: false,
    note: '6-month, 2-year, 5-year, or 10-year UK multi-entry visitor vignette.',
  },
  {
    id: 'uk_student_work',
    issuer: 'UK',
    flagCode: 'gb',
    title: 'UK Student / Skilled Worker Visa',
    shortTitle: 'UK Study/Work Visa',
    isResidence: false,
    note: 'Long-term UK academic or sponsored employment permission.',
  },
  {
    id: 'uk_ilr_residence_evisa',
    issuer: 'UK',
    flagCode: 'gb',
    title: 'UK ILR / Settlement Residence (eVisa/BRP)',
    shortTitle: 'UK Residence / ILR',
    isResidence: true,
    note: 'Residence status is distinct from a visitor visa (required for UAE VoA & Dutch Caribbean).',
  },
  // 3. Schengen / EU
  {
    id: 'schengen_c_multi',
    issuer: 'SCHENGEN',
    flagCode: 'eu',
    title: 'Schengen Type C Short-Stay Visa',
    shortTitle: 'Schengen C Visa',
    isResidence: false,
    note: 'Short-stay Schengen sticker visa (many boosters require Multiple-Entry).',
  },
  {
    id: 'schengen_d_national',
    issuer: 'SCHENGEN',
    flagCode: 'eu',
    title: 'Schengen Type D National Long-Stay Visa',
    shortTitle: 'Schengen D Visa',
    isResidence: false,
    note: 'National long-stay study or work visa issued by a Schengen member state.',
  },
  {
    id: 'schengen_eu_residence',
    issuer: 'SCHENGEN',
    flagCode: 'eu',
    title: 'EU / Schengen Residence Permit Card',
    shortTitle: 'EU Residence Card',
    isResidence: true,
    note: 'Biometric residence card issued by any EU or Schengen member state.',
  },
  // 4. Canada
  {
    id: 'ca_trv_visitor_study_work',
    issuer: 'CA',
    flagCode: 'ca',
    title: 'Canada Visitor / Study / Work TRV',
    shortTitle: 'Canada TRV Visa',
    isResidence: false,
    note: 'Temporary Resident Visa counterfoil stamped in passport.',
  },
  {
    id: 'ca_pr_card',
    issuer: 'CA',
    flagCode: 'ca',
    title: 'Canada Permanent Resident (PR Card)',
    shortTitle: 'Canada PR Card',
    isResidence: true,
    note: 'Canadian Permanent Resident card.',
  },
  // 5. Australia
  {
    id: 'au_visitor_visa',
    issuer: 'AU',
    flagCode: 'au',
    title: 'Australia Visitor / Temporary Visa',
    shortTitle: 'Australia Visa',
    isResidence: false,
    note: 'Note: Some destinations (e.g. Panama/Peru) require physical/verified visa.',
  },
  {
    id: 'au_permanent_resident',
    issuer: 'AU',
    flagCode: 'au',
    title: 'Australia Permanent Resident',
    shortTitle: 'Australia PR',
    isResidence: true,
    note: 'Australian permanent residence status.',
  },
  // 6. Japan
  {
    id: 'jp_sticker_visa',
    issuer: 'JP',
    flagCode: 'jp',
    title: 'Japan Single / Multiple Entry Visa',
    shortTitle: 'Japan Visa',
    isResidence: false,
    note: 'Unlocks Mexico, Panama, Georgia, Philippines & Singapore VFTF.',
  },
  {
    id: 'jp_residence_card',
    issuer: 'JP',
    flagCode: 'jp',
    title: 'Japan Zairyu Residence Card',
    shortTitle: 'Japan Residence',
    isResidence: true,
    note: 'Mid-to-long-term resident card issued by Japan.',
  },
  // 7. Ireland
  {
    id: 'ie_short_stay_visa',
    issuer: 'IE',
    flagCode: 'ie',
    title: 'Ireland Short-Stay C Visa',
    shortTitle: 'Ireland Visa',
    isResidence: false,
    note: 'Accepted by Türkiye (conditional eVisa), Montenegro, and Georgia.',
  },
  {
    id: 'ie_residence_permit',
    issuer: 'IE',
    flagCode: 'ie',
    title: 'Ireland Residence Permit (IRP)',
    shortTitle: 'Ireland Residence',
    isResidence: true,
    note: 'Accepted by Türkiye, Dutch Caribbean, Montenegro, and Georgia.',
  },
];

const RAW_JURISDICTIONS = [
  // AMERICAS (44)
  ['US', 'United States', 'Americas', 'NONE', 'Washington, D.C.', 1],
  ['CA', 'Canada', 'Americas', 'NONE', 'Ottawa', 1],
  ['MX', 'Mexico', 'Americas', 'NONE', 'Mexico City', 2],
  ['BR', 'Brazil', 'Americas', 'NONE', 'Brasília', 2],
  ['AR', 'Argentina', 'Americas', 'NONE', 'Buenos Aires', 2],
  ['CL', 'Chile', 'Americas', 'NONE', 'Santiago', 1],
  ['CO', 'Colombia', 'Americas', 'NONE', 'Bogotá', 2],
  ['PE', 'Peru', 'Americas', 'NONE', 'Lima', 2],
  ['CR', 'Costa Rica', 'Americas', 'NONE', 'San José', 2],
  ['PA', 'Panama', 'Americas', 'NONE', 'Panama City', 2],
  ['BZ', 'Belize', 'Americas', 'NONE', 'Belmopan', 2],
  ['GT', 'Guatemala', 'Americas', 'CA4_SHARED_90', 'Guatemala City', 2],
  ['SV', 'El Salvador', 'Americas', 'CA4_SHARED_90', 'San Salvador', 2],
  ['HN', 'Honduras', 'Americas', 'CA4_SHARED_90', 'Tegucigalpa', 2],
  ['NI', 'Nicaragua', 'Americas', 'CA4_SHARED_90', 'Managua', 2],
  ['DO', 'Dominican Republic', 'Americas', 'NONE', 'Santo Domingo', 3],
  ['JM', 'Jamaica', 'Americas', 'NONE', 'Kingston', 2],
  ['BS', 'Bahamas', 'Americas', 'NONE', 'Nassau', 2],
  ['BB', 'Barbados', 'Americas', 'NONE', 'Bridgetown', 2],
  ['TT', 'Trinidad & Tobago', 'Americas', 'NONE', 'Port of Spain', 2],
  ['UY', 'Uruguay', 'Americas', 'NONE', 'Montevideo', 2],
  ['PY', 'Paraguay', 'Americas', 'NONE', 'Asunción', 2],
  ['BO', 'Bolivia', 'Americas', 'NONE', 'La Paz', 3],
  ['EC', 'Ecuador', 'Americas', 'NONE', 'Quito', 3],
  ['VE', 'Venezuela', 'Americas', 'NONE', 'Caracas', 3],
  ['GY', 'Guyana', 'Americas', 'NONE', 'Georgetown', 3],
  ['SR', 'Suriname', 'Americas', 'NONE', 'Paramaribo', 3],
  ['CU', 'Cuba', 'Americas', 'NONE', 'Havana', 4],
  ['HT', 'Haiti', 'Americas', 'NONE', 'Port-au-Prince', 4],
  ['AG', 'Antigua & Barbuda', 'Americas', 'NONE', "St. John's", 2],
  ['DM', 'Dominica', 'Americas', 'NONE', 'Roseau', 2],
  ['GD', 'Grenada', 'Americas', 'NONE', "St. George's", 2],
  ['KN', 'St. Kitts & Nevis', 'Americas', 'NONE', 'Basseterre', 2],
  ['LC', 'St. Lucia', 'Americas', 'NONE', 'Castries', 2],
  ['VC', 'St. Vincent & the Grenadines', 'Americas', 'NONE', 'Kingstown', 2],
  // Americas Territories
  ['PR', 'Puerto Rico (US)', 'Americas', 'NONE', 'San Juan', 1],
  ['VI', 'US Virgin Islands', 'Americas', 'NONE', 'Charlotte Amalie', 1],
  ['BM', 'Bermuda', 'Americas', 'NONE', 'Hamilton', 2],
  ['KY', 'Cayman Islands', 'Americas', 'NONE', 'George Town', 2],
  ['VG', 'British Virgin Islands', 'Americas', 'NONE', 'Road Town', 2],
  ['TC', 'Turks & Caicos Islands', 'Americas', 'NONE', 'Cockburn Town', 2],
  ['AW', 'Aruba', 'Americas', 'NONE', 'Oranjestad', 2],
  ['CW', 'Curaçao', 'Americas', 'NONE', 'Willemstad', 2],
  ['SX', 'Sint Maarten', 'Americas', 'NONE', 'Philipsburg', 2],
  ['GF', 'French Guiana', 'Americas', 'NONE', 'Cayenne', 2],
  ['GL', 'Greenland', 'Americas', 'NONE', 'Nuuk', 2],

  // EUROPE (50)
  ['GB', 'United Kingdom', 'Europe', 'NONE', 'London', 1],
  ['IE', 'Ireland', 'Europe', 'NONE', 'Dublin', 1],
  ['FR', 'France', 'Europe', 'SCHENGEN_90_180', 'Paris', 1],
  ['DE', 'Germany', 'Europe', 'SCHENGEN_90_180', 'Berlin', 1],
  ['IT', 'Italy', 'Europe', 'SCHENGEN_90_180', 'Rome', 1],
  ['ES', 'Spain', 'Europe', 'SCHENGEN_90_180', 'Madrid', 1],
  ['PT', 'Portugal', 'Europe', 'SCHENGEN_90_180', 'Lisbon', 1],
  ['NL', 'Netherlands', 'Europe', 'SCHENGEN_90_180', 'Amsterdam', 1],
  ['BE', 'Belgium', 'Europe', 'SCHENGEN_90_180', 'Brussels', 1],
  ['LU', 'Luxembourg', 'Europe', 'SCHENGEN_90_180', 'Luxembourg', 1],
  ['CH', 'Switzerland', 'Europe', 'SCHENGEN_90_180', 'Bern', 1],
  ['AT', 'Austria', 'Europe', 'SCHENGEN_90_180', 'Vienna', 1],
  ['GR', 'Greece', 'Europe', 'SCHENGEN_90_180', 'Athens', 1],
  ['SE', 'Sweden', 'Europe', 'SCHENGEN_90_180', 'Stockholm', 1],
  ['NO', 'Norway', 'Europe', 'SCHENGEN_90_180', 'Oslo', 1],
  ['DK', 'Denmark', 'Europe', 'SCHENGEN_90_180', 'Copenhagen', 1],
  ['FI', 'Finland', 'Europe', 'SCHENGEN_90_180', 'Helsinki', 1],
  ['IS', 'Iceland', 'Europe', 'SCHENGEN_90_180', 'Reykjavík', 1],
  ['PL', 'Poland', 'Europe', 'SCHENGEN_90_180', 'Warsaw', 1],
  ['CZ', 'Czechia', 'Europe', 'SCHENGEN_90_180', 'Prague', 1],
  ['HU', 'Hungary', 'Europe', 'SCHENGEN_90_180', 'Budapest', 1],
  ['SK', 'Slovakia', 'Europe', 'SCHENGEN_90_180', 'Bratislava', 1],
  ['SI', 'Slovenia', 'Europe', 'SCHENGEN_90_180', 'Ljubljana', 1],
  ['HR', 'Croatia', 'Europe', 'SCHENGEN_90_180', 'Zagreb', 1],
  ['EE', 'Estonia', 'Europe', 'SCHENGEN_90_180', 'Tallinn', 1],
  ['LV', 'Latvia', 'Europe', 'SCHENGEN_90_180', 'Riga', 1],
  ['LT', 'Lithuania', 'Europe', 'SCHENGEN_90_180', 'Vilnius', 1],
  ['MT', 'Malta', 'Europe', 'SCHENGEN_90_180', 'Valletta', 1],
  ['LI', 'Liechtenstein', 'Europe', 'SCHENGEN_90_180', 'Vaduz', 1],
  ['RO', 'Romania', 'Europe', 'SCHENGEN_90_180', 'Bucharest', 1],
  ['BG', 'Bulgaria', 'Europe', 'SCHENGEN_90_180', 'Sofia', 1],
  ['CY', 'Cyprus', 'Europe', 'NONE', 'Nicosia', 1],
  ['MC', 'Monaco', 'Europe', 'SCHENGEN_90_180', 'Monaco', 1],
  ['SM', 'San Marino', 'Europe', 'SCHENGEN_90_180', 'San Marino', 1],
  ['VA', 'Vatican City', 'Europe', 'SCHENGEN_90_180', 'Vatican City', 1],
  ['AD', 'Andorra', 'Europe', 'NONE', 'Andorra la Vella', 1],
  ['FO', 'Faroe Islands', 'Europe', 'NONE', 'Tórshavn', 1],
  ['AL', 'Albania', 'Europe', 'NONE', 'Tirana', 2],
  ['ME', 'Montenegro', 'Europe', 'NONE', 'Podgorica', 2],
  ['MK', 'North Macedonia', 'Europe', 'NONE', 'Skopje', 2],
  ['BA', 'Bosnia & Herzegovina', 'Europe', 'NONE', 'Sarajevo', 2],
  ['RS', 'Serbia', 'Europe', 'NONE', 'Belgrade', 2],
  ['XK', 'Kosovo', 'Europe', 'NONE', 'Pristina', 3],
  ['MD', 'Moldova', 'Europe', 'NONE', 'Chișinău', 2],
  ['UA', 'Ukraine', 'Europe', 'NONE', 'Kyiv', 2],
  ['GE', 'Georgia', 'Europe', 'NONE', 'Tbilisi', 2],
  ['TR', 'Türkiye', 'Europe', 'NONE', 'Ankara', 2],
  ['AM', 'Armenia', 'Europe', 'NONE', 'Yerevan', 3],
  ['AZ', 'Azerbaijan', 'Europe', 'NONE', 'Baku', 3],
  ['BY', 'Belarus', 'Europe', 'NONE', 'Minsk', 3],
  ['RU', 'Russia', 'Europe', 'NONE', 'Moscow', 3],

  // ASIA (39)
  ['JP', 'Japan', 'Asia', 'NONE', 'Tokyo', 1],
  ['SG', 'Singapore', 'Asia', 'NONE', 'Singapore', 1],
  ['KR', 'South Korea', 'Asia', 'NONE', 'Seoul', 1],
  ['MY', 'Malaysia', 'Asia', 'NONE', 'Kuala Lumpur', 1],
  ['BN', 'Brunei', 'Asia', 'NONE', 'Bandar Seri Begawan', 1],
  ['HK', 'Hong Kong SAR', 'Asia', 'NONE', 'Hong Kong', 1],
  ['MO', 'Macau SAR', 'Asia', 'NONE', 'Macau', 2],
  ['TW', 'Taiwan', 'Asia', 'NONE', 'Taipei', 2],
  ['TH', 'Thailand', 'Asia', 'NONE', 'Bangkok', 2],
  ['PH', 'Philippines', 'Asia', 'NONE', 'Manila', 3],
  ['ID', 'Indonesia', 'Asia', 'NONE', 'Jakarta', 3],
  ['VN', 'Vietnam', 'Asia', 'NONE', 'Hanoi', 3],
  ['CN', 'China', 'Asia', 'NONE', 'Beijing', 3],
  ['IN', 'India', 'Asia', 'NONE', 'New Delhi', 3],
  ['NP', 'Nepal', 'Asia', 'NONE', 'Kathmandu', 4],
  ['LK', 'Sri Lanka', 'Asia', 'NONE', 'Colombo', 4],
  ['MV', 'Maldives', 'Asia', 'NONE', 'Malé', 2],
  ['BT', 'Bhutan', 'Asia', 'NONE', 'Thimphu', 4],
  ['BD', 'Bangladesh', 'Asia', 'NONE', 'Dhaka', 4],
  ['PK', 'Pakistan', 'Asia', 'NONE', 'Islamabad', 4],
  ['AF', 'Afghanistan', 'Asia', 'NONE', 'Kabul', 4],
  ['KH', 'Cambodia', 'Asia', 'NONE', 'Phnom Penh', 4],
  ['LA', 'Laos', 'Asia', 'NONE', 'Vientiane', 4],
  ['MM', 'Myanmar', 'Asia', 'NONE', 'Naypyidaw', 4],
  ['TL', 'Timor-Leste', 'Asia', 'NONE', 'Dili', 3],
  ['MN', 'Mongolia', 'Asia', 'NONE', 'Ulaanbaatar', 3],
  ['KZ', 'Kazakhstan', 'Asia', 'NONE', 'Astana', 2],
  ['UZ', 'Uzbekistan', 'Asia', 'NONE', 'Tashkent', 3],
  ['KG', 'Kyrgyzstan', 'Asia', 'NONE', 'Bishkek', 3],
  ['TJ', 'Tajikistan', 'Asia', 'NONE', 'Dushanbe', 3],
  ['TM', 'Turkmenistan', 'Asia', 'NONE', 'Ashgabat', 4],
  ['KP', 'North Korea', 'Asia', 'NONE', 'Pyongyang', 4],

  // MIDDLE EAST (15)
  ['AE', 'United Arab Emirates', 'Middle East', 'NONE', 'Abu Dhabi / Dubai', 1],
  ['QA', 'Qatar', 'Middle East', 'NONE', 'Doha', 2],
  ['SA', 'Saudi Arabia', 'Middle East', 'NONE', 'Riyadh', 3],
  ['OM', 'Oman', 'Middle East', 'NONE', 'Muscat', 3],
  ['KW', 'Kuwait', 'Middle East', 'NONE', 'Kuwait City', 3],
  ['BH', 'Bahrain', 'Middle East', 'NONE', 'Manama', 3],
  ['IL', 'Israel', 'Middle East', 'NONE', 'Jerusalem', 2],
  ['PS', 'Palestine', 'Middle East', 'NONE', 'Ramallah', 4],
  ['JO', 'Jordan', 'Middle East', 'NONE', 'Amman', 3],
  ['LB', 'Lebanon', 'Middle East', 'NONE', 'Beirut', 4],
  ['IQ', 'Iraq', 'Middle East', 'NONE', 'Baghdad', 4],
  ['IR', 'Iran', 'Middle East', 'NONE', 'Tehran', 4],
  ['SY', 'Syria', 'Middle East', 'NONE', 'Damascus', 4],
  ['YE', 'Yemen', 'Middle East', 'NONE', "Sana'a", 4],

  // AFRICA (42)
  ['ZA', 'South Africa', 'Africa', 'NONE', 'Pretoria / Cape Town', 2],
  ['MU', 'Mauritius', 'Africa', 'NONE', 'Port Louis', 2],
  ['SC', 'Seychelles', 'Africa', 'NONE', 'Victoria', 2],
  ['MA', 'Morocco', 'Africa', 'NONE', 'Rabat', 3],
  ['TN', 'Tunisia', 'Africa', 'NONE', 'Tunis', 3],
  ['EG', 'Egypt', 'Africa', 'NONE', 'Cairo', 3],
  ['KE', 'Kenya', 'Africa', 'NONE', 'Nairobi', 3],
  ['TZ', 'Tanzania', 'Africa', 'NONE', 'Dodoma', 3],
  ['RW', 'Rwanda', 'Africa', 'NONE', 'Kigali', 3],
  ['UG', 'Uganda', 'Africa', 'NONE', 'Kampala', 3],
  ['ET', 'Ethiopia', 'Africa', 'NONE', 'Addis Ababa', 4],
  ['NG', 'Nigeria', 'Africa', 'NONE', 'Abuja / Lagos', 4],
  ['GH', 'Ghana', 'Africa', 'NONE', 'Accra', 3],
  ['SN', 'Senegal', 'Africa', 'NONE', 'Dakar', 3],
  ['CI', 'Côte d’Ivoire', 'Africa', 'NONE', 'Yamoussoukro', 4],
  ['CV', 'Cabo Verde', 'Africa', 'NONE', 'Praia', 3],
  ['GM', 'Gambia', 'Africa', 'NONE', 'Banjul', 3],
  ['NA', 'Namibia', 'Africa', 'NONE', 'Windhoek', 3],
  ['BW', 'Botswana', 'Africa', 'NONE', 'Gaborone', 2],
  ['ZW', 'Zimbabwe', 'Africa', 'NONE', 'Harare', 3],
  ['ZM', 'Zambia', 'Africa', 'NONE', 'Lusaka', 3],
  ['MZ', 'Mozambique', 'Africa', 'NONE', 'Maputo', 4],
  ['MG', 'Madagascar', 'Africa', 'NONE', 'Antananarivo', 4],
  ['DZ', 'Algeria', 'Africa', 'NONE', 'Algiers', 4],
  ['LY', 'Libya', 'Africa', 'NONE', 'Tripoli', 4],
  ['SD', 'Sudan', 'Africa', 'NONE', 'Khartoum', 4],
  ['SS', 'South Sudan', 'Africa', 'NONE', 'Juba', 4],
  ['AO', 'Angola', 'Africa', 'NONE', 'Luanda', 4],
  ['CM', 'Cameroon', 'Africa', 'NONE', 'Yaoundé', 4],
  ['CD', 'DR Congo', 'Africa', 'NONE', 'Kinshasa', 4],
  ['CG', 'Republic of the Congo', 'Africa', 'NONE', 'Brazzaville', 4],
  ['GA', 'Gabon', 'Africa', 'NONE', 'Libreville', 4],
  ['GQ', 'Equatorial Guinea', 'Africa', 'NONE', 'Malabo', 4],
  ['BJ', 'Benin', 'Africa', 'NONE', 'Porto-Novo', 3],
  ['TG', 'Togo', 'Africa', 'NONE', 'Lomé', 4],
  ['BF', 'Burkina Faso', 'Africa', 'NONE', 'Ouagadougou', 4],
  ['ML', 'Mali', 'Africa', 'NONE', 'Bamako', 4],
  ['NE', 'Niger', 'Africa', 'NONE', 'Niamey', 4],
  ['TD', 'Chad', 'Africa', 'NONE', "N'Djamena", 4],
  ['SO', 'Somalia', 'Africa', 'NONE', 'Mogadishu', 4],
  ['DJ', 'Djibouti', 'Africa', 'NONE', 'Djibouti', 4],
  ['ER', 'Eritrea', 'Africa', 'NONE', 'Asmara', 4],
  ['MW', 'Malawi', 'Africa', 'NONE', 'Lilongwe', 3],
  ['LS', 'Lesotho', 'Africa', 'NONE', 'Maseru', 3],
  ['SZ', 'Eswatini', 'Africa', 'NONE', 'Mbabane', 3],
  ['SL', 'Sierra Leone', 'Africa', 'NONE', 'Freetown', 4],
  ['LR', 'Liberia', 'Africa', 'NONE', 'Monrovia', 4],
  ['GN', 'Guinea', 'Africa', 'NONE', 'Conakry', 4],
  ['GW', 'Guinea-Bissau', 'Africa', 'NONE', 'Bissau', 4],
  ['MR', 'Mauritania', 'Africa', 'NONE', 'Nouakchott', 4],
  ['ST', 'São Tomé & Príncipe', 'Africa', 'NONE', 'São Tomé', 3],
  ['KM', 'Comoros', 'Africa', 'NONE', 'Moroni', 4],
  ['BI', 'Burundi', 'Africa', 'NONE', 'Gitega', 4],
  ['CF', 'Central African Republic', 'Africa', 'NONE', 'Bangui', 4],

  // OCEANIA (17)
  ['AU', 'Australia', 'Oceania', 'NONE', 'Canberra', 1],
  ['NZ', 'New Zealand', 'Oceania', 'NONE', 'Wellington', 1],
  ['FJ', 'Fiji', 'Oceania', 'NONE', 'Suva', 2],
  ['PG', 'Papua New Guinea', 'Oceania', 'NONE', 'Port Moresby', 3],
  ['WS', 'Samoa', 'Oceania', 'NONE', 'Apia', 2],
  ['TO', 'Tonga', 'Oceania', 'NONE', "Nuku'alofa", 2],
  ['VU', 'Vanuatu', 'Oceania', 'NONE', 'Port Vila', 2],
  ['SB', 'Solomon Islands', 'Oceania', 'NONE', 'Honiara', 2],
  ['KI', 'Kiribati', 'Oceania', 'NONE', 'Tarawa', 2],
  ['TV', 'Tuvalu', 'Oceania', 'NONE', 'Funafuti', 2],
  ['NR', 'Nauru', 'Oceania', 'NONE', 'Yaren', 3],
  ['PW', 'Palau', 'Oceania', 'NONE', 'Ngerulmud', 2],
  ['FM', 'Micronesia', 'Oceania', 'NONE', 'Palikir', 2],
  ['MH', 'Marshall Islands', 'Oceania', 'NONE', 'Majuro', 2],
  // US Pacific Territories
  ['GU', 'Guam (US)', 'Oceania', 'NONE', 'Hagåtña', 1],
  ['MP', 'Northern Mariana Islands (US)', 'Oceania', 'NONE', 'Saipan', 1],
  ['AS', 'American Samoa (US)', 'Oceania', 'NONE', 'Pago Pago', 1],
];

const JURISDICTIONS = RAW_JURISDICTIONS.map(([id, name, region, sharedZone, capital, passportTier]) => ({
  id,
  name,
  region,
  sharedZone,
  capital,
  passportTier, // 1 = top mobility (US/EU/JP), 2 = high-mid (BR/MX/AR), 3 = developing (CN/IN/PH), 4 = restricted (NP/NG/PK)
}));

const JURISDICTION_MAP = Object.fromEntries(JURISDICTIONS.map((j) => [j.id, j]));

const BOOSTER_RULES = [
  {
    id: 'BOOST_MX_MULTI_OR_RESIDENCE',
    destinationId: 'MX',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_student_work', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'jp_sticker_visa', 'jp_residence_card',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 180,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Physical sticker visa or residence card required (electronic visas, eTAs, or ESTAs are not accepted).',
      'Must be a valid, multiple-entry visa or permanent residence card from the US, Canada, UK, Japan, or Schengen Area.',
      'Document must remain valid for the entire intended stay in Mexico.',
      'US C-1/C-2/C-3 transit visas are explicitly excluded.',
    ],
    sourceUrl: 'https://www.inm.gob.mx/gobmx/word/index.php/paises-requieren-visa-2/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_PA_USED_VISA',
    destinationId: 'PA',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
      'schengen_c_multi', 'schengen_eu_residence',
      'jp_sticker_visa', 'jp_residence_card',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: true,
    minRemainingValidityDays: 180,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'MUST have been used at least once previously to enter the issuing country.',
      'Must be a multiple-entry visa (or residence card) with at least 6 months (180 days) remaining validity on arrival (Executive Decree No. 521).',
      'Proof of $500 USD financial solvency and confirmed onward ticket required.',
    ],
    sourceUrl: 'https://www.migracion.gob.pa/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_CR_US_CA_SCHENGEN',
    destinationId: 'CR',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_eu_residence', 'uk_ilr_residence_evisa',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Multiple-entry US or Canada visa (B1/B2, F, H, J, L, etc.) or legal residence permit from the US, Canada, UK, or EU/Schengen.',
      'US C-1/C-2/C-3 transit visas are NOT accepted.',
      'Passport and visa must cover the duration of stay (some nationalities require 90+ days remaining passport validity).',
    ],
    sourceUrl: 'https://migracion.go.cr/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_CO_US_SCHENGEN',
    destinationId: 'CO',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: ['IN', 'CN', 'TH', 'VN', 'NP', 'MM', 'LK', 'KH', 'NI', 'TW'],
    excludedNationalities: ['CU', 'HT', 'NG', 'PK'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 90,
    stillRequires: 'online_pre_registration',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Applies to designated nationalities (including India, China, Nepal, Thailand, Vietnam, Taiwan) holding a valid US visa (except C-1 transit), US Green Card, or Schengen C/D visa or residence.',
      'The US or Schengen visa/residence MUST have at least 180 days (6 months) remaining validity on the day of entry into Colombia.',
      'Travelers must complete Check-Mig online pre-registration prior to flight.',
    ],
    sourceUrl: 'https://www.cancilleria.gov.co/tramites_servicios/visas',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_PE_CN_IN',
    destinationId: 'PE',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: ['CN', 'IN'],
    excludedNationalities: ['NP', 'NG'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 180,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Specifically enacted for Chinese (PRC) and Indian passport holders.',
      'Requires a valid visa or permanent residence from the US, Canada, UK, Australia, or Schengen Area with at least 6 months (180 days) remaining validity at entry.',
    ],
    sourceUrl: 'https://www.gob.pe/rree',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_BZ_BELIZE',
    destinationId: 'BZ',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 90,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Holders of a valid US Green Card, Canadian PR Card, or multiple-entry US, Canadian, or Schengen visa may enter Belize visa-free for up to 30 days.',
    ],
    sourceUrl: 'https://immigration.gov.bz/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_GT_CA4',
    destinationId: 'GT',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: ['CN', 'IN', 'NP', 'NG', 'AF', 'PK', 'BD', 'LK'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'CA-4 Shared 90-Day Zone: Total stay is shared across Guatemala, El Salvador, Honduras, and Nicaragua.',
      'Category C Exclusions: Several nationalities (including Nepal, China, India, Nigeria, Pakistan) are classified as Category C consultive visas in Guatemala and are excluded from automatic visa-free entry.',
    ],
    sourceUrl: 'https://igm.gob.gt/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_SV_CA4',
    destinationId: 'SV',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: ['CN', 'NP', 'NG', 'AF', 'PK', 'BD'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 90,
    stillRequires: 'tourist_card',
    resultStatus: 'visa_free',
    feeUsdApprox: 12,
    conditions: [
      'CA-4 Shared 90-Day Zone (shared with Guatemala, Honduras, and Nicaragua).',
      'Indian passport holders with a valid US, Canadian, or Schengen visa are exempt from an El Salvador embassy visa ($12 tourist card/airport fee applies for some nationalities).',
    ],
    sourceUrl: 'https://www.migracion.gob.sv/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_HN_CA4',
    destinationId: 'HN',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: ['CN', 'NP', 'NG', 'AF', 'PK', 'BD'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'CA-4 Shared 90-Day Zone: Requires valid US, Canadian, or Schengen visa with at least 6 months remaining validity.',
      'Category C consultive nationalities (e.g. Nepal, China, Nigeria) remain excluded.',
    ],
    sourceUrl: 'https://inm.gob.hn/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_NI_CA4',
    destinationId: 'NI',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: ['CN', 'IN', 'NP', 'NG', 'AF', 'PK', 'BD', 'CU', 'HT'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 90,
    stillRequires: 'tourist_card',
    resultStatus: 'visa_free',
    feeUsdApprox: 10,
    conditions: [
      'CA-4 Shared 90-Day Zone ($10 USD Tourist Card collected on arrival).',
      'Category C nationalities (including China, India, Nepal, Nigeria) require prior ministerial consultation and are not exempt.',
    ],
    sourceUrl: 'https://www.migob.gob.ni/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_DO_DOMINICAN_REPUBLIC',
    destinationId: 'DO',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: ['HT'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 30,
    stillRequires: 'tourist_card',
    resultStatus: 'visa_free',
    feeUsdApprox: 10,
    conditions: [
      'Any traveler who can legally enter the US, Canada, UK, or European Union/Schengen may enter the Dominican Republic for tourism with a Tourist Card (included in most airfares).',
      'Mandatory digital e-Ticket form must be completed before boarding.',
    ],
    sourceUrl: 'https://mirex.gob.do/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_BS_BAHAMAS',
    destinationId: 'BS',
    boosterIssuer: 'US',
    acceptedDocKinds: ['us_green_card', 'ca_pr_card', 'us_b1_b2', 'uk_standard_visitor', 'schengen_c_multi'],
    eligiblePassportNationalities: ['IN', 'CN'],
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 90,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'US Green Card and Canadian PR Card holders of most nationalities (and Indian nationals holding valid US, UK, Canadian, or Schengen visas) enjoy visa-free entry to The Bahamas.',
    ],
    sourceUrl: 'https://www.immigration.gov.bs/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_BM_BERMUDA',
    destinationId: 'BM',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_student_work', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 45,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Bermuda requires no visa for travelers holding a valid multiple-entry visa or residence permit for the US, Canada, or the UK.',
      'Both passport and the US/UK/CA visa/residence must be valid for at least 45 days beyond the end of the stay in Bermuda.',
    ],
    sourceUrl: 'https://www.gov.bm/department/immigration',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_TC_TURKS_CAICOS',
    destinationId: 'TC',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 90,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Holders of a valid US, UK, or Canadian tourist/business visa or residence permit may enter Turks and Caicos visa-free for up to 90 days.',
    ],
    sourceUrl: 'https://www.gov.tc/bordercontrol/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_VG_BVI',
    destinationId: 'VG',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Holders of a valid US, UK, or Canadian visa or permanent residence card with at least 6 months remaining validity are exempt from a BVI visa.',
    ],
    sourceUrl: 'https://bvi.gov.vg/departments/immigration-department',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_KY_CAYMAN',
    destinationId: 'KY',
    boosterIssuer: 'US',
    acceptedDocKinds: ['us_green_card', 'ca_pr_card', 'uk_ilr_residence_evisa', 'us_b1_b2', 'uk_standard_visitor', 'ca_trv_visitor_study_work'],
    eligiblePassportNationalities: ['IN', 'CN', 'JM'],
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 30,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'US Green Card, Canadian PR, or UK ILR holders (plus Indian, Chinese, and Jamaican nationals holding valid US/UK/CA visas arriving directly from that country) are exempt from a Cayman Islands visa.',
    ],
    sourceUrl: 'https://www.worc.ky/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_CW_CURACAO',
    destinationId: 'CW',
    boosterIssuer: 'SCHENGEN',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'uk_ilr_residence_evisa', 'ie_residence_permit',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'online_pre_registration',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Dutch Caribbean (Curaçao, Aruba, Sint Maarten): Exempt from a Caribbean visa if holding a multiple-entry Schengen C/D visa, multiple-entry US/Canadian visa, or residence permit from US, CA, UK, IE, or Schengen.',
      'Digital Embarkation Card required before boarding.',
    ],
    sourceUrl: 'https://www.netherlandsworldwide.nl/caribbean-visa',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_AW_ARUBA',
    destinationId: 'AW',
    boosterIssuer: 'SCHENGEN',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'uk_ilr_residence_evisa', 'ie_residence_permit',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'online_pre_registration',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Aruba grants visa-free entry with a multiple-entry US, Canadian, or Schengen visa, or a residence card from the US, Canada, UK, Ireland, or EU/Schengen.',
      'Online ED-Card required prior to arrival.',
    ],
    sourceUrl: 'https://www.netherlandsworldwide.nl/caribbean-visa',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_SX_SINT_MAARTEN',
    destinationId: 'SX',
    boosterIssuer: 'SCHENGEN',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'uk_ilr_residence_evisa', 'ie_residence_permit',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'online_pre_registration',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Sint Maarten grants visa-free entry with a multiple-entry Schengen, US, or Canadian visa, or residence permit from US/CA/UK/IE/Schengen.',
    ],
    sourceUrl: 'https://www.netherlandsworldwide.nl/caribbean-visa',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_AL_ALBANIA_USED',
    destinationId: 'AL',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_student_work', 'uk_ilr_residence_evisa',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: true,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Requires a valid, multiple-entry US, UK, or Schengen visa that HAS BEEN PREVIOUSLY USED at least once to enter the issuing country/zone, OR a valid US/UK/Schengen residence permit.',
      'Allows up to 90 days stay within a 180-day period.',
    ],
    sourceUrl: 'https://punetejashtme.gov.al/en/regjimi-i-vizave-per-te-huajt/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_ME_MONTENEGRO',
    destinationId: 'ME',
    boosterIssuer: 'SCHENGEN',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'ie_short_stay_visa', 'ie_residence_permit',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Holders of a valid visa or residence permit issued by a Schengen member state, the US, the UK, or Ireland may stay in Montenegro up to 30 days (or until the visa expires, if shorter).',
    ],
    sourceUrl: 'https://www.gov.me/en/mfa',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_MK_NORTH_MACEDONIA',
    destinationId: 'MK',
    boosterIssuer: 'SCHENGEN',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 5,
    maxStayDays: 15,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Up to 15 days per entry (max 90 days in 180 days) with a valid multiple-entry US, UK, Canadian, or Schengen C/D visa.',
      'The visa must remain valid for at least 5 days beyond the intended stay in North Macedonia.',
    ],
    sourceUrl: 'https://www.mfa.gov.mk/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_BA_BOSNIA',
    destinationId: 'BA',
    boosterIssuer: 'SCHENGEN',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: ['XK'],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Visa-free up to 30 days for holders of a valid multiple-entry Schengen or US visa or EU/Schengen/US residence permit.',
    ],
    sourceUrl: 'https://www.mvp.gov.ba/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_RS_SERBIA',
    destinationId: 'RS',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Foreign nationals holding a valid Schengen, UK, or US visa or residence permit may enter Serbia visa-free for up to 90 days within a 180-day period (provided the visa stays valid).',
    ],
    sourceUrl: 'https://www.mfa.gov.rs/en/citizens/travel-serbia/visa-regime',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_GE_GEORGIA',
    destinationId: 'GE',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_student_work', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'jp_sticker_visa', 'jp_residence_card',
      'ie_short_stay_visa', 'ie_residence_permit',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Holders of valid visas or residence permits from 50+ listed countries (including US, UK, Schengen/EU, Canada, Australia, Japan, Ireland, GCC) may enter Georgia visa-free for 90 days in any 180-day period.',
      'Visa or residence permit must be valid on the day of entry into Georgia.',
    ],
    sourceUrl: 'https://www.geoconsul.gov.ge/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_TR_EVISA_US_UK_SCHENGEN_IE',
    destinationId: 'TR',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_student_work', 'uk_ilr_residence_evisa',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
      'ie_short_stay_visa', 'ie_residence_permit',
    ],
    eligiblePassportNationalities: ['IN', 'NP', 'PH', 'PK', 'BD', 'VN', 'EG', 'ZA'],
    excludedNationalities: ['NG'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'evisa_simplified',
    feeUsdApprox: 45,
    conditions: [
      'Conditional Single-Entry e-Visa (30 days): Unlocked ONLY by a valid physical sticker visa or residence permit from the US, UK, Schengen Area, or Ireland.',
      'CRITICAL: Canadian, Australian, and Japanese visas are NOT accepted for Turkish conditional e-Visas. Electronic visas of the issuer are also not accepted.',
    ],
    sourceUrl: 'https://www.evisa.gov.tr/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_KR_TRANSIT_TOURISM',
    destinationId: 'KR',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
    ],
    eligiblePassportNationalities: ['IN', 'CN', 'PH', 'VN', 'ID'],
    excludedNationalities: ['NP', 'NG', 'SY', 'AF'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 30,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Tourists in Transit (B-2-2): Eligible nationalities holding a physical visa/residence for the US, Canada, Australia, or New Zealand AND a confirmed onward flight within 30 days transiting through South Korea to/from the visa-issuing country can enter up to 30 days visa-free.',
    ],
    sourceUrl: 'https://www.visa.go.kr/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_TW_TAC_ONLINE',
    destinationId: 'TW',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
      'schengen_c_multi', 'schengen_eu_residence',
      'jp_sticker_visa', 'jp_residence_card',
    ],
    eligiblePassportNationalities: ['IN', 'VN', 'ID', 'MM', 'KH', 'LA'],
    excludedNationalities: ['CN', 'NP', 'NG', 'PK'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 14,
    stillRequires: 'online_pre_registration',
    resultStatus: 'evisa_simplified',
    feeUsdApprox: 0,
    conditions: [
      'ROC Travel Authorization Certificate (TAC): Citizens of India, Vietnam, Indonesia, Myanmar, Cambodia, and Laos holding a valid visa or residence card from the US, Canada, UK, Japan, Australia, New Zealand, Korea, or Schengen can obtain an instant free 14-day TAC online.',
    ],
    sourceUrl: 'https://niaspeedy.immigration.gov.tw/nia_southeast/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_PH_AJACSSUK',
    destinationId: 'PH',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
      'schengen_c_multi', 'schengen_eu_residence',
      'jp_sticker_visa', 'jp_residence_card',
    ],
    eligiblePassportNationalities: ['IN', 'CN'],
    excludedNationalities: ['NP', 'NG'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 14,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'AJACSSUK Visa-Free Privilege: Indian nationals (14 days, extendable to 21) and Chinese nationals (7 days) holding a valid current American, Japanese, Australian, Canadian, Schengen, Singapore, or UK visa or permanent residence may enter the Philippines visa-free.',
    ],
    sourceUrl: 'https://dfa.gov.ph/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_SG_VFTF_96H',
    destinationId: 'SG',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_ilr_residence_evisa',
      'ca_trv_visitor_study_work', 'ca_pr_card',
      'au_visitor_visa', 'au_permanent_resident',
      'schengen_c_multi', 'schengen_eu_residence',
      'jp_sticker_visa', 'jp_residence_card',
    ],
    eligiblePassportNationalities: ['IN', 'CN'],
    excludedNationalities: ['NP', 'NG'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 30,
    maxStayDays: 4,
    stillRequires: 'online_pre_registration',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      '96-Hour Visa Free Transit Facility (VFTF) ONLY — Not General Point-to-Point Tourism.',
      'Available strictly to Indian and PRC nationals in transit to or from a third country with a confirmed onward air/ferry ticket departing within 96 hours (4 days).',
      'Visa/residence from US, UK, Canada, Australia, New Zealand, Japan, Germany, or Switzerland must be valid for at least 1 month.',
    ],
    sourceUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa-free-transit-facility',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_AE_UAE_VOA_INDIA',
    destinationId: 'AE',
    boosterIssuer: 'US',
    acceptedDocKinds: ['us_b1_b2', 'us_f_j_h_l_o', 'us_green_card', 'uk_ilr_residence_evisa', 'schengen_eu_residence'],
    eligiblePassportNationalities: ['IN'],
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 180,
    maxStayDays: 14,
    stillRequires: 'none',
    resultStatus: 'voa',
    feeUsdApprox: 63,
    conditions: [
      'Indian citizens holding a US Visitor Visa, US Green Card, UK Residence Permit, or EU Residence Permit valid for at least 6 months (180 days) can obtain a 14-day Visa on Arrival at UAE airports (extendable once).',
      'Note: For UK and EU, a Residence Permit is required (short-stay UK/Schengen visitor visas do not unlock UAE VoA).',
    ],
    sourceUrl: 'https://u.ae/en/information-and-services/visa-and-emirates-id',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_SA_SAUDI_USED_VISA',
    destinationId: 'SA',
    boosterIssuer: 'US',
    acceptedDocKinds: [
      'us_b1_b2', 'us_f_j_h_l_o', 'us_green_card',
      'uk_standard_visitor', 'uk_student_work', 'uk_ilr_residence_evisa',
      'schengen_c_multi', 'schengen_d_national', 'schengen_eu_residence',
    ],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: true,
    minRemainingValidityDays: 1,
    maxStayDays: 90,
    stillRequires: 'none',
    resultStatus: 'voa',
    feeUsdApprox: 130,
    conditions: [
      'Holders of a valid tourist or business visa from the US, UK, or a Schengen state that HAS BEEN USED at least once to enter the issuing country (or permanent residents of US/UK/EU) are eligible for a 90-day Saudi Visa on Arrival.',
    ],
    sourceUrl: 'https://visa.visitsaudi.com/',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_CA_ETA_WITH_US_VISA',
    destinationId: 'CA',
    boosterIssuer: 'US',
    acceptedDocKinds: ['us_b1_b2', 'us_f_j_h_l_o'],
    eligiblePassportNationalities: ['BR', 'PH', 'TH', 'AR', 'CR', 'MA', 'PA', 'UY', 'MX'],
    excludedNationalities: ['IN', 'NP', 'NG', 'CN'],
    visaMustBeMultipleEntry: false,
    visaMustHaveBeenUsedToEnterIssuer: false,
    minRemainingValidityDays: 1,
    maxStayDays: 180,
    stillRequires: 'eta',
    resultStatus: 'evisa_simplified',
    feeUsdApprox: 5,
    conditions: [
      'Canada eTA Expansion for Eligible Nationalities (including Brazil, Philippines, Mexico, Thailand): Travelers holding a valid US nonimmigrant visa can apply for a CAD $7 eTA when flying to Canada instead of a full Temporary Resident Visa (TRV).',
      'Entering Canada by land or sea still requires a visitor visa.',
    ],
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/eligibility/eta-x.html',
    lastVerifiedIsoDate: '2026-09-25',
  },
  {
    id: 'BOOST_CA_GREEN_CARD_EXEMPT',
    destinationId: 'CA',
    boosterIssuer: 'US',
    acceptedDocKinds: ['us_green_card'],
    eligiblePassportNationalities: 'all_visa_required_nationalities',
    excludedNationalities: [],
    visaMustBeMultipleEntry: true,
    visaMustHaveBeenUsedToEnterIssuer: true,
    minRemainingValidityDays: 1,
    maxStayDays: 180,
    stillRequires: 'none',
    resultStatus: 'visa_free',
    feeUsdApprox: 0,
    conditions: [
      'Lawful Permanent Residents of the United States (US Green Card holders) of ANY nationality are exempt from both a Canadian TRV and eTA when entering Canada by air, land, or sea.',
      'Must present a valid passport plus valid physical Green Card (Form I-551).',
    ],
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html',
    lastVerifiedIsoDate: '2026-09-25',
  },
];

const EXPLICIT_BASELINES = {
  // NEPAL (NP)
  NP_IN: { status: 'visa_free', stay: 365, fee: 0, program: '1950 Peace & Friendship Treaty', notes: 'Nepali citizens enjoy freedom of movement and unlimited stay in India with a valid passport or citizenship certificate.' },
  NP_SG: { status: 'visa_free', stay: 30, fee: 0, program: 'ASEAN/SAARC Exemption', notes: 'Nepali passport holders receive 30 days visa-free entry into Singapore (SG Arrival Card required).' },
  NP_MY: { status: 'visa_free', stay: 30, fee: 0, program: 'MDAC Exemption', notes: '30 days visa-free entry with Malaysia Digital Arrival Card.' },
  NP_PH: { status: 'visa_free', stay: 30, fee: 0, program: 'Executive Order 408', notes: '30 days visa-free entry for Nepali citizens with onward ticket.' },
  NP_MV: { status: 'visa_on_arrival', stay: 30, fee: 0, program: 'Free Tourist VoA', notes: 'Free 30-day Visa on Arrival with IMUGA Traveller Declaration.' },
  NP_LK: { status: 'visa_on_arrival', stay: 30, fee: 0, program: 'SAARC VoA / ETA', notes: '30-day entry for SAARC nationals.' },
  NP_KH: { status: 'visa_on_arrival', stay: 30, fee: 30, program: 'Cambodia VoA / eVisa', notes: '30-day Visa on Arrival or eVisa available.' },
  NP_KE: { status: 'eta', stay: 90, fee: 32, program: 'Kenya eTA', notes: 'Electronic Travel Authorisation required before boarding.' },
  NP_TH: { status: 'evisa', stay: 60, fee: 40, program: 'Thai e-Visa', notes: 'Nepali passport holders require a Thai e-Visa prior to travel.' },

  // INDIA (IN)
  IN_NP: { status: 'visa_free', stay: 365, fee: 0, program: 'Freedom of Movement', notes: 'Indian citizens enjoy unrestricted entry into Nepal with a valid passport or Voter ID.' },
  IN_BT: { status: 'visa_free', stay: 14, fee: 15, program: 'Entry Permit (SDF)', notes: 'Visa-free entry permit; Sustainable Development Fee of INR 1,200/night applies.' },
  IN_TH: { status: 'visa_free', stay: 60, fee: 0, program: 'Tourism Exemption', notes: '60 days visa-free entry for Indian tourists.' },
  IN_MY: { status: 'visa_free', stay: 30, fee: 0, program: 'Visa Waiver + MDAC', notes: 'Visa-free entry up to 30 days for Indian citizens.' },
  IN_MU: { status: 'visa_free', stay: 90, fee: 0, program: 'Visa Exemption', notes: '90 days visa-free for Indian tourists.' },
  IN_SC: { status: 'visa_free', stay: 90, fee: 12, program: 'Visitor Permit + TA', notes: 'Visa-free Visitor Permit upon completing Seychelles Electronic Border System.' },
  IN_KZ: { status: 'visa_free', stay: 14, fee: 0, program: '14-Day Visa Free', notes: 'Up to 14 days visa-free per entry (max 42 days in 180 days).' },
  IN_MV: { status: 'visa_on_arrival', stay: 90, fee: 0, program: 'Free Tourist VoA', notes: 'Free Visa on Arrival up to 90 days.' },
  IN_ID: { status: 'visa_on_arrival', stay: 30, fee: 35, program: 'e-VoA / VoA', notes: '30-day Visa on Arrival (IDR 500,000), extendable once.' },
  IN_QA: { status: 'visa_on_arrival', stay: 30, fee: 0, program: 'Discover Qatar VoA', notes: 'Free 30-day Visa on Arrival with confirmed Discover Qatar hotel booking.' },
  IN_JO: { status: 'visa_on_arrival', stay: 30, fee: 56, program: 'Jordan VoA', notes: 'Visa on Arrival (40 JOD, waived with Jordan Pass + 3-night stay).' },
  IN_VN: { status: 'evisa', stay: 90, fee: 25, program: 'Vietnam 90-Day e-Visa', notes: 'Single or multiple-entry 90-day e-Visa.' },
  IN_SG: { status: 'evisa', stay: 30, fee: 22, program: 'Singapore e-Visa (or 96h VFTF)', notes: 'Authorized agent e-Visa required for tourism, unless using 96-hour VFTF transit with US/UK/Schengen/CA/AU/JP visa.' },

  // PHILIPPINES (PH)
  PH_SG: { status: 'visa_free', stay: 30, fee: 0, program: 'ASEAN Visa Free', notes: '30 days visa-free within ASEAN.' },
  PH_MY: { status: 'visa_free', stay: 30, fee: 0, program: 'ASEAN Visa Free', notes: '30 days visa-free within ASEAN.' },
  PH_TH: { status: 'visa_free', stay: 60, fee: 0, program: 'ASEAN Visa Free', notes: '60 days visa-free within ASEAN.' },
  PH_VN: { status: 'visa_free', stay: 21, fee: 0, program: 'ASEAN Visa Free', notes: '21 days visa-free within ASEAN.' },
  PH_ID: { status: 'visa_free', stay: 30, fee: 0, program: 'ASEAN Visa Free', notes: '30 days visa-free within ASEAN.' },
  PH_HK: { status: 'visa_free', stay: 14, fee: 0, program: '14-Day Visa Free', notes: '14 days visa-free entry.' },
  PH_TW: { status: 'visa_free', stay: 14, fee: 0, program: 'Trial Visa Exemption', notes: '14 days visa-free entry for Filipino passport holders.' },
  PH_BR: { status: 'visa_free', stay: 90, fee: 0, program: 'Bilateral Waiver', notes: '90 days visa-free entry into Brazil.' },
  PH_CO: { status: 'visa_free', stay: 90, fee: 0, program: 'Bilateral Waiver', notes: '90 days visa-free entry into Colombia.' },
  PH_PE: { status: 'visa_free', stay: 90, fee: 0, program: 'Bilateral Waiver', notes: '90 days visa-free entry into Peru.' },
  PH_CR: { status: 'visa_free', stay: 30, fee: 0, program: 'Group 2 Exemption', notes: '30 days visa-free entry into Costa Rica.' },
  PH_IL: { status: 'visa_free', stay: 90, fee: 7, program: 'ETA-IL Required', notes: '90 days visa-free with Israel ETA-IL authorization.' },

  // CHINA (CN)
  CN_SG: { status: 'visa_free', stay: 30, fee: 0, program: 'Mutual 30-Day Waiver', notes: '30 days mutual visa-free agreement between China and Singapore.' },
  CN_MY: { status: 'visa_free', stay: 30, fee: 0, program: 'Mutual Waiver + MDAC', notes: '30 days visa-free entry.' },
  CN_TH: { status: 'visa_free', stay: 60, fee: 0, program: 'Permanent Mutual Waiver', notes: '60 days visa-free entry under permanent bilateral waiver.' },
  CN_AE: { status: 'visa_free', stay: 30, fee: 0, program: 'Mutual Visa Exemption', notes: '30 days free entry on arrival.' },
  CN_QA: { status: 'visa_free', stay: 30, fee: 0, program: 'Mutual Visa Exemption', notes: '30 days visa-free entry.' },
  CN_RS: { status: 'visa_free', stay: 30, fee: 0, program: 'Bilateral Waiver', notes: '30 days visa-free entry into Serbia.' },
  CN_BA: { status: 'visa_free', stay: 30, fee: 0, program: 'Bilateral Waiver', notes: '30 days visa-free entry into Bosnia & Herzegovina.' },
  CN_AL: { status: 'visa_free', stay: 90, fee: 0, program: 'Bilateral Waiver', notes: '90 days in 180 days visa-free entry into Albania.' },
  CN_GE: { status: 'visa_free', stay: 30, fee: 0, program: 'Visa Exemption', notes: '30 days visa-free entry into Georgia.' },
  CN_MA: { status: 'visa_free', stay: 90, fee: 0, program: 'Visa Exemption', notes: '90 days visa-free entry into Morocco.' },

  // BRAZIL (BR)
  BR_US: { status: 'visa_required', stay: 180, fee: 185, program: 'US B1/B2 Embassy Visa', notes: 'Requires a US B1/B2 sticker visa.' },
  BR_CA: { status: 'visa_required', stay: 180, fee: 100, program: 'Canada TRV (or eTA w/ US Visa)', notes: 'Requires a Canadian TRV unless holding a valid US nonimmigrant visa (which unlocks $7 eTA by air).' },
  BR_MX: { status: 'evisa', stay: 180, fee: 40, program: 'Mexico Visa (Exempt w/ US/UK/CA/Schengen/JP Visa)', notes: 'Brazilian nationals require a Mexican visa unless holding a valid multi-entry US, Canadian, UK, Japanese, or Schengen visa/residence.' },
  BR_JP: { status: 'visa_free', stay: 90, fee: 0, program: 'Reciprocal 90-Day Exemption', notes: '90 days visa-free for short-term tourism.' },
  BR_GB: { status: 'eta', stay: 180, fee: 13, program: 'UK ETA', notes: 'Up to 6 months with UK Electronic Travel Authorisation (£10).' },

  // NIGERIA (NG)
  NG_GH: { status: 'visa_free', stay: 90, fee: 0, program: 'ECOWAS Free Movement', notes: '90 days visa-free across ECOWAS member states.' },
  NG_SN: { status: 'visa_free', stay: 90, fee: 0, program: 'ECOWAS Free Movement', notes: '90 days visa-free across ECOWAS member states.' },
  NG_CI: { status: 'visa_free', stay: 90, fee: 0, program: 'ECOWAS Free Movement', notes: '90 days visa-free across ECOWAS member states.' },
  NG_GM: { status: 'visa_free', stay: 90, fee: 0, program: 'ECOWAS Free Movement', notes: '90 days visa-free across ECOWAS member states.' },
  NG_CV: { status: 'visa_free', stay: 90, fee: 34, program: 'ECOWAS + EASE Fee', notes: '90 days visa-free with Airport Security Tax.' },
  NG_BB: { status: 'visa_free', stay: 180, fee: 0, program: 'Commonwealth Exemption', notes: 'Up to 6 months visa-free entry.' },
  NG_RW: { status: 'visa_on_arrival', stay: 30, fee: 0, program: 'African Union Free VoA', notes: '30-day free Visa on Arrival for African Union citizens.' },
  NG_MU: { status: 'visa_on_arrival', stay: 14, fee: 0, program: 'Short-Stay VoA', notes: '14-day Visa on Arrival with return ticket and hotel voucher.' },
  NG_KE: { status: 'eta', stay: 90, fee: 32, program: 'Kenya eTA', notes: '90-day entry with approved Kenya eTA.' },
};

function getBaselineRule(passportId, destination) {
  const pId = passportId.toUpperCase();
  const dId = destination.id.toUpperCase();

  // Domestic / Right of Abode
  if (pId === dId || (pId === 'US' && ['PR', 'VI', 'GU', 'MP', 'AS'].includes(dId))) {
    return {
      passportId: pId,
      destinationId: dId,
      status: 'visa_free',
      programName: 'Right of Abode / Domestic',
      maxStayDays: 365,
      entries: 'multiple',
      feeUsdApprox: 0,
      requiredDocs: ['Valid national passport or government photo ID'],
      officialNotes: 'Citizens and nationals enjoy unrestricted right of entry and residence.',
      lastVerifiedIsoDate: '2026-09-25',
      sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }

  const explicitKey = `${pId}_${dId}`;
  if (EXPLICIT_BASELINES[explicitKey]) {
    const ex = EXPLICIT_BASELINES[explicitKey];
    return {
      passportId: pId,
      destinationId: dId,
      status: ex.status,
      programName: ex.program,
      maxStayDays: ex.stay,
      entries: ex.status === 'visa_free' || ex.status === 'eta' ? 'multiple' : 'single',
      feeUsdApprox: ex.fee,
      requiredDocs: [
        'Passport valid for at least 6 months beyond intended stay',
        'Confirmed return or onward ticket',
        'Proof of sufficient funds / accommodation',
      ],
      officialNotes: ex.notes,
      lastVerifiedIsoDate: '2026-09-25',
      sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }

  const pJur = JURISDICTION_MAP[pId] || { passportTier: 3, region: 'Asia' };
  const pTier = pJur.passportTier;

  // Universal open/VoA/eTA destinations
  if (dId === 'MV') {
    return {
      passportId: pId, destinationId: dId, status: 'visa_on_arrival',
      programName: 'Maldives Free VoA', maxStayDays: 30, entries: 'single', feeUsdApprox: 0,
      requiredDocs: ['Passport valid 1+ month', 'IMUGA Traveller Declaration', 'Confirmed resort/hotel booking'],
      officialNotes: 'Maldives grants a free 30-day Visa on Arrival to all nationalities.',
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.immigration.gov.mv/',
    };
  }
  if (dId === 'SC') {
    return {
      passportId: pId, destinationId: dId, status: 'visa_free',
      programName: 'Visitor Permit + Electronic TA', maxStayDays: 90, entries: 'single', feeUsdApprox: 12,
      requiredDocs: ['Seychelles Electronic Border System (SEBS) approval', 'Return ticket & accommodation voucher'],
      officialNotes: 'Seychelles is visa-free for all nationalities upon completing the online Travel Authorization.',
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://seychelles.govtas.com/',
    };
  }
  if (dId === 'KE') {
    return {
      passportId: pId, destinationId: dId, status: 'eta',
      programName: 'Kenya eTA', maxStayDays: 90, entries: 'single', feeUsdApprox: 32,
      requiredDocs: ['Kenya eTA confirmation', 'Passport valid 6+ months', 'Return flight'],
      officialNotes: 'Kenya replaced traditional visas with a universal Electronic Travel Authorisation (eTA).',
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.etakenya.go.ke/',
    };
  }
  if (dId === 'RW') {
    return {
      passportId: pId, destinationId: dId, status: 'visa_on_arrival',
      programName: 'Universal VoA', maxStayDays: 30, entries: 'single', feeUsdApprox: pJur.region === 'Africa' ? 0 : 50,
      requiredDocs: ['Passport valid 6+ months', 'Return ticket'],
      officialNotes: 'Rwanda offers 30-day Visa on Arrival to citizens of all countries (free for AU/Commonwealth/Francophonie).',
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.migration.gov.rw/',
    };
  }
  if (['DM', 'VC', 'HT', 'FM', 'KI'].includes(dId)) {
    return {
      passportId: pId, destinationId: dId, status: 'visa_free',
      programName: 'Universal Visa Exemption', maxStayDays: 30, entries: 'single', feeUsdApprox: 0,
      requiredDocs: ['Passport valid 6+ months', 'Return or onward ticket'],
      officialNotes: `${destination.name} grants visa-free entry to almost all travelers worldwide.`,
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }

  // Tier 1 Passports (US, UK, CA, JP, EU/Schengen, AU, NZ, SG, KR)
  if (pTier === 1) {
    if (['US', 'PR', 'VI', 'GU', 'MP'].includes(dId)) {
      return {
        passportId: pId, destinationId: dId,
        status: pId === 'CA' || pId === 'BM' ? 'visa_free' : 'eta',
        programName: pId === 'CA' ? 'Bilateral Exemption' : 'US VWP (ESTA)',
        maxStayDays: pId === 'CA' ? 180 : 90, entries: 'multiple', feeUsdApprox: pId === 'CA' ? 0 : 21,
        requiredDocs: ['Biometric e-Passport', 'Approved ESTA ($21 USD, valid 2 years)'],
        officialNotes: 'Passport-based US Visa Waiver Program (ESTA) eligibility.',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://esta.cbp.dhs.gov/',
      };
    }
    if (dId === 'CA') {
      return {
        passportId: pId, destinationId: dId,
        status: pId === 'US' ? 'visa_free' : 'eta',
        programName: pId === 'US' ? 'US Citizen Exemption' : 'Canada eTA',
        maxStayDays: 180, entries: 'multiple', feeUsdApprox: pId === 'US' ? 0 : 5,
        requiredDocs: ['Valid Passport', 'Canada eTA (CAD $7 when flying)'],
        officialNotes: 'Visa-exempt foreign nationals require a CAD $7 eTA when boarding a flight to Canada.',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.canada.ca/eta',
      };
    }
    if (dId === 'GB') {
      return {
        passportId: pId, destinationId: dId,
        status: pId === 'IE' ? 'visa_free' : 'eta',
        programName: pId === 'IE' ? 'Common Travel Area' : 'UK ETA',
        maxStayDays: 180, entries: 'multiple', feeUsdApprox: pId === 'IE' ? 0 : 13,
        requiredDocs: ['Valid Biometric Passport', 'UK Electronic Travel Authorisation (£10)'],
        officialNotes: 'Visa-exempt nationalities require a UK ETA prior to travel.',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta',
      };
    }
    if (dId === 'AU') {
      return {
        passportId: pId, destinationId: dId,
        status: pId === 'NZ' ? 'visa_free' : 'eta',
        programName: ['US', 'CA', 'JP', 'SG', 'KR'].includes(pId) ? 'Australia ETA (601)' : 'eVisitor (651)',
        maxStayDays: 90, entries: 'multiple', feeUsdApprox: ['US', 'CA', 'JP', 'SG', 'KR'].includes(pId) ? 14 : 0,
        requiredDocs: ['Valid Passport', 'Approved eVisitor (651) or ETA (601)'],
        officialNotes: 'Electronic authorization required prior to boarding for Australia.',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://immi.homeaffairs.gov.au/',
      };
    }
    if (dId === 'NZ') {
      return {
        passportId: pId, destinationId: dId,
        status: pId === 'AU' ? 'visa_free' : 'eta',
        programName: 'NZeTA + IVL', maxStayDays: 90, entries: 'multiple', feeUsdApprox: 75,
        requiredDocs: ['Valid Passport', 'NZeTA & International Visitor Conservation Levy'],
        officialNotes: 'Visa waiver nationality; NZeTA required before boarding.',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.immigration.govt.nz/',
      };
    }
    if (destination.sharedZone === 'SCHENGEN_90_180') {
      const isEuPassport = JURISDICTION_MAP[pId]?.sharedZone === 'SCHENGEN_90_180' || ['IE', 'CY'].includes(pId);
      return {
        passportId: pId, destinationId: dId, status: 'visa_free',
        programName: isEuPassport ? 'EU/EEA Free Movement' : 'Schengen 90/180 (ETIAS Ready)',
        maxStayDays: isEuPassport ? 365 : 90, entries: 'multiple', feeUsdApprox: isEuPassport ? 0 : 8,
        requiredDocs: ['Passport valid 3+ months beyond departure from Schengen', 'Shared 90/180-day clock across 29 Schengen states'],
        officialNotes: isEuPassport
          ? 'Unrestricted EU/Schengen freedom of movement.'
          : '90 days in any 180-day period shared across the entire Schengen Area (ETIAS €7 pre-travel authorization when active).',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://travel-europe.europa.eu/',
      };
    }
    if (['CN', 'RU', 'AF', 'KP', 'TM', 'DZ', 'NG', 'SD', 'SY', 'YE', 'IR'].includes(dId)) {
      if (dId === 'CN' && ['FR', 'DE', 'IT', 'ES', 'NL', 'CH', 'AT', 'IE', 'SG', 'MY', 'TH', 'JP', 'AU', 'NZ'].includes(pId)) {
        return {
          passportId: pId, destinationId: dId, status: 'visa_free',
          programName: 'China 30-Day Unilateral Waiver', maxStayDays: 30, entries: 'multiple', feeUsdApprox: 0,
          requiredDocs: ['Passport valid 6+ months', 'Return ticket'],
          officialNotes: 'China grants 30-day visa-free entry to citizens of eligible European and Asia-Pacific states.',
          lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.mfa.gov.cn/',
        };
      }
      return {
        passportId: pId, destinationId: dId, status: 'visa_required',
        programName: 'Consular Visa Required', maxStayDays: 30, entries: 'single', feeUsdApprox: 140,
        requiredDocs: ['Passport valid 6+ months', 'Consular application & invitation/itinerary'],
        officialNotes: `Advance embassy or consular visa required for ${destination.name}.`,
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
      };
    }
    if (['IN', 'VN', 'AZ', 'SA', 'OM', 'BH', 'EG', 'TZ', 'UG', 'ET', 'KH', 'LA', 'MM', 'BJ', 'GN', 'CM'].includes(dId)) {
      return {
        passportId: pId, destinationId: dId, status: 'evisa',
        programName: `${destination.name} e-Visa`, maxStayDays: 30, entries: 'single', feeUsdApprox: 40,
        requiredDocs: ['Passport valid 6+ months', 'Approved online e-Visa PDF'],
        officialNotes: `Online e-Visa available for ${pJur.name} passport holders.`,
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
      };
    }
    if (['NP', 'JO', 'ID', 'QA', 'BD', 'MG', 'ZW', 'ZM', 'PG', 'LA'].includes(dId)) {
      return {
        passportId: pId, destinationId: dId, status: 'visa_on_arrival',
        programName: 'Visa on Arrival', maxStayDays: 30, entries: 'single', feeUsdApprox: 35,
        requiredDocs: ['Passport valid 6+ months', 'Return ticket', 'Visa fee at airport counter'],
        officialNotes: `Visa on Arrival available at major international airports in ${destination.name}.`,
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
      };
    }
    return {
      passportId: pId, destinationId: dId, status: 'visa_free',
      programName: 'Visa Waiver', maxStayDays: 90, entries: 'multiple', feeUsdApprox: 0,
      requiredDocs: ['Passport valid 6+ months', 'Return or onward ticket'],
      officialNotes: `Visa-free entry for tourism and short business trips to ${destination.name}.`,
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }

  // Tier 2 Passports (e.g. Brazil, Argentina, Mexico, Costa Rica, Panama, Uruguay)
  if (pTier === 2) {
    if (destination.sharedZone === 'SCHENGEN_90_180') {
      return {
        passportId: pId, destinationId: dId, status: 'visa_free',
        programName: 'Schengen Annex II (90/180)', maxStayDays: 90, entries: 'multiple', feeUsdApprox: 0,
        requiredDocs: ['Passport valid 3+ months beyond departure', 'Return ticket & travel insurance'],
        officialNotes: 'Annex II visa-free access to the Schengen Area for 90 days in any 180-day period.',
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://travel-europe.europa.eu/',
      };
    }
    if (['US', 'PR', 'VI', 'GU', 'MP', 'CA', 'AU', 'CN', 'SA', 'NG', 'DZ', 'AF', 'KP', 'TM'].includes(dId)) {
      return {
        passportId: pId, destinationId: dId, status: 'visa_required',
        programName: 'Embassy Visa Required', maxStayDays: null, entries: 'unspecified', feeUsdApprox: 160,
        requiredDocs: ['Passport valid 6+ months', 'Consular visa application, financials & biometrics'],
        officialNotes: `Requires a consular visa prior to travel (check if a third-country booster unlocks ${destination.name}).`,
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
      };
    }
    if (destination.region === 'Americas' || destination.region === 'Europe' || ['AE', 'IL', 'ZA', 'MA', 'TN', 'TH', 'SG', 'MY', 'PH', 'HK', 'MO', 'KR'].includes(dId)) {
      return {
        passportId: pId, destinationId: dId, status: 'visa_free',
        programName: 'Reciprocal Visa Waiver', maxStayDays: 90, entries: 'multiple', feeUsdApprox: 0,
        requiredDocs: ['Passport valid 6+ months', 'Return ticket'],
        officialNotes: `Reciprocal visa-free entry for ${pJur.name} citizens.`,
        lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
      };
    }
    return {
      passportId: pId, destinationId: dId, status: 'evisa',
      programName: 'e-Visa / VoA', maxStayDays: 30, entries: 'single', feeUsdApprox: 40,
      requiredDocs: ['Passport valid 6+ months', 'Online e-Visa or airport VoA'],
      officialNotes: `Electronic visa or Visa on Arrival required for ${destination.name}.`,
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }

  // Tier 3 & Tier 4 Passports (India, China, Philippines, Nepal, Nigeria, etc.)
  if (['MY', 'FJ', 'VU', 'BB'].includes(dId) && pTier === 3) {
    return {
      passportId: pId, destinationId: dId, status: 'visa_free',
      programName: 'Tourist Visa Exemption', maxStayDays: 30, entries: 'single', feeUsdApprox: 0,
      requiredDocs: ['Passport valid 6+ months', 'Return ticket', 'Digital arrival card'],
      officialNotes: `Visa-free entry for short-term tourism in ${destination.name}.`,
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }
  if (['KH', 'LA', 'NP', 'TL', 'DJ', 'MG', 'KM', 'GW', 'BI', 'BO', 'WS', 'TO', 'TV', 'PW'].includes(dId)) {
    return {
      passportId: pId, destinationId: dId, status: 'visa_on_arrival',
      programName: 'Visa on Arrival', maxStayDays: 30, entries: 'single', feeUsdApprox: 35,
      requiredDocs: ['Passport valid 6+ months', 'Confirmed return flight', 'USD cash for VoA stamp fee'],
      officialNotes: `Visa on Arrival available at designated ports of entry in ${destination.name}.`,
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }
  if (['VN', 'UZ', 'KG', 'TJ', 'AZ', 'AM', 'ET', 'TZ', 'UG', 'ZM', 'ZW', 'BJ', 'TG', 'CI', 'GA', 'OM', 'BH', 'LK', 'MM'].includes(dId)) {
    return {
      passportId: pId, destinationId: dId, status: 'evisa',
      programName: `${destination.name} Official e-Visa`, maxStayDays: 30, entries: 'single', feeUsdApprox: 50,
      requiredDocs: ['Passport valid 6+ months', 'Printed e-Visa approval letter', 'Return flight & hotel booking'],
      officialNotes: `Apply online through the official ${destination.name} government e-Visa portal prior to departure.`,
      lastVerifiedIsoDate: '2026-09-25', sourceUrl: 'https://www.iatatravelcentre.com',
    };
  }

  return {
    passportId: pId,
    destinationId: dId,
    status: 'visa_required',
    programName: destination.sharedZone === 'SCHENGEN_90_180' ? 'Schengen Type C Visa Required' : 'Embassy Visa Required',
    maxStayDays: null,
    entries: 'unspecified',
    feeUsdApprox: destination.sharedZone === 'SCHENGEN_90_180' ? 98 : 140,
    requiredDocs: [
      'Passport valid for at least 6 months with 2 blank pages',
      'Completed embassy visa application form & biometric appointment',
      'Confirmed round-trip flight itinerary & hotel reservation',
      'Bank statements (last 3–6 months) & employment/study letter',
    ],
    officialNotes: `Requires a full consular/embassy visa prior to travel unless unlocked by a third-country booster visa.`,
    lastVerifiedIsoDate: '2026-09-25',
    sourceUrl: 'https://www.iatatravelcentre.com',
  };
}

const BOOSTER_RULES_BY_DEST = BOOSTER_RULES.reduce((acc, rule) => {
  if (!acc[rule.destinationId]) acc[rule.destinationId] = [];
  acc[rule.destinationId].push(rule);
  return acc;
}, {});

function resolveDestinationEligibility(destination, selectedPassports, heldBoosters) {
  const passports = selectedPassports.length > 0 ? selectedPassports.slice(0, 2) : [JURISDICTION_MAP['NP']];

  // STEP 1: Resolve Layer A across selected passport(s), taking the BETTER status
  let winningPassport = passports[0];
  let bestBaseline = getBaselineRule(winningPassport.id, destination);

  for (let i = 1; i < passports.length; i++) {
    const candidatePassport = passports[i];
    const candidateRule = getBaselineRule(candidatePassport.id, destination);
    const bestRank = VISA_CATEGORIES[bestBaseline.status]?.easeRank ?? 0;
    const candRank = VISA_CATEGORIES[candidateRule.status]?.easeRank ?? 0;
    if (candRank > bestRank || (candRank === bestRank && (candidateRule.maxStayDays || 0) > (bestBaseline.maxStayDays || 0))) {
      bestBaseline = candidateRule;
      winningPassport = candidatePassport;
    }
  }

  // STEP 4 GUARD: Never override a ban or domestic citizenship
  if (bestBaseline.status === 'banned' || winningPassport.id === destination.id) {
    return {
      destination,
      winningPassport,
      baselineRule: bestBaseline,
      effectiveCategory: bestBaseline.status,
      effectiveMaxStayDays: bestBaseline.maxStayDays,
      effectiveFeeUsd: bestBaseline.feeUsdApprox,
      isBoosted: false,
      appliedBoosterRule: null,
      unlockingDoc: null,
      unmetBoosterHints: [],
    };
  }

  // STEP 2: Check Layer B Booster Rules
  const candidateRules = BOOSTER_RULES_BY_DEST[destination.id] || [];
  let bestBoosterMatch = null;
  const unmetBoosterHints = [];

  for (const passport of passports) {
    const passportBaseline = getBaselineRule(passport.id, destination);
    if (passportBaseline.status === 'banned') continue;

    for (const rule of candidateRules) {
      // Never override an explicit nationality exclusion
      if (rule.excludedNationalities.includes(passport.id)) {
        continue;
      }

      // Check nationality scope
      if (rule.eligiblePassportNationalities === 'all_visa_required_nationalities') {
        if (!['visa_required', 'evisa', 'visa_on_arrival'].includes(passportBaseline.status)) {
          continue;
        }
      } else if (Array.isArray(rule.eligiblePassportNationalities)) {
        if (!rule.eligiblePassportNationalities.includes(passport.id)) {
          continue;
        }
      }

      // Match against user's held documents
      for (const heldDoc of heldBoosters) {
        const docMeta = BOOSTER_DOC_KINDS.find((d) => d.id === heldDoc.docKind);
        if (!docMeta) continue;

        // If user holds US C-1 transit visa on a destination that accepts US visas, warn them why C-1 is excluded
        if (heldDoc.docKind === 'us_c1_transit' && rule.acceptedDocKinds.includes('us_b1_b2')) {
          unmetBoosterHints.push({
            rule,
            heldDoc,
            docMeta,
            missingReasons: ['US C-1/C-2/C-3 Transit Visas are explicitly excluded from visa-free cascade entry (requires B1/B2 or Study/Work visa).'],
          });
          continue;
        }

        if (!rule.acceptedDocKinds.includes(heldDoc.docKind)) continue;

        const missingReasons = [];
        if (rule.visaMustBeMultipleEntry && !heldDoc.isMultipleEntry && !docMeta.isResidence) {
          missingReasons.push('Visa must be Multiple-Entry (yours is set to Single-Entry)');
        }
        if (rule.visaMustHaveBeenUsedToEnterIssuer && !heldDoc.hasBeenUsedToEnterIssuer && !docMeta.isResidence) {
          missingReasons.push(`Visa must have been used at least once to enter ${docMeta.issuer} first`);
        }
        if (heldDoc.remainingValidityDays < rule.minRemainingValidityDays) {
          missingReasons.push(`Requires ${rule.minRemainingValidityDays}+ days remaining validity (yours has ${heldDoc.remainingValidityDays}d)`);
        }

        const mappedCat =
          rule.resultStatus === 'visa_free'
            ? 'visa_free'
            : rule.resultStatus === 'voa'
            ? 'visa_on_arrival'
            : rule.stillRequires === 'eta'
            ? 'eta'
            : 'evisa';

        if (missingReasons.length === 0) {
          // STEP 3: Verify booster improves baseline status
          const baseRank = VISA_CATEGORIES[bestBaseline.status]?.easeRank ?? 0;
          const boostRank = VISA_CATEGORIES[mappedCat]?.easeRank ?? 0;
          const improves =
            boostRank > baseRank ||
            (boostRank === baseRank && rule.maxStayDays > (bestBaseline.maxStayDays || 0));

          if (improves) {
            if (
              !bestBoosterMatch ||
              boostRank > VISA_CATEGORIES[bestBoosterMatch.mappedCat].easeRank ||
              (boostRank === VISA_CATEGORIES[bestBoosterMatch.mappedCat].easeRank &&
                rule.maxStayDays > bestBoosterMatch.rule.maxStayDays)
            ) {
              bestBoosterMatch = {
                rule,
                heldDoc,
                docMeta,
                passport,
                baseline: passportBaseline,
                mappedCat,
              };
            }
          }
        } else {
          unmetBoosterHints.push({
            rule,
            heldDoc,
            docMeta,
            missingReasons,
          });
        }
      }
    }
  }

  if (bestBoosterMatch) {
    return {
      destination,
      winningPassport: bestBoosterMatch.passport,
      baselineRule: bestBoosterMatch.baseline,
      effectiveCategory: bestBoosterMatch.mappedCat,
      effectiveMaxStayDays: bestBoosterMatch.rule.maxStayDays,
      effectiveFeeUsd: bestBoosterMatch.rule.feeUsdApprox ?? 0,
      isBoosted: true,
      appliedBoosterRule: bestBoosterMatch.rule,
      unlockingDoc: bestBoosterMatch.docMeta,
      unlockingHeldQualifier: bestBoosterMatch.heldDoc,
      unmetBoosterHints,
    };
  }

  return {
    destination,
    winningPassport,
    baselineRule: bestBaseline,
    effectiveCategory: bestBaseline.status,
    effectiveMaxStayDays: bestBaseline.maxStayDays,
    effectiveFeeUsd: bestBaseline.feeUsdApprox,
    isBoosted: false,
    appliedBoosterRule: null,
    unlockingDoc: null,
    unlockingHeldQualifier: null,
    unmetBoosterHints,
  };
}

const DEMO_PRESETS = [
  {
    id: 'nepal_us_schengen',
    label: 'Nepal + US B1/B2 + Schengen',
    passportIds: ['NP'],
    boosters: [
      { docKind: 'us_b1_b2', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 365 },
      { docKind: 'schengen_c_multi', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 180 },
    ],
  },
  {
    id: 'india_us_visa',
    label: 'India + US B1/B2 (Used)',
    passportIds: ['IN'],
    boosters: [
      { docKind: 'us_b1_b2', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 365 },
    ],
  },
  {
    id: 'philippines_us_visa',
    label: 'Philippines + US B1/B2',
    passportIds: ['PH'],
    boosters: [
      { docKind: 'us_b1_b2', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 365 },
    ],
  },
  {
    id: 'china_us_schengen',
    label: 'China + US B1/B2 + Schengen',
    passportIds: ['CN'],
    boosters: [
      { docKind: 'us_b1_b2', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 365 },
      { docKind: 'schengen_c_multi', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 180 },
    ],
  },
  {
    id: 'brazil_us_visa',
    label: 'Brazil + US B1/B2',
    passportIds: ['BR'],
    boosters: [
      { docKind: 'us_b1_b2', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 365 },
    ],
  },
  {
    id: 'nigeria_uk_ilr',
    label: 'Nigeria + UK ILR Residence',
    passportIds: ['NG'],
    boosters: [
      { docKind: 'uk_ilr_residence_evisa', isMultipleEntry: true, hasBeenUsedToEnterIssuer: true, remainingValidityDays: 365 },
    ],
  },
  {
    id: 'dual_us_br',
    label: 'Dual: US + Brazil',
    passportIds: ['US', 'BR'],
    boosters: [],
  },
];

function FlagBadge({ isoCode, size = 40, shape = 'circle', darkMode = false, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const cleanCode = (isoCode || 'un').toLowerCase() === 'schengen' ? 'eu' : (isoCode || 'un').toLowerCase();
  const src = `https://flagcdn.com/w80/${cleanCode}.png`;

  useEffect(() => {
    setImgError(false);
  }, [cleanCode]);

  const borderRadius = shape === 'circle' ? '9999px' : '12px';
  const ringColor = darkMode ? 'rgba(251, 249, 255, 0.4)' : BRAND.ink;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        border: `1.5px solid ${ringColor}`,
        backgroundColor: darkMode ? '#351B66' : '#EDE7F8',
        boxShadow: '0 2px 6px rgba(34, 26, 58, 0.14)',
      }}
      aria-label={`Flag of ${cleanCode.toUpperCase()}`}
    >
      {!imgError ? (
        <img
          src={src}
          alt={cleanCode.toUpperCase()}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className="font-bold tracking-tighter text-xs"
          style={{ color: darkMode ? BRAND.paper : BRAND.ink }}
        >
          {cleanCode.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function StatusPill({ resolved, size = 'md' }) {
  const { isBoosted, effectiveCategory, appliedBoosterRule, baselineRule } = resolved;
  const catMeta = VISA_CATEGORIES[effectiveCategory] || VISA_CATEGORIES.visa_required;

  let pillBg = catMeta.color;
  let pillLabel = catMeta.shortLabel;

  if (isBoosted && appliedBoosterRule) {
    pillBg = BRAND.royalPurple; // #4A2585
    if (appliedBoosterRule.stillRequires === 'eta') pillLabel = 'eTA Unlocked';
    else if (appliedBoosterRule.stillRequires === 'tourist_card') pillLabel = 'Tourist Card';
    else if (appliedBoosterRule.stillRequires === 'online_pre_registration') pillLabel = 'Online TAC / e-Reg';
    else pillLabel = `${catMeta.shortLabel}`;
  } else if (baselineRule?.programName && effectiveCategory === 'eta') {
    pillLabel = baselineRule.programName.length <= 14 ? baselineRule.programName : 'eTA / ESTA';
  }

  const paddingClass = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full text-white shadow-sm tracking-wide ${paddingClass}`}
      style={{ backgroundColor: pillBg }}
      role="status"
      aria-label={`Entry status: ${pillLabel}${isBoosted ? ' Boosted by held visa' : ''}`}
    >
      {isBoosted && <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />}
      <span>{pillLabel}</span>
      {isBoosted && (
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/20 text-amber-200">
          Boosted
        </span>
      )}
    </span>
  );
}

function ShareCardModal({ resolved, onClose, darkMode }) {
  const canvasRef = useRef(null);
  const [isRendering, setIsRendering] = useState(true);

  const drawShareCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    // 1. Sunset-to-Plum Brand Gradient Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, BRAND.sunsetOrange);
    grad.addColorStop(0.38, BRAND.magenta);
    grad.addColorStop(0.72, BRAND.royalPurple);
    grad.addColorStop(1, BRAND.deepPlum);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle decorative editorial circles
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.arc(1050, 120, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(180, 540, 210, 0, Math.PI * 2);
    ctx.fill();

    // Inner glass card
    ctx.fillStyle = 'rgba(36, 18, 70, 0.55)';
    ctx.strokeStyle = 'rgba(251, 249, 255, 0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 54, W - 120, H - 108, 36);
    ctx.fill();
    ctx.stroke();

    // Brand Header
    ctx.fillStyle = '#FBF9FF';
    ctx.font = '800 26px system-ui, -apple-system, sans-serif';
    ctx.fillText('EXPLORE · WORLDWIDE VISA ELIGIBILITY ENGINE', 110, 118);

    // Status Banner Pill
    const statusText = resolved.isBoosted
      ? `✨ BOOSTED: ${VISA_CATEGORIES[resolved.effectiveCategory]?.label.toUpperCase()}`
      : VISA_CATEGORIES[resolved.effectiveCategory]?.label.toUpperCase();

    ctx.fillStyle = resolved.isBoosted ? BRAND.royalPurple : VISA_CATEGORIES[resolved.effectiveCategory]?.color || BRAND.teal;
    ctx.beginPath();
    ctx.roundRect(110, 148, 460, 56, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(statusText, 138, 185);

    // Passport -> Destination Headline
    ctx.fillStyle = '#FBF9FF';
    ctx.font = '900 54px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${resolved.winningPassport.name}  ➔  ${resolved.destination.name}`, 110, 295);

    // Stay & Fee Row
    const stayLabel = resolved.effectiveMaxStayDays ? `${resolved.effectiveMaxStayDays} Days Max Stay` : 'Consular Stay Limit';
    const feeLabel = resolved.effectiveFeeUsd === 0 ? 'No Visa Fee ($0)' : `Approx. Fee: $${resolved.effectiveFeeUsd} USD`;
    ctx.fillStyle = 'rgba(251, 249, 255, 0.88)';
    ctx.font = '600 30px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${stayLabel}   ·   ${feeLabel}   ·   ${resolved.destination.region}`, 110, 355);

    // Booster Attribution or Baseline Program
    ctx.fillStyle = '#FDE68A';
    ctx.font = '700 26px system-ui, -apple-system, sans-serif';
    if (resolved.isBoosted && resolved.unlockingDoc) {
      ctx.fillText(
        `Unlocked by held ${resolved.unlockingDoc.title} (Baseline was ${VISA_CATEGORIES[resolved.baselineRule.status]?.label})`,
        110,
        425
      );
    } else {
      ctx.fillText(`Program: ${resolved.baselineRule.programName || 'Standard Passport Baseline'}`, 110, 425);
    }

    // Footer disclaimer
    ctx.fillStyle = 'rgba(251, 249, 255, 0.65)';
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(
      `Verified ${resolved.baselineRule.lastVerifiedIsoDate} · Planning data only; verify with official embassy / airline Timatic.`,
      110,
      530
    );

    // Draw Flag Badges in top-right of card
    const drawFlagCircle = (img, x, y, r, fallbackIso) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      if (img) {
        ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
      } else {
        ctx.fillStyle = BRAND.royalPurple;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(fallbackIso, x, y + 10);
      }
      ctx.restore();
      ctx.strokeStyle = '#FBF9FF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    };

    const pImg = new Image();
    const dImg = new Image();
    pImg.crossOrigin = 'anonymous';
    dImg.crossOrigin = 'anonymous';

    let loaded = 0;
    const finishFlags = () => {
      loaded += 1;
      if (loaded === 2) {
        drawFlagCircle(pImg.complete && pImg.naturalWidth ? pImg : null, 935, 165, 52, resolved.winningPassport.id);
        drawFlagCircle(dImg.complete && dImg.naturalWidth ? dImg : null, 1025, 165, 52, resolved.destination.id);
        setIsRendering(false);
      }
    };

    pImg.onload = finishFlags;
    pImg.onerror = finishFlags;
    dImg.onload = finishFlags;
    dImg.onerror = finishFlags;

    pImg.src = `https://flagcdn.com/w160/${resolved.winningPassport.id.toLowerCase()}.png`;
    dImg.src = `https://flagcdn.com/w160/${resolved.destination.id.toLowerCase()}.png`;
  }, [resolved]);

  useEffect(() => {
    drawShareCard();
  }, [drawShareCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `EXPLORE-${resolved.winningPassport.id}-to-${resolved.destination.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Fallback if CORS tainted canvas
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: darkMode ? BRAND.deepPlum : BRAND.paper,
          borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(34,26,58,0.15)',
          color: darkMode ? BRAND.paper : BRAND.ink,
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-lg">1200×630 Share Card Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
            aria-label="Close Share Card Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-purple-500/30 bg-black/20">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-xs opacity-75">
              Sunset-to-Plum editorial card with passport flag + destination flag & eligibility summary.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-purple-500/30 hover:bg-purple-500/10"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                disabled={isRendering}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-transform active:scale-95"
                style={{ backgroundColor: BRAND.sunsetOrange }}
              >
                <Download className="w-4 h-4" />
                <span>Download PNG (1200×630)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountryDetailModal({
  resolved,
  onClose,
  onAddToTrip,
  isInTrip,
  onOpenBoosterManager,
  darkMode,
}) {
  const [showShareCard, setShowShareCard] = useState(false);
  if (!resolved) return null;

  const {
    destination,
    winningPassport,
    baselineRule,
    effectiveCategory,
    effectiveMaxStayDays,
    effectiveFeeUsd,
    isBoosted,
    appliedBoosterRule,
    unlockingDoc,
    unlockingHeldQualifier,
    unmetBoosterHints,
  } = resolved;

  const allPossibleBoostersForDest = BOOSTER_RULES_BY_DEST[destination.id] || [];

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border transition-all"
        style={{
          backgroundColor: darkMode ? '#1B0D36' : BRAND.paper,
          borderColor: darkMode ? 'rgba(255,255,255,0.16)' : 'rgba(34,26,58,0.15)',
          color: darkMode ? BRAND.paper : BRAND.ink,
        }}
      >
        {/* Hero Header with Flag Watermark */}
        <div
          className="relative overflow-hidden p-6 sm:p-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${BRAND.deepPlum} 0%, ${BRAND.royalPurple} 55%, ${BRAND.magenta} 100%)`,
          }}
        >
          {/* Subtle Watermark Flag */}
          <img
            src={`https://flagcdn.com/w320/${destination.id.toLowerCase()}.png`}
            alt=""
            aria-hidden="true"
            className="absolute -right-8 -bottom-8 w-64 h-44 object-cover opacity-15 rotate-[-10deg] pointer-events-none select-none rounded-2xl"
          />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <FlagBadge isoCode={destination.id} size={64} darkMode={true} />
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-200">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{destination.region}</span>
                  {destination.capital && <span>· {destination.capital}</span>}
                  <span>· ISO: {destination.id}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                  {destination.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <StatusPill resolved={resolved} />
                  {destination.sharedZone === 'SCHENGEN_90_180' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-purple-100">
                      Schengen 90/180 Zone
                    </span>
                  )}
                  {destination.sharedZone === 'CA4_SHARED_90' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-200">
                      CA-4 Shared 90-Day Zone
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              aria-label="Close country details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metric Pills */}
          <div className="relative z-10 grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <span className="text-[11px] uppercase tracking-wider text-purple-200 block">
                Max Stay
              </span>
              <span className="text-lg sm:text-xl font-extrabold mt-0.5 block">
                {effectiveMaxStayDays ? `${effectiveMaxStayDays} Days` : 'Per Visa'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <span className="text-[11px] uppercase tracking-wider text-purple-200 block">
                Allowed Entries
              </span>
              <span className="text-lg sm:text-xl font-extrabold mt-0.5 capitalize block">
                {isBoosted ? 'Multiple / Per Rule' : baselineRule.entries}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <span className="text-[11px] uppercase tracking-wider text-purple-200 block">
                Typical Fee
              </span>
              <span className="text-lg sm:text-xl font-extrabold mt-0.5 block">
                {effectiveFeeUsd === 0
                  ? 'Free ($0)'
                  : effectiveFeeUsd
                  ? `~$${effectiveFeeUsd} USD`
                  : 'Consular Fee'}
              </span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Winning Passport Banner */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border"
            style={{
              backgroundColor: darkMode ? 'rgba(74, 37, 133, 0.25)' : '#F3EEFC',
              borderColor: darkMode ? 'rgba(138, 59, 143, 0.35)' : 'rgba(74, 37, 133, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <FlagBadge isoCode={winningPassport.id} size={36} darkMode={darkMode} />
              <div>
                <div className="text-xs opacity-75 font-medium">Evaluated with Passport</div>
                <div className="font-bold text-sm">{winningPassport.name} Passport ({winningPassport.id})</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75">Layer A Baseline</div>
              <div className={`text-sm font-bold ${isBoosted ? 'line-through opacity-75' : ''}`}>
                {VISA_CATEGORIES[baselineRule.status]?.label}
              </div>
            </div>
          </div>

          {/* IF BOOSTED: Unlocked by Third-Country Visa Card */}
          {isBoosted && appliedBoosterRule && unlockingDoc && (
            <div
              className="p-5 rounded-2xl border-2 space-y-3"
              style={{
                backgroundColor: darkMode ? 'rgba(74, 37, 133, 0.35)' : 'rgba(74, 37, 133, 0.08)',
                borderColor: BRAND.royalPurple,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FlagBadge isoCode={unlockingDoc.flagCode} size={40} darkMode={darkMode} />
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Cascade Visa Booster Active</span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg">
                      Unlocked by your {unlockingDoc.title}
                    </h3>
                  </div>
                </div>
              </div>

              {unlockingHeldQualifier && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg font-semibold bg-teal-500/20 text-teal-600 dark:text-teal-300">
                    ✓ {unlockingHeldQualifier.isMultipleEntry ? 'Multiple-Entry' : 'Single-Entry'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg font-semibold bg-teal-500/20 text-teal-600 dark:text-teal-300">
                    ✓ {unlockingHeldQualifier.hasBeenUsedToEnterIssuer ? 'Previously Used' : 'Unused'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg font-semibold bg-teal-500/20 text-teal-600 dark:text-teal-300">
                    ✓ {unlockingHeldQualifier.remainingValidityDays}+ Days Validity
                  </span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Mandatory Entry Conditions Checklist:
                </div>
                {appliedBoosterRule.conditions.map((cond, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IF UNMET BOOSTER HINTS EXIST: Show why the user's held visa didn't unlock it yet! */}
          {!isBoosted && unmetBoosterHints.length > 0 && (
            <div className="p-4 rounded-2xl border-2 border-amber-500/60 bg-amber-500/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-amber-600 dark:text-amber-300 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Almost Unlocked — Qualifier Needed on Your Held Visa!</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBoosterManager();
                  }}
                  className="text-xs font-bold underline text-amber-600 dark:text-amber-300"
                >
                  Edit Qualifiers
                </button>
              </div>
              {unmetBoosterHints.map((hint, i) => (
                <div key={i} className="text-xs space-y-1 pl-6">
                  <div className="font-bold">
                    Your {hint.docMeta.title} could unlock {destination.name}, except:
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                    {hint.missingReasons.map((reason, rIdx) => (
                      <li key={rIdx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Why This Status Explanation */}
          <div
            className="p-4 rounded-2xl border space-y-2"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
            }}
          >
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider opacity-75">
              <Info className="w-4 h-4 text-orange-500" />
              <span>Why This Status Applies</span>
            </div>
            <p className="text-sm leading-relaxed">
              {isBoosted
                ? `On a standalone ${winningPassport.name} passport, ${destination.name} is "${
                    VISA_CATEGORIES[baselineRule.status]?.label
                  }". However, because you hold a qualifying ${unlockingDoc?.title}, Layer B cascade rules upgrade your entry to "${
                    VISA_CATEGORIES[effectiveCategory]?.label
                  }" for up to ${effectiveMaxStayDays} days.`
                : baselineRule.officialNotes}
            </p>
          </div>

          {/* If not boosted, show what third-country visas COULD unlock this destination */}
          {!isBoosted && allPossibleBoostersForDest.length > 0 && (
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: darkMode ? 'rgba(239, 125, 60, 0.08)' : 'rgba(239, 125, 60, 0.07)',
                borderColor: 'rgba(239, 125, 60, 0.35)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
                  Cascade Visa Opportunity
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBoosterManager();
                  }}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-500 text-white"
                >
                  + Add Held Visa
                </button>
              </div>
              {allPossibleBoostersForDest.map((rule) => {
                const isExcluded = rule.excludedNationalities.includes(winningPassport.id);
                const isSpecificMismatch =
                  Array.isArray(rule.eligiblePassportNationalities) &&
                  !rule.eligiblePassportNationalities.includes(winningPassport.id);

                if (isExcluded || isSpecificMismatch) {
                  return (
                    <p key={rule.id} className="text-xs opacity-80">
                      Note: While {destination.name} has a third-country booster rule,{' '}
                      <strong>{winningPassport.name} ({winningPassport.id})</strong> is not on the eligible nationality list for this exemption.
                    </p>
                  );
                }
                return (
                  <div key={rule.id} className="text-xs space-y-1">
                    <p className="font-semibold">
                      Can be unlocked up to <strong>{rule.maxStayDays} days</strong> with qualifying visas/residence from:{' '}
                      <span className="font-bold">
                        {Array.from(new Set(rule.acceptedDocKinds.map((k) => k.split('_')[0].toUpperCase()))).join(', ')}
                      </span>
                      .
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Required Documents Checklist */}
          <div
            className="p-4 rounded-2xl border space-y-2.5"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
            }}
          >
            <div className="text-xs font-extrabold uppercase tracking-wider opacity-75">
              Border & Airline Checklist
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {baselineRule.requiredDocs.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </div>
              ))}
              {isBoosted && unlockingDoc && (
                <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-purple-500 dark:text-purple-300">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Original physical {unlockingDoc.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Official Source + Verification Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs opacity-75 pt-1">
            <span>Last verified: {appliedBoosterRule?.lastVerifiedIsoDate || baselineRule.lastVerifiedIsoDate}</span>
            <a
              href={appliedBoosterRule?.sourceUrl || baselineRule.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold underline hover:text-orange-500"
            >
              <span>Official Government / MFA Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-purple-500/20">
            <button
              onClick={() => onAddToTrip(destination.id)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm text-white shadow-md transition-transform active:scale-95"
              style={{ backgroundColor: isInTrip ? BRAND.teal : BRAND.royalPurple }}
            >
              {isInTrip ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isInTrip ? 'Added to Trip Planner' : 'Add to Trip Planner'}</span>
            </button>

            <button
              onClick={() => setShowShareCard(true)}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-sm text-white shadow-md transition-transform active:scale-95"
              style={{ backgroundColor: BRAND.sunsetOrange }}
            >
              <Share2 className="w-4 h-4" />
              <span>Share Card</span>
            </button>
          </div>
        </div>
      </div>

      {showShareCard && (
        <ShareCardModal
          resolved={resolved}
          onClose={() => setShowShareCard(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

function PassportPickerModal({
  selectedPassports,
  onTogglePassport,
  onClose,
  darkMode,
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JURISDICTIONS;
    return JURISDICTIONS.filter(
      (j) =>
        j.name.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q) ||
        j.region.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-xl max-h-[86vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: darkMode ? '#1B0D36' : BRAND.paper,
          borderColor: darkMode ? 'rgba(255,255,255,0.16)' : 'rgba(34,26,58,0.15)',
          color: darkMode ? BRAND.paper : BRAND.ink,
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
          <div>
            <h3 className="font-extrabold text-lg">Select Your Passport(s)</h3>
            <p className="text-xs opacity-75">
              Choose up to 2 passports. EXPLORE automatically picks the better status per destination.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-500/20"
            aria-label="Close passport selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-purple-500/15 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 208 passports by country or ISO code (e.g. Nepal, NP, India, US)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(34,26,58,0.2)',
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold opacity-70">Active ({selectedPassports.length}/2):</span>
            {selectedPassports.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => onTogglePassport(p.id)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: idx === 0 ? BRAND.royalPurple : BRAND.magenta }}
              >
                <FlagBadge isoCode={p.id} size={18} darkMode={true} />
                <span>{p.name} ({p.id})</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filtered.map((jur) => {
            const isSelected = selectedPassports.some((p) => p.id === jur.id);
            return (
              <button
                key={jur.id}
                onClick={() => onTogglePassport(jur.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  isSelected ? 'ring-2 ring-orange-400' : 'hover:bg-purple-500/10'
                }`}
                style={{
                  backgroundColor: isSelected
                    ? darkMode
                      ? 'rgba(74, 37, 133, 0.45)'
                      : 'rgba(74, 37, 133, 0.1)'
                    : darkMode
                    ? 'rgba(255,255,255,0.03)'
                    : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FlagBadge isoCode={jur.id} size={36} darkMode={darkMode} />
                  <div className="truncate">
                    <div className="font-bold text-sm truncate">{jur.name}</div>
                    <div className="text-[11px] opacity-65">
                      {jur.region} · ISO {jur.id}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shrink-0"
                    style={{ backgroundColor: BRAND.teal }}
                  >
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-purple-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: BRAND.sunsetOrange }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function BoosterManagerModal({
  heldBoosters,
  onToggleBoosterDoc,
  onUpdateBoosterQualifier,
  onClose,
  darkMode,
}) {
  const [selectedIssuer, setSelectedIssuer] = useState('ALL');

  const filteredDocs = useMemo(() => {
    if (selectedIssuer === 'ALL') return BOOSTER_DOC_KINDS;
    return BOOSTER_DOC_KINDS.filter((d) => d.issuer === selectedIssuer);
  }, [selectedIssuer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border"
        style={{
          backgroundColor: darkMode ? '#1B0D36' : BRAND.paper,
          borderColor: darkMode ? 'rgba(255,255,255,0.16)' : 'rgba(34,26,58,0.15)',
          color: darkMode ? BRAND.paper : BRAND.ink,
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Layer B — Cascade Visas & Residence Permits</span>
            </div>
            <h3 className="font-extrabold text-lg">My Held Visas & Residence Cards</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-purple-500/20"
            aria-label="Close booster manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Issuer Filter Chips */}
        <div className="px-6 py-3 border-b border-purple-500/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedIssuer('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              selectedIssuer === 'ALL' ? 'text-white' : 'opacity-75 hover:opacity-100'
            }`}
            style={{
              backgroundColor: selectedIssuer === 'ALL' ? BRAND.royalPurple : 'rgba(138, 59, 143, 0.15)',
            }}
          >
            All Issuers ({BOOSTER_DOC_KINDS.length})
          </button>
          {BOOSTER_ISSUERS.map((issuer) => (
            <button
              key={issuer.id}
              onClick={() => setSelectedIssuer(issuer.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                selectedIssuer === issuer.id ? 'text-white' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedIssuer === issuer.id ? BRAND.royalPurple : 'rgba(138, 59, 143, 0.15)',
              }}
            >
              <FlagBadge isoCode={issuer.flagCode} size={16} darkMode={darkMode} />
              <span>{issuer.name}</span>
            </button>
          ))}
        </div>

        {/* Document List with Interactive Qualifiers */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredDocs.map((doc) => {
            const held = heldBoosters.find((h) => h.docKind === doc.id);
            const isHeld = Boolean(held);

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isHeld ? 'ring-2 ring-purple-500' : ''
                }`}
                style={{
                  backgroundColor: isHeld
                    ? darkMode
                      ? 'rgba(74, 37, 133, 0.32)'
                      : 'rgba(74, 37, 133, 0.07)'
                    : darkMode
                    ? 'rgba(255,255,255,0.03)'
                    : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <FlagBadge isoCode={doc.flagCode} size={40} darkMode={darkMode} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base">{doc.title}</span>
                        {doc.isResidence && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-teal-500/20 text-teal-500">
                            Residence Card
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${doc.isTransitWarning ? 'text-amber-500 font-semibold' : 'opacity-70'}`}>
                        {doc.note}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleBoosterDoc(doc.id)}
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white shrink-0 transition-transform active:scale-95"
                    style={{
                      backgroundColor: isHeld ? BRAND.teal : BRAND.deepPlum,
                    }}
                  >
                    {isHeld ? '✓ Held' : '+ Add'}
                  </button>
                </div>

                {/* Qualifier Controls when Held */}
                {isHeld && held && (
                  <div className="mt-4 pt-3 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {!doc.isResidence && (
                      <>
                        <button
                          onClick={() =>
                            onUpdateBoosterQualifier(doc.id, {
                              isMultipleEntry: !held.isMultipleEntry,
                            })
                          }
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border font-semibold ${
                            held.isMultipleEntry
                              ? 'border-teal-500/50 bg-teal-500/15 text-teal-600 dark:text-teal-300'
                              : 'border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                          }`}
                        >
                          <span>Entries:</span>
                          <span className="font-extrabold">
                            {held.isMultipleEntry ? 'Multiple-Entry' : 'Single-Entry'}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            onUpdateBoosterQualifier(doc.id, {
                              hasBeenUsedToEnterIssuer: !held.hasBeenUsedToEnterIssuer,
                            })
                          }
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border font-semibold ${
                            held.hasBeenUsedToEnterIssuer
                              ? 'border-teal-500/50 bg-teal-500/15 text-teal-600 dark:text-teal-300'
                              : 'border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                          }`}
                        >
                          <span>Prior Use:</span>
                          <span className="font-extrabold">
                            {held.hasBeenUsedToEnterIssuer ? 'Used at least once' : 'Unused (New)'}
                          </span>
                        </button>
                      </>
                    )}

                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10">
                      <span className="font-semibold">Validity:</span>
                      <select
                        value={held.remainingValidityDays}
                        onChange={(e) =>
                          onUpdateBoosterQualifier(doc.id, {
                            remainingValidityDays: Number(e.target.value),
                          })
                        }
                        className="bg-transparent font-extrabold focus:outline-none cursor-pointer"
                      >
                        <option value={30} className="text-black">30 Days</option>
                        <option value={90} className="text-black">90 Days (3m)</option>
                        <option value={180} className="text-black">180+ Days (6m)</option>
                        <option value={365} className="text-black">365+ Days (1y+)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-purple-500/20 flex items-center justify-between">
          <span className="text-xs opacity-75">
            Panama & Albania require <strong>Used</strong> multi-entry visas; Colombia, Peru & UAE require <strong>180d+</strong> validity.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shrink-0"
            style={{ backgroundColor: BRAND.sunsetOrange }}
          >
            Apply ({heldBoosters.length} Held)
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareTabView({
  selectedPassports,
  heldBoosters,
  resolvedList,
  onSelectDestination,
  onOpenBoosterManager,
  darkMode,
}) {
  const [compareMode, setCompareMode] = useState('booster_delta'); // 'booster_delta' | 'two_passports'
  const [passportAId, setPassportAId] = useState(selectedPassports[0]?.id || 'NP');
  const [passportBId, setPassportBId] = useState(selectedPassports[1]?.id || 'US');
  const [onlyDifferences, setOnlyDifferences] = useState(true);

  const boostedDestinations = useMemo(
    () => resolvedList.filter((r) => r.isBoosted),
    [resolvedList]
  );

  const baselineEasyCount = useMemo(
    () =>
      resolvedList.filter(
        (r) => r.baselineRule.status === 'visa_free' || r.baselineRule.status === 'visa_on_arrival'
      ).length,
    [resolvedList]
  );

  const boostedEasyCount = useMemo(
    () =>
      resolvedList.filter(
        (r) =>
          r.effectiveCategory === 'visa_free' ||
          r.effectiveCategory === 'visa_on_arrival' ||
          r.isBoosted
      ).length,
    [resolvedList]
  );

  const twoPassportRows = useMemo(() => {
    const pA = JURISDICTION_MAP[passportAId] || JURISDICTION_MAP['NP'];
    const pB = JURISDICTION_MAP[passportBId] || JURISDICTION_MAP['US'];
    return JURISDICTIONS.map((dest) => {
      const ruleA = getBaselineRule(pA.id, dest);
      const ruleB = getBaselineRule(pB.id, dest);
      const rankA = VISA_CATEGORIES[ruleA.status]?.easeRank ?? 0;
      const rankB = VISA_CATEGORIES[ruleB.status]?.easeRank ?? 0;
      return {
        dest,
        pA,
        pB,
        ruleA,
        ruleB,
        winner: rankA > rankB ? 'A' : rankB > rankA ? 'B' : 'TIE',
      };
    }).filter((row) => (!onlyDifferences ? true : row.ruleA.status !== row.ruleB.status));
  }, [passportAId, passportBId, onlyDifferences]);

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Eligibility Matrix Compare</h2>
          <p className="text-xs sm:text-sm opacity-75">
            Quantify your third-country visa power or compare two passports side-by-side.
          </p>
        </div>

        <div
          className="inline-flex p-1 rounded-2xl border"
          style={{
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#EFEAF8',
            borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(34,26,58,0.12)',
          }}
        >
          <button
            onClick={() => setCompareMode('booster_delta')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              compareMode === 'booster_delta' ? 'text-white shadow-sm' : 'opacity-75'
            }`}
            style={{
              backgroundColor: compareMode === 'booster_delta' ? BRAND.royalPurple : 'transparent',
            }}
          >
            Passport vs. +Boosters ({boostedDestinations.length})
          </button>
          <button
            onClick={() => setCompareMode('two_passports')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              compareMode === 'two_passports' ? 'text-white shadow-sm' : 'opacity-75'
            }`}
            style={{
              backgroundColor: compareMode === 'two_passports' ? BRAND.royalPurple : 'transparent',
            }}
          >
            Compare 2 Passports
          </button>
        </div>
      </div>

      {compareMode === 'booster_delta' ? (
        <div className="space-y-5">
          {/* Delta Hero Banner */}
          <div
            className="p-6 rounded-3xl text-white shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.deepPlum} 0%, ${BRAND.royalPurple} 60%, ${BRAND.sunsetOrange} 100%)`,
            }}
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-purple-200 font-bold">
                Passport Baseline Only
              </span>
              <div className="text-3xl font-black mt-1">{baselineEasyCount} Easy</div>
              <span className="text-xs text-purple-200">Visa-Free + VoA without boosters</span>
            </div>

            <div className="border-y md:border-y-0 md:border-x border-white/20 py-3 md:py-0 md:px-6">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                With Your {heldBoosters.length} Held Booster(s)
              </span>
              <div className="text-3xl font-black mt-1 text-amber-300">
                {boostedEasyCount} Easy (+{boostedDestinations.length} Unlocked)
              </div>
              <span className="text-xs text-purple-100">
                Upgraded from Embassy Visa to Visa-Free / VoA / eTA
              </span>
            </div>

            <div className="flex md:justify-end">
              <button
                onClick={onOpenBoosterManager}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-purple-950 shadow hover:bg-purple-50"
              >
                Configure Held Visas ({heldBoosters.length})
              </button>
            </div>
          </div>

          {boostedDestinations.length === 0 ? (
            <div
              className="p-8 rounded-3xl border text-center space-y-3"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.12)',
              }}
            >
              <Sparkles className="w-10 h-10 mx-auto text-orange-400" />
              <h3 className="font-bold text-lg">No Boosted Destinations Currently Active</h3>
              <p className="text-xs sm:text-sm opacity-75 max-w-md mx-auto">
                Add a US B1/B2 Visa, US Green Card, Schengen Multi-Entry Visa, UK Visa, or Canadian Visa to see which countries upgrade from Embassy Visa Required!
              </p>
              <button
                onClick={onOpenBoosterManager}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white"
                style={{ backgroundColor: BRAND.sunsetOrange }}
              >
                + Add Held Booster Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {boostedDestinations.map((item) => (
                <button
                  key={item.destination.id}
                  onClick={() => onSelectDestination(item)}
                  className="p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: darkMode ? 'rgba(74, 37, 133, 0.22)' : '#FFFFFF',
                    borderColor: darkMode ? 'rgba(138, 59, 143, 0.35)' : 'rgba(74, 37, 133, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FlagBadge isoCode={item.destination.id} size={42} darkMode={darkMode} />
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm sm:text-base truncate">
                        {item.destination.name}
                      </div>
                      <div className="text-xs opacity-70 flex items-center gap-1.5 flex-wrap">
                        <span className="line-through">
                          {VISA_CATEGORIES[item.baselineRule.status]?.shortLabel}
                        </span>
                        <span>➔</span>
                        <span className="font-bold text-teal-500">
                          {item.effectiveMaxStayDays}d via {item.unlockingDoc?.shortTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusPill resolved={item} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Two Passports Selector Bar */}
          <div
            className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(34,26,58,0.12)',
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <FlagBadge isoCode={passportAId} size={32} darkMode={darkMode} />
                <select
                  value={passportAId}
                  onChange={(e) => setPassportAId(e.target.value)}
                  className="font-bold text-sm bg-transparent border rounded-xl px-3 py-1.5"
                >
                  {JURISDICTIONS.map((j) => (
                    <option key={j.id} value={j.id} className="text-black">
                      {j.name} ({j.id})
                    </option>
                  ))}
                </select>
              </div>

              <ArrowLeftRight className="w-4 h-4 opacity-60" />

              <div className="flex items-center gap-2">
                <FlagBadge isoCode={passportBId} size={32} darkMode={darkMode} />
                <select
                  value={passportBId}
                  onChange={(e) => setPassportBId(e.target.value)}
                  className="font-bold text-sm bg-transparent border rounded-xl px-3 py-1.5"
                >
                  {JURISDICTIONS.map((j) => (
                    <option key={j.id} value={j.id} className="text-black">
                      {j.name} ({j.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
                className="rounded accent-purple-600"
              />
              <span>Show only differences ({twoPassportRows.length})</span>
            </label>
          </div>

          <div className="space-y-2">
            {twoPassportRows.slice(0, 80).map(({ dest, pA, pB, ruleA, ruleB }) => (
              <div
                key={dest.id}
                className="p-3.5 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 items-center gap-3"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(34,26,58,0.08)',
                }}
              >
                <div className="flex items-center gap-3">
                  <FlagBadge isoCode={dest.id} size={34} darkMode={darkMode} />
                  <div>
                    <div className="font-bold text-sm">{dest.name}</div>
                    <div className="text-[11px] opacity-65">{dest.region}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-center gap-2">
                  <span className="text-xs opacity-70">{pA.id}:</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: VISA_CATEGORIES[ruleA.status]?.color }}
                  >
                    {VISA_CATEGORIES[ruleA.status]?.shortLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <span className="text-xs opacity-70">{pB.id}:</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: VISA_CATEGORIES[ruleB.status]?.color }}
                  >
                    {VISA_CATEGORIES[ruleB.status]?.shortLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TripPlannerTabView({
  tripStops,
  onAddStop,
  onRemoveStop,
  onUpdateStopDays,
  resolvedMap,
  onSelectDestination,
  darkMode,
}) {
  const [selectedAddIso, setSelectedAddIso] = useState('MX');

  // Compute smart zone & routing compliance alerts
  const alerts = useMemo(() => {
    const list = [];
    let schengenDays = 0;
    let ca4Days = 0;

    tripStops.forEach((stop) => {
      const res = resolvedMap[stop.iso];
      if (!res) return;

      if (res.destination.sharedZone === 'SCHENGEN_90_180') {
        schengenDays += stop.days;
      }
      if (res.destination.sharedZone === 'CA4_SHARED_90') {
        ca4Days += stop.days;
      }

      // Singapore 96-hour (4-day) VFTF transit check
      if (
        stop.iso === 'SG' &&
        res.isBoosted &&
        res.appliedBoosterRule?.id === 'BOOST_SG_VFTF_96H'
      ) {
        if (stop.days > 4) {
          list.push({
            type: 'error',
            title: `Singapore VFTF Exceeded (${stop.days} days > 4 days / 96 hours)`,
            desc: 'Singapore Visa Free Transit Facility (VFTF) is strictly limited to 96 hours (4 days) in transit to/from a third country.',
          });
        } else {
          list.push({
            type: 'warning',
            title: 'Singapore 96-Hour VFTF Routing Rule',
            desc: 'Ensure your Singapore stop is a true transit leg between two different countries (e.g. Home -> SG -> Third Country), not a turnaround trip.',
          });
        }
      }

      // Prior-use visa reminder (e.g. Panama / Albania / Saudi Arabia)
      if (res.isBoosted && res.appliedBoosterRule?.visaMustHaveBeenUsedToEnterIssuer) {
        list.push({
          type: 'info',
          title: `${res.destination.name} Requires Prior Entry Stamp on Your ${res.unlockingDoc?.shortTitle}`,
          desc: `Border officers in ${res.destination.name} verify that your ${res.unlockingDoc?.title} has been physically used at least once to enter the issuing country.`,
        });
      }
    });

    if (schengenDays > 90) {
      list.push({
        type: 'error',
        title: `Schengen 90/180-Day Limit Exceeded (${schengenDays} / 90 days)`,
        desc: 'All 29 Schengen countries share a single combined 90-day allowance within any 180-day period.',
      });
    } else if (schengenDays > 0) {
      list.push({
        type: 'info',
        title: `Schengen Shared Allowance: ${schengenDays} of 90 Days Used`,
        desc: 'Schengen hops count toward a single combined 90/180-day clock.',
      });
    }

    if (ca4Days > 90) {
      list.push({
        type: 'error',
        title: `CA-4 Central America Shared 90-Day Limit Exceeded (${ca4Days} / 90 days)`,
        desc: 'Guatemala, El Salvador, Honduras, and Nicaragua share a single 90-day combined stay clock.',
      });
    } else if (ca4Days > 0) {
      list.push({
        type: 'warning',
        title: `CA-4 Shared Clock Active: ${ca4Days} of 90 Days Across Central America`,
        desc: 'Days spent in Guatemala, El Salvador, Honduras, and Nicaragua are pooled together.',
      });
    }

    return list;
  }, [tripStops, resolvedMap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Multi-Stop Trip & Zone Planner</h2>
          <p className="text-xs sm:text-sm opacity-75">
            Verify every hop for Schengen 90/180, CA-4 shared 90-day clocks, and Singapore 96h VFTF rules.
          </p>
        </div>

        {/* Add Stop Bar */}
        <div className="flex items-center gap-2">
          <select
            value={selectedAddIso}
            onChange={(e) => setSelectedAddIso(e.target.value)}
            className="text-xs sm:text-sm font-bold rounded-xl px-3 py-2.5 border bg-transparent"
            style={{
              borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(34,26,58,0.2)',
            }}
          >
            {JURISDICTIONS.map((j) => (
              <option key={j.id} value={j.id} className="text-black">
                {j.name} ({j.id})
              </option>
            ))}
          </select>
          <button
            onClick={() => onAddStop(selectedAddIso)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm"
            style={{ backgroundColor: BRAND.sunsetOrange }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      {/* Smart Compliance Warnings */}
      {alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                alert.type === 'error'
                  ? 'border-red-500/60 bg-red-500/15 text-red-600 dark:text-red-300'
                  : alert.type === 'warning'
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                  : 'border-teal-500/50 bg-teal-500/10 text-teal-600 dark:text-teal-300'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <div className="font-extrabold">{alert.title}</div>
                <p className="opacity-90 mt-0.5">{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Itinerary Stops */}
      <div className="space-y-3">
        {tripStops.map((stop, index) => {
          const res = resolvedMap[stop.iso];
          if (!res) return null;
          const overStay =
            res.effectiveMaxStayDays && stop.days > res.effectiveMaxStayDays;

          return (
            <div
              key={`${stop.iso}_${index}`}
              className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                borderColor: overStay
                  ? '#EF4444'
                  : darkMode
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(34,26,58,0.1)',
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: BRAND.royalPurple }}
                >
                  {index + 1}
                </span>
                <FlagBadge isoCode={res.destination.id} size={42} darkMode={darkMode} />
                <div className="min-w-0">
                  <button
                    onClick={() => onSelectDestination(res)}
                    className="font-extrabold text-base hover:underline text-left truncate block"
                  >
                    {res.destination.name}
                  </button>
                  <div className="flex flex-wrap items-center gap-2 text-xs opacity-75">
                    <span>
                      Max Stay: {res.effectiveMaxStayDays ? `${res.effectiveMaxStayDays}d` : 'Per Visa'}
                    </span>
                    {res.isBoosted && res.unlockingDoc && (
                      <span className="text-purple-500 dark:text-purple-300 font-bold">
                        · Unlocked by {res.unlockingDoc.shortTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <StatusPill resolved={res} size="sm" />

                <div className="flex items-center gap-1.5 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={stop.days}
                    onChange={(e) => onUpdateStopDays(index, Math.max(1, Number(e.target.value)))}
                    className="w-12 text-center font-extrabold text-xs bg-transparent focus:outline-none"
                  />
                  <span className="text-xs opacity-75">days</span>
                </div>

                <button
                  onClick={() => onRemoveStop(index)}
                  className="p-2 rounded-xl hover:bg-red-500/15 text-red-400 transition-colors"
                  aria-label="Remove stop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  // Persistent Theme & Layout State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (typeof window === 'undefined') return true;
      const saved = localStorage.getItem('explore_dark_mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [iphoneFrameMode, setIphoneFrameMode] = useState(false);

  // Traveler Passports & Held Booster Visas
  const [selectedPassportIds, setSelectedPassportIds] = useState(['NP']);
  const [heldBoosters, setHeldBoosters] = useState([
    {
      docKind: 'us_b1_b2',
      isMultipleEntry: true,
      hasBeenUsedToEnterIssuer: true,
      remainingValidityDays: 365,
    },
    {
      docKind: 'schengen_c_multi',
      isMultipleEntry: true,
      hasBeenUsedToEnterIssuer: true,
      remainingValidityDays: 180,
    },
  ]);

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'compare' | 'trip' | 'profile'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'visa_free' | 'visa_on_arrival' | 'evisa_eta' | 'visa_required' | 'BOOSTED'
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('easiest'); // 'easiest' | 'az' | 'stay'

  // Modals
  const [activeDetailResolved, setActiveDetailResolved] = useState(null);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showBoosterModal, setShowBoosterModal] = useState(false);

  // Multi-Stop Trip Planner State
  const [tripStops, setTripStops] = useState([
    { iso: 'MX', days: 14 },
    { iso: 'PA', days: 7 },
    { iso: 'AL', days: 10 },
    { iso: 'TR', days: 8 },
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('explore_dark_mode', JSON.stringify(darkMode));
    } catch {
      // Ignore storage error
    }
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const selectedPassports = useMemo(
    () => selectedPassportIds.map((id) => JURISDICTION_MAP[id]).filter(Boolean),
    [selectedPassportIds]
  );

  // Resolve all 208 destinations in real time
  const resolvedList = useMemo(() => {
    return JURISDICTIONS.filter((d) => !selectedPassportIds.includes(d.id)).map((dest) =>
      resolveDestinationEligibility(dest, selectedPassports, heldBoosters)
    );
  }, [selectedPassports, selectedPassportIds, heldBoosters]);

  const resolvedMap = useMemo(
    () => Object.fromEntries(resolvedList.map((r) => [r.destination.id, r])),
    [resolvedList]
  );

  // Summary Counts
  const counts = useMemo(() => {
    let easy = 0;
    let visaFree = 0;
    let voa = 0;
    let evisaEta = 0;
    let visaReq = 0;
    let boosted = 0;

    resolvedList.forEach((r) => {
      if (r.isBoosted) boosted += 1;
      if (r.effectiveCategory === 'visa_free') {
        visaFree += 1;
        easy += 1;
      } else if (r.effectiveCategory === 'visa_on_arrival') {
        voa += 1;
        easy += 1;
      } else if (r.effectiveCategory === 'evisa' || r.effectiveCategory === 'eta') {
        evisaEta += 1;
      } else {
        visaReq += 1;
      }
    });

    return { easy, visaFree, voa, evisaEta, visaReq, boosted, total: resolvedList.length };
  }, [resolvedList]);

  // Filtered & Sorted Destinations for Home Explorer
  const filteredDestinations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return resolvedList
      .filter((item) => {
        if (regionFilter !== 'ALL' && item.destination.region !== regionFilter) return false;
        if (statusFilter === 'BOOSTED' && !item.isBoosted) return false;
        if (statusFilter === 'visa_free' && item.effectiveCategory !== 'visa_free') return false;
        if (statusFilter === 'visa_on_arrival' && item.effectiveCategory !== 'visa_on_arrival') return false;
        if (
          statusFilter === 'evisa_eta' &&
          item.effectiveCategory !== 'evisa' &&
          item.effectiveCategory !== 'eta'
        )
          return false;
        if (statusFilter === 'visa_required' && item.effectiveCategory !== 'visa_required') return false;

        if (q) {
          const matchName = item.destination.name.toLowerCase().includes(q);
          const matchIso = item.destination.id.toLowerCase().includes(q);
          const matchCapital = item.destination.capital?.toLowerCase().includes(q);
          const matchDoc = item.unlockingDoc?.title.toLowerCase().includes(q);
          if (!matchName && !matchIso && !matchCapital && !matchDoc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'az') {
          return a.destination.name.localeCompare(b.destination.name);
        }
        if (sortBy === 'stay') {
          return (b.effectiveMaxStayDays || 0) - (a.effectiveMaxStayDays || 0);
        }
        // Default: Easiest Entry (Boosted & Visa-Free on top, then stay length, then A-Z)
        const rankA = (VISA_CATEGORIES[a.effectiveCategory]?.easeRank || 0) + (a.isBoosted ? 5 : 0);
        const rankB = (VISA_CATEGORIES[b.effectiveCategory]?.easeRank || 0) + (b.isBoosted ? 5 : 0);
        if (rankB !== rankA) return rankB - rankA;
        return a.destination.name.localeCompare(b.destination.name);
      });
  }, [resolvedList, regionFilter, statusFilter, searchQuery, sortBy]);

  // Handlers
  const handleTogglePassport = (isoCode) => {
    setSelectedPassportIds((prev) => {
      if (prev.includes(isoCode)) {
        return prev.length > 1 ? prev.filter((id) => id !== isoCode) : prev;
      }
      if (prev.length >= 2) {
        return [prev[0], isoCode];
      }
      return [...prev, isoCode];
    });
  };

  const handleToggleBoosterDoc = (docKind) => {
    setHeldBoosters((prev) => {
      const exists = prev.some((h) => h.docKind === docKind);
      if (exists) {
        return prev.filter((h) => h.docKind !== docKind);
      }
      return [
        ...prev,
        {
          docKind,
          isMultipleEntry: true,
          hasBeenUsedToEnterIssuer: true,
          remainingValidityDays: 365,
        },
      ];
    });
  };

  const handleUpdateBoosterQualifier = (docKind, patch) => {
    setHeldBoosters((prev) =>
      prev.map((item) => (item.docKind === docKind ? { ...item, ...patch } : item))
    );
  };

  const handleApplyPreset = (preset) => {
    setSelectedPassportIds(preset.passportIds);
    setHeldBoosters(preset.boosters);
  };

  const handleAddTripStop = (iso) => {
    setTripStops((prev) => [...prev, { iso, days: 10 }]);
  };

  const handleRemoveTripStop = (idx) => {
    setTripStops((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateStopDays = (idx, days) => {
    setTripStops((prev) => prev.map((s, i) => (i === idx ? { ...s, days } : s)));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        iphoneFrameMode ? 'py-6 px-2 flex justify-center bg-slate-950' : ''
      }`}
      style={{
        backgroundColor: iphoneFrameMode
          ? '#0B0616'
          : darkMode
          ? '#140A28'
          : BRAND.paper,
        color: darkMode ? BRAND.paper : BRAND.ink,
      }}
    >
      <div
        className={`w-full flex flex-col ${
          iphoneFrameMode
            ? 'max-w-[430px] h-[880px] rounded-[52px] border-[10px] border-neutral-800 shadow-2xl overflow-hidden relative'
            : 'max-w-7xl mx-auto min-h-screen'
        }`}
        style={{
          backgroundColor: darkMode ? '#140A28' : BRAND.paper,
        }}
      >
        {/* Top Editorial Header */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl border-b px-4 sm:px-6 py-3.5"
          style={{
            backgroundColor: darkMode ? 'rgba(20, 10, 40, 0.88)' : 'rgba(251, 249, 255, 0.9)',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.sunsetOrange}, ${BRAND.magenta}, ${BRAND.royalPurple})`,
                }}
              >
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-lg sm:text-xl tracking-tight">EXPLORE</h1>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
                    style={{ backgroundColor: BRAND.royalPurple }}
                  >
                    208 Jurisdictions
                  </span>
                </div>
                <p className="text-[11px] opacity-70 hidden sm:block">
                  Worldwide Passport & Cascade-Visa Eligibility Engine · Offline Snapshot v2026.09
                </p>
              </div>
            </div>

            {/* Active Traveler Profile Pills + Theme/Frame Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowPassportModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-extrabold border shadow-sm transition-transform active:scale-95"
                style={{
                  backgroundColor: darkMode ? 'rgba(74, 37, 133, 0.35)' : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(34,26,58,0.18)',
                }}
              >
                <div className="flex -space-x-1.5">
                  {selectedPassports.map((p) => (
                    <FlagBadge key={p.id} isoCode={p.id} size={22} darkMode={darkMode} />
                  ))}
                </div>
                <span>
                  {selectedPassports.map((p) => p.name).join(' + ')}
                </span>
              </button>

              <button
                onClick={() => setShowBoosterModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-extrabold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: BRAND.royalPurple }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>+{heldBoosters.length} Held Visas</span>
              </button>

              <button
                onClick={() => setIphoneFrameMode((v) => !v)}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border opacity-80 hover:opacity-100"
                style={{
                  borderColor: darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(34,26,58,0.18)',
                }}
                title="Toggle iPhone 16 Pro Preview vs. Full Windows Monitor Width"
              >
                {iphoneFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                <span>{iphoneFrameMode ? 'Wide View' : 'iPhone Frame'}</span>
              </button>

              <button
                onClick={() => setDarkMode((d) => !d)}
                className="p-2 rounded-xl border opacity-85 hover:opacity-100"
                style={{
                  borderColor: darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(34,26,58,0.18)',
                }}
                aria-label="Toggle Dark / Light Mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Traveler Presets Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 mt-2.5 border-t border-purple-500/15">
            <span className="text-[11px] font-bold opacity-65 shrink-0 mr-1">Quick Presets:</span>
            {DEMO_PRESETS.map((preset) => {
              const isCurrent =
                preset.passportIds.join(',') === selectedPassportIds.join(',') &&
                preset.boosters.length === heldBoosters.length;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 border transition-all ${
                    isCurrent ? 'text-white shadow-sm' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isCurrent
                      ? BRAND.magenta
                      : darkMode
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(34,26,58,0.04)',
                    borderColor: isCurrent ? BRAND.magenta : 'rgba(138, 59, 143, 0.25)',
                  }}
                >
                  <FlagBadge isoCode={preset.passportIds[0]} size={15} darkMode={darkMode} />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 pb-28 space-y-6">
          {activeTab === 'explorer' && (
            <>
              {/* Hero Summary Counter Banner */}
              <div
                className="p-5 sm:p-6 rounded-3xl text-white shadow-xl relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.deepPlum} 0%, ${BRAND.royalPurple} 52%, ${BRAND.magenta} 100%)`,
                }}
              >
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200">
                      <span>Active Eligibility Snapshot</span>
                      <span>·</span>
                      <span>Verified Sep 2026</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {counts.easy} Easy Entry{' '}
                      <span className="text-amber-300">({counts.boosted} Boosted ✨)</span> ·{' '}
                      {counts.evisaEta} eVisa/eTA · {counts.visaReq} Visa
                    </h2>
                    <p className="text-xs sm:text-sm text-purple-100 max-w-2xl">
                      Showing combined Layer A ({selectedPassports.map((p) => p.name).join(' + ')}) + Layer B (
                      {heldBoosters.length > 0
                        ? heldBoosters
                            .map((h) => BOOSTER_DOC_KINDS.find((d) => d.id === h.docKind)?.shortTitle)
                            .join(', ')
                        : 'No booster visas active'}
                      ).
                    </p>
                  </div>

                  {/* Active Booster Quick Pills */}
                  <div className="flex flex-wrap gap-2">
                    {heldBoosters.map((h) => {
                      const meta = BOOSTER_DOC_KINDS.find((d) => d.id === h.docKind);
                      if (!meta) return null;
                      return (
                        <button
                          key={h.docKind}
                          onClick={() => setShowBoosterModal(true)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold"
                        >
                          <FlagBadge isoCode={meta.flagCode} size={20} darkMode={true} />
                          <div className="text-left">
                            <div>{meta.shortTitle}</div>
                            <div className="text-[10px] text-amber-200">
                              {meta.isResidence
                                ? `Residence · ${h.remainingValidityDays}d+`
                                : `${h.hasBeenUsedToEnterIssuer ? 'Used' : 'Unused'} · ${
                                    h.isMultipleEntry ? 'Multi' : 'Single'
                                  } · ${h.remainingValidityDays}d`}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setShowBoosterModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white shadow"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Edit Visas / Qualifiers</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Segmented Status Filter + Search + Region Chips */}
              <div className="space-y-3">
                {/* Segmented Control */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: 'ALL', label: `All (${counts.total})`, color: BRAND.royalPurple },
                    { id: 'BOOSTED', label: `✨ Boosted (${counts.boosted})`, color: BRAND.royalPurple },
                    { id: 'visa_free', label: `Visa Free (${counts.visaFree})`, color: BRAND.teal },
                    { id: 'visa_on_arrival', label: `VoA (${counts.voa})`, color: BRAND.sunsetOrange },
                    { id: 'evisa_eta', label: `eVisa / eTA (${counts.evisaEta})`, color: BRAND.magenta },
                    { id: 'visa_required', label: `Visa Required (${counts.visaReq})`, color: BRAND.deepPlum },
                  ].map((seg) => {
                    const active = statusFilter === seg.id;
                    return (
                      <button
                        key={seg.id}
                        onClick={() => setStatusFilter(seg.id)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition-all ${
                          active ? 'text-white shadow-md scale-[1.02]' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: active
                            ? seg.color
                            : darkMode
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(34,26,58,0.07)',
                        }}
                      >
                        {seg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search + Sort Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 200+ destinations by country, capital, ISO, or unlocking visa..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-sm border bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{
                        borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(34,26,58,0.15)',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-70 shrink-0">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl text-xs font-extrabold border bg-transparent cursor-pointer"
                      style={{
                        borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(34,26,58,0.15)',
                      }}
                    >
                      <option value="easiest" className="text-black">Easiest Entry First</option>
                      <option value="stay" className="text-black">Longest Stay First</option>
                      <option value="az" className="text-black">Country A–Z</option>
                    </select>
                  </div>
                </div>

                {/* Region Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {['ALL', 'Americas', 'Europe', 'Asia', 'Middle East', 'Africa', 'Oceania'].map(
                    (reg) => {
                      const active = regionFilter === reg;
                      return (
                        <button
                          key={reg}
                          onClick={() => setRegionFilter(reg)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                            active ? 'text-white' : 'opacity-75 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: active ? BRAND.sunsetOrange : 'transparent',
                            borderColor: active
                              ? BRAND.sunsetOrange
                              : darkMode
                              ? 'rgba(255,255,255,0.12)'
                              : 'rgba(34,26,58,0.12)',
                          }}
                        >
                          {reg === 'ALL' ? 'All Regions' : reg}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Destination Cards Grid */}
              {filteredDestinations.length === 0 ? (
                <div
                  className="p-10 rounded-3xl border text-center space-y-3"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
                  }}
                >
                  <Globe className="w-10 h-10 mx-auto opacity-40" />
                  <h3 className="font-bold text-base">No Matching Destinations</h3>
                  <p className="text-xs opacity-70">
                    Try clearing your search filter or switching status/region tabs.
                  </p>
                </div>
              ) : (
                <div
                  className={`grid gap-3 ${
                    iphoneFrameMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}
                >
                  {filteredDestinations.map((item) => {
                    const {
                      destination,
                      winningPassport,
                      baselineRule,
                      effectiveMaxStayDays,
                      isBoosted,
                      unlockingDoc,
                      unmetBoosterHints,
                    } = item;

                    return (
                      <button
                        key={destination.id}
                        onClick={() => setActiveDetailResolved(item)}
                        className="group p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] hover:shadow-lg flex items-center justify-between gap-3"
                        style={{
                          backgroundColor: isBoosted
                            ? darkMode
                              ? 'rgba(74, 37, 133, 0.24)'
                              : '#F6F2FD'
                            : darkMode
                            ? 'rgba(36, 18, 70, 0.65)'
                            : '#FFFFFF',
                          borderColor: isBoosted
                            ? BRAND.royalPurple
                            : darkMode
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(34,26,58,0.1)',
                        }}
                      >
                        {/* Left: Circular Flag + Name + Subtitles */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <FlagBadge isoCode={destination.id} size={44} darkMode={darkMode} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm sm:text-base truncate">
                                {destination.name}
                              </span>
                              {selectedPassports.length > 1 && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 shrink-0">
                                  {winningPassport.id}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 text-xs mt-0.5">
                              <span className="opacity-70">{destination.region}</span>
                              {effectiveMaxStayDays && (
                                <>
                                  <span className="opacity-40">·</span>
                                  <span className="font-bold">{effectiveMaxStayDays} days</span>
                                </>
                              )}
                              {isBoosted && (
                                <>
                                  <span className="opacity-40">·</span>
                                  <span className="line-through opacity-60 text-[11px]">
                                    {VISA_CATEGORIES[baselineRule.status]?.shortLabel}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Boosted Attribution or Almost-Unlocked Hint */}
                            {isBoosted && unlockingDoc && (
                              <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-500 dark:text-amber-300">
                                <Sparkles className="w-3 h-3 shrink-0" />
                                <span className="truncate">Unlocked by {unlockingDoc.shortTitle}</span>
                              </div>
                            )}
                            {!isBoosted && unmetBoosterHints.length > 0 && (
                              <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-500">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span className="truncate">Qualifier needed on held visa</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Status Pill + Chevron */}
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusPill resolved={item} size="sm" />
                          <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'compare' && (
            <CompareTabView
              selectedPassports={selectedPassports}
              heldBoosters={heldBoosters}
              resolvedList={resolvedList}
              onSelectDestination={(res) => setActiveDetailResolved(res)}
              onOpenBoosterManager={() => setShowBoosterModal(true)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'trip' && (
            <TripPlannerTabView
              tripStops={tripStops}
              onAddStop={handleAddTripStop}
              onRemoveStop={handleRemoveTripStop}
              onUpdateStopDays={handleUpdateStopDays}
              resolvedMap={resolvedMap}
              onSelectDestination={(res) => setActiveDetailResolved(res)}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">Traveler Profile & Engine Settings</h2>
                <p className="text-xs sm:text-sm opacity-75">
                  Configure your passports, third-country cascade visas, and display preferences.
                </p>
              </div>

              {/* Passports Card */}
              <div
                className="p-5 rounded-3xl border space-y-4"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(34,26,58,0.12)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-base">Held Passports (Max 2)</div>
                  <button
                    onClick={() => setShowPassportModal(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: BRAND.royalPurple }}
                  >
                    Change Passports
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPassports.map((p, idx) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border flex items-center gap-3"
                      style={{
                        borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(34,26,58,0.12)',
                      }}
                    >
                      <FlagBadge isoCode={p.id} size={42} darkMode={darkMode} />
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
                          {idx === 0 ? 'Primary Passport' : 'Second Passport'}
                        </div>
                        <div className="font-bold text-sm">{p.name} ({p.id})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Held Booster Documents Card */}
              <div
                className="p-5 rounded-3xl border space-y-4"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(34,26,58,0.12)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-base">Third-Country Booster Visas & Residence Cards</div>
                    <p className="text-xs opacity-70">
                      Toggle whether each visa is Multiple-Entry, Used at least once, and its remaining validity.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBoosterModal(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: BRAND.sunsetOrange }}
                  >
                    Manage Visas ({heldBoosters.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {heldBoosters.map((h) => {
                    const meta = BOOSTER_DOC_KINDS.find((d) => d.id === h.docKind);
                    if (!meta) return null;
                    return (
                      <div
                        key={h.docKind}
                        className="p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
                        style={{
                          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(34,26,58,0.1)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <FlagBadge isoCode={meta.flagCode} size={36} darkMode={darkMode} />
                          <div>
                            <div className="font-bold text-sm">{meta.title}</div>
                            <div className="text-xs opacity-75">
                              {meta.isResidence
                                ? `Residence Permit · ${h.remainingValidityDays}d+ validity`
                                : `${h.isMultipleEntry ? 'Multiple-Entry' : 'Single-Entry'} · ${
                                    h.hasBeenUsedToEnterIssuer ? 'Used to enter issuer' : 'Unused'
                                  } · ${h.remainingValidityDays}d validity`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleBoosterDoc(h.docKind)}
                          className="text-xs font-bold text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Planning Disclaimer Banner */}
              <div
                className="p-5 rounded-3xl border space-y-2"
                style={{
                  backgroundColor: darkMode ? 'rgba(239, 125, 60, 0.1)' : 'rgba(239, 125, 60, 0.08)',
                  borderColor: 'rgba(239, 125, 60, 0.35)',
                }}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm text-orange-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important Border & Airline Timatic Disclaimer</span>
                </div>
                <p className="text-xs leading-relaxed opacity-85">
                  Status depends on airline boarding checks (IATA Timatic) and border officer discretion — this is structured planning data, not a visa. Dataset snapshot verified <strong>2026-09-25</strong>. Always confirm physical sticker vs. eVisa requirements with the destination’s Ministry of Foreign Affairs before booking non-refundable travel.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Bottom iOS-Styled Tab Navigation Bar */}
        <nav
          className={`${
            iphoneFrameMode ? 'absolute' : 'fixed'
          } bottom-0 left-0 right-0 z-30 backdrop-blur-xl border-t px-4 py-2`}
          style={{
            backgroundColor: darkMode ? 'rgba(20, 10, 40, 0.92)' : 'rgba(251, 249, 255, 0.94)',
            borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(34,26,58,0.12)',
          }}
        >
          <div className="max-w-xl mx-auto grid grid-cols-4 gap-2">
            {[
              { id: 'explorer', label: 'Explore', icon: Compass, badge: counts.easy },
              { id: 'compare', label: 'Compare', icon: ArrowLeftRight, badge: counts.boosted },
              { id: 'trip', label: 'Trip Planner', icon: Plane, badge: tripStops.length },
              { id: 'profile', label: 'Profile', icon: UserCheck, badge: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
                    isActive ? 'font-extrabold' : 'opacity-65 hover:opacity-100 font-medium'
                  }`}
                  style={{
                    color: isActive ? BRAND.sunsetOrange : undefined,
                  }}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {tab.badge !== null && tab.badge > 0 && (
                      <span
                        className="absolute -top-1.5 -right-3.5 px-1.5 py-0.2 rounded-full text-[9px] font-black text-white"
                        style={{ backgroundColor: isActive ? BRAND.sunsetOrange : BRAND.royalPurple }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] mt-1">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {activeDetailResolved && (
          <CountryDetailModal
            resolved={activeDetailResolved}
            onClose={() => setActiveDetailResolved(null)}
            onAddToTrip={(iso) => {
              if (!tripStops.some((s) => s.iso === iso)) {
                handleAddTripStop(iso);
              }
            }}
            isInTrip={tripStops.some((s) => s.iso === activeDetailResolved.destination.id)}
            onOpenBoosterManager={() => setShowBoosterModal(true)}
            darkMode={darkMode}
          />
        )}

        {showPassportModal && (
          <PassportPickerModal
            selectedPassports={selectedPassports}
            onTogglePassport={handleTogglePassport}
            onClose={() => setShowPassportModal(false)}
            darkMode={darkMode}
          />
        )}

        {showBoosterModal && (
          <BoosterManagerModal
            heldBoosters={heldBoosters}
            onToggleBoosterDoc={handleToggleBoosterDoc}
            onUpdateBoosterQualifier={handleUpdateBoosterQualifier}
            onClose={() => setShowBoosterModal(false)}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}
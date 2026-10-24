const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('scratch/build_db.js', 'utf8');
const match = content.match(/const rawPlayers = (\[[\s\S]*?\]);\s*console\.log/);
if (!match) {
  console.error('Failed to match raw players');
  process.exit(1);
}

const rawPlayers = eval(match[1]);

const sections = [
  { pos: 'GK', count: 40 },
  { pos: 'RB', count: 36 },
  { pos: 'CB', count: 60 },
  { pos: 'LB', count: 36 },
  { pos: 'CDM', count: 40 },
  { pos: 'CM', count: 64 },
  { pos: 'RW', count: 40 },
  { pos: 'LW', count: 40 },
  { pos: 'ST', count: 60 }
];

function generateStats(pos, rating) {
  const base = rating;
  switch (pos) {
    case 'GK':
      return {
        pace: Math.max(45, Math.min(65, Math.round(base * 0.6))),
        shooting: Math.max(20, Math.min(40, Math.round(base * 0.3))),
        passing: Math.max(65, Math.min(92, Math.round(base * 0.85))),
        dribbling: Math.max(45, Math.min(70, Math.round(base * 0.55))),
        defending: Math.max(85, Math.min(96, Math.round(base * 0.98))),
        physical: Math.max(80, Math.min(94, Math.round(base * 0.94)))
      };
    case 'RB':
    case 'LB':
      return {
        pace: Math.max(82, Math.min(97, Math.round(base * 0.98))),
        shooting: Math.max(60, Math.min(84, Math.round(base * 0.75))),
        passing: Math.max(76, Math.min(92, Math.round(base * 0.88))),
        dribbling: Math.max(78, Math.min(90, Math.round(base * 0.89))),
        defending: Math.max(78, Math.min(92, Math.round(base * 0.92))),
        physical: Math.max(78, Math.min(90, Math.round(base * 0.90)))
      };
    case 'CB':
      return {
        pace: Math.max(70, Math.min(88, Math.round(base * 0.85))),
        shooting: Math.max(40, Math.min(68, Math.round(base * 0.55))),
        passing: Math.max(68, Math.min(86, Math.round(base * 0.80))),
        dribbling: Math.max(65, Math.min(80, Math.round(base * 0.76))),
        defending: Math.max(85, Math.min(97, Math.round(base * 1.02))),
        physical: Math.max(84, Math.min(96, Math.round(base * 0.99)))
      };
    case 'CDM':
      return {
        pace: Math.max(68, Math.min(84, Math.round(base * 0.82))),
        shooting: Math.max(65, Math.min(82, Math.round(base * 0.78))),
        passing: Math.max(80, Math.min(94, Math.round(base * 0.94))),
        dribbling: Math.max(76, Math.min(88, Math.round(base * 0.88))),
        defending: Math.max(86, Math.min(95, Math.round(base * 0.99))),
        physical: Math.max(84, Math.min(95, Math.round(base * 0.97)))
      };
    case 'CM':
      return {
        pace: Math.max(72, Math.min(88, Math.round(base * 0.86))),
        shooting: Math.max(75, Math.min(91, Math.round(base * 0.89))),
        passing: Math.max(84, Math.min(97, Math.round(base * 1.02))),
        dribbling: Math.max(82, Math.min(96, Math.round(base * 0.98))),
        defending: Math.max(65, Math.min(84, Math.round(base * 0.80))),
        physical: Math.max(72, Math.min(88, Math.round(base * 0.85)))
      };
    case 'RW':
    case 'LW':
      return {
        pace: Math.max(88, Math.min(98, Math.round(base * 1.02))),
        shooting: Math.max(80, Math.min(96, Math.round(base * 0.95))),
        passing: Math.max(80, Math.min(94, Math.round(base * 0.92))),
        dribbling: Math.max(88, Math.min(98, Math.round(base * 1.02))),
        defending: Math.max(35, Math.min(60, Math.round(base * 0.50))),
        physical: Math.max(68, Math.min(84, Math.round(base * 0.78)))
      };
    case 'ST':
      return {
        pace: Math.max(80, Math.min(97, Math.round(base * 0.96))),
        shooting: Math.max(88, Math.min(98, Math.round(base * 1.04))),
        passing: Math.max(72, Math.min(88, Math.round(base * 0.84))),
        dribbling: Math.max(80, Math.min(95, Math.round(base * 0.93))),
        defending: Math.max(35, Math.min(55, Math.round(base * 0.48))),
        physical: Math.max(78, Math.min(94, Math.round(base * 0.92)))
      };
    default:
      return { pace: 80, shooting: 80, passing: 80, dribbling: 80, defending: 80, physical: 80 };
  }
}

const sampleImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80'
];

let globalIdx = 0;
const processedPlayers = [];

for (const sec of sections) {
  for (let i = 0; i < sec.count; i++) {
    const raw = rawPlayers[globalIdx];
    if (!raw) {
      console.error(`Ran out of players at section ${sec.pos}, index ${i}`);
      break;
    }

    const cleanId = `${raw.era === 'legend' ? 'leg' : 'mod'}_${sec.pos.toLowerCase()}_${raw.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${globalIdx}`;
    const stats = generateStats(sec.pos, raw.rat);
    const img = sampleImages[globalIdx % sampleImages.length];

    processedPlayers.push({
      id: cleanId,
      name: raw.name,
      nationality: raw.nat,
      flag: raw.flag,
      primaryPosition: sec.pos,
      secondaryPositions: [],
      era: raw.era,
      rating: raw.rat,
      image: img,
      clubOrIcon: raw.club,
      description: `${raw.name} (${raw.nat}) - ${raw.club}. Rating: ${raw.rat}.`,
      darijaTag: raw.tag,
      stats,
      auctionEligible: true,
      secretEligible: true
    });

    globalIdx++;
  }
}

console.log(`Generated ${processedPlayers.length} typed players.`);

const tsOutput = `import type { Player } from '../types';

export const PLAYERS_DB: Player[] = ${JSON.stringify(processedPlayers, null, 2)};
`;

fs.writeFileSync('src/data/players.ts', tsOutput, 'utf8');
console.log('Successfully wrote src/data/players.ts');

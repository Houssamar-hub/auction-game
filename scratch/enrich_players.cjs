const fs = require('fs');
const path = require('path');

// Read existing players from src/data/players.ts
const content = fs.readFileSync('src/data/players.ts', 'utf8');
const match = content.match(/export const PLAYERS_DB: Player\[\] = (\[[\s\S]*?\]);\s*$/);

if (!match) {
  console.error('Failed to match PLAYERS_DB');
  process.exit(1);
}

const existingPlayers = eval(match[1]);
console.log('Existing players count:', existingPlayers.length);

// Cult / 3ayanin / Funny / Mid-tier players for pure luck (Zahr)
const cultPlayers = [
  // GK
  { name: 'Loris Karius', nat: 'Germany', flag: '🇩🇪', pos: 'GK', era: 'modern', rat: 76, club: 'Ex-Liverpool', tag: 'كاريوس ومول زلة فينال كييف الشهيرة 😅' },
  { name: 'Khalid Askri', nat: 'Morocco', flag: '🇲🇦', pos: 'GK', era: 'legend', rat: 78, club: 'Raja Casablanca Icon', tag: 'خالد العسكري ومول لقطة البيلانتي والهروب من التيران 😂' },
  { name: 'Massimo Taibi', nat: 'Italy', flag: '🇮🇹', pos: 'GK', era: 'legend', rat: 75, club: 'Man United 1999', tag: 'تايبي والهدف اللي داز بين رجليه' },
  { name: 'Kepa Arrizabalaga', nat: 'Spain', flag: '🇪🇸', pos: 'GK', era: 'modern', rat: 80, club: 'Bournemouth / Chelsea', tag: 'كيبا اللي رفض يتبدل مع ساري فالفينال' },

  // RB
  { name: 'Carl Jenkinson', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'RB', era: 'modern', rat: 76, club: 'Ex-Arsenal', tag: 'جينكينسون المشجع اللي لعب فالدفاع' },
  { name: 'Bouna Sarr', nat: 'Senegal', flag: '🇸🇳', pos: 'RB', era: 'modern', rat: 75, club: 'Ex-Bayern Munich', tag: 'بونا سار صفقة بايرن ميونخ الغامضة' },
  { name: 'Serge Aurier', nat: 'Ivory Coast', flag: '🇨🇮', pos: 'RB', era: 'modern', rat: 79, club: 'Galatasaray', tag: 'سيرج أورييه وبلنتيات مجانية للخصوم' },

  // CB
  { name: 'Harry Maguire', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'CB', era: 'modern', rat: 80, club: 'Manchester United', tag: 'اللورد ماغواير ملك الميمز والمراوغات العكسية 🗿' },
  { name: 'Shkodran Mustafi', nat: 'Germany', flag: '🇩🇪', pos: 'CB', era: 'modern', rat: 77, club: 'Ex-Arsenal', tag: 'موستافي ورفع اليد لطلب التسلل بلا فايدة' },
  { name: 'Titus Bramble', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'CB', era: 'legend', rat: 75, club: 'Newcastle / Wigan', tag: 'تيتوس برامبل أسطورة الأخطاء الكوميدية' },
  { name: 'Djimi Traoré', nat: 'Mali', flag: '🇲🇱', pos: 'CB', era: 'legend', rat: 76, club: 'Liverpool 2005', tag: 'دجيمي تراوري بطل أوروبا ومول الأوتوجول الشهير' },
  { name: 'Phil Jones', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'CB', era: 'modern', rat: 76, club: 'Ex-Man United', tag: 'فيل جونز والزحف بالرأس وتعبيرات الوجه الخارقة 😂' },
  { name: 'Eric Bailly', nat: 'Ivory Coast', flag: '🇨🇮', pos: 'CB', era: 'modern', rat: 78, club: 'Villarreal', tag: 'إريك بايلي والتاكلينغات الانتحارية العجيبة' },

  // LB
  { name: 'Alberto Moreno', nat: 'Spain', flag: '🇪🇸', pos: 'LB', era: 'modern', rat: 77, club: 'Como / Ex-Liverpool', tag: 'ألبرتو مورينو وهفوات نهائي بازل 2016' },
  { name: 'Aly Cissokho', nat: 'France', flag: '🇫🇷', pos: 'LB', era: 'modern', rat: 76, club: 'Ex-Liverpool', tag: 'سيسوكو ومقطع اليوتيوب الأسطوري الشهير' },
  { name: 'Kieran Gibbs', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'LB', era: 'modern', rat: 77, club: 'Ex-Arsenal', tag: 'كيران جيبس اللي طردو الحكم فالغلط بلاصة تشامبرلين' },

  // CDM
  { name: 'Marouane Fellaini', nat: 'Belgium', flag: '🇧🇪', pos: 'CDM', era: 'modern', rat: 80, club: 'Ex-Man United', tag: 'فيلايني والكوع الشهير والضربات الرأسية الشوكية' },
  { name: 'Tiémoué Bakayoko', nat: 'France', flag: '🇫🇷', pos: 'CDM', era: 'modern', rat: 77, club: 'PAOK / Ex-Chelsea', tag: 'باكايوكو وتمريرات للخصم مباشرة' },
  { name: 'Morgan Schneiderlin', nat: 'France', flag: '🇫🇷', pos: 'CDM', era: 'modern', rat: 77, club: 'Ex-Man United', tag: 'شنيدرلين واختفاء تام في خط الوسط' },

  // CM
  { name: 'Jesse Lingard', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'CM', era: 'modern', rat: 79, club: 'FC Seoul / Ex-Man United', tag: 'جينغلز لينغاردينهو والرقصات فالأولد ترافورد 🕺' },
  { name: 'Anderson', nat: 'Brazil', flag: '🇧🇷', pos: 'CM', era: 'legend', rat: 78, club: 'Man United 2008', tag: 'أندرسون الفتى الذهبي اللي ربح رونالدينيو وما ماركاش' },
  { name: 'Tom Cleverley', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'CM', era: 'modern', rat: 76, club: 'Watford / Ex-United', tag: 'كليفرلي وعريضة إبعاده الشهيرة من الجماهير' },

  // RW
  { name: 'Antony', nat: 'Brazil', flag: '🇧🇷', pos: 'RW', era: 'modern', rat: 79, club: 'Manchester United', tag: 'أنتوني ودورة 360 درجة فالهواء بدون حتى هدف 🌀' },
  { name: 'Nicolas Pépé', nat: 'Ivory Coast', flag: '🇨🇮', pos: 'RW', era: 'modern', rat: 79, club: 'Villarreal / Ex-Arsenal', tag: 'نيكولا بيبي مول 80 مليون يورو اللي صدقات فاشوش' },
  { name: 'Adama Traoré', nat: 'Spain', flag: '🇪🇸', pos: 'RW', era: 'modern', rat: 79, club: 'Fulham', tag: 'أداما الزيت وعضلات الملاكمة بدون فينيس فالتيران' },

  // LW
  { name: 'Bébé', nat: 'Cape Verde', flag: '🇨🇻', pos: 'LW', era: 'modern', rat: 75, club: 'Racing Ferrol / Ex-United', tag: 'بيبي اللي شراه فيرغسون بلا ما يشوفو يلعب حتى ثانية 😂' },
  { name: 'Yannick Bolasie', nat: 'DR Congo', flag: '🇨🇩', pos: 'LW', era: 'modern', rat: 78, club: 'Criciúma / Ex-Palace', tag: 'بولاسي ومراوغة 360 الشهيرة على خط التماس' },
  { name: 'Gervinho', nat: 'Ivory Coast', flag: '🇨🇮', pos: 'LW', era: 'legend', rat: 79, club: 'Arsenal / Roma Icon', tag: 'جيرفينهو والجبهة العريضة وتضييع الأهداف السهلة' },

  // ST
  { name: 'Lord Bendtner', nat: 'Denmark', flag: '🇩🇰', pos: 'ST', era: 'legend', rat: 78, club: 'Arsenal Cult Hero', tag: 'اللورد بيندتنر أعظم مهاجم في الكون بمخيلته 👑' },
  { name: 'Ali Dia', nat: 'Senegal', flag: '🇸🇳', pos: 'ST', era: 'legend', rat: 65, club: 'Southampton 1996 Legend', tag: 'علي ديا أعظم نصاب فتاريخ البريميرليغ لعب 53 دقيقة وخرج 😂' },
  { name: 'Mario Balotelli', nat: 'Italy', flag: '🇮🇹', pos: 'ST', era: 'modern', rat: 80, club: 'Genoa / Ex-City/Milan', tag: 'سوبر ماريو بالوتيلي وقميص Why Always Me والألعاب النارية فالحمام' },
  { name: 'Wout Weghorst', nat: 'Netherlands', flag: '🇳🇱', pos: 'ST', era: 'modern', rat: 79, club: 'Ajax / Ex-Man United', tag: 'فيخهورست ومول كلمة ميسي الشهيرة: كوي ميرا بوبو!' },
  { name: 'Marouane Chamakh', nat: 'Morocco', flag: '🇲🇦', pos: 'ST', era: 'legend', rat: 81, club: 'Bordeaux / Arsenal Icon', tag: 'مروان الشماخ والجيلاتين الشهير وأيام بوردو الذهبية' },
  { name: 'Andy Carroll', nat: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'ST', era: 'modern', rat: 77, club: 'Bordeaux / Ex-Liverpool', tag: 'آندي كارول بـ 35 مليون باوند والرأسيات العشوائية' }
];

function generateStats(pos, rating) {
  const base = rating;
  switch (pos) {
    case 'GK':
      return { pace: 45, shooting: 20, passing: 65, dribbling: 45, defending: Math.max(70, rating), physical: 75 };
    case 'RB':
    case 'LB':
      return { pace: Math.max(75, Math.min(94, Math.round(base * 1.05))), shooting: 55, passing: 68, dribbling: 72, defending: Math.max(68, rating), physical: 74 };
    case 'CB':
      return { pace: Math.max(60, Math.min(80, Math.round(base * 0.85))), shooting: 35, passing: 60, dribbling: 55, defending: Math.max(72, rating), physical: 80 };
    case 'CDM':
      return { pace: 65, shooting: 60, passing: 70, dribbling: 68, defending: Math.max(72, rating), physical: 82 };
    case 'CM':
      return { pace: 68, shooting: 68, passing: 75, dribbling: 74, defending: 65, physical: 72 };
    case 'RW':
    case 'LW':
      return { pace: Math.max(82, Math.min(95, Math.round(base * 1.1))), shooting: 72, passing: 70, dribbling: 80, defending: 35, physical: 68 };
    case 'ST':
      return { pace: Math.max(72, Math.min(90, Math.round(base * 0.98))), shooting: Math.max(75, rating), passing: 65, dribbling: 74, defending: 35, physical: 78 };
    default:
      return { pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70 };
  }
}

const sampleImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=400&q=80'
];

const newPlayers = [...existingPlayers];

cultPlayers.forEach((cp, idx) => {
  const cleanId = `cult_${cp.pos.toLowerCase()}_${cp.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${idx}`;
  const stats = generateStats(cp.pos, cp.rat);
  newPlayers.push({
    id: cleanId,
    name: cp.name,
    nationality: cp.nat,
    flag: cp.flag,
    primaryPosition: cp.pos,
    secondaryPositions: [],
    era: cp.era,
    rating: cp.rat,
    image: sampleImages[idx % sampleImages.length],
    clubOrIcon: cp.club,
    description: `${cp.name} (${cp.nat}) - ${cp.club}. طاقة: ${cp.rat}.`,
    darijaTag: cp.tag,
    stats,
    auctionEligible: true,
    secretEligible: true
  });
});

console.log('Total players with cult/funny pros:', newPlayers.length);

const tsOutput = `import type { Player } from '../types';

export const PLAYERS_DB: Player[] = ${JSON.stringify(newPlayers, null, 2)};
`;

fs.writeFileSync('src/data/players.ts', tsOutput, 'utf8');
console.log('Successfully updated src/data/players.ts with full spectrum of players!');

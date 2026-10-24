export type Position = 
  | 'GK' 
  | 'RB' 
  | 'CB' 
  | 'LB' 
  | 'CDM' 
  | 'CM' 
  | 'CAM' 
  | 'RW' 
  | 'LW' 
  | 'ST';

export type PositionSlot = 
  | 'GK' 
  | 'RB' 
  | 'CB1' 
  | 'CB2' 
  | 'LB' 
  | 'CDM' 
  | 'CM1' 
  | 'CM2' 
  | 'RW' 
  | 'LW' 
  | 'ST';

export type Era = 'legend' | 'modern';

export type GameMode = 'legends' | 'modern' | 'mixed';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  nationality: string;
  flag: string;
  primaryPosition: Position;
  secondaryPositions: Position[];
  era: Era;
  rating: number; // 80 - 99
  image: string;
  clubOrIcon: string;
  description: string;
  darijaTag: string;
  stats: PlayerStats;
  auctionEligible: boolean;
  secretEligible: boolean;
}

export interface BidRecord {
  id: string;
  bidderId: 'player1' | 'player2';
  bidderName: string;
  amount: number;
  isPass: boolean;
  timestamp: string;
  round: number;
}

export interface AcquiredPlayer {
  player: Player;
  cost: number;
  round: number;
  isSecret: boolean;
  slotAssigned: PositionSlot;
}

export interface TeamState {
  id: 'player1' | 'player2';
  name: string;
  budget: number; // Starting 100 M€
  startingLineup: Record<PositionSlot, Player | null>;
  bench: Player[];
  acquiredHistory: AcquiredPlayer[];
}

export type GamePhase = 'setup' | 'auction' | 'reveal' | 'pitch' | 'gameover';

export interface RoundResult {
  round: number;
  positionTarget: PositionSlot;
  auctionPlayer: Player;
  secretPlayer: Player;
  winnerId: 'player1' | 'player2';
  winningBid: number;
  loserId: 'player1' | 'player2';
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  allowCamAsCm: boolean;
  player1: TeamState;
  player2: TeamState;
  currentRound: number;
  currentAuctionPlayer: Player | null;
  currentSecretPlayer: Player | null;
  currentPositionTarget: PositionSlot;
  currentBid: number;
  highestBidderId: 'player1' | 'player2' | null;
  currentTurn: 'player1' | 'player2';
  firstBidderThisRound: 'player1' | 'player2';
  consecutivePasses: number;
  bidHistory: BidRecord[];
  allRoundsHistory: RoundResult[];
  usedPlayerIds: string[];
  lastRoundResult: RoundResult | null;
}

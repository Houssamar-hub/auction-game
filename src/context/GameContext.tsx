import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  GameState, 
  GameMode, 
  PositionSlot, 
  Position, 
  Player, 
  TeamState, 
  BidRecord, 
  RoundResult 
} from '../types';
import { PLAYERS_DB } from '../data/players';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'FOOTBALL_AUCTION_GAME_STATE_V1';

const INITIAL_TEAM = (id: 'player1' | 'player2', name: string): TeamState => ({
  id,
  name,
  budget: 100,
  startingLineup: {
    GK: null,
    RB: null,
    CB1: null,
    CB2: null,
    LB: null,
    CDM: null,
    CM1: null,
    CM2: null,
    RW: null,
    LW: null,
    ST: null,
  },
  bench: [],
  acquiredHistory: [],
});

const DEFAULT_STATE: GameState = {
  phase: 'setup',
  mode: 'mixed',
  allowCamAsCm: true,
  player1: INITIAL_TEAM('player1', 'Houssam'),
  player2: INITIAL_TEAM('player2', 'Ayoub'),
  currentRound: 0,
  currentAuctionPlayer: null,
  currentSecretPlayer: null,
  currentPositionTarget: 'GK',
  currentBid: 0,
  highestBidderId: null,
  currentTurn: 'player1',
  firstBidderThisRound: 'player1',
  consecutivePasses: 0,
  bidHistory: [],
  allRoundsHistory: [],
  usedPlayerIds: [],
  lastRoundResult: null,
};

interface GameContextType {
  state: GameState;
  hasSavedGame: boolean;
  startGame: (p1Name: string, p2Name: string, mode: GameMode, allowCam: boolean) => void;
  placeBid: (amount: number) => { success: boolean; message?: string };
  passBid: () => void;
  proceedFromReveal: () => void;
  restartGame: () => void;
  loadSavedGame: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Check saved game on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.currentRound > 0) {
          setHasSavedGame(true);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save on state change (if not in setup)
  useEffect(() => {
    if (state.phase !== 'setup') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error('Failed to save game state to local storage', err);
      }
    }
  }, [state]);

  const toggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  const loadSavedGame = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: GameState = JSON.parse(saved);
        setState(parsed);
      }
    } catch {
      // Ignore
    }
  };

  const restartGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
    setHasSavedGame(false);
  };

  // True Fisher-Yates shuffle
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Helper to determine which slot is target next
  const determineNextPositionTarget = (p1: TeamState, p2: TeamState): { slot: PositionSlot; pos: Position } => {
    const allSlots: { slot: PositionSlot; pos: Position }[] = [
      { slot: 'ST', pos: 'ST' },
      { slot: 'RW', pos: 'RW' },
      { slot: 'LW', pos: 'LW' },
      { slot: 'CM1', pos: 'CM' },
      { slot: 'CM2', pos: 'CM' },
      { slot: 'CDM', pos: 'CDM' },
      { slot: 'CB1', pos: 'CB' },
      { slot: 'CB2', pos: 'CB' },
      { slot: 'RB', pos: 'RB' },
      { slot: 'LB', pos: 'LB' },
      { slot: 'GK', pos: 'GK' },
    ];

    // Priority 1: Slots missing in BOTH teams
    const missingBoth = allSlots.filter(s => p1.startingLineup[s.slot] === null && p2.startingLineup[s.slot] === null);
    if (missingBoth.length > 0) {
      return missingBoth[Math.floor(Math.random() * missingBoth.length)];
    }

    // Priority 2: Slots missing in EITHER team
    const missingEither = allSlots.filter(s => p1.startingLineup[s.slot] === null || p2.startingLineup[s.slot] === null);
    if (missingEither.length > 0) {
      return missingEither[Math.floor(Math.random() * missingEither.length)];
    }

    // Otherwise random from 4-3-3 slots
    return allSlots[Math.floor(Math.random() * allSlots.length)];
  };

  // Helper to pick candidate player (STRICT SAME POSITION: pos)
  const selectPlayersForRound = (
    pos: Position,
    mode: GameMode,
    usedIds: string[]
  ): { auctionPlayer: Player; secretPlayer: Player } | null => {
    // STRICT position match: primaryPosition === pos ensures both auction and secret player have the EXACT same position
    let eligible = PLAYERS_DB.filter(p => {
      if (usedIds.includes(p.id)) return false;
      if (mode === 'legends' && p.era !== 'legend') return false;
      if (mode === 'modern' && p.era !== 'modern') return false;
      return p.primaryPosition === pos;
    });

    if (eligible.length < 2) {
      // Fallback: relax era restriction if pool is low in this era
      eligible = PLAYERS_DB.filter(p => {
        if (usedIds.includes(p.id)) return false;
        return p.primaryPosition === pos;
      });
      if (eligible.length < 2) {
        return null;
      }
    }

    // In mixed mode: prioritize classic legends ("la3ab l9dam ktar") with 65% weight
    let candidatePool = [...eligible];
    if (mode === 'mixed') {
      const legends = eligible.filter(p => p.era === 'legend');
      const modern = eligible.filter(p => p.era === 'modern');
      // If we have enough of both, weigh legends 65%
      if (legends.length > 0 && Math.random() < 0.65) {
        candidatePool = [...legends, ...modern];
      }
    }

    const shuffled = shuffleArray(candidatePool);
    const auctionPlayer = shuffled[0];

    // Secret player is pure luck ("howa o zahro"): could be a 98 beast or an 75-80 cult hero!
    const remainingForSecret = shuffleArray(eligible.filter(p => p.id !== auctionPlayer.id));
    const secretPlayer = remainingForSecret[0];

    return {
      auctionPlayer,
      secretPlayer,
    };
  };

  // Check if both teams have full 11
  const isFormationComplete = (team: TeamState): boolean => {
    const slots: PositionSlot[] = ['GK', 'RB', 'CB1', 'CB2', 'LB', 'CDM', 'CM1', 'CM2', 'RW', 'LW', 'ST'];
    return slots.every(slot => team.startingLineup[slot] !== null);
  };

  // Start new game
  const startGame = (p1Name: string, p2Name: string, mode: GameMode, allowCam: boolean) => {
    const player1 = INITIAL_TEAM('player1', p1Name.trim() || 'Houssam');
    const player2 = INITIAL_TEAM('player2', p2Name.trim() || 'Ayoub');

    const nextTarget = determineNextPositionTarget(player1, player2);
    const selected = selectPlayersForRound(nextTarget.pos, mode, []);

    if (!selected) {
      alert('Error: Not enough players in database for selected mode.');
      return;
    }

    sound.playWhistle();

    setState({
      phase: 'auction',
      mode,
      allowCamAsCm: allowCam,
      player1,
      player2,
      currentRound: 1,
      currentAuctionPlayer: selected.auctionPlayer,
      currentSecretPlayer: selected.secretPlayer,
      currentPositionTarget: nextTarget.slot,
      currentBid: 0,
      highestBidderId: null,
      currentTurn: 'player1',
      firstBidderThisRound: 'player1',
      consecutivePasses: 0,
      bidHistory: [],
      allRoundsHistory: [],
      usedPlayerIds: [selected.auctionPlayer.id, selected.secretPlayer.id],
      lastRoundResult: null,
    });
  };

  // Helper to assign a player to squad slot without exceeding 11
  const assignPlayerToTeam = (
    team: TeamState, 
    player: Player, 
    cost: number, 
    isSecret: boolean, 
    round: number
  ): { updatedTeam: TeamState; assignedSlot: PositionSlot } => {
    const pos = player.primaryPosition;
    let targetSlot: PositionSlot = 'ST';

    // Map position to 4-3-3 slot
    if (pos === 'GK') targetSlot = 'GK';
    else if (pos === 'RB') targetSlot = 'RB';
    else if (pos === 'LB') targetSlot = 'LB';
    else if (pos === 'CDM') targetSlot = 'CDM';
    else if (pos === 'RW') targetSlot = 'RW';
    else if (pos === 'LW') targetSlot = 'LW';
    else if (pos === 'ST') targetSlot = 'ST';
    else if (pos === 'CB') {
      if (team.startingLineup.CB1 === null) targetSlot = 'CB1';
      else if (team.startingLineup.CB2 === null) targetSlot = 'CB2';
      else targetSlot = 'CB1'; // Replace CB1
    } else if (pos === 'CM' || pos === 'CAM') {
      if (team.startingLineup.CM1 === null) targetSlot = 'CM1';
      else if (team.startingLineup.CM2 === null) targetSlot = 'CM2';
      else targetSlot = 'CM1'; // Replace CM1
    }

    // No bench allowed: exactly 11 starting players
    const updatedStartingLineup = {
      ...team.startingLineup,
      [targetSlot]: player,
    };

    const updatedAcquired = [
      ...team.acquiredHistory,
      {
        player,
        cost,
        round,
        isSecret,
        slotAssigned: targetSlot,
      },
    ];

    const updatedTeam: TeamState = {
      ...team,
      budget: team.budget - cost,
      startingLineup: updatedStartingLineup,
      bench: [],
      acquiredHistory: updatedAcquired,
    };

    return { updatedTeam, assignedSlot: targetSlot };
  };

  // Place a bid
  const placeBid = (amount: number): { success: boolean; message?: string } => {
    if (state.phase !== 'auction') return { success: false, message: 'Auction is not active' };

    const bidderId = state.currentTurn;
    const bidder = bidderId === 'player1' ? state.player1 : state.player2;

    // Validation 1: Opening bid must be at least 1M€
    if (state.currentBid === 0 && amount < 1) {
      return { success: false, message: 'Opening bid must be at least 1 M€ / أقل ثمن للبيد هو 1 مليون يورو' };
    }

    // Validation 2: Every new bid must be higher than current bid
    if (amount <= state.currentBid) {
      return { success: false, message: `Bid must be higher than current bid (${state.currentBid} M€)` };
    }

    // Validation 3: Cannot exceed player remaining budget
    if (amount > bidder.budget) {
      return { success: false, message: `${bidder.name} does not have enough budget! / ميزانية غير كافية` };
    }

    sound.playBid();

    const newRecord: BidRecord = {
      id: `${Date.now()}-${Math.random()}`,
      bidderId,
      bidderName: bidder.name,
      amount,
      isPass: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      round: state.currentRound,
    };

    const nextTurn = bidderId === 'player1' ? 'player2' : 'player1';

    setState(prev => ({
      ...prev,
      currentBid: amount,
      highestBidderId: bidderId,
      currentTurn: nextTurn,
      consecutivePasses: 0,
      bidHistory: [newRecord, ...prev.bidHistory],
    }));

    return { success: true };
  };

  // Pass turn
  const passBid = () => {
    if (state.phase !== 'auction') return;

    sound.playPass();

    const passerId = state.currentTurn;
    const passer = passerId === 'player1' ? state.player1 : state.player2;
    const otherId = passerId === 'player1' ? 'player2' : 'player1';

    const passRecord: BidRecord = {
      id: `${Date.now()}-${Math.random()}`,
      bidderId: passerId,
      bidderName: passer.name,
      amount: state.currentBid,
      isPass: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      round: state.currentRound,
    };

    // Case 1: Both players passed before any valid bid was made
    if (state.highestBidderId === null && (state.consecutivePasses + 1 >= 2)) {
      // Player returns to pool, select another player
      const nextTarget = determineNextPositionTarget(state.player1, state.player2);
      const selected = selectPlayersForRound(nextTarget.pos, state.mode, state.usedPlayerIds);

      if (!selected) {
        alert('All available players evaluated.');
        return;
      }

      setState(prev => ({
        ...prev,
        currentAuctionPlayer: selected.auctionPlayer,
        currentSecretPlayer: selected.secretPlayer,
        currentPositionTarget: nextTarget.slot,
        currentBid: 0,
        highestBidderId: null,
        currentTurn: prev.firstBidderThisRound === 'player1' ? 'player2' : 'player1',
        firstBidderThisRound: prev.firstBidderThisRound === 'player1' ? 'player2' : 'player1',
        consecutivePasses: 0,
        bidHistory: [passRecord, ...prev.bidHistory],
        usedPlayerIds: [...prev.usedPlayerIds, selected.auctionPlayer.id, selected.secretPlayer.id],
      }));
      return;
    }

    // Case 2: One player passed, and there is a highest bidder -> Highest bidder WINS!
    if (state.highestBidderId !== null) {
      const winnerId = state.highestBidderId;
      const loserId = winnerId === 'player1' ? 'player2' : 'player1';
      const winningBid = state.currentBid;

      sound.playGavel();

      const winnerTeam = winnerId === 'player1' ? state.player1 : state.player2;
      const loserTeam = loserId === 'player1' ? state.player1 : state.player2;

      // Assign auction player to winner with cost deducted
      const { updatedTeam: newWinnerTeam } = assignPlayerToTeam(
        winnerTeam,
        state.currentAuctionPlayer!,
        winningBid,
        false,
        state.currentRound
      );

      // Assign secret player to loser for €0
      const { updatedTeam: newLoserTeam } = assignPlayerToTeam(
        loserTeam,
        state.currentSecretPlayer!,
        0,
        true,
        state.currentRound
      );

      const roundResult: RoundResult = {
        round: state.currentRound,
        positionTarget: state.currentPositionTarget,
        auctionPlayer: state.currentAuctionPlayer!,
        secretPlayer: state.currentSecretPlayer!,
        winnerId,
        winningBid,
        loserId,
      };

      const finalPlayer1 = winnerId === 'player1' ? newWinnerTeam : newLoserTeam;
      const finalPlayer2 = winnerId === 'player2' ? newWinnerTeam : newLoserTeam;

      setState(prev => ({
        ...prev,
        phase: 'reveal',
        player1: finalPlayer1,
        player2: finalPlayer2,
        bidHistory: [passRecord, ...prev.bidHistory],
        allRoundsHistory: [roundResult, ...prev.allRoundsHistory],
        lastRoundResult: roundResult,
      }));
      return;
    }

    // Case 3: First player passed before any bid, turn goes to second player
    setState(prev => ({
      ...prev,
      currentTurn: otherId,
      consecutivePasses: prev.consecutivePasses + 1,
      bidHistory: [passRecord, ...prev.bidHistory],
    }));
  };

  // Proceed from Secret Reveal screen to next round or Game Over
  const proceedFromReveal = () => {
    // Check if both teams have full 11
    const p1Complete = isFormationComplete(state.player1);
    const p2Complete = isFormationComplete(state.player2);

    if (p1Complete && p2Complete) {
      sound.playFanfare();
      setState(prev => ({
        ...prev,
        phase: 'gameover',
      }));
      return;
    }

    // Otherwise, prepare next auction round
    const nextRoundNumber = state.currentRound + 1;
    const nextTarget = determineNextPositionTarget(state.player1, state.player2);
    const selected = selectPlayersForRound(nextTarget.pos, state.mode, state.usedPlayerIds);

    if (!selected) {
      // If pool exhausted, complete game
      setState(prev => ({
        ...prev,
        phase: 'gameover',
      }));
      return;
    }

    // Alternate first bidder each round
    const nextFirstBidder = state.firstBidderThisRound === 'player1' ? 'player2' : 'player1';

    sound.playWhistle();

    setState(prev => ({
      ...prev,
      phase: 'auction',
      currentRound: nextRoundNumber,
      currentAuctionPlayer: selected.auctionPlayer,
      currentSecretPlayer: selected.secretPlayer,
      currentPositionTarget: nextTarget.slot,
      currentBid: 0,
      highestBidderId: null,
      currentTurn: nextFirstBidder,
      firstBidderThisRound: nextFirstBidder,
      consecutivePasses: 0,
      bidHistory: [],
      usedPlayerIds: [...prev.usedPlayerIds, selected.auctionPlayer.id, selected.secretPlayer.id],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        state,
        hasSavedGame,
        startGame,
        placeBid,
        passBid,
        proceedFromReveal,
        restartGame,
        loadSavedGame,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

import type { TeamState, PositionSlot } from '../types';

export interface TeamScoreBreakdown {
  startingCount: number;
  averageOvr: number;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  budgetBonus: number;
  totalScore: number;
  unfilledCount: number;
  criteriaDetails: {
    label: string;
    score: number;
    description: string;
  }[];
}

export function calculateTeamRating(team: TeamState): TeamScoreBreakdown {
  const slots: PositionSlot[] = ['GK', 'RB', 'CB1', 'CB2', 'LB', 'CDM', 'CM1', 'CM2', 'RW', 'LW', 'ST'];
  const startingPlayers = slots.map(slot => team.startingLineup[slot]).filter((p): p is NonNullable<typeof p> => p !== null);

  const startingCount = startingPlayers.length;
  const unfilledCount = 11 - startingCount;

  if (startingCount === 0) {
    return {
      startingCount: 0,
      averageOvr: 0,
      attackRating: 0,
      midfieldRating: 0,
      defenseRating: 0,
      budgetBonus: 0,
      totalScore: 0,
      unfilledCount: 11,
      criteriaDetails: [],
    };
  }

  const sumOvr = startingPlayers.reduce((acc, p) => acc + p.rating, 0);
  const averageOvr = Math.round((sumOvr / startingCount) * 10) / 10;

  // Attack: ST, RW, LW
  const attackers = [team.startingLineup.ST, team.startingLineup.RW, team.startingLineup.LW].filter(Boolean);
  const attackRating = attackers.length > 0 
    ? Math.round((attackers.reduce((acc, p) => acc + (p?.rating || 0), 0) / attackers.length) * 10) / 10
    : 0;

  // Midfield: CDM, CM1, CM2
  const midfielders = [team.startingLineup.CDM, team.startingLineup.CM1, team.startingLineup.CM2].filter(Boolean);
  const midfieldRating = midfielders.length > 0
    ? Math.round((midfielders.reduce((acc, p) => acc + (p?.rating || 0), 0) / midfielders.length) * 10) / 10
    : 0;

  // Defense: GK, RB, CB1, CB2, LB
  const defenders = [team.startingLineup.GK, team.startingLineup.RB, team.startingLineup.CB1, team.startingLineup.CB2, team.startingLineup.LB].filter(Boolean);
  const defenseRating = defenders.length > 0
    ? Math.round((defenders.reduce((acc, p) => acc + (p?.rating || 0), 0) / defenders.length) * 10) / 10
    : 0;

  // Financial discipline bonus: 0.05 points per million remaining
  const budgetBonus = Math.round((team.budget * 0.05) * 10) / 10;

  // Total transparent score calculation
  // Base: (Average Starting OVR * 0.70)
  // Balance: (Attack * 0.10 + Midfield * 0.10 + Defense * 0.10)
  // Bonus: budgetBonus
  const totalScore = Math.round(
    ((averageOvr * 0.7) + (attackRating * 0.1) + (midfieldRating * 0.1) + (defenseRating * 0.1) + budgetBonus) * 10
  ) / 10;

  const criteriaDetails = [
    {
      label: 'Average Squad OVR (70%) / معدل طاقة الفريق',
      score: Math.round(averageOvr * 0.7 * 10) / 10,
      description: `Average of 11 players: ${averageOvr}/100`,
    },
    {
      label: 'Attack Potency (10%) / قوة الهجوم',
      score: Math.round(attackRating * 0.1 * 10) / 10,
      description: `ST, RW, LW average: ${attackRating}/100`,
    },
    {
      label: 'Midfield Synergy (10%) / سيطرة خط الوسط',
      score: Math.round(midfieldRating * 0.1 * 10) / 10,
      description: `CDM, CM1, CM2 average: ${midfieldRating}/100`,
    },
    {
      label: 'Defensive Solidity (10%) / صلابة الدفاع والحراسة',
      score: Math.round(defenseRating * 0.1 * 10) / 10,
      description: `GK, RB, CB1, CB2, LB average: ${defenseRating}/100`,
    },
    {
      label: 'Budget Discipline Bonus / مكافأة إدارة الميزانية',
      score: budgetBonus,
      description: `${team.budget} M€ remaining (0.05 pts per M€)`,
    },
  ];

  return {
    startingCount,
    averageOvr,
    attackRating,
    midfieldRating,
    defenseRating,
    budgetBonus,
    totalScore,
    unfilledCount,
    criteriaDetails,
  };
}

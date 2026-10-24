import React, { useState } from 'react';
import type { TeamState, PositionSlot, Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { X } from 'lucide-react';

interface PitchProps {
  team: TeamState;
}

export const Pitch: React.FC<PitchProps> = ({ team }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const lineup = team.startingLineup;

  const filledCount = Object.values(lineup).filter(Boolean).length;
  const startingPlayers = Object.values(lineup).filter((p): p is Player => p !== null);
  const avgOvr = startingPlayers.length > 0 
    ? Math.round((startingPlayers.reduce((sum, p) => sum + p.rating, 0) / startingPlayers.length) * 10) / 10
    : 0;

  // Render individual player node on pitch
  const renderSlotNode = (slot: PositionSlot, label: string) => {
    const player = lineup[slot];

    if (!player) {
      return (
        <div className="flex flex-col items-center justify-center group cursor-default">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed border-white/40 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center transition-all group-hover:border-emerald-400 group-hover:scale-105">
            <span className="text-xs font-bold text-slate-300">{label}</span>
            <span className="text-[10px] text-slate-400">فارغ</span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium mt-1 bg-black/60 px-1.5 py-0.5 rounded">
            {label}
          </span>
        </div>
      );
    }

    const isLegend = player.era === 'legend';
    const isFree = team.acquiredHistory.some(a => a.player.id === player.id && a.isSecret);

    return (
      <div 
        onClick={() => setSelectedPlayer(player)}
        className="flex flex-col items-center justify-center cursor-pointer group transition-transform duration-200 hover:scale-110 relative"
      >
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full p-0.5 border-2 relative shadow-lg ${
          isLegend ? 'border-amber-400 bg-amber-950/80' : 'border-cyan-400 bg-slate-900/80'
        }`}>
          <img
            src={player.image}
            alt={player.name}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full rounded-full object-cover object-top"
          />
          <div className="absolute -top-1 -right-1 bg-black/80 rounded-full px-1 text-[10px] font-black text-amber-400 border border-white/20">
            {player.rating}
          </div>
          {isFree && (
            <div className="absolute -top-1 -left-1 bg-emerald-600 rounded-full px-1 text-[8px] font-black text-white">
              0€
            </div>
          )}
        </div>
        <div className="text-[10px] md:text-xs font-bold text-white mt-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 max-w-[85px] md:max-w-[105px] truncate text-center shadow-md">
          {player.name.split(' ').pop()}
        </div>
        <span className="text-[9px] text-emerald-400 font-extrabold">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">
      {/* Team header summary */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-white/10 rounded-t-2xl p-3 px-4">
        <div>
          <h4 className="font-black text-white text-base md:text-lg tracking-wide flex items-center gap-2">
            <span>{team.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              4-3-3 Formation
            </span>
          </h4>
          <p className="text-xs text-slate-400">
            {filledCount}/11 كوايري • التشكيلة الأساسية 4-3-3 (بدون احتياط)
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">معدل الطاقة / OVR</div>
          <div className="text-xl font-black text-amber-400">{avgOvr > 0 ? avgOvr : '--'}</div>
        </div>
      </div>

      {/* Realistic 4-3-3 Football Pitch */}
      <div className="football-pitch w-full aspect-[3/4] relative rounded-b-2xl overflow-hidden flex flex-col justify-between p-4 border-t-0 select-none">
        {/* Pitch Lines */}
        <div className="absolute inset-2 border-2 pitch-line pointer-events-none rounded-lg" />
        {/* Halfway line */}
        <div className="absolute top-1/2 left-2 right-2 border-b-2 pitch-line pointer-events-none -translate-y-1/2" />
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 pitch-line rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        {/* Top Penalty Box (Opponent) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-t-0 pitch-line pointer-events-none" />
        {/* Bottom Penalty Box (Home) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-b-0 pitch-line pointer-events-none" />
        {/* Goal Area */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-8 border-2 border-b-0 pitch-line pointer-events-none" />

        {/* Row 1: Attack (LW - ST - RW) */}
        <div className="relative z-10 grid grid-cols-3 items-center justify-items-center pt-2">
          {renderSlotNode('LW', 'LW')}
          {renderSlotNode('ST', 'ST')}
          {renderSlotNode('RW', 'RW')}
        </div>

        {/* Row 2: Midfield (CM1 - CDM - CM2) */}
        <div className="relative z-10 grid grid-cols-3 items-center justify-items-center">
          {renderSlotNode('CM1', 'CM/CAM')}
          {renderSlotNode('CDM', 'CDM')}
          {renderSlotNode('CM2', 'CM')}
        </div>

        {/* Row 3: Defense (LB - CB1 - CB2 - RB) */}
        <div className="relative z-10 grid grid-cols-4 items-center justify-items-center pb-1">
          {renderSlotNode('LB', 'LB')}
          {renderSlotNode('CB1', 'CB')}
          {renderSlotNode('CB2', 'CB')}
          {renderSlotNode('RB', 'RB')}
        </div>

        {/* Row 4: Goalkeeper (GK) */}
        <div className="relative z-10 flex justify-center pb-1">
          {renderSlotNode('GK', 'GK')}
        </div>
      </div>



      {/* Player Detail Modal on Click */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-sm w-full">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center border border-white/20 hover:bg-slate-700 shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <PlayerCard player={selectedPlayer} size="lg" showDetails={true} />
          </div>
        </div>
      )}
    </div>
  );
};

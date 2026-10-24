import React, { useState } from 'react';
import type { Player } from '../types';
import { Shield, Sparkles, Award } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  isSecret?: boolean;
  cost?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  size = 'md',
  showDetails = true,
  isSecret = false,
  cost,
}) => {
  const [imgError, setImgError] = useState(false);

  const isLegend = player.era === 'legend';
  
  // Card styling based on era
  const cardBorder = isLegend
    ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/80 via-slate-900/90 to-amber-950/90 shadow-amber-500/20'
    : 'border-cyan-400/80 bg-gradient-to-b from-cyan-950/80 via-slate-900/90 to-blue-950/90 shadow-cyan-500/20';

  const badgeColor = isLegend ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';

  if (size === 'sm') {
    return (
      <div className={`relative flex items-center gap-2 p-2 rounded-xl border backdrop-blur-md shadow-lg ${cardBorder}`}>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative border border-white/20">
          {!imgError ? (
            <img
              src={player.image}
              alt={player.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white/70 bg-gradient-to-br from-slate-700 to-slate-900">
              {player.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0 right-0 text-[10px] bg-black/70 px-0.5 rounded">
            {player.flag}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs truncate text-white">{player.name}</span>
            <span className="font-extrabold text-xs text-amber-400 ml-1">{player.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-300">
            <span className="font-semibold text-emerald-400">{player.primaryPosition}</span>
            <span>•</span>
            <span className="truncate">{player.clubOrIcon}</span>
          </div>
        </div>
        {cost !== undefined && (
          <div className="text-right text-[11px] font-bold text-emerald-300">
            {isSecret ? 'FREE' : `${cost}M€`}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl border-2 p-4 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] ${cardBorder} ${isLegend ? 'animate-gold-glow' : ''}`}>
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor} flex items-center gap-1`}>
            {isLegend ? <Sparkles className="w-3 h-3 text-amber-300" /> : <Shield className="w-3 h-3 text-cyan-300" />}
            {isLegend ? 'LEGEND / أسطورة' : 'MODERN / معاصر'}
          </span>
          {isSecret && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              GRATUIT 0M€
            </span>
          )}
        </div>
        <div className="text-xl" title={player.nationality}>{player.flag}</div>
      </div>

      {/* Main Player Display: Rating, Position, Photo */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex flex-col items-center justify-center bg-black/40 px-3 py-2 rounded-xl border border-white/10">
          <span className="text-3xl font-black text-amber-400 leading-none">{player.rating}</span>
          <span className="text-xs font-extrabold text-emerald-400 mt-1">{player.primaryPosition}</span>
          {player.secondaryPositions.length > 0 && (
            <span className="text-[10px] text-slate-400 mt-0.5">
              ({player.secondaryPositions.join('/')})
            </span>
          )}
        </div>

        {/* Player Photo */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-inner bg-slate-900 flex-shrink-0">
          {!imgError ? (
            <img
              src={player.image}
              alt={player.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top filter contrast-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white/80 font-black text-xl">
              {player.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-white truncate tracking-wide">{player.name}</h3>
          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
            <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{player.clubOrIcon}</span>
          </p>
          <div className="mt-2 text-xs font-medium text-emerald-300 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20 inline-block max-w-full truncate">
            {player.darijaTag}
          </div>
        </div>
      </div>

      {/* Description */}
      {showDetails && (
        <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-black/30 p-2.5 rounded-xl border border-white/5">
          {player.description}
        </p>
      )}

      {/* FIFA-style Stats Grid */}
      {showDetails && (
        <div className="grid grid-cols-6 gap-1 bg-black/40 p-2.5 rounded-xl border border-white/10 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">PAC</div>
            <div className="text-xs font-black text-white">{player.stats.pace}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">SHO</div>
            <div className="text-xs font-black text-white">{player.stats.shooting}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">PAS</div>
            <div className="text-xs font-black text-white">{player.stats.passing}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">DRI</div>
            <div className="text-xs font-black text-white">{player.stats.dribbling}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">DEF</div>
            <div className="text-xs font-black text-white">{player.stats.defending}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">PHY</div>
            <div className="text-xs font-black text-white">{player.stats.physical}</div>
          </div>
        </div>
      )}
    </div>
  );
};

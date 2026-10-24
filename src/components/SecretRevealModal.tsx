import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PlayerCard } from './PlayerCard';
import { Trophy, Gift, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

export const SecretRevealModal: React.FC = () => {
  const { state, proceedFromReveal } = useGame();
  const [revealed, setRevealed] = useState(false);

  const result = state.lastRoundResult;

  useEffect(() => {
    // Play fanfare when reveal screen opens
    sound.playFanfare();
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (!result) return null;

  const winner = result.winnerId === 'player1' ? state.player1 : state.player2;
  const loser = result.loserId === 'player1' ? state.player1 : state.player2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative my-8">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>نهاية المزاد للجولة {result.round}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white">
            مبروك للصفقة وإسدال الستار! 🎉
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            الفائز حصل على اللاعب بالمزاد، والخاسر كيربح لاعب سري مجاني بنفس المركز!
          </p>
        </div>

        {/* Grid: Winner's Purchase vs Loser's Secret Player */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Winner Card */}
          <div className="bg-gradient-to-b from-amber-950/30 to-black/60 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-400/40">
                    🏆
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">الفائز بالبيد</span>
                    <h4 className="font-black text-white text-base">{winner.name}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">الثمن المؤدى</span>
                  <span className="font-black text-amber-400 text-lg">-{result.winningBid} M€</span>
                </div>
              </div>

              <PlayerCard
                player={result.auctionPlayer}
                size="md"
                showDetails={true}
                cost={result.winningBid}
              />
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                تم خصم <b>{result.winningBid} M€</b> من ميزانية {winner.name} وإلحاق اللاعب بالتشكيلة الأساسية.
              </span>
            </div>
          </div>

          {/* Loser's Secret Player Card */}
          <div className="bg-gradient-to-b from-emerald-950/30 to-black/60 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-400/40">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">الهدية السرية لـ</span>
                    <h4 className="font-black text-white text-base">{loser.name}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">الثمن</span>
                  <span className="font-black text-emerald-400 text-lg">0 M€ (GRATUIT)</span>
                </div>
              </div>

              {/* Reveal Animation Card */}
              {revealed ? (
                <div className="animate-reveal">
                  <PlayerCard
                    player={result.secretPlayer}
                    size="md"
                    showDetails={true}
                    isSecret={true}
                    cost={0}
                  />
                </div>
              ) : (
                <div className="h-64 rounded-2xl border-2 border-dashed border-emerald-400/50 bg-emerald-950/20 flex flex-col items-center justify-center text-center p-6 animate-pulse">
                  <Sparkles className="w-12 h-12 text-emerald-400 mb-2 animate-spin" />
                  <h4 className="font-black text-white text-lg">جارٍ كشف اللاعب السري...</h4>
                  <p className="text-xs text-slate-400 mt-1">نفس المركز: {result.positionTarget}</p>
                </div>
              )}
            </div>

            {revealed && (
              <div className="mt-4 p-2.5 rounded-xl border text-xs flex flex-col gap-1 shadow-md animate-fade-in bg-black/50 border-emerald-500/30">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-400">حالة الزهر / Coup de Chance:</span>
                  {result.secretPlayer.rating >= 92 ? (
                    <span className="text-amber-400 font-black animate-pulse">🔥 جاكـبـوط واعر بزاف! ({result.secretPlayer.rating})</span>
                  ) : result.secretPlayer.rating >= 85 ? (
                    <span className="text-emerald-400 font-extrabold">✨ زهرك ناضي ومزيان ({result.secretPlayer.rating})</span>
                  ) : (
                    <span className="text-rose-400 font-extrabold">😅 زهرك عيان شوية ({result.secretPlayer.rating})</span>
                  )}
                </div>

                <div className="text-[11px] text-slate-300 mt-1">
                  {result.secretPlayer.rating > result.auctionPlayer.rating ? (
                    <span className="text-emerald-300 font-bold">
                      🎉 الضحكة على {winner.name}! خسر {result.winningBid}M€ وأنت طاح فيك كوايري حسن منو وفابور (0€)!
                    </span>
                  ) : (
                    <span>
                      {loser.name} ربح لاعب سري مجاني (0 M€) بنفس المركز دون أن ينقص أي سنتيم من ميزانيته!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Continue */}
        <div className="mt-8 text-center relative z-10">
          <button
            onClick={proceedFromReveal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
          >
            <span>الجولة الموالية / Continuer</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

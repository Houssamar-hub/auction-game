import React, { useState } from 'react';
import type { GameMode } from '../types';
import { useGame } from '../context/GameContext';
import { Trophy, Flame, Sparkles, Shuffle, CheckCircle, RotateCcw } from 'lucide-react';

export const SetupScreen: React.FC = () => {
  const { startGame, hasSavedGame, loadSavedGame } = useGame();

  const [p1Name, setP1Name] = useState('Houssam');
  const [p2Name, setP2Name] = useState('Ayoub');
  const [selectedMode, setSelectedMode] = useState<GameMode>('mixed');
  const [allowCam, setAllowCam] = useState(true);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startGame(p1Name, p2Name, selectedMode, allowCam);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest uppercase mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>مزاد كرة القدم • Football Auction</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 tracking-tight">
            ميركاتو الحصري
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-md mx-auto">
            تنافس تاريخي بين حسام وأيوب.. جمع أحسن 11 لاعب بتكتيك 4-3-3 وبميزانية 100M€!
          </p>
        </div>

        {/* Saved Game Banner */}
        {hasSavedGame && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-amber-300 text-sm">ماتش سابق مسجل!</h4>
              <p className="text-xs text-slate-400">كاين ماتش سابق ملعوب، بغيتي تكملو؟</p>
            </div>
            <button
              onClick={loadSavedGame}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>كمل الماتش</span>
            </button>
          </div>
        )}

        <form onSubmit={handleStart} className="space-y-6 relative z-10">
          {/* Player Names & Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              اللاعبان والميزانية الابتدائية (100 M€ لكل لاعب)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-3 focus-within:border-emerald-500 transition-colors">
                <span className="text-[11px] font-bold text-emerald-400">Player 1 (اللاعب الأول)</span>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  className="w-full bg-transparent text-white font-extrabold text-base focus:outline-none mt-1"
                  required
                />
                <span className="text-[11px] text-slate-400 block mt-1">Starting Budget: <b className="text-emerald-300">100 M€</b></span>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-3 focus-within:border-cyan-500 transition-colors">
                <span className="text-[11px] font-bold text-cyan-400">Player 2 (اللاعب الثاني)</span>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full bg-transparent text-white font-extrabold text-base focus:outline-none mt-1"
                  required
                />
                <span className="text-[11px] text-slate-400 block mt-1">Starting Budget: <b className="text-cyan-300">100 M€</b></span>
              </div>
            </div>
          </div>

          {/* Era Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              اختر الحقبة الزمنية / Mode de Jeu
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Legends Mode */}
              <div
                onClick={() => setSelectedMode('legends')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                  selectedMode === 'legends'
                    ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    {selectedMode === 'legends' && <CheckCircle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <h3 className="font-extrabold text-white text-base">الأساطير (Legends)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    نجوم الزمن الجميل المعتزلين (زيدان، رونالدو الظاهرة، مالديني، بيليه، بوفون...)
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block w-fit">
                  Icons & Ballons d'Or
                </div>
              </div>

              {/* Modern Mode */}
              <div
                onClick={() => setSelectedMode('modern')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                  selectedMode === 'modern'
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="w-5 h-5 text-cyan-400" />
                    {selectedMode === 'modern' && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <h3 className="font-extrabold text-white text-base">العصر الحديث (Modern)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    نجوم الجيل الحالي والملاعب الأوروبية (مبابي، هالاند، بيلينغهام، حكيمي، رودري...)
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block w-fit">
                  Current Superstars
                </div>
              </div>

              {/* Mixed Mode */}
              <div
                onClick={() => setSelectedMode('mixed')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                  selectedMode === 'mixed'
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/20'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Shuffle className="w-5 h-5 text-emerald-400" />
                    {selectedMode === 'mixed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <h3 className="font-extrabold text-white text-base">المزيج الممتع (Mixed)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    توليفة متوازنة بين كبار أساطير الماضي وأبرز نجوم الحاضر جنباً إلى جنب!
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block w-fit">
                  Ultimate Clash
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Formation Rules */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>خطة اللعب: 4-3-3 التكتيكية الرسمية</span>
              <span className="text-emerald-400 font-extrabold">11 كوايري بالضبط (بدون احتياط)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div>• حارس مرمى (GK × 1)</div>
              <div>• ظهير أيمن (RB × 1) وأيسر (LB × 1)</div>
              <div>• قلبي دفاع (CB × 2)</div>
              <div>• ارتكاز دفاعي (CDM × 1)</div>
              <div>• لاعبي وسط (CM × 2)</div>
              <div>• أجنحة (RW × 1, LW × 1) ورأس حربة (ST × 1)</div>
            </div>

            {/* CAM Substitute Option */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">السماح بـ صانع الألعاب (CAM كبديل لـ CM)</span>
                <span className="text-[11px] text-slate-400">وفق قوانين المسابقة: يمكن لـ CAM تعويض أحد مراكز CM</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCam}
                  onChange={(e) => setAllowCam(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-lg tracking-wide uppercase shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            بدا الماتش والمزاد ⚡
          </button>
        </form>
      </div>
    </div>
  );
};

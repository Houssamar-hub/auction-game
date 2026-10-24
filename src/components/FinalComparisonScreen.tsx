import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Pitch } from './Pitch';
import { calculateTeamRating } from '../utils/scoring';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Sparkles, 
  HelpCircle
} from 'lucide-react';

export const FinalComparisonScreen: React.FC = () => {
  const { state, restartGame } = useGame();
  const [activeTab, setActiveTab] = useState<'comparison' | 'pitches' | 'breakdown'>('comparison');

  const { player1, player2 } = state;

  const score1 = calculateTeamRating(player1);
  const score2 = calculateTeamRating(player2);

  const p1TotalSpent = 100 - player1.budget;
  const p2TotalSpent = 100 - player2.budget;

  const winner = score1.totalScore > score2.totalScore 
    ? player1 
    : score2.totalScore > score1.totalScore 
    ? player2 
    : null; // Draw

  const winnerScore = winner ? (winner.id === 'player1' ? score1 : score2) : null;

  useEffect(() => {
    // Confetti explosion
    try {
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#eab308', '#10b981', '#06b6d4', '#f43f5e'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Fallback if canvas is unavailable
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header banner */}
      <header className="bg-slate-900/90 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 text-xl">
              🏆
            </div>
            <div>
              <h1 className="font-black text-white text-lg md:text-xl">
                نهاية المباراة والميركاتو الرسمي
              </h1>
              <p className="text-xs text-slate-400">
                اكتمال التشكيلة الرسمية (11/11) للطرفين وحساب النتيجة النهائية الشفافة
              </p>
            </div>
          </div>

          <button
            onClick={restartGame}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ماتش جديد / Nouvelle Partie</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-8">
        {/* Winner Hero Podium Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-400/50 p-6 md:p-10 shadow-2xl text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>البطل النهائي / The Champion</span>
            </div>

            {winner ? (
              <>
                <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">
                  {winner.name} هو الفائز! 👑
                </h2>
                <p className="text-slate-300 text-sm md:text-base mt-3 leading-relaxed">
                  بناءً على معايير القوة التكتيكية الشفافة، استطاع {winner.name} جمع تشكيلة حديدية بـ{' '}
                  <b className="text-amber-400">{winnerScore?.totalScore} نقطة</b> وتوفير{' '}
                  <b className="text-emerald-400">{winner.budget} M€</b> من ميزانيته!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-black text-white">
                  تعادل تاريخي بين حسام وأيوب! 🤝
                </h2>
                <p className="text-slate-300 text-sm mt-2">
                  الفريقان متساويان تماماً في النقاط التكتيكية الشفافة!
                </p>
              </>
            )}

            {/* Score Comparison Pill */}
            <div className="mt-6 flex items-center justify-center gap-6 md:gap-10">
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase font-bold">{player1.name}</div>
                <div className="text-2xl md:text-4xl font-black text-emerald-400">{score1.totalScore} pts</div>
                <div className="text-[11px] text-slate-400">OVR: {score1.averageOvr} | باقي: {player1.budget}M€</div>
              </div>

              <div className="text-2xl font-black text-slate-600">VS</div>

              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase font-bold">{player2.name}</div>
                <div className="text-2xl md:text-4xl font-black text-cyan-400">{score2.totalScore} pts</div>
                <div className="text-[11px] text-slate-400">OVR: {score2.averageOvr} | باقي: {player2.budget}M€</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-slate-900 border border-white/10 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold shadow-lg">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'comparison'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              مقارنة الإحصائيات الشاملة
            </button>
            <button
              onClick={() => setActiveTab('pitches')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'pitches'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              التشكيلات على أرضية الملعب (4-3-3)
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'breakdown'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              قائمة الصفقات واللاعبين السريين
            </button>
          </div>
        </div>

        {/* Tab 1: Comprehensive Comparison & Scoring Breakdown */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {/* Direct Comparison Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player 1 Card */}
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Player 1</span>
                    <h3 className="text-2xl font-black text-white">{player1.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">النتيجة الإجمالية</span>
                    <span className="text-2xl font-black text-emerald-400">{score1.totalScore}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">معدل طاقة الفريق (Average OVR):</span>
                    <b className="text-amber-400">{score1.averageOvr}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">قوة خط الهجوم (ST, RW, LW):</span>
                    <b className="text-white">{score1.attackRating}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">صلابة خط الوسط (CDM, CM × 2):</span>
                    <b className="text-white">{score1.midfieldRating}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">صلابة الدفاع والحراسة:</span>
                    <b className="text-white">{score1.defenseRating}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">المبلغ الإجمالي المصروف:</span>
                    <b className="text-rose-400">{p1TotalSpent} M€</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">الميزانية المتبقية (+مكافأة الانضباط):</span>
                    <b className="text-emerald-400">{player1.budget} M€ (+{score1.budgetBonus} pts)</b>
                  </div>
                </div>
              </div>

              {/* Player 2 Card */}
              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Player 2</span>
                    <h3 className="text-2xl font-black text-white">{player2.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">النتيجة الإجمالية</span>
                    <span className="text-2xl font-black text-cyan-400">{score2.totalScore}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">معدل طاقة الفريق (Average OVR):</span>
                    <b className="text-amber-400">{score2.averageOvr}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">قوة خط الهجوم (ST, RW, LW):</span>
                    <b className="text-white">{score2.attackRating}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">صلابة خط الوسط (CDM, CM × 2):</span>
                    <b className="text-white">{score2.midfieldRating}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">صلابة الدفاع والحراسة:</span>
                    <b className="text-white">{score2.defenseRating}/100</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">المبلغ الإجمالي المصروف:</span>
                    <b className="text-rose-400">{p2TotalSpent} M€</b>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300">الميزانية المتبقية (+مكافأة الانضباط):</span>
                    <b className="text-cyan-400">{player2.budget} M€ (+{score2.budgetBonus} pts)</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Scoring Formula Explained */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>معادلة التقييم الشفافة (Transparent Scoring Formula)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                وفق دفتر التحملات: لا يتم إعلان الفائز اعتماداً على الميزانية المتبقية فقط! يتم الحساب رياضياً بناءً على:
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <b className="text-white block mb-0.5">70% طاقة التشكيلة (Squad OVR)</b>
                  <span className="text-slate-400">معدل طاقة الـ 11 كوايري الأساسيين</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <b className="text-white block mb-0.5">30% توازن الخطوط (Synergy)</b>
                  <span className="text-slate-400">10% هجوم + 10% وسط + 10% دفاع</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <b className="text-white block mb-0.5">بونص التدبير المالي (Bonus)</b>
                  <span className="text-slate-400">+0.05 نقطة عن كل مليون يورو متبقي</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pitches Side-by-Side */}
        {activeTab === 'pitches' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            <Pitch team={player1} />
            <Pitch team={player2} />
          </div>
        )}

        {/* Tab 3: Detailed Acquisitions breakdown */}
        {activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Player 1 Acquisitions */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
              <h4 className="font-extrabold text-white text-base mb-3 flex items-center justify-between pb-2 border-b border-white/10">
                <span>صفقات {player1.name}</span>
                <span className="text-xs text-emerald-400 font-bold">{player1.acquiredHistory.length} لاعبين</span>
              </h4>
              <div className="space-y-2">
                {player1.acquiredHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.player.flag}</span>
                      <div>
                        <div className="font-bold text-white text-xs">{item.player.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.player.primaryPosition} • {item.player.clubOrIcon}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.isSecret ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          سري مجاني (0€)
                        </span>
                      ) : (
                        <span className="font-black text-amber-400 text-xs">
                          مزاد: {item.cost} M€
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Player 2 Acquisitions */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
              <h4 className="font-extrabold text-white text-base mb-3 flex items-center justify-between pb-2 border-b border-white/10">
                <span>صفقات {player2.name}</span>
                <span className="text-xs text-cyan-400 font-bold">{player2.acquiredHistory.length} لاعبين</span>
              </h4>
              <div className="space-y-2">
                {player2.acquiredHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.player.flag}</span>
                      <div>
                        <div className="font-bold text-white text-xs">{item.player.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.player.primaryPosition} • {item.player.clubOrIcon}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.isSecret ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          سري مجاني (0€)
                        </span>
                      ) : (
                        <span className="font-black text-amber-400 text-xs">
                          مزاد: {item.cost} M€
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

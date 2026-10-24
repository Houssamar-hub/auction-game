import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PlayerCard } from './PlayerCard';
import { Pitch } from './Pitch';
import { 
  Gavel, 
  Coins, 
  Clock, 
  AlertCircle, 
  Check, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  LayoutGrid
} from 'lucide-react';

export const AuctionScreen: React.FC = () => {
  const { 
    state, 
    placeBid, 
    passBid, 
    soundEnabled, 
    toggleSound, 
    restartGame 
  } = useGame();

  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'auction' | 'p1_pitch' | 'p2_pitch'>('auction');

  const {
    currentRound,
    currentAuctionPlayer,
    currentPositionTarget,
    currentBid,
    highestBidderId,
    currentTurn,
    player1,
    player2,
    bidHistory,
  } = state;

  if (!currentAuctionPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        جارٍ تجهيز الجولة...
      </div>
    );
  }

  const activeTurnPlayer = currentTurn === 'player1' ? player1 : player2;
  const otherPlayer = currentTurn === 'player1' ? player2 : player1;
  const isP1Turn = currentTurn === 'player1';

  // Minimum required bid to overtake current bid
  const minRequiredBid = currentBid === 0 ? 1 : currentBid + 1;
  const canAffordMinBid = activeTurnPlayer.budget >= minRequiredBid;

  const handleQuickBid = (increment: number) => {
    setErrorMessage(null);
    const targetAmount = (currentBid === 0 ? 0 : currentBid) + increment;
    const res = placeBid(targetAmount);
    if (!res.success && res.message) {
      setErrorMessage(res.message);
    }
  };

  const handleCustomBid = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const amount = parseInt(customBidAmount, 10);
    if (isNaN(amount)) {
      setErrorMessage('الرجاء إدخال مبلغ صحيح');
      return;
    }
    const res = placeBid(amount);
    if (!res.success && res.message) {
      setErrorMessage(res.message);
    } else {
      setCustomBidAmount('');
    }
  };

  const handlePass = () => {
    setErrorMessage(null);
    passBid();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Round */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black text-slate-950 text-xl">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-base md:text-lg tracking-wide">
                  مزاد كرة القدم
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  الجولة {currentRound}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                المركز المطلوب: <b className="text-emerald-400">{currentPositionTarget}</b> (تشكيلة 4-3-3)
              </p>
            </div>
          </div>

          {/* View Toggles & Sound */}
          <div className="flex items-center gap-2">
            <div className="bg-black/50 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('auction')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'auction'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>المزاد</span>
              </button>
              <button
                onClick={() => setActiveTab('p1_pitch')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'p1_pitch'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{player1.name}</span>
              </button>
              <button
                onClick={() => setActiveTab('p2_pitch')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'p2_pitch'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{player2.name}</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Restart Match */}
            <button
              onClick={() => {
                if (window.confirm('واش متأكد باغي تعاود الماتش من اللول؟')) {
                  restartGame();
                }
              }}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition-colors hidden sm:block"
            >
              إعادة البدء
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* Render Formations if pitch tab is active */}
        {activeTab === 'p1_pitch' && (
          <div className="py-4 animate-fade-in">
            <Pitch team={player1} />
          </div>
        )}
        {activeTab === 'p2_pitch' && (
          <div className="py-4 animate-fade-in">
            <Pitch team={player2} />
          </div>
        )}

        {/* Live Auction Floor */}
        {activeTab === 'auction' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Player: Houssam */}
            <div className={`lg:col-span-3 rounded-2xl p-4 border-2 transition-all ${
              isP1Turn
                ? 'border-emerald-400 bg-emerald-950/20 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-400/20'
                : 'border-white/10 bg-slate-900/60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Player 1</span>
                {isP1Turn && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 animate-pulse">
                    دورو دابا / TURN
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-white">{player1.name}</h3>

              {/* Budget Progress Bar */}
              <div className="mt-4 bg-black/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">الميزانية المتبقية:</span>
                  <span className="font-black text-emerald-400 text-lg">{player1.budget} M€</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, Math.min(100, (player1.budget / 100) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Squad count */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>الكوايرية المعتمدين:</span>
                <span className="font-bold text-white">
                  {Object.values(player1.startingLineup).filter(Boolean).length}/11
                </span>
              </div>

              {/* Purchases miniature list */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                  آخر الصفقات ({player1.acquiredHistory.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {player1.acquiredHistory.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">مازال ما شرا حتى كوايري</div>
                  ) : (
                    player1.acquiredHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-black/30 p-1.5 rounded-lg border border-white/5">
                        <span className="truncate text-slate-300 font-medium">
                          {item.player.name}
                        </span>
                        <span className={`font-bold ${item.isSecret ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {item.isSecret ? 'FREE' : `${item.cost}M€`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Middle: Featured Player & Live Auction Stage */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              {/* Featured Player Card */}
              <PlayerCard player={currentAuctionPlayer} size="lg" showDetails={true} />

              {/* Live Bidding Box */}
              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                {/* Header status */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs text-slate-400 block">أعلى مبلغ معروض حالياً</span>
                    <div className="text-3xl font-black text-amber-400 flex items-center gap-1">
                      <span>{currentBid > 0 ? `${currentBid} M€` : '0 M€ (بداية المزاد)'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">صاحب أعلى عرض</span>
                    <div className="text-base font-extrabold text-white">
                      {highestBidderId ? (
                        <span className="text-emerald-400 font-black flex items-center gap-1 justify-end">
                          <Check className="w-4 h-4" />
                          {highestBidderId === 'player1' ? player1.name : player2.name}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">لا يوجد بعد</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Turn Instruction */}
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="text-xs font-bold text-slate-300">
                      الدور دابا عند: <b className={isP1Turn ? 'text-emerald-400' : 'text-cyan-400'}>{activeTurnPlayer.name}</b>
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    أقل بيد مقبول: <b className="text-amber-300">{minRequiredBid} M€</b>
                  </span>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Warning if cannot afford */}
                {!canAffordMinBid && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {activeTurnPlayer.name} ما عندوش ميزانية كافية للزيادة ({activeTurnPlayer.budget} M€). خاصو يدوز (Pass)!
                    </span>
                  </div>
                )}

                {/* Bidding Buttons */}
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    أزرار الزيادة السريعة (M€)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[1, 2, 5, 10].map((inc) => {
                      const amount = (currentBid === 0 ? 0 : currentBid) + inc;
                      const disabled = amount > activeTurnPlayer.budget;
                      return (
                        <button
                          key={inc}
                          onClick={() => handleQuickBid(inc)}
                          disabled={disabled}
                          className={`py-2.5 px-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-1 ${
                            disabled
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                              : 'bg-gradient-to-b from-slate-700 to-slate-800 hover:from-emerald-600 hover:to-emerald-700 text-white border border-white/10 hover:border-emerald-400 shadow-md'
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+{inc} M€</span>
                          <span className="text-[10px] text-slate-400">({amount}M)</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Bid Input */}
                  <form onSubmit={handleCustomBid} className="flex gap-2 pt-1">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder={`مبلغ مخصص (أكثر من ${currentBid} M€)...`}
                        value={customBidAmount}
                        onChange={(e) => setCustomBidAmount(e.target.value)}
                        min={minRequiredBid}
                        max={activeTurnPlayer.budget}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                      />
                      <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">M€</span>
                    </div>
                    <button
                      type="submit"
                      disabled={!canAffordMinBid}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-white font-bold text-xs transition-colors disabled:opacity-40"
                    >
                      زيد بالبيد
                    </button>
                  </form>

                  {/* Pass Button ("DOUZ / دوز") */}
                  <button
                    onClick={handlePass}
                    className="w-full py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-white font-black text-sm tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>دوز (Pass) ✕</span>
                    <span className="text-xs text-rose-400 font-normal">
                      {highestBidderId ? `(كيمنح الفوز لـ ${otherPlayer.name})` : '(إذا دوزتو بجوج كيتبدل اللاعب)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Secret Player Teaser */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-lg">
                    🎁
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">
                      اللاعب السري المجاني (Secret Free Player 0M€)
                    </h4>
                    <p className="text-xs text-slate-400">
                      الخاسر فالمزاد كياخد لاعب سري مجاني بنفس المركز (<b className="text-emerald-400">{currentPositionTarget}</b>)!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Player: Ayoub */}
            <div className={`lg:col-span-3 rounded-2xl p-4 border-2 transition-all ${
              !isP1Turn
                ? 'border-cyan-400 bg-cyan-950/20 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/20'
                : 'border-white/10 bg-slate-900/60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Player 2</span>
                {!isP1Turn && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500 text-slate-950 animate-pulse">
                    دورو دابا / TURN
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-white">{player2.name}</h3>

              {/* Budget Progress Bar */}
              <div className="mt-4 bg-black/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">الميزانية المتبقية:</span>
                  <span className="font-black text-cyan-400 text-lg">{player2.budget} M€</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, Math.min(100, (player2.budget / 100) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Squad count */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>الكوايرية المعتمدين:</span>
                <span className="font-bold text-white">
                  {Object.values(player2.startingLineup).filter(Boolean).length}/11
                </span>
              </div>

              {/* Purchases miniature list */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
                  آخر الصفقات ({player2.acquiredHistory.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {player2.acquiredHistory.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">مازال ما شرا حتى كوايري</div>
                  ) : (
                    player2.acquiredHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-black/30 p-1.5 rounded-lg border border-white/5">
                        <span className="truncate text-slate-300 font-medium">
                          {item.player.name}
                        </span>
                        <span className={`font-bold ${item.isSecret ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {item.isSecret ? 'FREE' : `${item.cost}M€`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Bid History Log (Always visible at bottom of auction floor) */}
        {activeTab === 'auction' && bidHistory.length > 0 && (
          <div className="mt-8 bg-slate-900/60 border border-white/10 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>سجل المزايدات الحية لهاد الجولة (Live Bids Log)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {bidHistory.slice(0, 8).map((record) => (
                <div
                  key={record.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    record.isPass
                      ? 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                      : 'bg-black/40 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-slate-500 font-mono">{record.timestamp}</span>
                    <span className="font-extrabold truncate">{record.bidderName}</span>
                  </div>
                  <div>
                    {record.isPass ? (
                      <span className="font-bold text-rose-400">PASS ✕</span>
                    ) : (
                      <span className="font-black text-amber-400">{record.amount} M€</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

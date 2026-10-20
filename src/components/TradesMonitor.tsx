import React, { useState, useEffect } from 'react';
import { ActiveTrade, MarketPrice, TradeStatus } from '../types';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  DollarSign,
  Percent,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TradesMonitorProps {
  trades: ActiveTrade[];
  onUpdateTrade: (updated: ActiveTrade) => void;
  onRemoveTrade: (id: string) => void;
  prices: Record<string, MarketPrice>;
}

export const TradesMonitor: React.FC<TradesMonitorProps> = ({
  trades,
  onUpdateTrade,
  onRemoveTrade,
  prices,
}) => {
  const [isSimulating, setIsSimulating] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

  // Realistic micro-tick simulation loop for active trades
  useEffect(() => {
    if (!isSimulating || trades.length === 0) return;

    const interval = setInterval(() => {
      trades.forEach((trade) => {
        if (trade.status !== 'RUNNING' && trade.status !== 'PENDING') return;

        // Get asset price or fallback
        const market = trade.asset.includes('BTC') ? prices.BTCUSD : prices.XAUUSD;
        let currentPrice = trade.currentPrice || trade.entryPrice;

        if (market) {
          // Add micro jitter around current market price
          const delta = (Math.random() - 0.48) * (trade.asset.includes('BTC') ? 15 : 0.4);
          currentPrice = parseFloat((currentPrice + delta).toFixed(2));
        }

        // Calculate PnL
        let pnlUsd = 0;
        const diff = trade.action === 'BUY' ? currentPrice - trade.entryPrice : trade.entryPrice - currentPrice;

        if (trade.asset.includes('XAU')) {
          // 1 lot XAU = 100 oz. $1 diff = $100 per lot
          pnlUsd = diff * 100 * trade.lotSize;
        } else if (trade.asset.includes('BTC')) {
          pnlUsd = diff * trade.lotSize;
        } else {
          pnlUsd = diff * 100000 * trade.lotSize;
        }

        const pnlPercent = trade.riskAmountUsd > 0 ? (pnlUsd / trade.riskAmountUsd) * 100 : 0;

        let status: TradeStatus = trade.status;
        if (trade.action === 'BUY') {
          if (currentPrice >= trade.takeProfit) {
            status = 'TP_HIT';
            sound.playSuccessChime();
          } else if (currentPrice <= trade.stopLoss) {
            status = 'SL_HIT';
          }
        } else if (trade.action === 'SELL') {
          if (currentPrice <= trade.takeProfit) {
            status = 'TP_HIT';
            sound.playSuccessChime();
          } else if (currentPrice >= trade.stopLoss) {
            status = 'SL_HIT';
          }
        }

        onUpdateTrade({
          ...trade,
          currentPrice,
          pnlUsd: parseFloat(pnlUsd.toFixed(2)),
          pnlPercent: parseFloat(pnlPercent.toFixed(1)),
          status,
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, trades, prices, onUpdateTrade]);

  const activeTrades = trades.filter((t) => t.status === 'RUNNING' || t.status === 'PENDING');
  const historyTrades = trades.filter((t) => t.status === 'TP_HIT' || t.status === 'SL_HIT' || t.status === 'CLOSED');

  const totalFloatingPnl = activeTrades.reduce((acc, t) => acc + t.pnlUsd, 0);
  const totalRealizedPnl = historyTrades.reduce((acc, t) => acc + t.pnlUsd, 0);

  const setBreakEven = (trade: ActiveTrade) => {
    onUpdateTrade({
      ...trade,
      stopLoss: trade.entryPrice,
      notes: 'Stop Loss dipindahkan ke Break-Even (Zero Risk)',
    });
    sound.playSuccessChime();
  };

  const closeTrade = (trade: ActiveTrade) => {
    onUpdateTrade({
      ...trade,
      status: 'CLOSED',
    });
    sound.playOrderExecuted();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
      {/* Dashboard Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-sm text-white">
              Monitor Rencana Trading Real-Time
            </h3>
            <p className="text-[11px] text-slate-400">
              Pelacakan posisi berjalan & simulasi eksekusi harga mekanis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition flex items-center gap-1.5 ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Nyalakan / Matikan Pembaruan Tick Otomatis"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Tick Real-Time: {isSimulating ? 'ON' : 'PAUSED'}</span>
          </button>

          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3 py-1 rounded-md transition font-medium ${
                activeTab === 'ACTIVE'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Aktif ({activeTrades.length})
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3 py-1 rounded-md transition font-medium ${
                activeTab === 'HISTORY'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Riwayat ({historyTrades.length})
            </button>
          </div>
        </div>
      </div>

      {/* Performance Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">FLOATING P&L</span>
          <span
            className={`text-base font-extrabold block mt-0.5 ${
              totalFloatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)}
          </span>
          <span className="text-[9px] text-slate-500 block">Posisi Berjalan</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">REALIZED P&L</span>
          <span
            className={`text-base font-extrabold block mt-0.5 ${
              totalRealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)}
          </span>
          <span className="text-[9px] text-slate-500 block">Dari Posisi Ditutup</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">TOTAL RENCANA AKTIF</span>
          <span className="text-base font-extrabold text-white block mt-0.5">
            {activeTrades.length} Setup
          </span>
          <span className="text-[9px] text-slate-500 block">Mekanisme RRR 1:2+</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">KONTROL DISIPLIN</span>
          <span className="text-sm font-bold text-cyan-400 block mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Bebas Emosi
          </span>
          <span className="text-[9px] text-slate-500 block">Maks Risiko 1% per trade</span>
        </div>
      </div>

      {/* Trades List View */}
      {activeTab === 'ACTIVE' ? (
        activeTrades.length === 0 ? (
          <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <Activity className="w-8 h-8 text-slate-600 mb-2" />
            <h5 className="text-xs font-semibold text-slate-300">
              Belum Ada Rencana Trading Aktif di Monitor
            </h5>
            <p className="text-[11px] text-slate-500 max-w-sm mt-1">
              Jalankan pemindaian grafik di atas dan klik tombol{' '}
              <span className="text-cyan-400 font-medium">"Pantau Real-Time"</span> untuk memasukkan trading plan ke dashboard monitoring ini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeTrades.map((trade) => {
              const isProfit = trade.pnlUsd >= 0;
              const isBuy = trade.action === 'BUY';

              // Calculate progress % towards TP or SL
              const totalSpan = Math.abs(trade.takeProfit - trade.stopLoss);
              const currentOffset = Math.abs(trade.currentPrice - trade.stopLoss);
              const progressPct = totalSpan > 0 ? Math.min(100, Math.max(0, (currentOffset / totalSpan) * 100)) : 50;

              return (
                <div
                  key={trade.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isBuy
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trade.action}
                      </span>
                      <span className="font-mono text-sm font-extrabold text-white">
                        {trade.asset}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                        {trade.timeframe}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        {trade.lotSize} Lot
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 block">P&L BERJALAN</span>
                        <span
                          className={`text-sm font-extrabold ${
                            isProfit ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isProfit ? '+' : ''}${trade.pnlUsd.toFixed(2)} ({trade.pnlPercent > 0 ? '+' : ''}{trade.pnlPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Progress Visualizer Bar */}
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-rose-400">SL: ${trade.stopLoss}</span>
                      <span className="text-slate-200 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Live: ${trade.currentPrice}
                      </span>
                      <span className="text-emerald-400">TP: ${trade.takeProfit} ({trade.rrr})</span>
                    </div>

                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isProfit ? 'bg-gradient-to-r from-teal-500 to-emerald-400' : 'bg-gradient-to-r from-orange-500 to-rose-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions & Risk Free Management */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Maks Kerugian Dibatasi: -${trade.riskAmountUsd.toFixed(2)}</span>
                      {trade.notes && (
                        <span className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                          {trade.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBreakEven(trade)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono transition flex items-center gap-1"
                        title="Pindahkan Stop Loss ke Entry (Tanpa Risiko)"
                      >
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        <span>Kunci Break-Even</span>
                      </button>

                      <button
                        onClick={() => closeTrade(trade)}
                        className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 text-[11px] font-mono transition"
                      >
                        Tutup Posisi
                      </button>

                      <button
                        onClick={() => onRemoveTrade(trade.id)}
                        className="p-1 text-slate-500 hover:text-slate-300 transition"
                        title="Hapus dari Monitor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* History tab */
        historyTrades.length === 0 ? (
          <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
            Belum ada posisi yang selesai dieksekusi.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {historyTrades.map((trade) => {
              const isProfit = trade.pnlUsd >= 0;
              return (
                <div
                  key={trade.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trade.status === 'TP_HIT'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : trade.status === 'SL_HIT'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {trade.status === 'TP_HIT'
                        ? 'TAKE PROFIT HIT'
                        : trade.status === 'SL_HIT'
                        ? 'STOP LOSS HIT'
                        : 'MANUAL CLOSED'}
                    </span>
                    <span className="font-bold text-white">{trade.asset}</span>
                    <span className="text-slate-400">{trade.action}</span>
                    <span className="text-slate-500">{trade.lotSize} Lot</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isProfit ? '+' : ''}${trade.pnlUsd.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveTrade(trade.id)}
                      className="text-slate-500 hover:text-slate-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

import React from 'react';
import { MarketPrice } from '../types';
import { Activity, Cpu, Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface TickerBarProps {
  prices: Record<string, MarketPrice>;
  soundMuted: boolean;
  onToggleSound: () => void;
  isScanning: boolean;
}

export const TickerBar: React.FC<TickerBarProps> = ({
  prices,
  soundMuted,
  onToggleSound,
  isScanning,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Top micro ribbon */}
      <div className="flex items-center justify-between px-3 py-1.5 text-xs border-b border-slate-900 bg-slate-900/40 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-slate-300 font-semibold tracking-wide">ALPHAVISION KERNEL</span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>gemini-4-argon</span>
            <span className="bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-1.5 py-0.2 rounded font-bold text-[10px]">
              THINKING: HIGH
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-medium">RRR &ge; 1:2 &bull; Max Risk 1%</span>
          </div>

          <button
            onClick={() => {
              onToggleSound();
              sound.setMuted(!soundMuted);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition px-1.5 py-0.5 rounded hover:bg-slate-800"
            title={soundMuted ? 'Aktifkan Audio' : 'Senyapkan Audio'}
          >
            {soundMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="text-[10px] hidden sm:inline">{soundMuted ? 'Muted' : 'Sound ON'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar with Brand & Live Price Tickers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-2 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>AlphaVision</span>
                <span className="text-cyan-400 font-mono">Trader AI</span>
              </h1>
              <span className="bg-blue-900/60 text-blue-300 border border-blue-700/60 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider">
                Multimodal CV
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              Pemindaian Visual Grafik Mekanis &bull; EMA 50 &bull; RSI Divergence &bull; Grounding Berita Makro
            </p>
          </div>
        </div>

        {/* Live Ticker Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {Object.entries(prices).map(([key, item]) => {
            const isUp = item.change24h >= 0;
            return (
              <div
                key={key}
                className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-lg shrink-0 transition"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-200">{item.symbol}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {item.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-white tracking-tight">
                      {key === 'BTCUSD'
                        ? `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 1 })}`
                        : key === 'XAUUSD'
                        ? `$${item.price.toFixed(2)}`
                        : item.price.toFixed(key.includes('USD') && !key.includes('XAU') ? 4 : 2)}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Sp: {item.spread}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isScanning && (
        <div className="h-0.5 bg-slate-800 w-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 animate-[shimmer_1.5s_infinite] w-full" />
        </div>
      )}
    </header>
  );
};

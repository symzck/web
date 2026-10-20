import React from 'react';
import { ShieldAlert, CheckCircle, Calculator, DollarSign, Percent, AlertTriangle } from 'lucide-react';

interface RiskCalculatorProps {
  accountBalance: number;
  setAccountBalance: (val: number) => void;
  riskPercentage: number;
  setRiskPercentage: (val: number) => void;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  asset: string;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  accountBalance,
  setAccountBalance,
  riskPercentage,
  setRiskPercentage,
  entryPrice,
  stopLoss,
  takeProfit,
  asset,
}) => {
  const maxRiskUsd = (accountBalance * riskPercentage) / 100;

  // Distances
  const slDistance = entryPrice && stopLoss ? Math.abs(entryPrice - stopLoss) : 0;
  const tpDistance = entryPrice && takeProfit ? Math.abs(takeProfit - entryPrice) : 0;

  // Risk to Reward Ratio
  const rrrRatio = slDistance > 0 ? tpDistance / slDistance : 0;
  const isRrrValid = rrrRatio >= 1.99; // minimum 1:2

  // Position Sizing Formula
  let calculatedLot = 0;
  let lotUnit = 'Lot';

  if (slDistance > 0) {
    if (asset.toUpperCase().includes('XAU') || asset.toUpperCase().includes('GOLD')) {
      // 1 standard lot Gold = 100 oz. For every $1 move, 1 lot = $100 PnL
      calculatedLot = maxRiskUsd / (slDistance * 100);
      lotUnit = 'Lot Standar (100 oz)';
    } else if (asset.toUpperCase().includes('BTC')) {
      // Bitcoin contracts / position sizing in BTC
      calculatedLot = maxRiskUsd / slDistance;
      lotUnit = 'BTC';
    } else {
      // Standard Forex pairs (1 pip = 0.0001, $10 per lot)
      const pips = slDistance / 0.0001;
      calculatedLot = pips > 0 ? maxRiskUsd / (pips * 10) : 0;
      lotUnit = 'Lot FX';
    }
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Kalkulator Risiko & Ukuran Lot Aman (1% Rule)
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
          Protokol Mekanis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Account Balance */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 flex items-center justify-between">
            <span>Modal Akun Trading (USD):</span>
            <span className="font-mono text-white font-bold">${accountBalance.toLocaleString()}</span>
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="number"
              min="100"
              step="500"
              value={accountBalance}
              onChange={(e) => setAccountBalance(Math.max(100, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>
        </div>

        {/* Risk Percentage */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 flex items-center justify-between">
            <span>Batas Risiko per Trade (Maks 1%):</span>
            <span className="font-mono text-cyan-400 font-bold">{riskPercentage}%</span>
          </label>
          <div className="relative">
            <Percent className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="number"
              min="0.25"
              max="1.0"
              step="0.25"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(Math.min(1.0, Math.max(0.1, parseFloat(e.target.value) || 1)))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>
          <span className="text-[10px] text-slate-500">
            *Terkunci maksimal 1.0% sesuai aturan manajemen risiko mandatori
          </span>
        </div>
      </div>

      {/* Calculated Risk Output Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
        <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">MAKS KERUGIAN ($)</span>
          <span className="text-sm font-bold text-rose-400">
            -${maxRiskUsd.toFixed(2)}
          </span>
          <span className="text-[9px] text-slate-500 block">({riskPercentage}% modal)</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">JARAK SL</span>
          <span className="text-sm font-bold text-slate-200">
            {slDistance > 0 ? slDistance.toFixed(2) : '-'}
          </span>
          <span className="text-[9px] text-slate-500 block">Poin/USD</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">RISK-TO-REWARD</span>
          <span
            className={`text-sm font-bold ${
              isRrrValid ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {rrrRatio > 0 ? `1:${rrrRatio.toFixed(2)}` : '-'}
          </span>
          <span className="text-[9px] text-slate-500 block">Min. Wajib 1:2.0</span>
        </div>

        <div className="bg-slate-950/70 border border-cyan-900/60 p-2.5 rounded-xl bg-gradient-to-br from-cyan-950/20 to-transparent">
          <span className="text-[10px] text-cyan-400 block">REKOMENDASI LOT</span>
          <span className="text-base font-extrabold text-cyan-300">
            {calculatedLot > 0 ? calculatedLot.toFixed(asset.includes('BTC') ? 4 : 2) : '0.00'}
          </span>
          <span className="text-[9px] text-slate-400 block">{lotUnit}</span>
        </div>
      </div>

      {/* RRR Warning / Approval Banner */}
      {entryPrice > 0 && stopLoss > 0 && takeProfit > 0 && (
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
            isRrrValid
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
          }`}
        >
          {isRrrValid ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="font-semibold">
              {isRrrValid
                ? 'Validasi Manajemen Risiko Lolos: RRR memenuhi minimal 1:2.'
                : 'Perhatian RRR: Rasio Risk-to-Reward berada di bawah 1:2. Jangan pasang jika tidak memenuhi RRR 1:2.'}
            </span>
            <span className="text-[11px] opacity-80 font-mono">
              Potensi Keuntungan: +${(maxRiskUsd * rrrRatio).toFixed(2)} vs Risiko Maks: -${maxRiskUsd.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

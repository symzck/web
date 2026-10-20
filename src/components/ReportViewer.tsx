import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import {
  FileText,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  Search,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ReportViewerProps {
  result: AnalysisResult | null;
  onAddToLiveMonitor: () => void;
  isAlreadyAdded: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  result,
  onAddToLiveMonitor,
  isAlreadyAdded,
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-500 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-300 mb-1">
          Menunggu Hasil Pemindaian Grafik
        </h4>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
          Pilih salah satu contoh preset grafik di atas atau unggah screenshot TradingView Anda, kemudian klik tombol{' '}
          <span className="text-cyan-400 font-medium">"Jalankan Analisis AI Multimodal"</span>.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.analysisMarkdown);
    setCopied(true);
    sound.playSuccessChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const plan = result.structuredPlan;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
      {/* Header with Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Laporan Hasil Pemindaian Multimodal</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/70 px-2 py-0.5 rounded">
                Model: {result.modelUsed}
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3 h-3" /> {new Date(result.analyzedAt).toLocaleTimeString()} WIB &bull; 100% Mekanis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition flex items-center gap-1.5"
            title="Salin Analisis ke Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={() => {
              onAddToLiveMonitor();
              sound.playOrderExecuted();
            }}
            disabled={isAlreadyAdded || plan.action === 'WAIT'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-lg ${
              isAlreadyAdded
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : plan.action === 'WAIT'
                ? 'bg-slate-800 text-amber-400/80 border border-amber-900/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>
              {isAlreadyAdded
                ? 'Telah Masuk Monitor'
                : plan.action === 'WAIT'
                ? 'Sinyal WAIT (Tanpa Eksekusi)'
                : 'Pantau Real-Time'}
            </span>
          </button>
        </div>
      </div>

      {/* Structured Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">REKOMENDASI</span>
          <div className="flex items-center gap-1 mt-0.5">
            {plan.action === 'BUY' ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : plan.action === 'SELL' ? (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            ) : null}
            <span
              className={`text-sm font-extrabold ${
                plan.action === 'BUY'
                  ? 'text-emerald-400'
                  : plan.action === 'SELL'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {plan.action}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 block">Tren: {plan.trend}</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">ENTRY PRICE</span>
          <span className="text-sm font-bold text-white block mt-0.5">${plan.entryPrice}</span>
          <span className="text-[9px] text-slate-500 block">Live: ${plan.currentPrice}</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">STOP LOSS / TARGET</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs font-bold text-rose-400">${plan.stopLoss}</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-emerald-400">${plan.takeProfit}</span>
          </div>
          <span className="text-[9px] text-cyan-400 block font-semibold">RRR: {plan.rrr}</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-500 block">LOT AMAN (1% RESIKO)</span>
          <span className="text-sm font-extrabold text-cyan-300 block mt-0.5">
            {plan.recommendedLot} Lot
          </span>
          <span className="text-[9px] text-slate-500 block">
            Maks Risiko: -${plan.riskAmountUsd?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Full Markdown Render with Structured Highlights */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs font-sans text-slate-300 leading-relaxed overflow-x-auto">
        <div className="space-y-4 prose prose-invert prose-xs max-w-none">
          {/* Custom parser / styling for mandatory headers */}
          {result.analysisMarkdown.split('### ').map((section, idx) => {
            if (!section.trim()) return null;
            const lines = section.split('\n');
            const title = lines[0].trim();
            const body = lines.slice(1).join('\n');

            const isVisualScan = title.includes('HASIL PEMINDAIAN') || title.includes('VISUAL');
            const isGrounding = title.includes('INTEGRASI SENTIMEN') || title.includes('GROUNDING');
            const isExecution = title.includes('CEKLIS VALIDASI') || title.includes('EKSEKUSI');

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border ${
                  isVisualScan
                    ? 'bg-slate-900/60 border-blue-900/40'
                    : isGrounding
                    ? 'bg-slate-900/60 border-purple-900/40'
                    : isExecution
                    ? 'bg-slate-900/60 border-emerald-900/40'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                  {isVisualScan && <Scale className="w-4 h-4 text-blue-400" />}
                  {isGrounding && <Search className="w-4 h-4 text-purple-400" />}
                  {isExecution && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  <h4 className="font-bold text-xs uppercase tracking-wide text-white font-mono">
                    {title}
                  </h4>
                </div>

                <div className="text-slate-300 space-y-1.5 whitespace-pre-line text-xs font-normal">
                  {body}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Search Grounding Sources */}
      {result.groundingSources && result.groundingSources.length > 0 && (
        <div className="bg-purple-950/20 border border-purple-900/40 p-3 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono font-semibold">
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <span>Sumber Berita & Grounding Terverifikasi (Google Search Live):</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {result.groundingSources.slice(0, 5).map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 border border-purple-800/60 hover:border-purple-500 text-purple-200 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition hover:bg-slate-800 max-w-xs truncate"
              >
                <span className="truncate">{source.title || source.uri}</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

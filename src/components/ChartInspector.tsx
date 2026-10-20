import React, { useState } from 'react';
import { StructuredPlan, PresetChart } from '../types';
import { PRESET_CHARTS } from '../utils/presets';
import {
  Upload,
  Layers,
  ZoomIn,
  TrendingUp,
  TrendingDown,
  Eye,
  CheckCircle2,
  Crosshair,
  Sliders,
  FileImage,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ChartInspectorProps {
  imageSrc: string | null;
  onImageSelected: (dataUrl: string, fileName?: string) => void;
  plan: StructuredPlan | null;
  isScanning: boolean;
  selectedPresetId: string | null;
  onSelectPreset: (preset: PresetChart) => void;
}

export const ChartInspector: React.FC<ChartInspectorProps> = ({
  imageSrc,
  onImageSelected,
  plan,
  isScanning,
  selectedPresetId,
  onSelectPreset,
}) => {
  const [showOverlays, setShowOverlays] = useState(true);
  const [zoomMode, setZoomMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file format gambar (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs tracking-wider uppercase text-slate-200">
            Pemindai Tangkapan Layar Grafik
          </span>
          {plan && (
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                plan.action === 'BUY'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : plan.action === 'SELL'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {plan.action === 'BUY' ? (
                <TrendingUp className="w-3 h-3" />
              ) : plan.action === 'SELL' ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Crosshair className="w-3 h-3" />
              )}
              {plan.action} SIGNAL ({plan.trend})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {imageSrc && (
            <>
              <button
                onClick={() => setShowOverlays(!showOverlays)}
                className={`px-2 py-1 text-xs rounded border transition flex items-center gap-1 ${
                  showOverlays
                    ? 'bg-cyan-950/70 border-cyan-700 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Tampilkan/Sembunyikan Overlay Analisis Mekanis"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Overlay {showOverlays ? 'Aktif' : 'Nonaktif'}</span>
              </button>

              <button
                onClick={() => setZoomMode(!zoomMode)}
                className={`p-1 text-xs rounded border transition ${
                  zoomMode
                    ? 'bg-blue-950 border-blue-700 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Mode Zoom / Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded transition flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Screenshot</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
          </label>
        </div>
      </div>

      {/* Preset Demo Charts for Instant 1-Click Testing */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1 font-mono text-cyan-400">
            <Sparkles className="w-3 h-3" /> Contoh Grafik Siap Uji (1-Klik Tanpa Perlu Cari File):
          </span>
          <span className="text-[10px] text-slate-500">Pilih salah satu untuk menguji pemindaian AI</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {PRESET_CHARTS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-left p-2 rounded-xl border transition flex flex-col gap-1 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                    {preset.title.split('·')[0].trim()}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      preset.badge.includes('BUY')
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                    }`}
                  >
                    {preset.badge.split('·')[0].trim()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl overflow-hidden border bg-slate-950 transition min-h-[380px] lg:min-h-[440px] flex items-center justify-center ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20'
            : 'border-slate-800 shadow-2xl'
        }`}
      >
        {imageSrc ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img
              src={imageSrc}
              alt="Trading Chart Screenshot"
              className={`max-h-[520px] w-auto max-w-full rounded-lg object-contain transition-transform duration-200 ${
                zoomMode ? 'scale-125 cursor-move' : ''
              }`}
            />

            {/* Scanning radar line animation while AI thinking */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl bg-cyan-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_2s_linear_infinite]" />
                <div className="bg-slate-950/90 border border-cyan-500/50 p-4 rounded-xl shadow-2xl max-w-xs text-center flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    Memindai Tangkapan Layar...
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Menganalisis posisi stik lilin terhadap EMA 50, level S/R horizontal, pola candle, osilator RSI & grounding berita live...
                  </p>
                </div>
              </div>
            )}

            {/* Smart Computer Vision HUD Overlays */}
            {showOverlays && plan && !isScanning && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                {/* Top overlay badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 px-2.5 py-1 rounded-lg backdrop-blur shadow-lg">
                    <span className="text-[10px] text-slate-400 font-mono">PROTOKOL EMA 50:</span>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        plan.trend === 'UPTREND'
                          ? 'text-emerald-400'
                          : plan.trend === 'DOWNTREND'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {plan.trend === 'UPTREND'
                        ? 'Candlestick DI ATAS EMA 50 (UPTREND - ONLY BUY)'
                        : plan.trend === 'DOWNTREND'
                        ? 'Candlestick DI BAWAH EMA 50 (DOWNTREND - ONLY SELL)'
                        : 'Harga Bolak-balik EMA 50 (SIDEWAYS - WAIT)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 px-2.5 py-1 rounded-lg backdrop-blur shadow-lg font-mono text-[11px]">
                    <span className="text-slate-400">RRR MEKANIS:</span>
                    <span className="text-cyan-400 font-bold">{plan.rrr}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </div>
                </div>

                {/* Bottom floating execution card preview */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/95 border border-slate-800 p-2.5 rounded-xl backdrop-blur shadow-2xl">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">ENTRY</span>
                      <span className="font-bold text-slate-200">${plan.entryPrice}</span>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <span className="text-rose-400 block text-[9px]">STOP LOSS</span>
                      <span className="font-bold text-rose-400">${plan.stopLoss}</span>
                    </div>
                    <div className="border-l border-slate-800 pl-3">
                      <span className="text-emerald-400 block text-[9px]">TAKE PROFIT (MIN 1:2)</span>
                      <span className="font-bold text-emerald-400">${plan.takeProfit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                      <span className="text-[10px] text-slate-400">LOT AMAN (1%): </span>
                      <span className="font-bold text-cyan-300">{plan.recommendedLot} Lot</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty state dropzone */
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition shadow-inner">
              <FileImage className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Tarik & Lepaskan Screenshot Grafik Trading
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Dukung screenshot TradingView untuk <span className="text-cyan-400 font-semibold">XAUUSD</span> & <span className="text-cyan-400 font-semibold">BTCUSD</span>.
              Anda juga dapat menempelkan langsung dengan <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-700">Ctrl+V</kbd>.
            </p>

            <label className="cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-950 transition flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Pilih Berkas Screenshot</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

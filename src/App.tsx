import React, { useState, useEffect, useCallback } from 'react';
import { TickerBar } from './components/TickerBar';
import { ChartInspector } from './components/ChartInspector';
import { RiskCalculator } from './components/RiskCalculator';
import { ReportViewer } from './components/ReportViewer';
import { TradesMonitor } from './components/TradesMonitor';
import { PRESET_CHARTS } from './utils/presets';
import { sound } from './utils/audio';
import {
  MarketPrice,
  AnalysisResult,
  ActiveTrade,
  PresetChart,
  StructuredPlan,
} from './types';
import {
  BrainCircuit,
  AlertCircle,
  Play,
  RotateCw,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

const DEFAULT_PRICES: Record<string, MarketPrice> = {
  XAUUSD: {
    symbol: 'XAU/USD',
    name: 'Spot Gold',
    price: 2658.5,
    change24h: 0.64,
    high24h: 2668.2,
    low24h: 2645.1,
    pipValue: 0.1,
    spread: 0.18,
  },
  BTCUSD: {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    price: 67840.0,
    change24h: 2.18,
    high24h: 68450.0,
    low24h: 66900.0,
    pipValue: 1.0,
    spread: 1.5,
  },
  EURUSD: {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.0845,
    change24h: -0.15,
    high24h: 1.089,
    low24h: 1.082,
    pipValue: 0.0001,
    spread: 0.6,
  },
  GBPUSD: {
    symbol: 'GBP/USD',
    name: 'British Pound',
    price: 1.298,
    change24h: 0.28,
    high24h: 1.302,
    low24h: 1.294,
    pipValue: 0.0001,
    spread: 0.8,
  },
  DXY: {
    symbol: 'DXY',
    name: 'US Dollar Index',
    price: 103.85,
    change24h: -0.22,
    high24h: 104.2,
    low24h: 103.6,
    pipValue: 0.01,
    spread: 0.05,
  },
  ETHUSD: {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    price: 2642.5,
    change24h: 1.45,
    high24h: 2680.0,
    low24h: 2590.0,
    pipValue: 0.1,
    spread: 0.4,
  },
};

export default function App() {
  // State
  const [prices, setPrices] = useState<Record<string, MarketPrice>>(DEFAULT_PRICES);
  const [imageSrc, setImageSrc] = useState<string | null>(PRESET_CHARTS[0].svgDataUri);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(PRESET_CHARTS[0].id);
  const [imageFileName, setImageFileName] = useState<string>('preset-xauusd-h1.svg');

  // Trader Settings
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1.0); // max 1% mandatory
  const [userNotes, setUserNotes] = useState<string>('');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Analysis State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Trades Monitoring
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);

  // Fetch live market prices periodically from backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/market-prices');
        if (res.ok) {
          const data = await res.json();
          if (data.prices) setPrices(data.prices);
        }
      } catch (err) {
        // use fallback prices
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Support Ctrl+V paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const result = event.target?.result as string;
              if (result) {
                setImageSrc(result);
                setSelectedPresetId(null);
                setImageFileName(`clipboard-${Date.now()}.png`);
                sound.playScanBeep();
              }
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetChart) => {
    setImageSrc(preset.svgDataUri);
    setSelectedPresetId(preset.id);
    setImageFileName(`${preset.id}.svg`);
    sound.playScanBeep();
  };

  // Run AI Multimodal Visual Scanning
  const handleAnalyzeChart = async () => {
    if (!imageSrc) {
      setErrorMessage('Silakan pilih salah satu preset grafik atau unggah screenshot terlebih dahulu.');
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);
    sound.playScanBeep();

    // Visual step sequence
    const steps = [
      'Memindai stik lilin terhadap posisi garis EMA 50...',
      'Mendeteksi level horizontal puncak & lembah (Support & Resistance)...',
      'Menganalisis pola candlestick terujung & osilator RSI...',
      'Melakukan grounding berita makro/fundamental live via Google Search...',
      'Menghitung ukuran lot aman (1% risk) & validasi RRR minimal 1:2...',
    ];

    let currentStepIdx = 0;
    setScanStep(steps[0]);
    const stepInterval = setInterval(() => {
      currentStepIdx = (currentStepIdx + 1) % steps.length;
      setScanStep(steps[currentStepIdx]);
    }, 1800);

    try {
      const response = await fetch('/api/analyze-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          accountBalance,
          riskPercentage,
          assetHint: selectedPresetId ? (selectedPresetId.includes('btc') ? 'BTCUSD' : 'XAUUSD') : '',
          userNotes,
        }),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal memproses analisis gambar dengan AI.');
      }

      setAnalysisResult(data);
      sound.playSuccessChime();
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'Terjadi gangguan saat memindai grafik.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  // Add plan to live monitor
  const handleAddToLiveMonitor = () => {
    if (!analysisResult?.structuredPlan) return;
    const plan = analysisResult.structuredPlan;

    const newTrade: ActiveTrade = {
      id: `trade-${Date.now()}`,
      createdAt: Date.now(),
      asset: plan.asset || 'XAUUSD',
      timeframe: plan.timeframe || 'H1',
      action: plan.action,
      entryPrice: plan.entryPrice || plan.currentPrice,
      stopLoss: plan.stopLoss,
      takeProfit: plan.takeProfit,
      rrr: plan.rrr,
      lotSize: plan.recommendedLot || 0.1,
      riskAmountUsd: plan.riskAmountUsd || (accountBalance * riskPercentage) / 100,
      status: 'RUNNING',
      currentPrice: plan.currentPrice,
      pnlUsd: 0,
      pnlPercent: 0,
      notes: `${plan.trend} · ${plan.candlestickPattern || 'EMA 50 & S/R Rule'}`,
    };

    setActiveTrades((prev) => [newTrade, ...prev]);
  };

  const handleUpdateTrade = useCallback((updated: ActiveTrade) => {
    setActiveTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  const handleRemoveTrade = useCallback((id: string) => {
    setActiveTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const isAlreadyAdded = Boolean(
    analysisResult &&
      activeTrades.some(
        (t) =>
          t.asset === analysisResult.structuredPlan.asset &&
          t.entryPrice === analysisResult.structuredPlan.entryPrice &&
          t.status === 'RUNNING'
      )
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Ticker Ribbon */}
      <TickerBar
        prices={prices}
        soundMuted={soundMuted}
        onToggleSound={() => setSoundMuted(!soundMuted)}
        isScanning={isScanning}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5">
        {/* Banner Alert if any */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-bold ml-2"
            >
              &times;
            </button>
          </div>
        )}

        {/* Top Split Layout: Chart Inspector + Controls on Left, Calculator & Reports on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (7 cols): Visual Chart Inspector */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ChartInspector
              imageSrc={imageSrc}
              onImageSelected={(dataUrl, name) => {
                setImageSrc(dataUrl);
                setSelectedPresetId(null);
                if (name) setImageFileName(name);
                sound.playScanBeep();
              }}
              plan={analysisResult?.structuredPlan || null}
              isScanning={isScanning}
              selectedPresetId={selectedPresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Execute Analysis Action Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Eksekusi AlphaVision-Trader AI
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      100% Keputusan Mekanis &bull; gemini-4-argon &bull; High Thinking &bull; Grounding Berita Live
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  Protokol Mandatori
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAnalyzeChart}
                disabled={isScanning || !imageSrc}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg ${
                  isScanning
                    ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-cyan-950/50 hover:shadow-cyan-900/60 active:scale-[0.99]'
                }`}
              >
                {isScanning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="font-mono text-xs">{scanStep || 'Memproses Visual...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                    <span>JALANKAN PEMINDAIAN GRAFIK (100% MEKANIS)</span>
                  </>
                )}
              </button>

              {/* Protocol Checklist Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono text-slate-400 pt-1">
                <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">1.</span> EMA 50 Trend Rule
                </div>
                <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">2.</span> S/R & CHoCH Scan
                </div>
                <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">3.</span> RSI & Candle Shape
                </div>
                <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">4.</span> RRR &ge; 1:2 & Lot 1%
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Risk Calculator & Report Viewer */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <RiskCalculator
              accountBalance={accountBalance}
              setAccountBalance={setAccountBalance}
              riskPercentage={riskPercentage}
              setRiskPercentage={setRiskPercentage}
              entryPrice={analysisResult?.structuredPlan.entryPrice || 0}
              stopLoss={analysisResult?.structuredPlan.stopLoss || 0}
              takeProfit={analysisResult?.structuredPlan.takeProfit || 0}
              asset={analysisResult?.structuredPlan.asset || 'XAUUSD'}
            />

            <ReportViewer
              result={analysisResult}
              onAddToLiveMonitor={handleAddToLiveMonitor}
              isAlreadyAdded={isAlreadyAdded}
            />
          </div>
        </div>

        {/* Bottom Section: Real-time Live Trades Monitoring Dashboard */}
        <div className="w-full">
          <TradesMonitor
            trades={activeTrades}
            onUpdateTrade={handleUpdateTrade}
            onRemoveTrade={handleRemoveTrade}
            prices={prices}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AlphaVision-Trader AI &bull; Computer Vision & Deep Grounding Trading Engine
          </span>
          <span className="text-slate-600 text-[11px]">
            Strict Rule: Candle di atas EMA 50 = Buy Only | Candle di bawah EMA 50 = Sell Only | RRR &ge; 1:2
          </span>
        </div>
      </footer>
    </div>
  );
}

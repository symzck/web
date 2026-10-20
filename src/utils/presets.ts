import { PresetChart } from '../types';

function createSvgDataUri(svgContent: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgContent)));
  return `data:image/svg+xml;base64,${base64}`;
}

// 1. XAUUSD H1 Bullish Pullback to EMA 50 & Support at 2650
const xauBullishSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600" style="background:#131722; font-family:-apple-system,BlinkMacSystemFont,'Trebuchet MS',Roboto,sans-serif;">
  <!-- Grid -->
  <defs>
    <pattern id="grid" width="80" height="50" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#1e222d" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="900" height="460" fill="url(#grid)" />
  <rect y="460" width="900" height="140" fill="#11141d" />

  <!-- Top Bar / Watermark -->
  <text x="25" y="35" fill="#d1d4dc" font-size="18" font-weight="700">XAUUSD · 1H · OANDA</text>
  <text x="240" y="35" fill="#089981" font-size="14" font-weight="600">● Bullish Trend</text>
  <text x="25" y="58" fill="#787b86" font-size="12">EMA (50, close, 0): <tspan fill="#2962ff" font-weight="600">2646.80</tspan> | RSI (14, close): <tspan fill="#b2b5be">43.2</tspan></text>

  <!-- Horizontal Resistance Level: 2674.50 -->
  <line x1="0" y1="110" x2="900" y2="110" stroke="#f23645" stroke-dasharray="4,4" stroke-width="1.5" />
  <text x="750" y="104" fill="#f23645" font-size="11" font-weight="600">Resistensi Puncak 2674.50</text>

  <!-- Horizontal Support Level: 2648.00 -->
  <rect x="0" y="325" width="900" height="25" fill="#089981" fill-opacity="0.12" />
  <line x1="0" y1="337" x2="900" y2="337" stroke="#089981" stroke-dasharray="4,4" stroke-width="1.5" />
  <text x="750" y="332" fill="#089981" font-size="11" font-weight="600">Support Kuat 2648.00</text>

  <!-- EMA 50 line (curving upwards showing clear UPTREND) -->
  <path d="M 30 390 C 200 375, 400 355, 600 342 C 750 335, 820 338, 890 340" fill="none" stroke="#2962ff" stroke-width="3" />
  <text x="830" y="355" fill="#2962ff" font-size="12" font-weight="700">EMA 50</text>

  <!-- Candlesticks Sequence (Bullish continuation after pullback to EMA50) -->
  <!-- Candle 1 (Green) -->
  <line x1="70" y1="360" x2="70" y2="410" stroke="#089981" stroke-width="2"/>
  <rect x="63" y="370" width="14" height="30" fill="#089981"/>

  <!-- Candle 2 (Green) -->
  <line x1="120" y1="330" x2="120" y2="385" stroke="#089981" stroke-width="2"/>
  <rect x="113" y="340" width="14" height="35" fill="#089981"/>

  <!-- Candle 3 (Red pullback) -->
  <line x1="170" y1="300" x2="170" y2="360" stroke="#f23645" stroke-width="2"/>
  <rect x="163" y="315" width="14" height="30" fill="#f23645"/>

  <!-- Candle 4 (Green rally) -->
  <line x1="220" y1="230" x2="220" y2="320" stroke="#089981" stroke-width="2"/>
  <rect x="213" y="240" width="14" height="60" fill="#089981"/>

  <!-- Candle 5 (Green rally) -->
  <line x1="270" y1="160" x2="270" y2="250" stroke="#089981" stroke-width="2"/>
  <rect x="263" y="170" width="14" height="70" fill="#089981"/>

  <!-- Candle 6 (Peak tested resistance 2674) -->
  <line x1="320" y1="105" x2="320" y2="190" stroke="#f23645" stroke-width="2"/>
  <rect x="313" y="120" width="14" height="50" fill="#f23645"/>

  <!-- Candle 7 (Red pullback down to EMA50) -->
  <line x1="380" y1="150" x2="380" y2="230" stroke="#f23645" stroke-width="2"/>
  <rect x="373" y="160" width="14" height="60" fill="#f23645"/>

  <!-- Candle 8 (Red) -->
  <line x1="440" y1="210" x2="440" y2="280" stroke="#f23645" stroke-width="2"/>
  <rect x="433" y="220" width="14" height="50" fill="#f23645"/>

  <!-- Candle 9 (Red touching Support) -->
  <line x1="500" y1="260" x2="500" y2="345" stroke="#f23645" stroke-width="2"/>
  <rect x="493" y="270" width="14" height="65" fill="#f23645"/>

  <!-- Candle 10 (Doji at EMA50) -->
  <line x1="560" y1="320" x2="560" y2="355" stroke="#d1d4dc" stroke-width="2"/>
  <rect x="553" y="333" width="14" height="6" fill="#d1d4dc"/>

  <!-- Candle 11 (Bullish Hammer rejection on EMA50) -->
  <line x1="620" y1="300" x2="620" y2="350" stroke="#089981" stroke-width="2"/>
  <rect x="613" y="300" width="14" height="18" fill="#089981"/>

  <!-- Candle 12 (Bullish Confirming Green) -->
  <line x1="680" y1="270" x2="680" y2="325" stroke="#089981" stroke-width="2"/>
  <rect x="673" y="280" width="14" height="35" fill="#089981"/>

  <!-- Candle 13 (Rightmost Active Candle: Price above EMA 50 at 2658.50) -->
  <line x1="740" y1="240" x2="740" y2="295" stroke="#089981" stroke-width="2"/>
  <rect x="733" y="248" width="14" height="38" fill="#089981"/>

  <!-- Current Price Horizontal Cursor Line -->
  <line x1="0" y1="248" x2="900" y2="248" stroke="#089981" stroke-dasharray="2,2" stroke-width="1.2" />

  <!-- Right Y-Axis Price Panel -->
  <rect x="900" y="0" width="100" height="600" fill="#131722" stroke="#2a2e39" stroke-width="1" />
  <text x="912" y="115" fill="#787b86" font-size="11">2675.00</text>
  <text x="912" y="180" fill="#787b86" font-size="11">2668.00</text>
  <text x="912" y="252" fill="#ffffff" font-size="12" font-weight="700">2658.50</text>
  <rect x="900" y="238" width="100" height="22" fill="#089981" rx="3" />
  <text x="910" y="254" fill="#ffffff" font-size="12" font-weight="bold">2658.50</text>

  <text x="912" y="342" fill="#2962ff" font-size="11" font-weight="600">2646.80</text>
  <text x="912" y="420" fill="#787b86" font-size="11">2635.00</text>

  <!-- RSI Subpanel (Bottom) -->
  <line x1="0" y1="460" x2="1000" y2="460" stroke="#2a2e39" stroke-width="1.5" />
  <text x="25" y="482" fill="#787b86" font-size="11" font-weight="bold">RSI 14 (SMA 14)</text>
  <!-- Overbought 70 -->
  <line x1="0" y1="495" x2="900" y2="495" stroke="#787b86" stroke-dasharray="3,3" stroke-width="1"/>
  <text x="910" y="498" fill="#787b86" font-size="10">70.0</text>
  <!-- Middle 50 -->
  <line x1="0" y1="530" x2="900" y2="530" stroke="#2a2e39" stroke-dasharray="2,2" stroke-width="1"/>
  <text x="910" y="533" fill="#787b86" font-size="10">50.0</text>
  <!-- Oversold 30 -->
  <line x1="0" y1="565" x2="900" y2="565" stroke="#787b86" stroke-dasharray="3,3" stroke-width="1"/>
  <text x="910" y="568" fill="#787b86" font-size="10">30.0</text>

  <!-- RSI Line curving up from 34 to 43.2 -->
  <path d="M 50 515 C 200 485, 300 490, 360 520 C 450 560, 520 562, 600 558 C 670 545, 710 535, 750 522" fill="none" stroke="#9c27b0" stroke-width="2.5" />
</svg>`;

// 2. BTCUSD H4 Bearish Breakdown below EMA 50
const btcBearishSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600" style="background:#131722; font-family:-apple-system,BlinkMacSystemFont,'Trebuchet MS',Roboto,sans-serif;">
  <defs>
    <pattern id="grid2" width="80" height="50" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#1e222d" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="900" height="460" fill="url(#grid2)" />
  <rect y="460" width="900" height="140" fill="#11141d" />

  <!-- Top Bar / Watermark -->
  <text x="25" y="35" fill="#d1d4dc" font-size="18" font-weight="700">BTCUSD · 4H · BINANCE</text>
  <text x="240" y="35" fill="#f23645" font-size="14" font-weight="600">● Bearish Breakdown</text>
  <text x="25" y="58" fill="#787b86" font-size="12">EMA (50, close, 0): <tspan fill="#2962ff" font-weight="600">68,450.0</tspan> | RSI (14, close): <tspan fill="#f23645">38.4 (Bearish Divergence)</tspan></text>

  <!-- Horizontal Resistance (Previous Support Broken -> Resistance): 68,200.0 -->
  <line x1="0" y1="210" x2="900" y2="210" stroke="#f23645" stroke-dasharray="4,4" stroke-width="1.5" />
  <text x="700" y="202" fill="#f23645" font-size="11" font-weight="600">Resistance Retest 68,200.0</text>

  <!-- Key Support Level Target: 65,500.0 -->
  <line x1="0" y1="410" x2="900" y2="410" stroke="#089981" stroke-dasharray="4,4" stroke-width="1.5" />
  <text x="730" y="402" fill="#089981" font-size="11" font-weight="600">Target Support 65,500.0</text>

  <!-- EMA 50 line (sloping downward, candles clearly BELOW EMA 50) -->
  <path d="M 30 140 C 220 160, 420 185, 620 205 C 750 215, 820 220, 890 225" fill="none" stroke="#2962ff" stroke-width="3" />
  <text x="830" y="215" fill="#2962ff" font-size="12" font-weight="700">EMA 50</text>

  <!-- Candlesticks Sequence (Bearish engulfing breakdown below EMA 50) -->
  <!-- Candle 1 (Green peak) -->
  <line x1="70" y1="80" x2="70" y2="170" stroke="#089981" stroke-width="2"/>
  <rect x="63" y="90" width="14" height="60" fill="#089981"/>

  <!-- Candle 2 (Bearish Shooting Star rejection at 69,500) -->
  <line x1="130" y1="60" x2="130" y2="160" stroke="#f23645" stroke-width="2"/>
  <rect x="123" y="115" width="14" height="25" fill="#f23645"/>

  <!-- Candle 3 (Red drop) -->
  <line x1="190" y1="130" x2="190" y2="210" stroke="#f23645" stroke-width="2"/>
  <rect x="183" y="140" width="14" height="60" fill="#f23645"/>

  <!-- Candle 4 (Consolidation near EMA 50) -->
  <line x1="250" y1="180" x2="250" y2="240" stroke="#089981" stroke-width="2"/>
  <rect x="243" y="190" width="14" height="30" fill="#089981"/>

  <!-- Candle 5 (Heavy Breakdown below EMA 50) -->
  <line x1="310" y1="195" x2="310" y2="295" stroke="#f23645" stroke-width="2"/>
  <rect x="303" y="210" width="14" height="75" fill="#f23645"/>

  <!-- Candle 6 (Continuation red) -->
  <line x1="370" y1="270" x2="370" y2="340" stroke="#f23645" stroke-width="2"/>
  <rect x="363" y="280" width="14" height="50" fill="#f23645"/>

  <!-- Candle 7 (Minor pullback to retest broken EMA 50) -->
  <line x1="430" y1="230" x2="430" y2="310" stroke="#089981" stroke-width="2"/>
  <rect x="423" y="240" width="14" height="40" fill="#089981"/>

  <!-- Candle 8 (Bearish Engulfing right under EMA 50 rejection) -->
  <line x1="490" y1="225" x2="490" y2="330" stroke="#f23645" stroke-width="2"/>
  <rect x="483" y="235" width="14" height="80" fill="#f23645"/>

  <!-- Candle 9 (Rightmost candle: price well below EMA 50 at 67,200) -->
  <line x1="550" y1="290" x2="550" y2="365" stroke="#f23645" stroke-width="2"/>
  <rect x="543" y="305" width="14" height="50" fill="#f23645"/>

  <!-- Current Price Horizontal Cursor Line -->
  <line x1="0" y1="355" x2="900" y2="355" stroke="#f23645" stroke-dasharray="2,2" stroke-width="1.2" />

  <!-- Right Y-Axis Price Panel -->
  <rect x="900" y="0" width="100" height="600" fill="#131722" stroke="#2a2e39" stroke-width="1" />
  <text x="912" y="90" fill="#787b86" font-size="11">69,800.0</text>
  <text x="912" y="160" fill="#787b86" font-size="11">68,900.0</text>
  <text x="912" y="222" fill="#2962ff" font-size="11" font-weight="600">68,450.0</text>
  <rect x="900" y="345" width="100" height="22" fill="#f23645" rx="3" />
  <text x="910" y="361" fill="#ffffff" font-size="12" font-weight="bold">67,200.0</text>
  <text x="912" y="415" fill="#089981" font-size="11" font-weight="600">65,500.0</text>
  <text x="912" y="450" fill="#787b86" font-size="11">64,000.0</text>

  <!-- RSI Subpanel (Bottom) -->
  <line x1="0" y1="460" x2="1000" y2="460" stroke="#2a2e39" stroke-width="1.5" />
  <text x="25" y="482" fill="#787b86" font-size="11" font-weight="bold">RSI 14 (SMA 14)</text>
  <line x1="0" y1="495" x2="900" y2="495" stroke="#787b86" stroke-dasharray="3,3" stroke-width="1"/>
  <text x="910" y="498" fill="#787b86" font-size="10">70.0</text>
  <line x1="0" y1="530" x2="900" y2="530" stroke="#2a2e39" stroke-dasharray="2,2" stroke-width="1"/>
  <text x="910" y="533" fill="#787b86" font-size="10">50.0</text>
  <line x1="0" y1="565" x2="900" y2="565" stroke="#787b86" stroke-dasharray="3,3" stroke-width="1"/>
  <text x="910" y="568" fill="#787b86" font-size="10">30.0</text>

  <!-- RSI Line dropping from 62 down to 38.4 -->
  <path d="M 50 510 C 130 500, 200 525, 310 545 C 420 540, 480 548, 560 560" fill="none" stroke="#9c27b0" stroke-width="2.5" />
</svg>`;

// 3. XAUUSD M15 Change of Character (CHoCH) with Reversal
const xauChochSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600" style="background:#131722; font-family:-apple-system,BlinkMacSystemFont,'Trebuchet MS',Roboto,sans-serif;">
  <defs>
    <pattern id="grid3" width="80" height="50" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#1e222d" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="900" height="460" fill="url(#grid3)" />
  <rect y="460" width="900" height="140" fill="#11141d" />

  <text x="25" y="35" fill="#d1d4dc" font-size="18" font-weight="700">XAUUSD · 15M · FXCM</text>
  <text x="240" y="35" fill="#3b82f6" font-size="14" font-weight="600">● CHoCH Breakout & EMA 50 Cross</text>
  <text x="25" y="58" fill="#787b86" font-size="12">EMA (50, close, 0): <tspan fill="#2962ff" font-weight="600">2654.20</tspan> | RSI (14, close): <tspan fill="#089981">56.5 (Bullish Divergence)</tspan></text>

  <!-- CHoCH Breakout Line: 2657.00 -->
  <line x1="0" y1="230" x2="900" y2="230" stroke="#f59e0b" stroke-dasharray="3,3" stroke-width="2" />
  <text x="680" y="222" fill="#f59e0b" font-size="11" font-weight="700">CHoCH Level 2657.00 (Breakout)</text>

  <!-- Support Base: 2644.00 -->
  <line x1="0" y1="380" x2="900" y2="380" stroke="#089981" stroke-dasharray="4,4" stroke-width="1.5" />
  <text x="730" y="372" fill="#089981" font-size="11" font-weight="600">Double Bottom Support 2644.00</text>

  <!-- EMA 50 flattening and turning up -->
  <path d="M 30 260 C 220 280, 420 290, 600 270 C 720 255, 800 248, 890 242" fill="none" stroke="#2962ff" stroke-width="3" />
  <text x="830" y="235" fill="#2962ff" font-size="12" font-weight="700">EMA 50</text>

  <!-- Candlesticks Sequence (Double Bottom with RSI Bullish divergence then Break above EMA50) -->
  <line x1="70" y1="240" x2="70" y2="340" stroke="#f23645" stroke-width="2"/>
  <rect x="63" y="250" width="14" height="80" fill="#f23645"/>

  <!-- Low 1: 2644 -->
  <line x1="130" y1="320" x2="130" y2="390" stroke="#f23645" stroke-width="2"/>
  <rect x="123" y="330" width="14" height="45" fill="#f23645"/>

  <!-- Neckline bounce -->
  <line x1="200" y1="260" x2="200" y2="330" stroke="#089981" stroke-width="2"/>
  <rect x="193" y="270" width="14" height="50" fill="#089981"/>

  <!-- Low 2: 2645 (Higher low + pinbar) -->
  <line x1="270" y1="310" x2="270" y2="385" stroke="#089981" stroke-width="2"/>
  <rect x="263" y="320" width="14" height="30" fill="#089981"/>

  <!-- Strong green candle crossing EMA 50 -->
  <line x1="340" y1="220" x2="340" y2="310" stroke="#089981" stroke-width="2"/>
  <rect x="333" y="230" width="14" height="70" fill="#089981"/>

  <!-- Retest EMA 50 from above -->
  <line x1="410" y1="235" x2="410" y2="280" stroke="#f23645" stroke-width="2"/>
  <rect x="403" y="245" width="14" height="25" fill="#f23645"/>

  <!-- CHoCH Breakout Candle: Price closed above 2657 at 2661.20 -->
  <line x1="480" y1="180" x2="480" y2="260" stroke="#089981" stroke-width="2"/>
  <rect x="473" y="190" width="14" height="60" fill="#089981"/>

  <!-- Current Live Price line: 2661.20 -->
  <line x1="0" y1="190" x2="900" y2="190" stroke="#089981" stroke-dasharray="2,2" stroke-width="1.2" />

  <rect x="900" y="0" width="100" height="600" fill="#131722" stroke="#2a2e39" stroke-width="1" />
  <text x="912" y="120" fill="#787b86" font-size="11">2672.00</text>
  <rect x="900" y="180" width="100" height="22" fill="#089981" rx="3" />
  <text x="910" y="196" fill="#ffffff" font-size="12" font-weight="bold">2661.20</text>
  <text x="912" y="245" fill="#2962ff" font-size="11" font-weight="600">2654.20</text>
  <text x="912" y="385" fill="#089981" font-size="11" font-weight="600">2644.00</text>

  <line x1="0" y1="460" x2="1000" y2="460" stroke="#2a2e39" stroke-width="1.5" />
  <text x="25" y="482" fill="#787b86" font-size="11" font-weight="bold">RSI 14 (SMA 14)</text>
  <line x1="0" y1="495" x2="900" y2="495" stroke="#787b86" stroke-dasharray="3,3" stroke-width="1"/>
  <text x="910" y="498" fill="#787b86" font-size="10">70.0</text>
  <line x1="0" y1="530" x2="900" y2="530" stroke="#2a2e39" stroke-dasharray="2,2" stroke-width="1"/>
  <text x="910" y="533" fill="#787b86" font-size="10">50.0</text>
  <line x1="0" y1="565" x2="900" y2="565" stroke="#787b86" stroke-dasharray="3,3" stroke-width="1"/>
  <text x="910" y="568" fill="#787b86" font-size="10">30.0</text>

  <!-- RSI Line rising from oversold 28 into bullish 56.5 zone -->
  <path d="M 50 565 C 130 568, 200 550, 270 545 C 340 520, 420 522, 490 505" fill="none" stroke="#9c27b0" stroke-width="2.5" />
</svg>`;

export const PRESET_CHARTS: PresetChart[] = [
  {
    id: 'xauusd-h1-bullish',
    title: 'XAUUSD H1 · Pullback EMA 50 & Rejection Support',
    asset: 'XAUUSD',
    timeframe: 'H1',
    badge: 'UPTREND · BUY SETUP',
    description: 'Candlestick memantul tepat di atas garis EMA 50 dengan pola Hammer Rejection di level Support $2648.',
    scenario: 'Harga berada di atas garis EMA 50. Candlestick terbaru membentuk pola penolakan di area support horizontal. RSI di level netral 43.2 berbalik arah naik.',
    svgDataUri: createSvgDataUri(xauBullishSvg),
  },
  {
    id: 'btcusd-h4-bearish',
    title: 'BTCUSD H4 · Bearish Breakdown di Bawah EMA 50',
    asset: 'BTCUSD',
    timeframe: 'H4',
    badge: 'DOWNTREND · SELL SETUP',
    description: 'Candlestick menembus ke bawah EMA 50 di $68,450 dan mengalami retest penolakan (Shooting Star & Bearish Engulfing).',
    scenario: 'Struktur pasar DOWNTREND karena candlestick berada kokoh di bawah garis EMA 50. RSI menunjukkan bearish divergence dan momentum pelemahan.',
    svgDataUri: createSvgDataUri(btcBearishSvg),
  },
  {
    id: 'xauusd-m15-choch',
    title: 'XAUUSD M15 · Change of Character (CHoCH) & EMA Cross',
    asset: 'XAUUSD',
    timeframe: 'M15',
    badge: 'CHoCH REVERSAL · BUY SETUP',
    description: 'Double bottom di $2644 dengan Bullish Divergence pada RSI, menembus garis EMA 50 dan level CHoCH $2657.',
    scenario: 'Pola pembalikan arah dari oversold RSI (28) dengan penembusan stik lilin di atas EMA 50 dan validasi level horizontal swing high.',
    svgDataUri: createSvgDataUri(xauChochSvg),
  },
];

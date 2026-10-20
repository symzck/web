import express, { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client setup adhering to skill instructions
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'AlphaVision-Trader AI',
    timestamp: new Date().toISOString(),
  });
});

// API: Live market prices simulator / real tick aggregator
app.get('/api/market-prices', (_req: Request, res: Response) => {
  // Base realistic market levels with micro-fluctuations
  const now = Date.now();
  const seed = (now / 4000) % 100;
  const sinVal = Math.sin(seed);
  const cosVal = Math.cos(seed * 0.7);

  const xauBase = 2658.45 + sinVal * 2.8;
  const btcBase = 67840.0 + cosVal * 125.0;
  const eurBase = 1.0845 + sinVal * 0.0012;
  const gbpBase = 1.2980 + cosVal * 0.0015;
  const dxyBase = 103.85 - sinVal * 0.12;
  const ethBase = 2642.5 + sinVal * 8.4;

  res.json({
    timestamp: now,
    prices: {
      XAUUSD: {
        symbol: 'XAU/USD',
        name: 'Spot Gold',
        price: parseFloat(xauBase.toFixed(2)),
        change24h: 0.64 + sinVal * 0.1,
        high24h: 2668.2,
        low24h: 2645.1,
        pipValue: 0.1,
        spread: 0.18,
      },
      BTCUSD: {
        symbol: 'BTC/USD',
        name: 'Bitcoin',
        price: parseFloat(btcBase.toFixed(1)),
        change24h: 2.18 + cosVal * 0.25,
        high24h: 68450.0,
        low24h: 66900.0,
        pipValue: 1.0,
        spread: 1.5,
      },
      EURUSD: {
        symbol: 'EUR/USD',
        name: 'Euro / US Dollar',
        price: parseFloat(eurBase.toFixed(5)),
        change24h: -0.15 + sinVal * 0.05,
        high24h: 1.089,
        low24h: 1.082,
        pipValue: 0.0001,
        spread: 0.6,
      },
      GBPUSD: {
        symbol: 'GBP/USD',
        name: 'British Pound',
        price: parseFloat(gbpBase.toFixed(5)),
        change24h: 0.28 + cosVal * 0.04,
        high24h: 1.302,
        low24h: 1.294,
        pipValue: 0.0001,
        spread: 0.8,
      },
      DXY: {
        symbol: 'DXY',
        name: 'US Dollar Index',
        price: parseFloat(dxyBase.toFixed(2)),
        change24h: -0.22 - sinVal * 0.03,
        high24h: 104.2,
        low24h: 103.6,
        pipValue: 0.01,
        spread: 0.05,
      },
      ETHUSD: {
        symbol: 'ETH/USD',
        name: 'Ethereum',
        price: parseFloat(ethBase.toFixed(2)),
        change24h: 1.45 + sinVal * 0.15,
        high24h: 2680.0,
        low24h: 2590.0,
        pipValue: 0.1,
        spread: 0.4,
      },
    },
  });
});

// API: Chart Analysis with Gemini 4 Argon + Thinking Level High + Search Grounding
app.post('/api/analyze-chart', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/png',
      accountBalance = 10000,
      riskPercentage = 1,
      assetHint = '',
      userNotes = '',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Data gambar tangkapan layar (screenshot) grafik wajib diunggah.' });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const ai = getGeminiClient();

    const systemPrompt = `Anda adalah "AlphaVision-Trader AI", sebuah agen AI Multimodal Ekspert yang bertugas menganalisis tangkapan layar (screenshot) grafik perdagangan Forex (XAUUSD) dan Kripto (BTCUSD) untuk memberikan keputusan trading yang 100% mekanis dan bebas emosi.

FUNGSI UTAMA & INPUT PENGGUNA:
Pengguna mengunggah gambar screenshot grafik (biasanya dari TradingView). Tugas Anda adalah melakukan pemindaian visual (computer vision) secara presisi terhadap komponen grafik tersebut, mendeteksi harga saat ini, lalu menyelaraskannya dengan data pasar riil (grounding) sebelum memberikan kesimpulan.

PROTOKOL PEMINDAIAN VISUAL (WAJIB DIPATUHI SECARA KETAT):
1. Deteksi Tren Visual: Lihat posisi stik lilin (candlestick) relatif terhadap garis Exponential Moving Average (EMA 50) yang ada di gambar.
   - Candlestick di atas garis EMA 50 = Struktur pasar dalam keadaan UPTREND (Hanya boleh cari opsi BUY).
   - Candlestick di bawah garis EMA 50 = Struktur pasar dalam keadaan DOWNTREND (Hanya boleh cari opsi SELL).
   - Jika harga memotong bolak-balik tanpa arah jelas = SIDEWAYS / WAIT.
2. Baca Level Horizontal: Pindai area puncak (puncak masa lalu) dan lembah pada gambar untuk menentukan di mana area Support dan Resistance horizontal berada. Deteksi jika ada pola penembusan (Breakout) atau pembalikan (CHoCH / Change of Character).
3. Pindai Bentuk Candlestick: Cari stik lilin terbaru/terujung di sebelah kanan grafik. Identifikasi apakah ada pola penolakan harga (seperti Hammer, Inverted Hammer, Shooting Star, Bullish/Bearish Engulfing, Morning/Evening Star, Doji).
4. Analisis Panel Indikator Bawah: Periksa grafik osilator RSI pada gambar (jika ada). Pindai secara visual apakah garis RSI berada di area ekstrem Overbought (>=70), Oversold (<=30), atau sedang mengalami ketidaksesuaian arah dengan harga (Bearish/Bullish Divergence).

ATURAN MANAGING RISK MANDATORI:
- Rasio Risk-to-Reward (RRR) WAJIB minimal 1:2 (misal Stop Loss 20 pip, Take Profit minimal 40 pip).
- Risiko per trade dibatasi maksimal ${riskPercentage}% dari modal pengguna ($${accountBalance.toLocaleString()}), yaitu $${((accountBalance * riskPercentage) / 100).toFixed(2)}.
- Hitung ukuran lot aman (Position Sizing) secara spesifik berdasarkan jarak Stop Loss dari Entry Price.
  * Rumus Forex/XAUUSD: Lot = (Risk Amount $) / (Stop Loss Distance in pips * pip value per standard lot).
  * Rumus Kripto/BTCUSD: Position Size (BTC/USD) = (Risk Amount $) / (|Entry - Stop Loss|).

FORMAT RESUME OUTPUT PASCA PEMINDAIAN (WAJIB DIIKUTI PERSIS DENGAN FORMAT BERIKUT):

### 🔍 HASIL PEMINDAIAN GRAFIK (VISUAL ANALYSIS)
- Ticker Aset & Timeframe Terdeteksi: [Misal: XAUUSD, H1]
- Harga Berjalan Saat Ini (Live Price): [Sebutkan angka harga terujung kanan di grafik]
- Arah Tren terhadap EMA 50: [Di atas / Di bawah EMA 50 - UPTREND / DOWNTREND]
- Kondisi RSI & Pola Candlestick Terlihat: [Sebutkan kondisi jenuh/divergence dan pola candle yang Anda lihat di gambar]

### 📰 INTEGRASI SENTIMEN BERITA LIVE (GROUNDING)
- Berita Makro/Ekonomi Terkini Hari Ini: [Manfaatkan Google Search Grounding untuk merangkum berita fundamental hari ini terkait aset tersebut (misal suku bunga The Fed, inflasi CPI/PCE, geopolitik, US Dollar DXY, arus ETF BTC)]

### ⚡ CEKLIS VALIDASI EKSEKUSI (ANTI ASAL PASANG)
- Rekomendasi Tindakan: [BUY / SELL / WAIT]
- Titik Masuk (Entry Price): [Tentukan angka spesifik berdasarkan support/resistance terdekat di gambar]
- Pembatasan Kerugian (Stop Loss): [Sebutkan angka pengaman]
- Target Keuntungan (Take Profit): [Sebutkan angka target, wajib minimal RRR 1:2]
- Kalkulasi Lot Aman (Asumsi Risiko ${riskPercentage}% dari Modal User): [Berikan hitungan lot berdasarkan modal pengguna $${accountBalance}]
- Analisis teknikal pendukung: [Jelaskan indikator atau pola chart yang digunakan untuk entry posisi sesuai dengan strategi trading plan yang telah disusun]

Kemudian, di bagian akhir, sertakan:
1. Tabel ringkasan rencana dalam format tabel Markdown yang bersih dan mudah dibaca (Kolom: Parameter | Nilai / Kondisi | Keterangan Mekanis).
2. Blok JSON terstruktur di dalam tag \`\`\`json:structured-plan ... \`\`\` agar dashboard dapat mengekstrak data numerik untuk kalkulator dan indikator overlay:
\`\`\`json:structured-plan
{
  "asset": "XAUUSD",
  "timeframe": "H1",
  "currentPrice": 2658.50,
  "trend": "UPTREND",
  "action": "BUY",
  "entryPrice": 2658.00,
  "stopLoss": 2650.00,
  "takeProfit": 2674.00,
  "rrr": "1:2.0",
  "riskAmountUsd": 100,
  "recommendedLot": 0.12,
  "rsiValue": "42 (Netral)",
  "candlestickPattern": "Bullish Rejection Pinbar",
  "keySupport": 2650.00,
  "keyResistance": 2674.00,
  "status": "VALID_SETUP"
}
\`\`\``;

    const userPromptText = `Silakan pindai dan analisis tangkapan layar grafik ini secara menyeluruh dan mekanis.
Informasi Akun Trader:
- Modal Trading: $${accountBalance.toLocaleString()}
- Batas Risiko per Trade: ${riskPercentage}% (Maksimal Kerugian: $${((accountBalance * riskPercentage) / 100).toFixed(2)})
${assetHint ? `- Catatan Aset dari User: ${assetHint}` : ''}
${userNotes ? `- Catatan Tambahan Trader: ${userNotes}` : ''}

Lakukan pemindaian visual stik lilin terhadap EMA 50, identifikasi level horizontal, candle terujung, RSI, sentimen berita makro terkini via Google Search, dan buatkan Trading Plan Mekanis sesuai protokol wajib!`;

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    let responseText = '';
    let groundingChunks: any[] = [];
    let modelUsed = 'gemini-4-argon';

    try {
      // Primary model: gemini-4-argon with high thinking mode and Google Search grounding
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: [
          {
            role: 'user',
            parts: [imagePart, { text: `${systemPrompt}\n\n${userPromptText}` }],
          },
        ],
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          tools: [{ googleSearch: {} }],
        },
      });

      responseText = response.text || '';
      groundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-4-argon error, falling back to gemini-3.8-flash:', primaryErr?.message);
      modelUsed = 'gemini-3.8-flash';

      // Fallback to gemini-3.8-flash
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [imagePart, { text: `${systemPrompt}\n\n${userPromptText}` }],
          },
        ],
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          tools: [{ googleSearch: {} }],
        },
      });

      responseText = fallbackResponse.text || '';
      groundingChunks =
        fallbackResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    }

    // Extract structured plan if present
    let structuredPlan: any = null;
    const jsonMatch = responseText.match(/```json:structured-plan\s*([\s\S]*?)\s*```/) ||
                      responseText.match(/```json\s*(\{[\s\S]*?"action"[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        structuredPlan = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.warn('Failed to parse structured JSON block:', e);
      }
    }

    // If structured plan is missing or incomplete, generate fallback values by regex parsing
    if (!structuredPlan) {
      const actionMatch = responseText.match(/Rekomendasi Tindakan:\s*\*?\*?(BUY|SELL|WAIT)\*?\*?/i);
      const entryMatch = responseText.match(/Titik Masuk \(Entry Price\):\s*\*?\*?([0-9.,]+)/i);
      const slMatch = responseText.match(/Pembatasan Kerugian \(Stop Loss\):\s*\*?\*?([0-9.,]+)/i);
      const tpMatch = responseText.match(/Target Keuntungan \(Take Profit\):\s*\*?\*?([0-9.,]+)/i);
      const priceMatch = responseText.match(/Harga Berjalan Saat Ini \(Live Price\):\s*\*?\*?([0-9.,]+)/i);

      structuredPlan = {
        asset: assetHint || (responseText.includes('BTC') ? 'BTCUSD' : 'XAUUSD'),
        timeframe: 'H1',
        action: actionMatch ? actionMatch[1].toUpperCase() : 'WAIT',
        currentPrice: priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0,
        entryPrice: entryMatch ? parseFloat(entryMatch[1].replace(/,/g, '')) : 0,
        stopLoss: slMatch ? parseFloat(slMatch[1].replace(/,/g, '')) : 0,
        takeProfit: tpMatch ? parseFloat(tpMatch[1].replace(/,/g, '')) : 0,
        rrr: '1:2.0',
        riskAmountUsd: (accountBalance * riskPercentage) / 100,
        recommendedLot: 0.1,
        status: actionMatch && actionMatch[1].toUpperCase() !== 'WAIT' ? 'VALID_SETUP' : 'WAIT_SIGNAL',
      };
    }

    // Clean response text by removing the internal json:structured-plan block so only beautiful markdown is displayed
    const cleanMarkdown = responseText
      .replace(/```json:structured-plan[\s\S]*?```/g, '')
      .trim();

    res.json({
      success: true,
      modelUsed,
      thinkingLevel: 'HIGH',
      analysisMarkdown: cleanMarkdown,
      structuredPlan,
      groundingSources: groundingChunks.map((chunk) => ({
        title: chunk.web?.title || 'Web Search Grounding',
        uri: chunk.web?.uri || '',
      })).filter((s) => s.uri),
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error analyzing chart:', error);
    res.status(500).json({
      error: error.message || 'Terjadi kesalahan saat memproses gambar grafik dengan AI.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AlphaVision-Trader AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

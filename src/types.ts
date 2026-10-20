export type TradingAction = 'BUY' | 'SELL' | 'WAIT';

export type TradeStatus = 'PENDING' | 'RUNNING' | 'TP_HIT' | 'SL_HIT' | 'CLOSED';

export interface MarketPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  pipValue: number;
  spread: number;
}

export interface StructuredPlan {
  asset: string;
  timeframe: string;
  currentPrice: number;
  trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';
  action: TradingAction;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrr: string;
  riskAmountUsd: number;
  recommendedLot: number;
  rsiValue?: string;
  candlestickPattern?: string;
  keySupport?: number;
  keyResistance?: number;
  status: 'VALID_SETUP' | 'WAIT_SIGNAL' | 'HIGH_RISK';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  success: boolean;
  modelUsed: string;
  thinkingLevel: string;
  analysisMarkdown: string;
  structuredPlan: StructuredPlan;
  groundingSources: GroundingSource[];
  analyzedAt: string;
}

export interface ActiveTrade {
  id: string;
  createdAt: number;
  asset: string;
  timeframe: string;
  action: TradingAction;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrr: string;
  lotSize: number;
  riskAmountUsd: number;
  status: TradeStatus;
  currentPrice: number;
  pnlUsd: number;
  pnlPercent: number;
  notes?: string;
}

export interface PresetChart {
  id: string;
  title: string;
  asset: 'XAUUSD' | 'BTCUSD';
  timeframe: string;
  badge: string;
  description: string;
  scenario: string;
  svgDataUri: string;
}

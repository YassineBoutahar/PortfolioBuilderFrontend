import { Dispatch, SetStateAction } from "react";
import { HistoricalResult } from "yahoo-finance2/api/modules/historical";

export interface Holding {
  ticker: string;
  name: string;
  currency: string;
  exchange: string;
  currentPrice: number;
  previousClosePrice: number;
  portfolioPercentage: number;
  displayColor: string;
  historicalData?: HistoricalResult;
}

export interface HoldingListProps {
  screenSize: number;
  holdingsArray: Holding[];
  portfolioValue: number;
  insertHolding: (
    ticker: string,
    newHolding: Holding,
    upsert?: boolean
  ) => void;
  deleteHolding: (ticker: string) => void;
  updatePortfolioPercentage: (ticker: string, percent: number) => void;
  getAvailablePercentage: (ticker: string) => number;
}

export interface SingleHoldingProps {
  screenSize: number;
  holding: Holding;
  portfolioValue: number;
  insertHolding: (
    ticker: string,
    newHolding: Holding,
    upsert?: boolean
  ) => void;
  deleteHolding: (ticker: string) => void;
  updatePortfolioPercentage: (ticker: string, percent: number) => void;
  getAvailablePercentage: (ticker: string) => number;
}

export interface LocalStorageItem {
  ticker: string;
  portfolioPercentage: number;
}

export interface DataViewProps {
  screenSize: number;
  holdingsList?: React.ReactNode;
  holdings: Map<string, Holding>;
  timePeriod: "y" | "M" | "w";
  setTimePeriod: Dispatch<SetStateAction<"y" | "M" | "w">>;
  interval: "1mo" | "1d" | "1wk";
  setPriceInterval: Dispatch<SetStateAction<"1mo" | "1d" | "1wk">>;
  refreshAllHistoricalData: (
    startDate: moment.Moment,
    interval: "1d" | "1wk" | "1mo" | undefined,
    deletedTicker?: string
  ) => void;
}

export interface LineChartProps {
  screenSize: number;
  holdings: Map<string, Holding>;
}

export interface PolarChartProps {
  screenSize: number;
  holdingsArray: Holding[];
}

export interface PriceChangeProps {
  screenSize: number;
  fullText?: boolean;
  currentPrice: number;
  previousPrice: number;
}

export interface PressChartProps {
  height: number;
  width: number;
}

export interface AppProps {
  urlShareHash?: string;
}

export interface PortfolioControlsProps {
  screenSize: number;
  holdings: Map<string, Holding>;
  totalValue: number | null;
  setTotalValue: Dispatch<SetStateAction<number | null>>;
  addQuote: (ticker: string) => void;
  updateAllQuotes: () => void;
}

export interface SiteLogoProps {
  screenSize: number;
}

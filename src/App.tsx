import React, { useState, useEffect } from "react";
import { DisclaimerDialog } from "components";
import { HoldingList, DataView, PortfolioControls } from "containers";
import { Holding, LocalStorageItem, AppProps } from "types";
import { config } from "config";
import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import randomColor from "randomcolor";
import moment from "moment";
import axios from "axios";

const holdingsKey = config.localStorageKeys.holdings;
const backendUrl = config.serverUrl;

const useStyles = makeStyles({
  desktopRoot: {
    margin: "0.25rem 1.25rem 0 1.25rem",
    height: "100%",
  },
  mobileRoot: {
    margin: "0.25rem 0.25rem 0 0.25rem",
    height: "100%",
  },
  portfolioValueBar: {
    width: 160,
  },
});

const App = ({ urlShareHash }: AppProps) => {
  const classes = useStyles();
  const theme = useTheme();
  let screenSize: number = 0;
  const xl = useMediaQuery(theme.breakpoints.up("xl"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  if (xl) screenSize = 4;
  else if (lg) screenSize = 3;
  else if (md) screenSize = 2;
  else if (sm) screenSize = 1;
  console.log(screenSize);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [holdings, setHoldings] = useState<Map<string, Holding>>(new Map());
  // const [remainingPercent, setRemainingPercent] = useState<number>(100);
  const [chosenTimePeriod, setTimePeriod] = useState<"y" | "M" | "w">("y");
  const [chosenInterval, setPriceInterval] = useState<"1mo" | "1d" | "1wk">(
    "1wk"
  );

  useEffect(() => {
    if (urlShareHash) {
      fetchFromShareLink(urlShareHash);
    } else {
      if (window.localStorage.getItem(holdingsKey)) {
        let existingHoldings: LocalStorageItem[] = JSON.parse(
          window.localStorage.getItem(holdingsKey) || "[]"
        ) as LocalStorageItem[];
        existingHoldings.map((h) =>
          addQuote(h.ticker, h.portfolioPercentage, true)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFromShareLink = (shareHash: string) => {
    axios
      .get(`${backendUrl}/share/${shareHash}`)
      .then((response) => {
        let sharedHoldings = JSON.parse(
          response.data.PortfolioObj.S
        ) as LocalStorageItem[];
        sharedHoldings.map((h) =>
          addQuote(h.ticker, h.portfolioPercentage, true)
        );
      })
      .catch((err) => alert(err));
  };

  const insertHolding = (
    ticker: string,
    newHolding: Holding,
    upsert: boolean = false
  ) => {
    if (!upsert && holdings.get(ticker)) {
      alert("You have already added this ticker.");
      return false;
    } else {
      setHoldings((prev) => new Map(prev).set(ticker, newHolding));
      let localStorageHoldings = Array.from(holdings.values())
        .filter((holding) => holding.ticker !== ticker)
        .map((h) => ({
          ticker: h.ticker,
          portfolioPercentage: h.portfolioPercentage,
        }));
      window.localStorage.setItem(
        holdingsKey,
        JSON.stringify([
          ...localStorageHoldings,
          {
            ticker: ticker,
            portfolioPercentage: newHolding.portfolioPercentage,
          },
        ])
      );
      return true;
    }
  };

  const deleteHolding = (ticker: string) => {
    let localStorageHoldings = Array.from(holdings.values())
      .filter((holding) => holding.ticker !== ticker)
      .map((h) => ({
        ticker: h.ticker,
        portfolioPercentage: h.portfolioPercentage,
      }));
    window.localStorage.setItem(
      holdingsKey,
      JSON.stringify(localStorageHoldings)
    );
    setHoldings((prev) => {
      const ogState = new Map(prev);
      ogState.delete(ticker);
      return ogState;
    });
  };

  const updateAllQuotes = () => {
    Array.from(holdings.keys()).forEach((ticker) => updateQuote(ticker));
  };

  const addQuote = (
    ticker: string,
    portfolioPercentage: number = 0,
    forRefresh: boolean = false
  ) => {
    axios
      .get(`${backendUrl}/quote/${ticker}`)
      .then((response) => {
        if (!response.data) {
          throw Object.assign(new Error("Ticker not found!"), { code: 404 });
        }
        let newHolding: Holding = {
          ticker: ticker,
          name: response.data.longName || response.data.shortName,
          currency: response.data.financialCurrency,
          exchange: response.data.fullExchangeName,
          currentPrice: parseFloat(response.data.regularMarketPrice),
          previousClosePrice: parseFloat(
            response.data.regularMarketPreviousClose ||
              response.data.regularMarketOpen
          ),
          portfolioPercentage: portfolioPercentage,
          displayColor: randomColor({ luminosity: "bright" }),
        };
        if (insertHolding(ticker, newHolding, forRefresh)) {
          getHistoricalData(
            newHolding,
            moment().subtract(1, chosenTimePeriod),
            chosenInterval
          );
        }
      })
      .catch((error) => {
        alert("Ticker not found!");
      });
  };

  const updateQuote = (ticker: string) => {
    axios
      .get(`${backendUrl}/quote/${ticker}`)
      .then((response) => {
        let ogHolding = holdings.get(ticker);
        if (ogHolding) {
          ogHolding.currentPrice = parseFloat(response.data.regularMarketPrice);
          ogHolding.previousClosePrice = parseFloat(
            response.data.regularMarketPreviousClose ||
              response.data.regularMarketOpen
          );
          insertHolding(ticker, ogHolding, true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const refreshAllHistoricalData = (
    startDate: moment.Moment,
    interval: "1d" | "1wk" | "1mo" | undefined,
    deletedTicker?: string
  ) => {
    Array.from(holdings.values()).map((holding) => {
      if (holding.ticker !== deletedTicker) {
        getHistoricalData(holding, startDate, interval, true);
      }
      return null;
    });
  };

  const getHistoricalData = (
    holding: Holding,
    startDate: moment.Moment,
    interval: "1d" | "1wk" | "1mo" | undefined,
    refreshing: boolean = false
  ) => {
    axios
      .get(`${backendUrl}/historical/${holding.ticker}`, {
        params: {
          period1: startDate.format("YYYY-MM-DD"),
          interval: interval,
        },
      })
      .then((response) => {
        holding.historicalData = response.data;
        insertHolding(holding.ticker, holding, true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePortfolioPercentage = (ticker: string, percent: number) => {
    let ogHolding = holdings.get(ticker);
    if (ogHolding) {
      // setRemainingPercent(
      //   (prev) => prev - (percent + (ogHolding?.portfolioPercentage || 0))
      // );
      ogHolding.portfolioPercentage = percent;
      insertHolding(ticker, ogHolding, true);
    }
  };

  const getAvailablePercentage = (ticker: string) => {
    return Math.max(
      0,
      100 -
        Array.from(holdings.values())
          .map((a) => a.portfolioPercentage)
          .reduce((acc, p) => acc + p, 0) +
        (holdings.get(ticker)?.portfolioPercentage || 0)
    );
  };

  // const getEstimatedShares = (ticker: string) => {
  //   let holdingObj = holdings.get(ticker);
  //   return Math.floor(
  //     (totalValue * (holdingObj?.portfolioPercentage || 0)) /
  //       100 /
  //       (holdingObj?.currentPrice || 99999999)
  //   );
  // };

  const holdingsListRender = (
    <HoldingList
      screenSize={screenSize}
      holdingsArray={Array.from(holdings.values())}
      portfolioValue={totalValue || 0}
      insertHolding={insertHolding}
      deleteHolding={deleteHolding}
      updatePortfolioPercentage={updatePortfolioPercentage}
      getAvailablePercentage={getAvailablePercentage}
    />
  );

  return (
    <>
      <DisclaimerDialog />
      <Grid
        container
        className={screenSize >= 3 ? classes.desktopRoot : classes.mobileRoot}
        direction={screenSize >= 3 ? "row" : "column"}
        spacing={2}
        wrap="nowrap"
      >
        <Grid item xs={screenSize >= 3 ? 6 : "auto"}>
          <Grid container direction="column">
            <Grid item xs="auto">
              <PortfolioControls
                screenSize={screenSize}
                holdings={holdings}
                totalValue={totalValue}
                setTotalValue={setTotalValue}
                addQuote={addQuote}
                updateAllQuotes={updateAllQuotes}
              />
            </Grid>
            {screenSize >= 3 && (
              <Grid item xs="auto">
                {holdingsListRender}
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={screenSize >= 3 ? 6 : "auto"}>
          <DataView
            screenSize={screenSize}
            holdings={holdings}
            holdingsList={holdingsListRender}
            timePeriod={chosenTimePeriod}
            setTimePeriod={setTimePeriod}
            interval={chosenInterval}
            setPriceInterval={setPriceInterval}
            refreshAllHistoricalData={refreshAllHistoricalData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;

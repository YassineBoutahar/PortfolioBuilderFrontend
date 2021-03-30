import React, { useEffect, useState } from "react";
import { SiteLogo } from "components";
import { PortfolioControlsProps } from "types";
import { config } from "config";
import {
  TextField,
  IconButton,
  ButtonGroup,
  InputAdornment,
  Grid,
  Typography,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import ShareIcon from "@material-ui/icons/Share";
import NumberFormat from "react-number-format";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { AutocResult } from "yahoo-finance2/api/modules/autoc";
import { RecommendationsBySymbolResponse } from "yahoo-finance2/api/modules/recommendationsBySymbol";
import { TrendingSymbol } from "yahoo-finance2/api/modules/trendingSymbols";

const backendUrl = config.serverUrl;

const useStyles = makeStyles({
  root: {
    marginBottom: "1rem",
  },
  topBarActionButton: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonGroupOverline: {
    lineHeight: 1.75,
    fontSize: "0.7rem",
  },
  tickerSearchBar: {
    width: 120,
  },
});

const PortfolioControls = ({
  screenSize,
  holdings,
  totalValue,
  setTotalValue,
  addQuote,
  updateAllQuotes,
}: PortfolioControlsProps) => {
  const classes = useStyles();
  const [tickerSearch, setTickerSearch] = useState<string>("");
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    getAutocompleteValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const updateTickerSearch = (updatedTickerSearch: string) => {
    setTickerSearch(updatedTickerSearch);
    getAutoCompleteTickers(updatedTickerSearch);
  };

  const getAutocompleteValues = (empty: boolean = false) => {
    if (tickerSearch.length > 0 && !empty) {
      getAutoCompleteTickers(tickerSearch);
    } else if (holdings.size === 0) {
      getTrendingTickers();
    } else {
      getRecommendedTickers();
    }
  };

  const getAutoCompleteTickers = (currentSearch: string) => {
    axios
      .get(`${backendUrl}/autoc/${currentSearch}`)
      .then((response) => {
        let allQuotes: AutocResult[] = response.data.Result;
        setAutocompleteResults(
          allQuotes
            .slice(0, Math.min(allQuotes.length + 1, 6))
            .map((q) => q.symbol)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTrendingTickers = () => {
    axios
      .get(`${backendUrl}/trending`)
      .then((response) => {
        let allQuotes: TrendingSymbol[] = response.data.quotes;
        setAutocompleteResults(allQuotes.map((q) => q.symbol));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRecommendedTickers = () => {
    axios
      .get(
        `${backendUrl}/recommend/${Array.from(holdings.values()).pop()?.ticker}`
      )
      .then((response) => {
        let allSymbols: RecommendationsBySymbolResponse = response.data;
        setAutocompleteResults(
          allSymbols.recommendedSymbols.map((s) => s.symbol)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createShareLink = () => {
    let newUUID = uuidv4();
    axios
      .post(
        `${backendUrl}/share`,
        {
          portfolio: Array.from(holdings.values()).map((h) => ({
            ticker: h.ticker,
            portfolioPercentage: h.portfolioPercentage,
          })),
        },
        { params: { shareHash: newUUID } }
      )
      .then((response) => {
        let shareUrl = `${window.location.host}/share/${newUUID}`;
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => setSnackbarOpen(true));
      })
      .catch((err) => alert(`Could not fetch portfolio from DynamoDB. ${err}`));
  };

  return (
    <>
      <Grid container direction="column">
        <Grid item xs="auto">
          <Grid container justify="center">
            <Typography
              className={classes.buttonGroupOverline}
              variant="overline"
              color="textSecondary"
              align="center"
            >
              Portfolio Controls
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs="auto">
          <Grid
            className={classes.root}
            container
            direction="row"
            justify="space-between"
            wrap="nowrap"
          >
            {screenSize >= 2 && (
              <Grid item xs="auto">
                <SiteLogo screenSize={screenSize} />
              </Grid>
            )}
            <Grid item xs="auto">
              <Grid
                container
                spacing={2}
                justify={screenSize >= 3 ? "center" : "flex-start"}
                alignItems="flex-end"
                wrap="nowrap"
              >
                <Grid item xs="auto">
                  <Autocomplete
                    className={classes.tickerSearchBar}
                    freeSolo
                    disableClearable
                    size="small"
                    value={tickerSearch}
                    onChange={(event, value) =>
                      updateTickerSearch(value.toUpperCase())
                    }
                    options={autocompleteResults}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="standard-number"
                        label="Add a stock"
                        placeholder="Ticker"
                        onChange={(e) =>
                          updateTickerSearch(e.target.value.toUpperCase())
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addQuote(tickerSearch);
                            e.preventDefault();
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                          endAdornment: (
                            <IconButton
                              onClick={() => {
                                addQuote(tickerSearch);
                                setTickerSearch("");
                                getAutocompleteValues(true);
                              }}
                              edge="start"
                              size="small"
                            >
                              <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs="auto">
                  <NumberFormat
                    value={totalValue}
                    label={
                      <Typography noWrap>
                        {screenSize >= 3 ? "Total " : ""}Portfolio Value
                      </Typography>
                    }
                    onValueChange={({ value: v }) =>
                      setTotalValue(parseFloat(v))
                    }
                    name="name"
                    customInput={TextField}
                    thousandSeparator={true}
                    placeholder="0"
                    error={isNaN(totalValue || 0) || (totalValue || 0) < 0}
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <ButtonGroup aria-label="top bar actions">
                <IconButton
                  className={classes.topBarActionButton}
                  onClick={() => createShareLink()}
                >
                  <ShareIcon />
                </IconButton>
                <IconButton
                  className={classes.topBarActionButton}
                  onClick={() => updateAllQuotes()}
                >
                  <RefreshIcon />
                </IconButton>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Share link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PortfolioControls;

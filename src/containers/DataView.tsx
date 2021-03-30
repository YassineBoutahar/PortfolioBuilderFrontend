import React, { useState } from "react";
import { LineChart, PolarChart } from "components";
import { DataViewProps } from "types";
import { Grid, Box, Typography, makeStyles } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import PieChartIcon from "@material-ui/icons/PieChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import ListIcon from "@material-ui/icons/List";
import moment from "moment";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  buttonGroupOverline: {
    lineHeight: 1.75,
    fontSize: "0.7rem",
  },
  buttonGroupOverlineSmall: {
    lineHeight: 1.75,
    fontSize: "0.5rem",
  },
  chartTitle: {
    marginRight: "0.5rem",
    marginLeft: "0.5rem",
    marginTop: "1rem",
  },
  smallToggleButton: {
    padding: "3px",
  },
});

const DataView = ({
  screenSize,
  holdingsList = <></>,
  holdings,
  timePeriod,
  setTimePeriod,
  interval,
  setPriceInterval,
  refreshAllHistoricalData,
}: DataViewProps) => {
  const classes = useStyles();

  const [viewType, setViewType] = useState<"polar" | "line" | "holdings">(
    "polar"
  );

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewType: "polar" | "line" | "holdings" | null
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: "y" | "M" | "w" | null
  ) => {
    if (newPeriod !== null) {
      setTimePeriod(newPeriod);
      refreshAllHistoricalData(moment().subtract(1, newPeriod), interval);
    }
  };

  const handleIntervalChange = (
    event: React.MouseEvent<HTMLElement>,
    newInterval: "1mo" | "1d" | "1wk" | null
  ) => {
    if (newInterval !== null) {
      setPriceInterval(newInterval);
      refreshAllHistoricalData(moment().subtract(1, timePeriod), newInterval);
    }
  };

  return (
    <Box className={classes.root}>
      <Grid item xs="auto">
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item xs={6}>
            <Grid container direction="column">
              <Grid item xs="auto">
                <Typography
                  className={classes.buttonGroupOverline}
                  variant="overline"
                  color="textSecondary"
                >
                  {screenSize >= 3 ? "Chart Type" : "Data View"}
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <ToggleButtonGroup
                  value={viewType}
                  exclusive
                  onChange={handleViewChange}
                  hidden={false}
                  aria-label="Chart style"
                >
                  {screenSize < 3 && (
                    <ToggleButton value="holdings" aria-label="holdings list">
                      <ListIcon fontSize="small" />
                    </ToggleButton>
                  )}
                  <ToggleButton value="polar" aria-label="polar area">
                    <PieChartIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="line" aria-label="line chart">
                    <TimelineIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>

          {screenSize >= 3 && (
            <Grid item xs="auto">
              <Typography
                className={classes.chartTitle}
                align="center"
                variant="h6"
                color="textPrimary"
                noWrap
              >
                {
                  {
                    polar: "Portfolio Breakdown",
                    line: "Historical Portfolio Performance",
                    holdings: "Holdings",
                  }[viewType]
                }
              </Typography>
            </Grid>
          )}

          <Grid item xs={6}>
            {viewType === "line" && (
              <Grid
                container
                spacing={1}
                justify="flex-end"
                alignContent="flex-end"
                alignItems="flex-end"
                wrap="nowrap"
              >
                <Grid item xs="auto">
                  <Grid container direction="column">
                    <Grid item xs="auto">
                      <Typography
                        className={
                          screenSize >= 3
                            ? classes.buttonGroupOverline
                            : classes.buttonGroupOverlineSmall
                        }
                        variant="overline"
                        color="textSecondary"
                      >
                        Time period
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <ToggleButtonGroup
                        value={timePeriod}
                        size="small"
                        exclusive
                        onChange={handlePeriodChange}
                        aria-label="Start date"
                      >
                        <ToggleButton
                          className={
                            screenSize >= 3 ? "" : classes.smallToggleButton
                          }
                          value="w"
                          aria-label="last week"
                          disabled={interval === "1mo"}
                        >
                          <Typography>
                            {screenSize >= 3 ? <b>1W</b> : <span>1W</span>}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          className={
                            screenSize >= 3 ? "" : classes.smallToggleButton
                          }
                          value="M"
                          aria-label="last month"
                        >
                          <Typography>
                            {screenSize >= 3 ? <b>1M</b> : <span>1M</span>}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          className={
                            screenSize >= 3 ? "" : classes.smallToggleButton
                          }
                          value="y"
                          aria-label="last year"
                        >
                          <Typography>
                            {screenSize >= 3 ? <b>1Y</b> : <span>1Y</span>}
                          </Typography>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs="auto">
                  <Grid container direction="column">
                    <Grid item xs="auto">
                      <Typography
                        className={
                          screenSize >= 3
                            ? classes.buttonGroupOverline
                            : classes.buttonGroupOverlineSmall
                        }
                        variant="overline"
                        color="textSecondary"
                      >
                        Price interval
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <ToggleButtonGroup
                        value={interval}
                        size="small"
                        exclusive
                        onChange={handleIntervalChange}
                        aria-label="Point interval"
                      >
                        <ToggleButton
                          className={
                            screenSize >= 3 ? "" : classes.smallToggleButton
                          }
                          value="1d"
                          aria-label="per day"
                        >
                          <Typography>
                            {screenSize >= 3 ? <b>1D</b> : <span>1D</span>}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          className={
                            screenSize >= 3 ? "" : classes.smallToggleButton
                          }
                          value="1wk"
                          aria-label="per week"
                        >
                          <Typography>
                            {screenSize >= 3 ? <b>1W</b> : <span>1W</span>}
                          </Typography>
                        </ToggleButton>
                        <ToggleButton
                          className={
                            screenSize >= 3 ? "" : classes.smallToggleButton
                          }
                          value="1mo"
                          aria-label="per month"
                          disabled={timePeriod === "w"}
                        >
                          <Typography>
                            {screenSize >= 3 ? <b>1M</b> : <span>1M</span>}
                          </Typography>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs="auto">
        {
          {
            polar: (
              <PolarChart
                screenSize={screenSize}
                holdingsArray={Array.from(holdings.values())}
              />
            ),
            line: <LineChart screenSize={screenSize} holdings={holdings} />,
            holdings:
              screenSize >= 3 ? (
                <PolarChart
                  screenSize={screenSize}
                  holdingsArray={Array.from(holdings.values())}
                />
              ) : (
                holdingsList
              ),
          }[viewType]
        }
      </Grid>
    </Box>
  );
};

export default DataView;

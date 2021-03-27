import React, { useState } from "react";
import { LineChart, PolarChart } from "components";
import { ChartsProps, Holding } from "types";
import { Box, Typography, makeStyles, useTheme } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import PieChartIcon from "@material-ui/icons/PieChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import moment from "moment";

const useStyles = makeStyles({
  buttonGroupOverline: {
    lineHeight: 1.75,
    fontSize: "0.7rem",
  },
  lineChartButtonGroup: {
    marginRight: "0.5rem",
  },
  chartTitle: {
    marginRight: "0.5rem",
    marginLeft: "0.5rem",
    marginTop: "1rem",
  },
});

const Charts = ({
  holdings,
  timePeriod,
  setTimePeriod,
  interval,
  setPriceInterval,
  refreshAllHistoricalData,
}: ChartsProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const [chartType, setChartType] = useState("polar");

  const handleChartChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: string | null
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
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
    <Box>
      <Box
        width={1}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" flexDirection="column">
          <Typography
            className={classes.buttonGroupOverline}
            variant="overline"
            color="textSecondary"
          >
            Chart Type
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartChange}
            hidden={false}
            aria-label="Chart style"
          >
            <ToggleButton value="polar" aria-label="polar area">
              <PieChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart">
              <TimelineIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box display="flex" alignSelf="center">
          <Typography
            className={classes.chartTitle}
            align="center"
            variant="h6"
            color="textPrimary"
          >
            {chartType === "line"
              ? "Historical Portfolio Performance"
              : "Portfolio Breakdown"}
          </Typography>
        </Box>

        <Box display="flex" style={{ minWidth: "5.5rem" }}>
          {chartType === "line" ? (
            <Box display="flex" flexDirection="row">
              <Box
                display="flex"
                flexDirection="column"
                className={classes.lineChartButtonGroup}
              >
                <Typography
                  className={classes.buttonGroupOverline}
                  variant="overline"
                  color="textSecondary"
                >
                  Time period
                </Typography>
                <ToggleButtonGroup
                  value={timePeriod}
                  size="small"
                  exclusive
                  onChange={handlePeriodChange}
                  aria-label="Start date"
                >
                  <ToggleButton
                    value="w"
                    aria-label="last week"
                    disabled={interval === "1mo"}
                  >
                    <Typography>
                      <b>1W</b>
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value="M" aria-label="last month">
                    <Typography>
                      <b>1M</b>
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value="y" aria-label="last year">
                    <Typography>
                      <b>1Y</b>
                    </Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                className={classes.lineChartButtonGroup}
              >
                <Typography
                  className={classes.buttonGroupOverline}
                  variant="overline"
                  color="textSecondary"
                >
                  Price interval
                </Typography>
                <ToggleButtonGroup
                  value={interval}
                  size="small"
                  exclusive
                  onChange={handleIntervalChange}
                  aria-label="Point interval"
                >
                  <ToggleButton value="1d" aria-label="per day">
                    <Typography>
                      <b>1D</b>
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value="1wk" aria-label="per week">
                    <Typography>
                      <b>1W</b>
                    </Typography>
                  </ToggleButton>
                  <ToggleButton
                    value="1mo"
                    aria-label="per month"
                    disabled={timePeriod === "w"}
                  >
                    <Typography>
                      <b>1M</b>
                    </Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <Box>
        {chartType === "polar" ? (
          <PolarChart holdings={Array.from(holdings.values())} />
        ) : (
          <LineChart holdings={holdings} />
        )}
      </Box>
    </Box>
  );
};

export default Charts;

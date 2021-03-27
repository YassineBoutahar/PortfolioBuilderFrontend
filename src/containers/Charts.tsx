import React, { useState } from "react";
import { ChartsProps, Holding } from "types";
import { Box, Typography, makeStyles, useTheme } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { Polar, Line } from "react-chartjs-2";

import PieChartIcon from "@material-ui/icons/PieChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import { ChartDataSets, ChartPoint } from "chart.js";
import moment from "moment";
import { HistoricalResult } from "yahoo-finance2/api/modules/historical";

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

  const getChartDataSets = () => {
    let allChartDataSets: ChartDataSets[] = Array.from(holdings.values())
      .filter((holding) => holding.historicalData !== undefined)
      .map((holding) => ({
        label: holding.ticker,
        data: parseHistoricalDate(
          holding.historicalData as HistoricalResult
        )[1],
        fill: false,
        borderColor: holding.displayColor,
      }));

    allChartDataSets.push(getWeightedAverage(allChartDataSets));
    return allChartDataSets;
  };

  const getChartLabel = () => {
    let allLabelArrays = Array.from(holdings.values())
      .filter((holding) => holding.historicalData !== undefined)
      .map(
        (holding) =>
          parseHistoricalDate(holding.historicalData as HistoricalResult)[0]
      );
    let largestLabelArray = allLabelArrays
      .map((h) => h.length)
      .indexOf(Math.max(...allLabelArrays.map((h) => h.length)));

    return allLabelArrays[largestLabelArray];
  };

  const parseHistoricalDate = (dataset: HistoricalResult) => {
    //console.log(dataset.map((point) => ({t: point.date, y: point.close})));
    let chartLabels: string[] = dataset.map((point) =>
      moment(point.date).format("YYYY/MM/DD")
    );
    let chartData: ChartPoint[] = dataset.map((point) => ({
      t: point.date,
      y: Math.round((point.close + Number.EPSILON) * 100) / 100,
    }));

    let resObj: [string[], ChartPoint[]] = [chartLabels, chartData];
    return resObj;
  };

  const getWeightedAverage = (allDataSets: ChartDataSets[]) => {
    return {
      label: "Weighted Avg",
      data: generatedWeightedAveragePoints(allDataSets),
      fill: false,
      borderColor: theme.palette.text.secondary,
      backgroundColor: theme.palette.text.secondary,
      borderDash: [5, 5],
      pointBackgroundColor: theme.palette.text.secondary,
      pointBorderColor: theme.palette.text.primary,
    };
  };

  const generatedWeightedAveragePoints = (allDataSets: ChartDataSets[]) => {
    let chartPointsMap: Map<string, number> = new Map();
    allDataSets.forEach((holdingDataSet) => {
      let holding: Holding | undefined = holdings.get(
        holdingDataSet.label || ""
      );
      if (!holding) {
        return;
      }
      let portfolioPercentage = holding.portfolioPercentage;
      let currentChartPoints: ChartPoint[] =
        (holdingDataSet.data as ChartPoint[]) || [];
      currentChartPoints.forEach((point: ChartPoint) => {
        chartPointsMap.set(
          point.t as string,
          (chartPointsMap.get(point.t as string) || 0) +
            ((point.y as number) * portfolioPercentage) / 100
        );
      });
    });

    return Array.from(chartPointsMap).map(([time, price]) => ({
      t: time,
      y: Math.round((price + Number.EPSILON) * 100) / 100,
    }));
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
          <Polar
            data={{
              datasets: [
                {
                  data: Array.from(holdings.values()).map(
                    (h) => h.portfolioPercentage
                  ),
                  backgroundColor: Array.from(holdings.values()).map(
                    (h) => h.displayColor
                  ),
                },
              ],

              // These labels appear in the legend and in the tooltips when hovering different arcs
              labels: Array.from(holdings.values()).map((h) => h.ticker),
            }}
            options={{
              title: {
                display: false,
                text: "Portfolio Breakdown",
              },
              legend: {
                labels: {
                  fontColor: theme.palette.text.primary,
                },
              },
              elements: {
                arc: {
                  borderColor: theme.palette.text.secondary,
                },
              },
              scale: {
                gridLines: {
                  color: theme.palette.text.secondary,
                },
                pointLabels: {
                  fontColor: theme.palette.text.secondary,
                  // Include a dollar sign in the ticks
                  callback: function (value) {
                    return value + "%";
                  },
                },
              },
            }}
          />
        ) : (
          <Line
            data={{
              labels: getChartLabel(),
              datasets: getChartDataSets(),
            }}
            options={{
              title: {
                display: false,
                text: "Historical Portfolio Performance",
              },
              legend: {
                labels: {
                  fontColor: theme.palette.text.primary,
                },
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      fontColor: theme.palette.text.secondary,
                      // Include a dollar sign in the ticks
                      callback: function (value, index, values) {
                        return "$" + value;
                      },
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontColor: theme.palette.text.secondary,
                    },
                  },
                ],
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Charts;

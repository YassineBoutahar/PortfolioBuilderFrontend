import { Holding, LineChartProps } from "types";
import { useTheme } from "@material-ui/core";
import { Line } from "react-chartjs-2";

import { ChartDataSets, ChartPoint } from "chart.js";
import moment from "moment";
import { HistoricalResult } from "yahoo-finance2/api/modules/historical";

const Charts = ({ screenSize, holdings }: LineChartProps) => {
  const theme = useTheme();

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
    <Line
      data={{
        labels: getChartLabel(),
        datasets: getChartDataSets(),
      }}
      options={{
        title: {
          display: screenSize < 3,
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
  );
};

export default Charts;

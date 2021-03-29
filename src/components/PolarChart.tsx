import { PolarChartProps } from "types";
import { useTheme } from "@material-ui/core";
import { Polar } from "react-chartjs-2";

const Charts = ({ desktop, holdingsArray }: PolarChartProps) => {
  const theme = useTheme();

  return (
    <Polar
      data={{
        datasets: [
          {
            data: holdingsArray.map((h) => h.portfolioPercentage),
            backgroundColor: holdingsArray.map((h) => h.displayColor),
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: holdingsArray.map((h) => h.ticker),
      }}
      options={{
        title: {
          display: !desktop,
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
  );
};

export default Charts;

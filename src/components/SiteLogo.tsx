import React from "react";
import { PressChart } from "components";
import { Grid, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  pressChart: {
    marginLeft: "-0.5rem",
    marginRight: "-0.2rem",
    marginTop: "0.5rem",
  },
});

const SiteLogo = () => {
  const classes = useStyles();

  const remToPixels = (rem: number) => {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  };

  return (
    <Grid container direction="row" alignItems="flex-end">
      <Grid item className={classes.pressChart}>
        <PressChart height={remToPixels(2.5)} width={remToPixels(3)} />
      </Grid>

      <Grid item>
        <Grid container direction="column" justify="flex-end" wrap="nowrap">
          <Typography variant="body1" color="textPrimary">
            <b>Portfolio Builder</b>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Build Wealth, Share Wisdom
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SiteLogo;

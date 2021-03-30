import React from "react";
import { PressChart } from "components";
import { SiteLogoProps } from "types";
import { Grid, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  pressChart: {
    marginLeft: "-0.5rem",
    marginRight: "-0.2rem",
    marginTop: "0.5rem",
  },
});

const SiteLogo = ({ screenSize }: SiteLogoProps) => {
  const classes = useStyles();

  const remToPixels = (rem: number) => {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="flex-end"
      wrap="nowrap"
      className={classes.pressChart}
    >
      <Grid item>
        <PressChart height={remToPixels(2.5)} width={remToPixels(3)} />
      </Grid>

      <Grid item>
        <Grid container direction="column" justify="flex-end">
          <Typography variant="body1" color="textPrimary" noWrap>
            <b>Portfolio Builder</b>
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {screenSize === 4
              ? "Build Wealth, Share Wisdom"
              : "Wealth & Wisdom"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SiteLogo;

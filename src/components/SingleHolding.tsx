import React from "react";
import { PriceChange } from "components";
import { SingleHoldingProps } from "types";
import {
  IconButton,
  ButtonGroup,
  Slider,
  Input,
  InputAdornment,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  useTheme,
  Grid,
  Divider,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Avatar from "react-avatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    percentSlider: {
      color: theme.palette.text.primary,
      marginRight: "1rem",
      width: "100%",
    },
    percentInput: {
      marginRight: "1rem",
    },
    holdingActionButton: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    holdingActionButtonGroup: {
      marginRight: "0.6rem",
    },
    listItemBody: {
      width: "100%",
    },
    stockName: {},
  })
);

const SingleHolding = ({
  desktop,
  holding,
  portfolioValue,
  insertHolding,
  deleteHolding,
  updatePortfolioPercentage,
  getAvailablePercentage,
}: SingleHoldingProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const getEstimatedShares = () => {
    return Math.floor(
      (portfolioValue * (holding?.portfolioPercentage || 0)) /
        100 /
        (holding?.currentPrice || 99999999)
    );
  };

  return (
    <div key={holding.ticker}>
      {desktop ? (
        <Grid
          container
          className={classes.listItemBody}
          spacing={3}
          direction="row"
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>
            <Avatar
              name={holding.ticker.split("").join(" ")}
              round
              size="60"
              textSizeRatio={1}
              color={holding.displayColor}
              fgColor={theme.palette.text.primary}
            />
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="flex-end"
              alignContent="flex-end"
              spacing={2}
            >
              <Grid item xs={8}>
                <Grid container direction="column" justify="center" spacing={0}>
                  <Grid item>
                    <Typography
                      color="textPrimary"
                      className={classes.stockName}
                      align="center"
                    >
                      {holding.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Slider
                      className={classes.percentSlider}
                      value={
                        typeof holding.portfolioPercentage === "number"
                          ? holding.portfolioPercentage
                          : 0
                      }
                      onChange={(e, val) =>
                        updatePortfolioPercentage(holding.ticker, Number(val))
                      }
                      marks={[
                        {
                          value: getAvailablePercentage(holding.ticker),
                          label: "Max",
                        },
                      ]}
                      step={0.1}
                      aria-labelledby="input-slider"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Input
                  className={classes.percentInput}
                  value={holding.portfolioPercentage || 0}
                  margin="dense"
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  onChange={(e) =>
                    updatePortfolioPercentage(
                      holding.ticker,
                      Number(e.target.value)
                    )
                  }
                  onBlur={(e) => {
                    if (Number(e.target.value) < 0) {
                      updatePortfolioPercentage(holding.ticker, 0);
                    } else if (Number(e.target.value) > 100) {
                      updatePortfolioPercentage(holding.ticker, 100);
                    }
                  }}
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Typography color="textSecondary">
              {`${
                desktop ? "Approximately" : "~"
              } ${getEstimatedShares()} shares`}
            </Typography>
            <PriceChange
              mobile={!desktop}
              currentPrice={holding.currentPrice}
              previousPrice={holding.previousClosePrice}
            />
          </Grid>
          <Grid item xs="auto">
            <ButtonGroup
              className={classes.holdingActionButtonGroup}
              aria-label="holding actions"
            >
              <IconButton
                className={classes.holdingActionButton}
                onClick={() => deleteHolding(holding.ticker)}
              >
                <DeleteOutlineIcon />
              </IconButton>
              <IconButton
                className={classes.holdingActionButton}
                target="_blank"
                rel="noreferrer"
                href={`https://finance.yahoo.com/quote/${holding.ticker}`}
              >
                <LaunchIcon />
              </IconButton>
            </ButtonGroup>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          className={classes.listItemBody}
          direction="column"
          justify="center"
        >
          <Grid item xs="auto">
            <Typography
              color="textPrimary"
              className={classes.stockName}
              align="center"
            >
              {holding.name}
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Grid
              container
              className={classes.listItemBody}
              spacing={3}
              direction="row"
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
            >
              <Grid item>
                <Avatar
                  name={holding.ticker.split("").join(" ")}
                  round
                  size="45"
                  textSizeRatio={1}
                  color={holding.displayColor}
                  fgColor={theme.palette.text.primary}
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.percentInput}
                  value={holding.portfolioPercentage || 0}
                  margin="dense"
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  onChange={(e) =>
                    updatePortfolioPercentage(
                      holding.ticker,
                      Number(e.target.value)
                    )
                  }
                  onBlur={(e) => {
                    if (Number(e.target.value) < 0) {
                      updatePortfolioPercentage(holding.ticker, 0);
                    } else if (Number(e.target.value) > 100) {
                      updatePortfolioPercentage(holding.ticker, 100);
                    }
                  }}
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography color="textSecondary">
                  {`~ ${getEstimatedShares()} shares`}
                </Typography>
                <PriceChange
                  mobile={!desktop}
                  currentPrice={holding.currentPrice}
                  previousPrice={holding.previousClosePrice}
                />
              </Grid>
              <Grid item xs="auto">
                <ButtonGroup
                  className={classes.holdingActionButtonGroup}
                  aria-label="holding actions"
                >
                  <IconButton
                    className={classes.holdingActionButton}
                    onClick={() => deleteHolding(holding.ticker)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <IconButton
                    className={classes.holdingActionButton}
                    target="_blank"
                    rel="noreferrer"
                    href={`https://finance.yahoo.com/quote/${holding.ticker}`}
                  >
                    <LaunchIcon />
                  </IconButton>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Divider style={{ margin: "1rem 0.5rem 1rem 0.25rem" }} />
    </div>
  );
};

export default SingleHolding;

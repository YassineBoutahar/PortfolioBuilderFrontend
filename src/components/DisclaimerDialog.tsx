import React, { useState } from "react";
import { config } from "config";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";

const hideDisclaimerKey = config.localStorageKeys.disclaimer;

const DisclaimerDialog = () => {
  const userHidePreference: string | null = window.localStorage.getItem(
    hideDisclaimerKey
  );
  const [open, setOpen] = useState<boolean>(!userHidePreference);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Disclaimer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This app is for development purposes only. As the developer, I make no
          guarantees as to the accuracy of the presented financial information,
          nor can I be held responsible for any losses you may incur as a result
          of using this service. Use of this app is considered acknowledgement
          and acceptance of these terms.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          value="hideDisclaimerCheckbox"
          control={<Checkbox color="default" />}
          label={<Typography variant="subtitle2">Don't show again</Typography>}
          labelPlacement="start"
          onChange={(event, checked) => {
            checked
              ? window.localStorage.setItem(hideDisclaimerKey, "true")
              : window.localStorage.removeItem(hideDisclaimerKey);
          }}
        />
        <Button onClick={() => setOpen(false)} size="large">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisclaimerDialog;

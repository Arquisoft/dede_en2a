import * as React from "react";

import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type ShareDialogProps = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

export default function ShareDialog(props: ShareDialogProps) {
  return (
    <React.Fragment>
      <Dialog maxWidth="sm" open={props.open} onClose={props.handleClose}>
        <DialogTitle>Share this item or save it for later use</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ pb: 1 }}>
            You can share this product with anyone you want with the following
            link!
          </DialogContentText>
          <TextField
            aria-readonly
            value={window.location.href}
            multiline
            label="link to product"
            style={{ width: "100%" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              props.handleClose();
            }}
            startIcon={<ContentCopyIcon />}
          >
            Copy to clipboard
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

import * as React from "react";

import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { deleteAddressFromPod } from "../../../helpers/SolidHelper";

type RemoveAddressDialogProps = {
  open: boolean;
  webId: string;
  url: string | undefined;
  handleOpen: () => void;
  handleClose: () => void;
  sendNotification: (severity: AlertColor, message: string) => void;
};

export default function RemoveAddressDialog(props: RemoveAddressDialogProps) {
  const handleConfirm = async () => {
    if (props.url === undefined)
      props.sendNotification(
        "error",
        "An error ocurred removing the address. Nothing has been saved :("
      );
    else
      deleteAddressFromPod(props.webId, props.url).then(
        (e) => {
          props.sendNotification(
            "success",
            "The address has been removed from your POD!"
          );
          props.handleClose(); // We close the dialog
        },
        (error) => {
          props.sendNotification(
            "error",
            "An error ocurred removing the address. Nothing has been saved :("
          );
          props.handleClose();
        }
      );
  };

  return (
    <React.Fragment>
      <Dialog maxWidth="sm" open={props.open} onClose={props.handleClose}>
        <DialogTitle>
          Are you sure you want to delete this address from your POD?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirm} startIcon={<ThumbUpIcon />}>
            Yes
          </Button>

          <Button onClick={props.handleClose} startIcon={<ThumbDownIcon />}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

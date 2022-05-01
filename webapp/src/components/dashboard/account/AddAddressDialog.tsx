import * as React from "react";

import {
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";

import { addAddressToPod } from "../../../helpers/SolidHelper";

type AddAddressDialogProps = {
  open: boolean;
  webId: string;
  handleOpen: () => void;
  handleClose: () => void;
  sendNotification: (severity: AlertColor, message: string) => void;
};

export default function AddAddressDialog(props: AddAddressDialogProps) {
  const [streetAddress, setStreetAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState(0);
  const [region, setRegion] = React.useState("");
  const [country, setCountry] = React.useState("");

  const handleConfirm = async () => {
    addAddressToPod(props.webId, {
      street: streetAddress,
      locality: city,
      postalCode: postalCode.toString(),
      region: region,
    }).then(
      (e) => {
        props.sendNotification(
          "success",
          "The provided address has been saved in your POD!"
        );
        props.handleClose(); // We close the dialog
      },
      (error) => {
        props.sendNotification(
          "error",
          "An error ocurred saving the provided address. Nothing has been saved :("
        );
        console.log(error);
        props.handleClose();
      }
    );
  };

  return (
    <React.Fragment>
      <Dialog maxWidth="sm" open={props.open} onClose={props.handleClose}>
        <DialogTitle>
          Fill the form in order you to add a new address!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Notice that the following will be stored in a decentralized way.
            Meaning we won't store any of this information. It will be
            registered as a new address in your POD.
          </DialogContentText>

          <TextField
            autoFocus
            label="Street address"
            variant="outlined"
            onChange={(event) => {
              setStreetAddress(event.target.value);
            }}
            sx={{ width: "100%", mt: 1 }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 1 }}
          >
            <TextField
              label="City"
              variant="outlined"
              onChange={(event) => {
                setCity(event.target.value);
              }}
              sx={{ width: "69.5%" }}
            />

            <TextField
              label="Postal Code"
              variant="outlined"
              onChange={(event) => {
                setPostalCode(Number(event.target.value));
              }}
              sx={{ width: "29.5%" }}
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 1 }}
          >
            <TextField
              label="Region"
              variant="outlined"
              onChange={(event) => {
                setRegion(event.target.value);
              }}
              sx={{ width: "49.5%" }}
            />

            <TextField
              label="Country"
              variant="outlined"
              onChange={(event) => {
                setCountry(event.target.value);
              }}
              sx={{ width: "49.5%" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              streetAddress === "" ||
              city === "" ||
              postalCode === 0 ||
              region === "" ||
              country === ""
            }
            onClick={handleConfirm}
            startIcon={<SendIcon />}
          >
            Save my information
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

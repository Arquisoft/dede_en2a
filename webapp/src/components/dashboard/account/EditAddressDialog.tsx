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

import { Address } from "../../../shared/shareddtypes";

type EditAddressDialogProps = {
  open: boolean;
  addressToEdit: Address;
  handleOpen: () => void;
  handleClose: () => void;
  sendNotification: (severity: AlertColor, message: string) => void;
};

export default function EditAddressDialog(props: EditAddressDialogProps) {
  const [streetAddress, setStreetAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState(0);
  const [region, setRegion] = React.useState("");
  const [country, setCountry] = React.useState("");

  const handleConfirm = async () => {};

  return (
    <React.Fragment>
      <Dialog maxWidth="sm" open={props.open} onClose={props.handleClose}>
        <DialogTitle>
          Here you can edit your personal information regarding this address
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are editing the actual address on your POD. No personal
            information will be registered in our systems.
          </DialogContentText>

          <TextField
            autoFocus
            label="Street address"
            defaultValue={props.addressToEdit.street}
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
              defaultValue={props.addressToEdit.locality}
              label="City"
              variant="outlined"
              onChange={(event) => {
                setCity(event.target.value);
              }}
              sx={{ width: "69.5%" }}
            />

            <TextField
              defaultValue={props.addressToEdit.postalCode}
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
              defaultValue={props.addressToEdit.region}
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
            Modify my information
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

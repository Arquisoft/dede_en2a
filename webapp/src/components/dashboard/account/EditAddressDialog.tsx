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
import { editAddressFromPod } from "../../../helpers/SolidHelper";

type EditAddressDialogProps = {
  open: boolean;
  webId: string;
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

  const handleConfirm = async () => {
    editAddressFromPod(props.webId, {
      street: streetAddress,
      locality: city,
      postalCode: postalCode.toString(),
      region: region,
      url: props.addressToEdit.url,
    }).then(
      (e) => {
        props.sendNotification(
          "success",
          "We have edited the address in your POD!"
        );
        props.handleClose(); // We close the dialog
      },
      (error) => {
        props.sendNotification(
          "error",
          "An error ocurred editing the address. Nothing has been saved :("
        );
        props.handleClose();
      }
    );
  };

  React.useEffect(() => {
    setStreetAddress(props.addressToEdit.street);
    setCity(props.addressToEdit.locality);
    setPostalCode(Number(props.addressToEdit.postalCode));
    setRegion(props.addressToEdit.region);
  }, [props.addressToEdit]);

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
            value={streetAddress}
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
              value={city}
              label="City"
              variant="outlined"
              onChange={(event) => {
                setCity(event.target.value);
              }}
              sx={{ width: "69.5%" }}
            />

            <TextField
              value={postalCode}
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
              value={region}
              label="Region"
              variant="outlined"
              onChange={(event) => {
                setRegion(event.target.value);
              }}
              sx={{ width: "49.5%" }}
            />

            <TextField
              autoFocus
              value={country}
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

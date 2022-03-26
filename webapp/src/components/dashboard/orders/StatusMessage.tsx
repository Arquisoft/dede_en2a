import { Typography, Stack } from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function StatusMessage(props: any) {
  if (props.isOrderReceived)
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <CheckBoxIcon color="success" />
        <Typography>Received</Typography>
      </Stack>
    );
  else
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <LocalShippingIcon color="primary" />
        <Typography>Shipping</Typography>
      </Stack>
    );
}

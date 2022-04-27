import { Stack, Typography } from "@mui/material";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function StatusMessage(props: any) {
  if (new Date().getTime() > new Date(props.receivedDate).getTime())
  
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

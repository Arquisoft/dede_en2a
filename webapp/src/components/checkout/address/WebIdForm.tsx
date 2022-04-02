import * as React from "react";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function WebIdForm(props: any) {
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>WebID</Divider>

      <Typography sx={{ pb: 2 }}>
        Please provide a valid WebID so we can retrieve your address from. Don't
        worry, your data is safe here. In case you have several addresses stored
        on it we will let you choose among them.
      </Typography>
      <TextField
        name="webId"
        id="webId"
        required
        fullWidth
        label="WebID"
        onChange={(e) => props.setWebId(e.target.value)}
        autoFocus
      />
    </React.Fragment>
  );
}

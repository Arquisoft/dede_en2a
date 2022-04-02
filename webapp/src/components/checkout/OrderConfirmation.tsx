import * as React from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function OrderConfirmation(props: any) {
  let navigate = useNavigate();

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6">
        It's ordered!
      </Typography>
      <Typography>
        We've received your order and will ship your package as as soon as
        possible.
      </Typography>

      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          className="m-1"
        >
          Finish
        </Button>
      </Stack>
    </React.Fragment>
  );
}

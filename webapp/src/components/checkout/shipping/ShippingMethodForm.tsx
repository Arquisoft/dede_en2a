import React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import WebIdRadioGroup from "../../WebIdRadioGroup";

export default function ShippingMethod(props: any) {
  const shippingMethods = ["Correos", "Pick UP"];
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Shipping method</Divider>

      <Typography sx={{ pb: 2 }}>
        Those are the shipping methods we have in our site; feel free to choose
        any of them:
      </Typography>
      <WebIdRadioGroup
        value={props.shippingMethod}
        setValue={props.setShippingMethod}
        radioItems={shippingMethods}
        icon={<LocalShippingIcon />}
        checkedIcon={<LocalShippingIcon />}
      />
    </React.Fragment>
  );
}

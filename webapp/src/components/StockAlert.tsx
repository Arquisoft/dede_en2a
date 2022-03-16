import { useState } from "react";

import { Chip } from "@mui/material";

export default function StockAlert(props: any): JSX.Element {
  if (props.stock <= props.amount) {
    // to prevent from some issues regarding no stock
    return <Chip label="No stock available!" color="error" />;
  } else if (props.stock - props.amount <= 10) {
    return <Chip label="Few units left!" color="warning" />;
  } else {
    return <Chip label="Stock available!" color="success" />;
  }
}

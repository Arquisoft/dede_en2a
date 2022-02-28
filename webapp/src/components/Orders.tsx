import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import NavBar from "./NavBar";
import OrderItem from "./OrderItem";

import { Order } from "../shared/shareddtypes";
import { getOrders } from "../api/api";

function Orders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrderList = async () => {
    setOrders(await getOrders());
  };

  useEffect(() => {
    refreshOrderList();
  });

  return (
    <React.Fragment>
      <NavBar />
      <Typography>Your orders</Typography>
      <Grid container>
        {orders.map((order) => (
          <OrderItem orders={order} />
        ))}
      </Grid>
    </React.Fragment>
  );
}

export default Orders;

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
      <Typography align="center" variant="h4" color="darkblue"> Your orders</Typography>
      <Grid container alignItems="center" className="m-5" columns={4} >
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>User</span></Grid>
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>Products</span></Grid>
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>Total Price</span></Grid>         
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>Shipping Price</span></Grid>
        {orders.map((order) => (
          <Grid item xs={5}>
            <OrderItem orders={order} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

export default Orders;

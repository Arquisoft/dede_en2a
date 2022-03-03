import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import NavBar from "./NavBar";
import OrderItem from "./OrderItem";

import { Order } from "../shared/shareddtypes";
import { getOrders } from "../api/api";
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, tableCellClasses, styled } from "@mui/material";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function Orders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrderList = async () => {
    setOrders(await getOrders());
  };

  useEffect(() => {
    refreshOrderList();
  });

  return(
    <React.Fragment>
      <NavBar />
      <br></br>
      <Typography align="center" variant="h4" color="black"> Your orders</Typography>
      <br></br>
    <TableContainer  component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">User</StyledTableCell>
            <StyledTableCell >Product</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">Shipping price</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <OrderItem orders={order} /> 
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </React.Fragment>
  );

  /*return (
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
  );*/
}

export default Orders;

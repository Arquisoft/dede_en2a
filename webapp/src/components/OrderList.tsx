import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  Container,
  Stack,
  Button,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { Order } from "../shared/shareddtypes";
import { getOrdersForUser } from "../api/api";

type OrderTableItemProps = {
  order: Order;
};

type OrderTableProps = {
  orders: Order[];
};

function StatusMessage(props: any) {
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

function OrderTableItem(props: OrderTableItemProps): JSX.Element {
  let navigate = useNavigate();

  return (
    <TableRow hover>
      <TableCell align="center">{props.order.orderCode}</TableCell>
      <TableCell align="center">{props.order.totalPrice + " €"}</TableCell>
      <TableCell align="center">{props.order.shippingPrice + " €"}</TableCell>
      <TableCell align="center">
        <StatusMessage isOrderReceived={props.order.isOrderReceived} />
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="secondary"
          className="m-1"
          onClick={() => navigate("/order/" + props.order.orderCode)}
        >
          See details
        </Button>
      </TableCell>
    </TableRow>
  );
}

function OrderTable(props: OrderTableProps): JSX.Element {
  if (props.orders.length > 0)
    return (
      <React.Fragment>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center"> Order </TableCell>
                <TableCell align="center"> Price </TableCell>
                <TableCell align="center"> Shipping price </TableCell>
                <TableCell align="center"> Status </TableCell>
                <TableCell align="center"> Show details </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.orders.map((order: Order) => {
                return <OrderTableItem order={order} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  else
    return (
      <Typography variant="h6" className="m-2">
        No orders have been made :(
      </Typography>
    );
}

function Orders(props: any): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrderList = async () => {
    setOrders(await getOrdersForUser(props.userEmail));
  };

  useEffect(() => {
    refreshOrderList();
  });

  return (
    <Container component="main" sx={{ mb: 4, mt: 4 }}>
      <Typography component="h1" variant="h4" align="center">
        Your orders
      </Typography>
      <OrderTable orders={orders}></OrderTable>
    </Container>
  );
}

export default Orders;

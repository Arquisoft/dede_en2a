import React, { useEffect, useState } from "react";

import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { Order } from "../shared/shareddtypes";
import { getOrdersForUser } from "../api/api";

type OrderTableItemProps = {
  order: Order;
};

type OrderTableProps = {
  orders: Order[];
};

function OrderTableItem(props: OrderTableItemProps): JSX.Element {
  return (
    <TableRow hover>
      <TableCell align="center">{props.order.orderCode}</TableCell>
      <TableCell align="center">{props.order.totalPrice + " €"}</TableCell>
      <TableCell align="center">{props.order.shippingPrice + " €"}</TableCell>
      <TableCell align="center">
        <FormControlLabel
          disabled
          control={<Checkbox icon={<LocalShippingIcon />} />}
          label="Received"
        />
      </TableCell>
      <TableCell></TableCell>
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

function Orders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrderList = async () => {
    setOrders(await getOrdersForUser("palolol@gmail.com"));
  };

  useEffect(() => {
    refreshOrderList();
  }, []);

  return (
    <Stack sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <Typography component="h1" variant="h4" align="center">
        Your orders
      </Typography>
      <OrderTable orders={orders}></OrderTable>
    </Stack>
  );
}

export default Orders;

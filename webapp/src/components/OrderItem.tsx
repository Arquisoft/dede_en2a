import { useEffect, useState } from "react";
import { Order, OrderProduct, Product } from "../shared/shareddtypes";
import * as api from "../api/api";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Checkbox,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
} from "@mui/material";

type OrderItemProps = {
  orders: Order;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    fontSize: 15,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function OrderItem(props: OrderItemProps): JSX.Element {
  const [producto, setProducto] = useState<Product>();

  const productsHtml: String[] = [];
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <StyledTableRow hover>
      <TableCell align="center">{props.orders.userEmail}</TableCell>
      <TableCell align="center">
        <TableRow>
          {props.orders.products.map((product: OrderProduct) => {
            return "Code: " + product.code;
          })}
        </TableRow>
        <TableRow>
          {props.orders.products.map((product: OrderProduct) => {
            return "Amount: " + product.amount;
          })}
        </TableRow>
      </TableCell>
      <TableCell align="center">{props.orders.totalPrice + " €"}</TableCell>
      <TableCell align="center">{props.orders.shippingPrice + " €"}</TableCell>
      <TableCell align="center">
        {"Received"}
        {<Checkbox {...label} checked={true} color="success" />}
      </TableCell>
    </StyledTableRow>
  );
}
export default OrderItem;

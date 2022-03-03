import { useEffect, useState } from "react";
import { Order, OrderProduct, Product } from "../shared/shareddtypes";
import * as api from "../api/api";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styled, TableCell, tableCellClasses, TableRow } from "@mui/material";

type OrderItemProps = {
  orders: Order;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    fontSize:15,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function OrderItem(props: OrderItemProps): JSX.Element {
  const [producto, setProducto] = useState<Product>();

  const productsHtml: String[] = [];

  return(
    <StyledTableRow>
      <TableCell align="center">
      {props.orders.userId}      
      </TableCell>
      <TableCell align="center">
        <TableRow>
            {props.orders.products.map((product : OrderProduct) => {
            return "Code: " + product.code;
            })}
          </TableRow>
          <TableRow>
            {props.orders.products.map((product : OrderProduct) => {
            return  "Amount: " + product.amount ;
            })} 
          </TableRow>               
      </TableCell>
      <TableCell align="center">
        {props.orders.totalPrice}
      </TableCell>
      <TableCell align="center">
        {props.orders.shippingPrice}
      </TableCell>
    </StyledTableRow>
  )

  /*return (
    //<li>
    <>
    <Box component="div">
        <Grid container className="m-5" direction="row">
            <Grid item xs>{props.orders.userId}</Grid>
            <Grid item xs>
                {props.orders.products.map((product: OrderProduct) => {
                // CREAR COMPONENTE Y MANEJAR ALLI LA INFO
                   return "Code: " + product.code + '\n' + "Amount: " + product.amount ;
                })} </Grid>
            <Grid item xs>{props.orders.totalPrice + "\t"}</Grid>         
            <Grid item xs>{props.orders.shippingPrice}</Grid>
        </Grid>
    </Box>
    </>
  );*/
}
export default OrderItem;
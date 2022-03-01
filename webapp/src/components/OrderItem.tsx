import { useEffect, useState } from "react";
import { Order, OrderProduct, Product } from "../shared/shareddtypes";
import * as api from "../api/api";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

type OrderItemProps = {
  orders: Order;
};

function OrderItem(props: OrderItemProps): JSX.Element {
  const [producto, setProducto] = useState<Product>();

  const productsHtml: String[] = [];

  return (
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
  );
}
export default OrderItem;
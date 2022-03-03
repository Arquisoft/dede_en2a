import * as React from "react";

import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import { calculateTotal } from "../helpers/ShoppingCartHelper";
import { CartItem } from "../shared/shareddtypes";

export default function Review(props: any) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List>
        {props.productsCart.slice().map(
          (cartItem: CartItem) =>
            cartItem.amount > 0 && (
              <ListItem key={cartItem.product.code} sx={{ py: 1, px: 0 }}>
                <Typography mr={4}>{cartItem.amount}</Typography>
                <ListItemText
                  primary={cartItem.product.name}
                  secondary={cartItem.product.description}
                />
                <Typography>{cartItem.product.price}€</Typography>
              </ListItem>
            )
        )}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping costs" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {props.shippingCosts}€
          </Typography>
        </ListItem>

        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {calculateTotal(props.productsCart)}€
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}

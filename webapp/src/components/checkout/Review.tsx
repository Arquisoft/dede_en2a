import * as React from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { calculateTotal } from "../../helpers/ShoppingCartHelper";
import { CartItem } from "../../shared/shareddtypes";

import { toStringAddress } from "../../helpers/SolidHelper";

export default function Review(props: any) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Date:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {new Date(Date.now()).toUTCString().substring(0, 16)}
          </Typography>
        </ListItem>

        <Divider />

        {props.productsCart.slice().map(
          (cartItem: CartItem) =>
            cartItem.amount > 0 && (
              <ListItem key={cartItem.product.code} sx={{ py: 1, px: 0 }}>
                <Typography mr={4}>{cartItem.amount}</Typography>
                <ListItemText
                  primary={cartItem.product.name}
                  secondary={cartItem.product.description}
                />
                <Typography>{cartItem.product.price} €</Typography>
              </ListItem>
            )
        )}

        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {calculateTotal(props.productsCart, 0)} €
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping costs:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {props.shippingCosts} €
          </Typography>
        </ListItem>

        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {calculateTotal(props.productsCart, props.shippingCosts)} €
          </Typography>
        </ListItem>

        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping address:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {toStringAddress(props.address)}
          </Typography>
        </ListItem>
      </List>

      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="contained"
          onClick={props.handleNext}
          className="m-1"
          data-testid="next-button"
        >
          Next
        </Button>

        <Button onClick={props.handleReset} variant="outlined" className="m-1">
          Back
        </Button>
      </Stack>
    </React.Fragment>
  );
}

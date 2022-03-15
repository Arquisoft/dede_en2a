import React from "react";
import { Link } from "react-router-dom";

import { Typography, Stack, Button, styled } from "@mui/material";

import ShoppingCartTable from "./ShoppingCartTable";

import { CartItem, Product } from "../shared/shareddtypes";

type ShoppingCartProps = {
  products: CartItem[];
  totalUnitsInCart: number;
  onIncrementUnit: (product: Product) => void;
  onDecrementUnit: (product: Product) => void;
};

export default function ShoppingCart(props: ShoppingCartProps): JSX.Element {
  const handleButton = (cartItem: CartItem) => {
    if (cartItem.amount >= cartItem.product.stock) return false;
    else return true;
  };

  const Img = styled("img")({
    display: "block",
    width: "25%",
  });

  if (props.totalUnitsInCart > 0)
    return (
      <React.Fragment>
        <ShoppingCartTable
          products={props.products}
          totalUnitsInCart={props.totalUnitsInCart}
          onIncrementUnit={props.onIncrementUnit}
          onDecrementUnit={props.onDecrementUnit}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ mt: 2 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="outlined" className="m-1">
              Continue shopping
            </Button>
          </Link>

          <Button
            variant="contained"
            disabled={props.products.length === 0}
            component={Link}
            to="/checkout"
            className="m-1"
          >
            Proceed to checkout
          </Button>
        </Stack>
      </React.Fragment>
    );
  else
    return (
      <Typography variant="h6" className="m-2">
        Shopping cart is empty :(
      </Typography>
    );
}

import React, { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";

import { CartItem, Product } from "../shared/shareddtypes";

import ProductList from "./ProductList";

type HomeProps = {
  products: Product[];
  cartProducts: CartItem[];
  onAdd: (product: Product) => void;
};

function Home(props: HomeProps): JSX.Element {
  return (
    <React.Fragment>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ mb: 4, mt: 4 }}
      >
        Shop
      </Typography>
      <ProductList
        products={props.products}
        cartProducts={props.cartProducts}
        OnAddCart={props.onAdd}
      />
    </React.Fragment>
  );
}

export default Home;

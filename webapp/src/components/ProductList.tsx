import { Card } from "@mui/material";
import Grid from "@mui/material/Grid";

import { CartItem, Product } from "../shared/shareddtypes";
import ProductBox from "./ProductBox";

type ProductListProps = {
  products: Product[];
  cartProducts: CartItem[];
  OnAddCart: (product: Product) => void;
};

export default function ProductList(props: ProductListProps): JSX.Element {
  const getCurrentCartAmount = (product: Product) => {
    let currentAmount: number = 0;
    props.cartProducts.forEach((cartItem: CartItem) => {
      if (product.code === cartItem.product.code) {
        currentAmount = cartItem.amount;
      }
    });
    return currentAmount;
  };

  return (
    <Grid container spacing={4} sx={{ p: 2 }}>
      {props.products.map((product: Product) => (
        <Grid item xs={12} md={6} lg={3} key={product.code}>
          <Card sx={{ py: 2 }}>
            <ProductBox
              product={product}
              currentCartAmount={getCurrentCartAmount(product)}
              onAdd={(productToAdd: Product) => props.OnAddCart(productToAdd)}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

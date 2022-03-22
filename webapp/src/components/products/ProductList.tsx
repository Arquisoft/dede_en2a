import { Card } from "@mui/material";
import Grid from "@mui/material/Grid";

import { getCurrentCartAmount } from "../../helpers/ShoppingCartHelper";
import { CartItem, Product } from "../../shared/shareddtypes";

import ProductBox from "./ProductBox";

type ProductListProps = {
  products: Product[];
  cartProducts: CartItem[];
  OnAddCart: (product: Product) => void;
};

export default function ProductList(props: ProductListProps): JSX.Element {
  return (
    <Grid container spacing={4} sx={{ p: 2 }}>
      {props.products.map((product: Product) => (
        <Grid item xs={12} md={6} lg={3} key={product.code}>
          <Card sx={{ py: 2 }}>
            <ProductBox
              product={product}
              currentCartAmount={getCurrentCartAmount(
                product,
                props.cartProducts
              )}
              onAdd={(productToAdd: Product) => props.OnAddCart(productToAdd)}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

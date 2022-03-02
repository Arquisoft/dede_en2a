import Grid from "@mui/material/Grid";

import { CartItem, Product } from "../shared/shareddtypes";
import ProductBox from "./ProductBox";

type ProductListProps = {
  products: CartItem[];
  OnAddCart: (product: Product) => void;
};

function ProductList(props: ProductListProps): JSX.Element {
  return (
    <Grid container columns={50} rowSpacing={5} className="mt-2 mb-2">
      {props.products.map((product: CartItem) => (
        <Grid item xs={25} key={product.product.code}>
          <ProductBox
            cartItem={product}
            onAdd={(productToAdd: Product) => props.OnAddCart(productToAdd)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;

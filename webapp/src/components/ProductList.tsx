import Grid from "@mui/material/Grid";

import { CartItem, Product } from "../shared/shareddtypes";
import ProductBox from "./ProductBox";

type ProductListProps = {
  products: Product[];
  cartProducts: CartItem[];
  OnAddCart: (product: Product) => void;
};

function ProductList(props: ProductListProps): JSX.Element {
  
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
    <Grid container columns={50} rowSpacing={5} className="mt-2 mb-2">
      {props.products.map((product: Product) => (
        <Grid item xs={25} key={product.code}>
          <ProductBox
            product={product}
            currentCartAmount={getCurrentCartAmount(product)}
            onAdd={(productToAdd: Product) => props.OnAddCart(productToAdd)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;

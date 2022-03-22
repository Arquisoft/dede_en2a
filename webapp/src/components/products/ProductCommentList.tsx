import { Grid, Paper } from "@mui/material";

import { Review } from "../../shared/shareddtypes";

import ProductComment from "./ProductComment";

type ProductListProps = {
  reviews: Review[];
};

export default function ProductCommentList(
  props: ProductListProps
): JSX.Element {
  /*const getCurrentCartAmount = (product: Product) => {
        let currentAmount: number = 0;
        props.cartProducts.forEach((cartItem: CartItem) => {
          if (product.code === cartItem.product.code) {
            currentAmount = cartItem.amount;
          }
        });
        return currentAmount;
      };*/

  return (
    <Paper style={{ margin: "3vh 5vw", padding: "1em" }}>
      <h2>User opinions about this product!</h2>
      <Grid container rowSpacing={5} className="mt-2 mb-2">
        {props.reviews.map((review: Review) => (
          <Grid
            item
            xs={12}
            md={6}
            key={(review.userEmail, review.productCode)}
          >
            <ProductComment review={review} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

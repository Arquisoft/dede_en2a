import { Grid } from "@mui/material";
import { Review } from "../shared/shareddtypes";
import ProductComment from "./ProductComment";

type ProductListProps = {
  reviews: Review[];
};

function ProductCommentList(props: ProductListProps): JSX.Element {
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
    <Grid container columns={50} rowSpacing={5} className="mt-2 mb-2">
      {props.reviews.map((review: Review) => (
        <Grid item xs={25} key={(review.userEmail, review.productCode)}>
          <ProductComment review={review} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductCommentList;

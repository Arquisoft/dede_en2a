import React from "react";
import {Grid, Paper} from "@mui/material";
import {Review} from "../shared/shareddtypes";
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
        <React.Fragment>
            <Paper
                variant="outlined"
                elevation={8}
                style={{margin: "3vh 5vw", padding: "1em"}}>
                <h2>User opinions about this product!</h2>
                <Grid container columns={50} rowSpacing={5} className="mt-2 mb-2">
                    {props.reviews.map((review: Review) => (
                        <Grid item xs={25} key={(review.userEmail, review.productCode)}>
                            <ProductComment review={review}/>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </React.Fragment>
    );
}

export default ProductCommentList;
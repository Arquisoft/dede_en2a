import { Grid, Rating, Typography } from "@mui/material";
import React from "react";
import { Review } from "../shared/shareddtypes";

type ProductCommentProps = {
  review: Review;
};

function ProductComment(props: ProductCommentProps): JSX.Element {
  return (
    <React.Fragment>
      <Grid
        container
        columns={50}
        rowSpacing={5}
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "30vh" }}
      >
        <Grid item xs={25}>
          <Typography variant="h5" component="h6">
            {props.review.userEmail}
          </Typography>
        </Grid>
        <Grid item xs={25}>
          <Rating name="read-only" value={props.review.rating} readOnly />
        </Grid>
        <Grid>
          <Typography variant="body1">{props.review.comment}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ProductComment;

import { Grid, Paper } from "@mui/material";

import { Review } from "../../shared/shareddtypes";

import ProductComment from "./ProductComment";

type ProductListProps = {
  reviews: Review[];
};

export default function ProductCommentList(
  props: ProductListProps
): JSX.Element {
  return (
    <Paper elevation={8} style={{ margin: "3vh 5vw", padding: "1em" }}>
      <h2>User opinions about this product!</h2>
      <Grid container rowSpacing={5} className="mt-2 mb-2">
        {props.reviews.map((review: Review) => (
          <Grid
            item
            xs={12}
            md={6}
            key={`${review.userEmail}${review.productCode}`}
          >
            <ProductComment review={review} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

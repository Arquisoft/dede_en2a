import { Grid, Paper, Typography } from "@mui/material";

import { Review } from "../../../shared/shareddtypes";

import ProductComment from "./ProductComment";

type ProductListProps = {
  reviews: Review[];
};

export default function ProductCommentList(
  props: ProductListProps
): JSX.Element {
  return (
    <Paper elevation={8} sx={{ m: 3, p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        User opinions about this product!
      </Typography>
      {props.reviews.length > 0 && (
        <Grid container spacing={3}>
          {props.reviews.map((review: Review) => (
            <Grid
              item
              xs={12}
              md={6}
              key={`${review.webId}${review.productCode}`}
            >
              <ProductComment review={review} />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

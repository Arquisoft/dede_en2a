import { Stack, Grid, Paper, Rating, Typography } from "@mui/material";

import { Review } from "../../shared/shareddtypes";

type ProductCommentProps = {
  review: Review;
};

export default function ProductComment(
  props: ProductCommentProps
): JSX.Element {
  return (
    <Paper elevation={3} style={{ margin: "1vh 2vw", padding: "1em" }}>
      <Grid container spacing={0} direction="row" style={{ minHeight: "30vh" }}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="h6">
              {props.review.userEmail}
            </Typography>

            <Rating
              name="read-only"
              value={props.review.rating}
              precision={0.5}
              readOnly
            />
          </Stack>
        </Grid>

        <Grid item xs={12} alignItems="center">
          <Typography variant="body1">{props.review.comment}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

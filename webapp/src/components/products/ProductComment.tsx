import { Box, Grid, Paper, Rating, Typography, Divider } from "@mui/material";

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Grid item sx={{ m: 1 }}>
            <Typography variant="h6" component="h6">
              {props.review.userEmail}
            </Typography>
          </Grid>
          <Grid item sx={{ m: 1 }}>
            <Rating
              name="read-only"
              value={props.review.rating}
              precision={0.5}
              readOnly
            />
          </Grid>
        </Box>
        <Divider variant="middle" />
        <Grid sx={{ m: 2 }}>
          <Typography variant="body1">{props.review.comment}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

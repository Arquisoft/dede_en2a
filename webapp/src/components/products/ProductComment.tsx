import * as React from "react";

import { Stack, Grid, Paper, Rating, Typography } from "@mui/material";
import { getNameFromPod } from "../../helpers/SolidHelper";

import { Review } from "../../shared/shareddtypes";

type ProductCommentProps = {
  review: Review;
};

export default function ProductComment(
  props: ProductCommentProps
): JSX.Element {
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    getNameFromPod(window.atob(props.review.webId)).then((name) =>
      setName(name)
    );
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "1em" }}>
      <Grid container spacing={0} direction="row" style={{ minHeight: "30vh" }}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">{name}</Typography>

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

import * as React from "react";

import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { Divider, TextField } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";

import { Product, Review } from "../../shared/shareddtypes";
import { addReview, getReviewsByCodeAndWebId } from "../../api/api";
import DialogWrapper from "../dialogs/Dialog";

type ReviewDialogProps = {
  // TODO: check if any of the props can be removed
  product: Product;
  initialValue?: number;
  show: number;
  stars: number;
  sendNotification: (severity: AlertColor, message: string) => void;
  webId: string | undefined;
};

export default function ReviewDialog(props: ReviewDialogProps) {
  const [open, setOpen] = React.useState(0); // TODO: remove?
  const [close, setClose] = React.useState(0);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    setRating(props.stars);
    if (props.show > 1) setOpen(props.show + 1);
  }, [props.stars]);

  React.useEffect(() => {
    setRating(props.stars);
    if (props.show > 1) setOpen(props.show + 1);
  }, [props.show]);

  const handleConfirm = async () => {
    // In case the user hasn't completed all the fields
    if (btnDisabled) {
      props.sendNotification("error", "You must complete the fields!");
      return;
    }

    setClose(close + 1);

    // If no user has logged in
    if (props.webId === undefined) {
      props.sendNotification("error", "You must log in first!");
    } else {
      let reviews = await getReviewsByCodeAndWebId(
        props.product.code,
        props.webId
      );

      // In case the user has reviewed this product
      if (reviews.length > 0)
        props.sendNotification(
          "error",
          "You have already reviewed this product!"
        );

      // We create the review
      let createdReview: Review = {
        rating: rating,
        comment: comment,
        webId: props.webId,
        productCode: props.product.code,
      };

      if (await addReview(createdReview)) {
        props.sendNotification("success", "Review added correctly!");
        window.location.reload(); // TODO: refactor this
      } else
        props.sendNotification(
          "error",
          "There was an error creating your review!"
        );
    }
  };

  return (
    <React.Fragment>
      <DialogWrapper
        show={open}
        hide={close}
        titleText="Rate this product"
        handleConfirm={handleConfirm}
      >
        <Typography> Your rating is: </Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            if (newValue != null) {
              setRating(newValue);
              setBtnDisabled(false);
            }
          }}
          size="large"
          precision={0.5}
        />
        <Divider />
        <TextField
          autoFocus
          id="outlined-basic"
          label="Comment"
          multiline
          variant="outlined"
          onChange={(event) => {
            setComment(event.target.value);
          }}
          style={{ margin: "2vh .2vw" }}
          sx={{ width: "100%" }}
          minRows={5}
        />
      </DialogWrapper>
    </React.Fragment>
  );
}

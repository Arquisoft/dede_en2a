import * as React from "react";

import {
  Divider,
  TextField,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";

import { Product, Review } from "../../shared/shareddtypes";
import { addReview, getReviewsByCodeAndWebId } from "../../api/api";

type ReviewDialogProps = {
  product: Product;
  initialValue?: number;
  stars: number;
  webId: string;
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  sendNotification: (severity: AlertColor, message: string) => void;
};

export default function ReviewDialog(props: ReviewDialogProps) {
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const handleConfirm = async () => {
    // In case the user hasn't completed all the fields
    if (btnDisabled) {
      props.sendNotification("error", "You must complete the fields!");
      return;
    }

    // We close the dialog as we have finished the operations
    props.handleClose();

    // If no user has logged in
    if (props.webId === "") {
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
      <Dialog maxWidth="sm" open={props.open} onClose={props.handleClose}>
        <DialogTitle>
          In this dialog you can give us a review of the product!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Rank the product from 0 to 5 stars:
          </DialogContentText>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} startIcon={<SendIcon />}>
            Send your Review
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

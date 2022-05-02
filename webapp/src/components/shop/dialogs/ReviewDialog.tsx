import * as React from "react";
import { useEffect } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Rating,
  TextField,
} from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";

import {
  NotificationType,
  Product,
  Review,
} from "../../../shared/shareddtypes";
import {
  addReview,
  getReviewsByCodeAndWebId,
  modifyReview,
} from "../../../api/api";

import NotificationAlert from "../../misc/NotificationAlert";

type ReviewDialogProps = {
  product: Product;
  initialValue?: number;
  stars: number;
  webId: string;
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleConfirm: () => void;
};

export default function ReviewDialog(props: ReviewDialogProps) {
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [notificationStatus, setNotificationStatus] = React.useState(false);
  const [notification, setNotification] = React.useState<NotificationType>({
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const oldReviews: Review[] = await getReviewsByCodeAndWebId(
        props.product.code,
        props.webId
      );

      if (oldReviews.length > 0) {
        // There is a review
        setRating(oldReviews[0].rating);
        setComment(oldReviews[0].comment);
        sendNotification("info", "Loaded old review for edition!");
      }
    };
    if (props.open) {
      fetchData();
    }
  }, [props.open]);

  function sendNotification(severity: AlertColor, message: string) {
    setNotificationStatus(true);
    setNotification({
      severity: severity,
      message: message,
    });
  }

  const handleConfirm = async () => {
    // In case the user hasn't completed all the fields
    if (btnDisabled) {
      sendNotification("error", "You must complete the fields!");
      return;
    }

    // We close the dialog as we have finished the operations
    props.handleClose();

    // If no user has logged in
    if (props.webId === "") {
      sendNotification("error", "You must log in first!");
    } else {
      // We create the review
      let createdReview: Review = {
        rating: rating,
        comment: comment,
        webId: props.webId,
        productCode: props.product.code,
      };

      let reviews = await getReviewsByCodeAndWebId(
        props.product.code,
        props.webId
      );

      // In case the user has reviewed this product
      if (reviews.length > 0) {
        reviews[0].rating = createdReview.rating;
        reviews[0].comment = createdReview.comment;

        if (await modifyReview(createdReview)) {
          sendNotification("success", "Review modified correctly!");
          props.handleConfirm();
        } else
          sendNotification(
            "error",
            "There was an error modifying your review!"
          );
      } else {
        if (await addReview(createdReview)) {
          sendNotification("success", "Review added correctly!");
          props.handleConfirm();
        } else
          sendNotification("error", "There was an error creating your review!");
      }
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
            name="rating"
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
            name="comment"
            autoFocus
            id="outlined-basic"
            label="Comment"
            multiline
            variant="outlined"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
            style={{ margin: "2vh .2vw" }}
            sx={{ width: "100%" }}
            minRows={5}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={comment === ""}
            onClick={handleConfirm}
            startIcon={<SendIcon />}
          >
            Send your Review
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationAlert
        notification={notification}
        notificationStatus={notificationStatus}
        setNotificationStatus={setNotificationStatus}
      />
    </React.Fragment>
  );
}

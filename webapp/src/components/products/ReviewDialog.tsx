import * as React from "react";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import {Alert, Divider, Snackbar, TextField} from "@mui/material";
import {AlertColor} from "@mui/material/Alert";

import {Product, Review} from "../../shared/shareddtypes";
import {addReview, getReviewsByCodeAndEmail} from "../../api/api";
import DialogWrapper from "../dialogs/Dialog";

type ReviewDialogProps = {
    product: Product;
    initialValue?: number;
    show: number;
    stars: number;
};

export default function ReviewDialog(props: ReviewDialogProps) {
    const [open, setOpen] = React.useState(0);
    const [close, setClose] = React.useState(0);
    const [show, showInfo] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState("");

    const [infoMessage, setInfoMessage] = React.useState("");
    const [infoType, setInfoType] = React.useState<AlertColor>("success");

    React.useEffect(() => {
        setRating(props.stars);
        if (props.show > 1)
            setOpen(props.show + 1);
    }, [props.stars]);

    React.useEffect(() => {
        setRating(props.stars);
        if (props.show > 1)
            setOpen(props.show + 1);
    }, [props.show]);

    const handleCloseInfo = () => {
        showInfo(false);
    };

    const showMessage = (infotype: AlertColor, infomessage: string) => {
        setInfoMessage(infomessage);
        setInfoType(infotype);
        showInfo(true);
    };

    const handleConfirm = async () => {
        if (btnDisabled) {
            showMessage("error", "You must complete the forms!");
            return;
        }

        setClose(close+1);

        let userEmail = localStorage.getItem("user.email");

        if (userEmail == null) {
            showMessage("error", "You must log in first!");
        } else if (
            (await getReviewsByCodeAndEmail(props.product.code, userEmail)).length > 0
        ) {
            showMessage("error", "You have already reviewed this product!");
        } else {
            let createdReview: Review = {
                rating: rating,
                comment: comment,
                userEmail: userEmail,
                productCode: props.product.code,
            };
            let addStatus: boolean = await addReview(createdReview);

            if (addStatus) {
                showMessage("success", "Review added correctly!");
                window.location.reload();
            } else {
                showMessage("error", "There was an error creating your review!");
            }
        }
    };

    return (
        <React.Fragment>
            <DialogWrapper show={open} hide={close} titleText="Rate this product" handleConfirm={handleConfirm}>
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
                <Divider/>
                <TextField
                    autoFocus
                    id="outlined-basic"
                    label="Comment"
                    multiline
                    variant="outlined"
                    onChange={(event) => {
                        setComment(event.target.value);
                    }}
                    style={{margin: "2vh .2vw"}}
                    sx={{width: "100%"}}
                    minRows={5}
                />
            </DialogWrapper>
            <Snackbar open={show} autoHideDuration={6000} onClose={handleCloseInfo}>
                <Alert
                    severity={infoType}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseInfo}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    }
                >
                    {infoMessage}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

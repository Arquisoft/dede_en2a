import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import {Alert, Divider, Grid, Snackbar, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));

type bdtProps = {
    children: any;
    onClose: any;
}

const BootstrapDialogTitle = (props: bdtProps) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired
};
type ReviewDialogProps = {
    initialValue?: number
    show: number
    stars: number
}

export default function ReviewDialog(props: ReviewDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [show, showInfo] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState("");

    React.useEffect(() => {
        setOpen(props.show > 0);
        console.log(props.show)
    }, [props.show]);

    React.useEffect(() => {
        setRating(props.stars);
        setOpen(props.show > 0);
    }, [props.stars]);


    const handleClickOpen = () => {
        setOpen(true);
        setBtnDisabled(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseInfo = () => {
        showInfo(false);
    };
    const handleConfirm = () => {
        setOpen(false);
        showInfo(true);
    };

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle
                    onClose={handleClose}
                >
                    Rate this product!
                </BootstrapDialogTitle>
                <DialogContent dividers style={{minWidth:"30vw"}}>
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
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        endIcon={<SendIcon/>}
                        onClick={handleConfirm}
                        disabled={btnDisabled}
                    >
                        Send Rating
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <Snackbar open={show} autoHideDuration={6000} onClose={handleCloseInfo}>
                <Alert
                    severity="success"
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
                    Rating added
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

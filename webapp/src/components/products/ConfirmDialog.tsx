import * as React from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {Alert, Grid, Snackbar, TextField} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
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

type ConfirmDialogProps = {
    show: number;
    titleText: string;
    contentText: string;
    handleConfirm: Function;

}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [show, showInfo] = React.useState(false);

    const handleCloseInfo = () => {
        showInfo(false);
    };

    React.useEffect(() => {
        setOpen(props.show > 0);
    }, [props.show]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        setOpen(false);
        props.handleConfirm();
    };

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    {props.titleText}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom style={{margin: "-1vh 1vw 3vh"}}>
                        {props.contentText}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button autoFocus onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}

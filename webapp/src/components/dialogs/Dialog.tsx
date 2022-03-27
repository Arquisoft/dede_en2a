import React from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {jsx} from "@emotion/react";

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

type DialogWrapperProps = {
    show: number;
    hide?: number;
    titleText: string;
    handleConfirm?: Function;
    children: React.ReactNode;

}

export default function DialogWrapper(props: DialogWrapperProps) {
    const [open, setOpen] = React.useState(false);
    /*const [show, showInfo] = React.useState(false);

    const handleCloseInfo = () => {
        showInfo(false);
    };*/

    React.useEffect(() => {
        setOpen(props.show > 0);
    }, [props.show]);

    React.useEffect(() => {
        setOpen(false);
    }, [props.hide]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
            if (props.handleConfirm != null) {
                setOpen(false);
                props.handleConfirm();
            }
        }
    ;

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
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>

                    {
                        handleConfirm != null &&

                        <Button autoFocus onClick={handleConfirm}>
                            Confirm
                        </Button>
                    }
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
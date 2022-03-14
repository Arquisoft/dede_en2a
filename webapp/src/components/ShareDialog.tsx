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

type ShareDialogProps = {
    show: number;
}

export default function ShareDialog(props: ShareDialogProps) {
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
                    Share Item
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom style={{margin: "-1vh 1vw 3vh"}}>
                        You can share this product with your friend with the following link!
                    </Typography>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TextField aria-readonly value={window.location.href} multiline label="link to product"
                                   style={{width: "90%"}}/>
                        <br/>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showInfo(true);
                            }}
                            startIcon={<ContentCopyIcon/>}
                            variant={"contained"}
                        >
                            Copy to clipboard
                        </Button>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Okay
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <Snackbar open={show} autoHideDuration={6000} onClose={handleCloseInfo}>
                <Alert
                    severity="info"
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
                    Link copied to clipboard
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

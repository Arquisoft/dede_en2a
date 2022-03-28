import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {Alert, Grid, Snackbar, TextField} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DialogWrapper from "../dialogs/Dialog";

type ShareDialogProps = {
    show: number;
}

export default function ShareDialog(props: ShareDialogProps) {
    const [show, showInfo] = React.useState(false);

    const handleCloseInfo = () => {
        showInfo(false);
    };
    return (
        <React.Fragment>
            <DialogWrapper show={props.show} titleText="Share item" >
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
            </DialogWrapper>
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
    )
        ;
}

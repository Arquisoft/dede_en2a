import {Box, Grid, Paper, Rating, Typography} from "@mui/material";
import React from "react";
import {Review} from "../shared/shareddtypes";

type ProductCommentProps = {
    review: Review;
};

function ProductComment(props: ProductCommentProps): JSX.Element {
    return (
        <React.Fragment>
            <Paper>
                <Grid
                    spacing={0}
                    direction="row"
                    style={{minHeight: "30vh"}}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between'}}>
                        <Grid item sx={{m:2}}>
                            <Typography variant="h5" component="h6">
                                {props.review.userEmail}
                            </Typography>
                        </Grid>
                        <Grid item sx={{m:2}}>
                            <Rating name="read-only"
                                    value={props.review.rating}
                                    precision={0.5}
                                    readOnly/>
                        </Grid>
                    </Box>
                    <Grid sx={{m:2}}>
                        <Typography variant="body1">
                            {props.review.comment}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}

export default ProductComment;

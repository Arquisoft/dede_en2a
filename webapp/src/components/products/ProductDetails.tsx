import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProduct, getReviewsByCode } from "../../api/api";
import { checkImageExists } from "../../helpers/ImageHelper";
import { getReviewMean } from "../../helpers/ReviewHelper";
import { checkImageExists } from "../../helpers/ImageHelper";

import { Product, Review } from "../../shared/shareddtypes";

import ProductCommentList from "./ProductCommentList";
import StockAlert from "./StockAlert";
import ProductSpeedDial from "./ProductSpeedDial";
import ReviewDialog from "./ReviewDialog";
import ShareDialog from "./ShareDialog";

import {
  Breadcrumbs, Button, Divider, Grid, LinearProgress,
  Link, Paper, Rating, Stack, styled, Typography
} from "@mui/material";
import { AlertColor } from "@mui/material/Alert";

export type ProductProps = {
  product: Product;
  addToCart: (product: Product) => void;
  webId: string;
};

type ProductDets = {
  id: string;
};

const Img = styled("img")({
  margin: "0",
  display: "block",
  width: "100%",
  objectFit: "cover",
});

function ShopBreadcrumbs(props: any) {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: "2vh 2vw" }}>
        <Link underline="hover" color="inherit" href="/">
          DeDe
        </Link>
        <Link underline="hover" color="inherit" href="/shop/">
          Shop
        </Link>
        <Typography color="text.primary">{props.product}</Typography>
      </Breadcrumbs>
    </React.Fragment>
  );
}

export default function ProductDetails(props: ProductProps): JSX.Element {
  const { id } = useParams<keyof ProductDets>() as ProductDets;

  const [product, setProduct] = useState<Product>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [starsSelected, setSelectedStars] = useState(0);
  const [currentCartAmount] = useState(0);
  const [loading, setLoading] = React.useState(false);

  // We manage the share dialog as intended
  const [openShareDialog, setOpenShareDialog] = React.useState(false);

  const handleClickOpenShareDialog = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  // We manage the review dialog as intended
  const [openReviewDialog, setOpenReviewDialog] = React.useState(false);

  const handleClickOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  const obtainProductDetails = async (code: string) => {
    // We obtain the product
    if (props.product == null) setProduct(await getProduct(id));
    else setProduct(props.product);

    // And then set the reviews
    setReviews(await getReviewsByCode(code));
  };

  useEffect(() => {
    setLoading(true);
    obtainProductDetails(id + "").finally(() => setLoading(false)); // TODO: check that removing setCurrentCart works
  }, []);

  // In case we are retrieving the elements from the db...

  if (typeof product === "undefined") {
    if (loading) return <LinearProgress />;

    return (
      <React.Fragment>
        <ShopBreadcrumbs product={id} />

        <Typography component="h1" variant="h4" align="center">
          Product not found 🔍
        </Typography>

        <Img
          src={checkImageExists("undefined")}
          alt="Product not found image"
          sx={{ width: "50%", p: 2, m: "auto" }}
        />

        <Grid container justifyContent="center">
          <Button variant="contained">
            <Link underline="none" color="inherit" href="/">
              Take me home
            </Link>
          </Button>
        </Grid>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ShopBreadcrumbs product={product.name} />
        <Grid>
          <Paper elevation={8} sx={{ m: 3, p: 2 }}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ p: 2 }}
            >
              <Grid item xs={12} md={6}>
                <Img
                  alt="Image of the product"
                  src={checkImageExists(product.image)}
                />
              </Grid>

              <Grid container item xs={12} md={6} direction={"column"}>
                <Typography component="h1" variant="h5">
                  {product.name}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Rating
                    name="hover-feedback"
                    value={getReviewMean(reviews)}
                    precision={0.5}
                    onClick={handleClickOpenReviewDialog}
                    onChange={(event, newValue) => {
                      if (newValue != null) setSelectedStars(newValue);
                    }}
                  />

                  <Typography>{reviews.length} Reviews</Typography>
                </Stack>

                <Divider sx={{ m: 1 }} />

                <Typography>{product.description}</Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ m: 1 }}
                >
                  <Typography component="h2" variant="h5">
                    {product.price}€
                  </Typography>
                  <StockAlert
                    stock={product.stock}
                    amount={currentCartAmount}
                  />
                </Stack>

                <Button
                  variant="contained"
                  disabled={product.stock <= currentCartAmount}
                  onClick={() => props.addToCart(product)}
                  sx={{ my: 1, width: "100%" }}
                >
                  Add product to cart
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <ProductCommentList reviews={reviews} />
          <ReviewDialog
            product={product}
            stars={starsSelected}
            webId={props.webId}
            open={openReviewDialog}
            handleOpen={handleClickOpenReviewDialog}
            handleClose={handleCloseReviewDialog}
          />

          <ShareDialog
            open={openShareDialog}
            handleOpen={handleClickOpenShareDialog}
            handleClose={handleCloseShareDialog}
          />
        </Grid>

        <ProductSpeedDial
          addToCart={props.addToCart}
          review={handleClickOpenReviewDialog}
          share={handleClickOpenShareDialog}
        />
      </React.Fragment>
    );
  }
}

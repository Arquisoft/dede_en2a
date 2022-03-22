import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProduct, getReviewsByCode } from "../api/api";
import { getReviewMean } from "../helpers/ReviewHelper";
import { getCurrentCartAmount } from "../helpers/ShoppingCartHelper";
import { Product, Review, CartItem } from "../shared/shareddtypes";

import ProductCommentList from "./ProductCommentList";
import ProductSpeedDial from "./ProductSpeedDial";
import ReviewDialog from "./ReviewDialog";
import ShareDialog from "./ShareDialog";
import StockAlert from "./StockAlert";

import {
  Paper,
  Typography,
  Grid,
  Button,
  styled,
  Rating,
  Breadcrumbs,
  Stack,
  Divider,
  LinearProgress,
  Link,
} from "@mui/material";

export type ProductProps = {
  product: Product;
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
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
  const [dialogOpen, setDialogOpen] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(0);
  const [starsSelected, setSelectedStars] = useState(0);
  const [currentCartAmount, setCurrentCartAmount] = useState(0);
  const [loading, setLoading] = React.useState(false);

  const obtainProductDetails = async (code: string) => {
    // We obtain the product
    if (props.product == null) setProduct(await getProduct(id));
    else setProduct(props.product);

    // And then set the reviews
    setReviews(await getReviewsByCode(code));
  };

  const openDialog = () => {
    setDialogOpen(dialogOpen + 1);
  };

  const openShareDialog = () => {
    setShareDialogOpen(shareDialogOpen + 1);
  };

  const addProductToCart = () => {
    if (product !== undefined) {
      props.onAdd(product);
    }
  };

  useEffect(() => {
    setLoading(true);
    obtainProductDetails(id + "").finally(() => setLoading(false));

    // In case we have obtained a product
    if (product !== undefined)
      setCurrentCartAmount(getCurrentCartAmount(product, props.cartItems));
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
          src={require("../images/not-found.png")}
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
          <Paper
            variant="outlined"
            elevation={8}
            style={{ margin: "3vh 5vw", padding: "1em" }}
          >
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
                  src={require("../images/".concat(product.image))}
                />
              </Grid>

              <Grid item xs={12} md={6} direction={"column"}>
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
                    onClick={openDialog}
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
                  onClick={addProductToCart}
                  sx={{ my: 1, width: "100%" }}
                >
                  Add product to cart
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <ProductCommentList reviews={reviews}></ProductCommentList>
          <ReviewDialog
            product={product}
            show={dialogOpen}
            stars={starsSelected}
          />
          <ShareDialog show={shareDialogOpen} />
        </Grid>

        <ProductSpeedDial
          addToCart={addProductToCart}
          review={openDialog}
          share={openShareDialog}
        />
      </React.Fragment>
    );
  }
}

import React, { useEffect, useState } from "react";

import { Product, Review } from "../shared/shareddtypes";

import { useParams } from "react-router-dom";
import { getProduct, getReviewsByCode } from "../api/api";
import ProductCommentList from "./ProductCommentList";
import ProductSpeedDial from "./ProductSpeedDial";
import ReviewDialog from "./ReviewDialog";
import ShareDialog from "./ShareDialog";

import {
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  styled,
  Rating,
  Breadcrumbs,
  Link,
} from "@mui/material";

export type ProductProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

type ProductDets = {
  id: string;
};

const Img = styled("img")({
  margin: "auto",
  display: "block",
  width: "auto",
  height: "50vh",
  objectFit: "cover",
});

function getReviewMean(reviews: Review[]) {
  let mean: number = 0;

  reviews.forEach((review) => {
    mean += review.rating;
  });

  mean /= reviews.length;

  return mean;
}

export default function ProductDetails(props: ProductProps): JSX.Element {
  const [stockOption, setStockOption] = useState<boolean>(true);

  function StockAlert(props: any): JSX.Element {
    if (props.stock === 0) {
      setStockOption(false);
      return <Chip label="No stock available!" color="error" />;
    } else if (props.stock <= 10) {
      setStockOption(true);
      return <Chip label="Few units left!" color="warning" />;
    } else {
      setStockOption(true);
      return <Chip label="Stock available!" color="success" />;
    }
  }

  const { id } = useParams<keyof ProductDets>() as ProductDets;

  const obtainProduct = async () => {
    if (props.product == null) setProduct(await getProduct(id));
    else setProduct(props.product);
  };

  const obtainReviews = async (code: string) => {
    setReviews(await getReviewsByCode(code));
  };

  const [product, setProduct] = useState<Product>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dialogOpen, setDialogOpen] = useState<number>(0);
  const [shareDialogOpen, setShareDialogOpen] = useState<number>(0);
  const [starsSelected, setSelectedStars] = useState<number>(0);

  const openDialog = () => {
    setDialogOpen(dialogOpen + 1);
  };

  const openShareDialog = () => {
    setShareDialogOpen(shareDialogOpen + 1);
  };

  useEffect(() => {
    obtainProduct();
    obtainReviews(id + "");
  }, []);

  const addProductToCart = () => {
    if (product != undefined) {
      props.onAdd(product);
    }
  };

  if (typeof product === "undefined") {
    return (
      <React.Fragment>
        <Breadcrumbs aria-label="breadcrumb" style={{ margin: "2vh 2vw" }}>
          <Link underline="hover" color="inherit" href="/">
            DEDE
          </Link>
          <Link underline="hover" color="inherit" href="/shopping/">
            Shopping
          </Link>
          <Typography color="text.primary">Product not found :(</Typography>
        </Breadcrumbs>

        <h1>No Product found with id: {id}</h1>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Breadcrumbs aria-label="breadcrumb" style={{ margin: "2vh 2vw" }}>
          <Link underline="hover" color="inherit" href="/">
            DEDE
          </Link>
          <Link underline="hover" color="inherit" href="/shopping/">
            Shopping
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
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
              style={{ minHeight: "30vh", margin: "2vh", marginBottom: "4vh" }}
            >
              <Img
                alt="Image of the product"
                src={require("../images/".concat(product.code).concat(".png"))}
              />

              <Grid xs direction={"column"}>
                <h1> {product.name} </h1>
                <Button variant="text" onClick={openDialog} sx={{ my: 1 }}>
                  <Rating
                    name="hover-feedback"
                    value={getReviewMean(reviews)}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      if (newValue != null) {
                        setSelectedStars(newValue);
                      }
                    }}
                  />
                </Button>
                <Paper style={{ margin: "4vh 2vw", padding: ".5em" }}>
                  <Typography>{product.description}</Typography>
                </Paper>
                <h2> {product.price}€ </h2>
                <Grid style={{ margin: "4vh 0 0 0" }}>
                  <StockAlert stock={product.stock} /> <br />
                  <Button
                    variant="contained"
                    disabled={!stockOption}
                    onClick={addProductToCart}
                    sx={{ my: 1 }}
                  >
                    Add product to cart
                  </Button>
                </Grid>
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

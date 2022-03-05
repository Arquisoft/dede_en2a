import React, { useEffect, useState } from "react";

import { Product } from "../shared/shareddtypes";

import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { getProduct } from "../api/api";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export type ProductProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

type ProductDets = {
  id: string;
}

const Img = styled("img")({
  margin: "auto",
  display: "block",
  width: "auto",
  height: "30vh",
});

function ProductDetails(props: ProductProps): JSX.Element {

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

  function setValue(value: number | null) {
    //TODO
  }
  function setHover(value: number) {
    //TODO
  }


  const { id } = useParams<keyof ProductDets>() as ProductDets;

  const obtainProduct = async () => {
    if (props.product == null)
      setProduct(await getProduct(id));
    else
      setProduct(props.product);
  };

  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    obtainProduct();
  }, []);

  if (typeof product === "undefined") {
    return (
      <React.Fragment>
        <h1>No Product found with id: {id}</h1>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment><Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '30vh' }}
      >
        <Grid xs>
          <Img
            alt="Image of the product"
            src={require("../images/"
              .concat(product.code)
              .concat(".jpg"))}
          />
        </Grid>

        <Grid xs direction={"column"}>
          <h1> {product.name} </h1>
          <Rating
            name="hover-feedback"
            value={2}
            precision={0.5}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
          />
          <Card sx={{ maxWidth: 500 }}>
            <Typography>
              {product.description}
            </Typography>
          </Card>
          <h2> {product.price}€ </h2>

          <StockAlert stock={product.stock} />
          <br />
          <Button
            variant="contained"
            disabled={!stockOption}
            onClick={() => props.onAdd(product)}
            sx={{ my: 1 }}
          >
            Add product to cart
          </Button>

        </Grid>
      </Grid>
      </React.Fragment>
    );
  }

}

export default ProductDetails;

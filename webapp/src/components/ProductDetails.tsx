import React, { useEffect, useState } from "react";

import { Product } from "../shared/shareddtypes";

import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { getProduct } from "../api/api";

export type ProductProps = {
  product: Product;
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
      <React.Fragment>
        <h1>Product with code: {id}</h1>
        <h2>Name:</h2>
        <p> {product.name} </p>
        <h2>Description:</h2>
        <p> {product.description} </p>
        <h2>Price:</h2>
        <p> {product.price} </p>
        <h2>Stock:</h2>
        <p> {product.stock} </p>
          <Img
            alt="Image of the product"
            src={require("../images/"
              .concat(product.code)
              .concat(".jpg"))}
          />
      </React.Fragment>
    );
  }

}

export default ProductDetails;

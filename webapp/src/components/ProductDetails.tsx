import React, { useEffect, useState } from "react";

import { Product } from "../shared/shareddtypes";

import {useParams} from "react-router-dom";
import { getProduct, getProducts } from "../api/api";

type ProductProps = {

};

type ProductDets = {
  id: string;
}

function ProductDetails(props: ProductProps): JSX.Element {
  
  const {id} = useParams<keyof ProductDets>() as ProductDets; 

  const obtainProduct = async () => {
    setProduct( await getProduct(id) );
  };

  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    obtainProduct();
  }, []);

  if (typeof product === "undefined") 
  {
    return (
      <React.Fragment>
          <h1>No Product found with id: {id}</h1>
      </React.Fragment>
    );
  } 
  else
  {
    return (
      <React.Fragment>
          <h1>Product with id: {id}</h1>
          <h2>name: {product.name}</h2>
          <h2>description: {product.description}</h2>
      </React.Fragment>
  );
  }
          
}

export default ProductDetails;

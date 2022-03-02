import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import { Product } from "../shared/shareddtypes";
import ProductBox from "./ProductBox";
import { getProducts } from "../api/api";

type ProductListProps = {
  products: Product[];
  OnAddCart: (product: Product) => void;
};

function ProductList(props: ProductListProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProductList = async () => {
    setProducts(await getProducts());
  };

  //Works like componentDidMount(), it is called when the component is render for the first time.
  useEffect(() => {
    refreshProductList();
  }, []);

  return (
    <Grid container columns={50} rowSpacing={5} className="mt-2 mb-2">
      {products.map((product) => (
        <Grid item xs={25} key={product.code}>
          <ProductBox
            product={product}
            onAdd={(productToAdd: Product) => props.OnAddCart(productToAdd)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;

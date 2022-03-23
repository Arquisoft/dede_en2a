import React, { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";

import { CartItem, Product } from "../shared/shareddtypes";

import ProductList from "./products/ProductList";


type HomeProps = {
  products: Product[];
  cartProducts: CartItem[];
  onAdd: (product: Product) => void;
};

const Search = styled('div')({
  marginLeft: "30px",
});

function Home(props: HomeProps): JSX.Element {

  const [searchTerm, setSearchTerm] = useState("");
  let productos : Product[] = [];
  

  return (
    <React.Fragment>
      <div>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ mb: 4, mt: 4 }}
      >
        Shop
      </Typography>
      <Search>
        <TextField type="text" id="search" label="Search..." variant="standard" onChange={event => {setSearchTerm(event.target.value)}}/>
      </Search>
      </div>
      {props.products.filter((val) => {
        if(searchTerm == ""){
          productos = props.products;
        }else if(val.name.toLowerCase().includes(searchTerm.toLowerCase())){
          productos.push(val);
        }
      })}
      <ProductList
          products={productos}
          cartProducts={props.cartProducts}
          OnAddCart={props.onAdd}
      />
    </React.Fragment>
  );
}

export default Home;

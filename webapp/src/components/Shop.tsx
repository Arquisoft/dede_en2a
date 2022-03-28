import React, { useState } from "react";

import {
  styled,
  Stack,
  Typography,
  Pagination,
  TextField,
} from "@mui/material";

import { CartItem, Product } from "../shared/shareddtypes";
import ProductList from "./products/ProductList";

type HomeProps = {
  products: Product[];
  cartProducts: CartItem[];
  onAdd: (product: Product) => void;
};

const Search = styled("div")({
  marginLeft: "30px",
});

export default function Shop(props: HomeProps): JSX.Element {
  let products: Product[] = [];
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = React.useState(1);
  const [itemsPerPage] = React.useState(12);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const obtainNumberOfPages = () => {
    return props.products.length % itemsPerPage === 0
      ? Math.floor(props.products.length / itemsPerPage)
      : Math.floor(props.products.length / itemsPerPage) + 1;
  };

  return (
    <React.Fragment>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        sx={{ mb: 4, mt: 4 }}
      >
        Shop
      </Typography>

      <Search>
        <TextField
          type="text"
          id="search"
          label="Search..."
          variant="standard"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Search>

      {props.products.filter((val) => {
        if (searchTerm == "") products = props.products;
        else if (val.name.toLowerCase().includes(searchTerm.toLowerCase()))
          products.push(val);
      })}

      <Stack justifyContent="center" alignItems="center" spacing={2}>
        <ProductList
          cartProducts={props.cartProducts}
          OnAddCart={props.onAdd}
          products={products.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
          )}
        />

        <Pagination
          count={obtainNumberOfPages()}
          page={page}
          onChange={handleChange}
          showFirstButton
          showLastButton
        />
      </Stack>
    </React.Fragment>
  );
}

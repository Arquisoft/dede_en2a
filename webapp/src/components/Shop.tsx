import React, { useState, useEffect } from "react";

import Typography from "@mui/material/Typography";

import { CartItem, Product } from "../shared/shareddtypes";

import ProductList from "./products/ProductList";
import { alpha, styled, TablePagination, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(20);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, productos.length - page * rowsPerPage);
  

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
          products={productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          cartProducts={props.cartProducts}
          OnAddCart={props.onAdd}
      />
      <TablePagination
          component="div"
          count={productos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[0]}
        />
    </React.Fragment>
  );
}

export default Home;

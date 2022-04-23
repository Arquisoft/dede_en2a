import React, { useState } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ChairIcon from '@mui/icons-material/Chair';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import {
  styled,
  Stack,
  Typography,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Autocomplete,
} from "@mui/material";

import { CartItem, Product } from "../shared/shareddtypes";
import ProductList from "./products/ProductList";
import { ArrowDownward } from "@mui/icons-material";
import { filterProductsByCategory } from "../api/api";

type HomeProps = {
  products: Product[];
  cartProducts: CartItem[];
  onAdd: (product: Product) => void;
};

const Search = styled("div")({
  marginLeft: "30px",
});

const Filter = styled("div")({
  margin: "30px",
  marginLeft: "30px",
});

const ALL = "all";
const PRICEASC = "asc";
const PRICEDESC = "desc";


function ProductsFilter(props: any) {
  return (
    <FormControl variant="standard" >
      <InputLabel id="select-order-status">Filter by...</InputLabel>    
      <Select
        labelId="select-product"
        id="select-product"
        value={props}
        onChange={props.handleChange}
        label="filter"
        sx={{ width: 300 }}        
      >
        
      <MenuItem value={ALL}>
          <em>All</em>
        </MenuItem>
        <MenuItem value={PRICEASC}>
          <Typography>Price </Typography>
          <ArrowUpwardIcon color="primary" />
        </MenuItem>
        <MenuItem value={PRICEDESC}>
          <Typography>Price </Typography>
          <ArrowDownward color="primary" />
        </MenuItem>
        <MenuItem>
          <Typography>Clothes </Typography>
          <CheckroomIcon color="primary"></CheckroomIcon>
        </MenuItem>
        <MenuItem>
          <Typography>Decoration </Typography>
          <ChairIcon color="primary"></ChairIcon>
        </MenuItem>
        <MenuItem>
          <Typography>Electronics </Typography>
          <PhoneAndroidIcon color="primary"></PhoneAndroidIcon>
        </MenuItem>
        <MenuItem>
          <Typography>Miscellaneous </Typography>
          <AutoAwesomeIcon color="primary"></AutoAwesomeIcon>
        </MenuItem>
      </Select>
    </FormControl>
  );
}



export default function Shop(props: HomeProps): JSX.Element {
  let products: Product[] = [];
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = React.useState(1);
  const [itemsPerPage] = React.useState(12);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [initOrder, setInitOrder] = useState("init");


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scroll(0,0);
  };

  const handleChange = async (event: SelectChangeEvent) => {  
    setInitOrder("null"); 
    if(event.target.value == "all"){
      setFilteredProducts(await filterProductsByCategory("none","none"));
    }else if(event.target.value == "desc" || event.target.value == "asc"){
      setFilteredProducts(await filterProductsByCategory("none",event.target.value));
    }else{
      setFilteredProducts(await filterProductsByCategory(event.target.value,"none"));
    }
    
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
      <Stack spacing={3} sx={{width: 500}}>
      <Filter>
        <ProductsFilter state={props} handleChange={handleChange}/>   
      </Filter>
      </Stack>
      
      {props.products.filter((val) => {
        if(initOrder == "init"){
          products = props.products;
        }else{
          if (searchTerm == "") products = filteredProducts;
          else if (val.name.toLowerCase().includes(searchTerm.toLowerCase()))
            products.push(val);
        }
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
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Stack>
    </React.Fragment>
  );
}

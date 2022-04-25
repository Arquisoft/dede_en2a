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
  makeStyles,
  Chip,
  Box,
} from "@mui/material";

import { CartItem, Product } from "../shared/shareddtypes";
import ProductList from "./products/ProductList";
import { ArrowDownward } from "@mui/icons-material";
import { filterProductsByCategory } from "../api/api";

type HomeProps = {
  products: Product[];
  productsInCart: CartItem[];
  refreshShop: () => void;
  addToCart: (product: Product) => void;
};

const Search = styled("div")({
  marginLeft: "30px",
});

const Filter = styled("div")({
  margin: "30px",
  marginLeft: "30px",
  
});

const Categories = styled("div")({
  position: "absolute",
  margin: "30px",
  marginLeft: "350px",
  marginTop: "-78px",
});

const ALLP = "allp";
const ALLC = "allc";
const PRICEASC = "asc";
const PRICEDESC = "desc";
const CLO = "Clothes";
const DEC = "Decoration";
const ELEC = "Electronics";
const MIS = "Miscellaneous";

let orderPrice : string = "allp";
let category : string = "allc";

function ProductsFilter(props: any) {
  return (
    <FormControl variant="standard">
      <InputLabel id="select-order-status">Filter by...</InputLabel>    
      <Select
        labelId="select-product"
        id="select-product"
        value={orderPrice}
        onChange={props.handleChange}
        label="filter"
        sx={{ width: 300 }} 
        defaultValue={ALLP}       
      >
        
      <MenuItem value={ALLP}>
          <em>All</em>
      </MenuItem>
      <MenuItem value={PRICEASC}>
        <Typography>Price: Lower to Higher <ArrowUpwardIcon color="primary" /></Typography>        
      </MenuItem>
      <MenuItem value={PRICEDESC}>
        <Typography>Price: Higher to Lower <ArrowDownward color="primary"/></Typography>        
      </MenuItem>
      </Select>
    </FormControl>
  );
}

function CategoriesFilter(props: any) {  
  return (
    <FormControl variant="standard">
      <InputLabel id="select-categories">See categories</InputLabel>    
      <Select
        labelId="select-categories"
        id="select-categories"
        value={category}
        onChange={props.handleChange}
        label="categories"
        sx={{ width: 300}} 
        defaultValue={ALLC}  
      >
        
      <MenuItem value={ALLC}>
          <em>All</em>
        </MenuItem>
        <MenuItem value={CLO}>
          <Typography>Clothes <CheckroomIcon color="primary"></CheckroomIcon></Typography>
        </MenuItem>
        <MenuItem value={DEC}>
          <Typography>Decoration <ChairIcon color="primary"></ChairIcon></Typography>          
        </MenuItem>
        <MenuItem value={ELEC}>
          <Typography>Electronics <PhoneAndroidIcon color="primary"></PhoneAndroidIcon></Typography>          
        </MenuItem>
        <MenuItem value={MIS}>
          <Typography>Miscellaneous <AutoAwesomeIcon color="primary"></AutoAwesomeIcon></Typography>          
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

  const handleFilterChanges = async (event : SelectChangeEvent) => {
    setInitOrder("null");
    
    if(event.target.value == PRICEASC || event.target.value == PRICEDESC){
      orderPrice = event.target.value;
    }else if(event.target.value == ALLP){
      orderPrice = "allp";
    }else if(event.target.value == ALLC){
      category = "allc";
    }else{
      category = event.target.value;
    }

    setFilteredProducts(await filterProductsByCategory(category, orderPrice));
    setPage(1);    
  };

  const obtainNumberOfPages = () => {
    return props.products.length % itemsPerPage === 0
      ? Math.floor(props.products.length / itemsPerPage)
      : Math.floor(props.products.length / itemsPerPage) + 1;
  };

  React.useEffect(() => {
    props.refreshShop();
  }, []);

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
      <Filter>
        <ProductsFilter state={props} handleChange={handleFilterChanges}/>           
      </Filter>
      <Categories>
        <CategoriesFilter state={props} handleChange={handleFilterChanges}/>
      </Categories>
    
      
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
          productsInCart={props.productsInCart}
          addToCart={props.addToCart}
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


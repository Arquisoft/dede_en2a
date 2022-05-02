import React, { useState } from "react";

import {
  Grid,
  Stack,
  Typography,
  Pagination,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import { CartItem, Product } from "../../shared/shareddtypes";
import { sortProducts } from "../../api/api";

import ProductList from "./products/ProductList";
import { SortProducts } from "./misc/SortProducts";
import { CategoriesFilter } from "./misc/CategoriesFilter";

const priceAscending = "asc";
const priceDescending = "desc";
const categoryClothes = "Clothes";
const categoryDecoration = "Decoration";
const categoryElectronics = "Electronics";
const categoryMiscellaneous = "Miscellaneous";

type HomeProps = {
  products: Product[];
  productsInCart: CartItem[];
  refreshShop: () => void;
  addToCart: (product: Product) => void;
};

function FilteringSection(props: any) {
  return (
    <Grid
      container
      alignItems="flex-end"
      justifyContent="space-between"
      sx={{ py: 1, px: 2 }}
      spacing={1}
    >
      <Grid item xs={12} md={3}>
        <TextField
          name="search"
          type="text"
          id="search"
          label="Search..."
          variant="standard"
          onChange={(event) => props.setSearchTerm(event.target.value)}
        />
      </Grid>
      <Grid item xs={5} md={5}>
        <SortProducts
          sortMode={props.sortMode}
          priceAscending={priceAscending}
          priceDescending={priceDescending}
          handleChange={(event: SelectChangeEvent) =>
            props.setSortMode(event.target.value)
          }
        />
      </Grid>
      <Grid item xs={5} md={3}>
        <CategoriesFilter
          categoryFilter={props.categoryFilter}
          categoryClothes={categoryClothes}
          categoryDecoration={categoryDecoration}
          categoryElectronics={categoryElectronics}
          categoryMiscellaneous={categoryMiscellaneous}
          handleChange={(event: SelectChangeEvent) =>
            props.setCategoryFilter(event.target.value)
          }
        />
      </Grid>
    </Grid>
  );
}

export default function Shop(props: HomeProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scroll(0, 0);
  };

  const search = (products: Product[]) => {
    let temporalProducts: Product[] = [];
    products.forEach((product) => {
      // In case the product starts with the searching term
      if (product.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        temporalProducts.push(product);
    });
    return temporalProducts;
  };

  const filterByCategory = (products: Product[]) => {
    let temporalProducts: Product[] = [];
    products.forEach((product) => {
      if (product.category === categoryFilter) temporalProducts.push(product);
    });
    return temporalProducts;
  };

  const sort = async () => {
    return await sortProducts(sortMode);
  };

  const retrieveProducts = async (products: Product[]) => {
    if (sortMode.length > 0) products = await sort();
    if (searchTerm.length > 0) products = search(products);
    if (categoryFilter.length > 0) products = filterByCategory(products);
    return products;
  };

  const refreshNumberOfPages = (products: Product[]) => {
    setNumberOfPages(
      products.length % itemsPerPage === 0
        ? Math.floor(products.length / itemsPerPage)
        : Math.floor(products.length / itemsPerPage) + 1
    );
  };

  React.useEffect(() => {
    props.refreshShop();
    retrieveProducts(props.products).then((products) => {
      setProducts(products); // We establish the products to the retrieved ones
      refreshNumberOfPages(products);
    });
  }, [searchTerm, sortMode, categoryFilter]);

  return (
    <React.Fragment>
      <FilteringSection
        setSearchTerm={setSearchTerm}
        sortMode={sortMode}
        setSortMode={setSortMode}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

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
          count={numberOfPages}
          page={page}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Stack>
    </React.Fragment>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  Container,
  Stack,
  IconButton,
  Tooltip,
  TablePagination,
  styled,
  tableCellClasses,
} from "@mui/material";

import { Autorenew, Add, Remove } from "@mui/icons-material";

import { Product } from "../../../shared/shareddtypes";
import { getProducts } from "../../../api/api";
import {
  isRenderForModeratorAtLeast,
  isRenderForAdminOnly,
} from "../../../helpers/RoleHelper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
    fontSize: 22,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function AutorenewOrders(props: any) {
  return (
    <IconButton edge="end">
      <Tooltip title="Refresh products" arrow>
        <Autorenew onClick={props.refreshOrderList} />
      </Tooltip>
    </IconButton>
  );
}

function ProductsHeader(props: any) {
  let navigate = useNavigate();

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      <Typography component="h1" variant="h4" align="center">
        Listing of all the products
      </Typography>
      <AutorenewOrders refreshOrderList={props.refreshOrderList} />

      {isRenderForModeratorAtLeast() && (
        <IconButton edge="end">
          <Tooltip title="Add a new product" arrow>
            <Add onClick={() => navigate("/dashboard/products/add")} />
          </Tooltip>
        </IconButton>
      )}

      {isRenderForAdminOnly() && (
        <IconButton edge="end">
          <Tooltip title="Delete a product" arrow>
            <Remove onClick={() => navigate("/dashboard/products/delete")} />
          </Tooltip>
        </IconButton>
      )}
    </Stack>
  );
}

function ProductTableItem(props: any): JSX.Element {
  let navigate = useNavigate();

  return (
    <TableRow hover key={props.product.orderCode}>
      <TableCell align="center">{props.product.code}</TableCell>
      <TableCell align="center">{props.product.name}</TableCell>
      <TableCell align="center">{props.product.description}</TableCell>
      <TableCell align="center">{props.product.price + " €"}</TableCell>
      <TableCell align="center">{props.product.stock}</TableCell>
    </TableRow>
  );
}

function ProductsTable(props: any): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(5);

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
    Math.min(rowsPerPage, props.products.length - page * rowsPerPage);

  return (
    <React.Fragment>
      <TableContainer sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Product</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Description</StyledTableCell>
              <StyledTableCell align="center">Price</StyledTableCell>
              <StyledTableCell align="center">Stock</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product: Product) => {
                return <ProductTableItem product={product} />;
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={props.products.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </React.Fragment>
  );
}

export default function Products(props: any): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProductList = async () => {
    getProducts().then((products) => setProducts(products));
  };

  useEffect(() => {
    refreshProductList();
  }, []);

  return (
    <Container component="main" sx={{ mb: 4, mt: 4 }}>
      <ProductsHeader refreshProductList={refreshProductList} />
      <ProductsTable products={products} />
    </Container>
  );
}

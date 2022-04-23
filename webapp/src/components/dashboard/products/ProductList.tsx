import { Add, Autorenew, Remove } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import {
  Container,
  IconButton,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../../api/api";
import {
  isRenderForAdminOnly,
  isRenderForModeratorAtLeast
} from "../../../helpers/RoleHelper";
import { Product } from "../../../shared/shareddtypes";

type ProductsProps = {
  role: string;
};

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

      {isRenderForModeratorAtLeast(props.role) && (
        <IconButton edge="end">
          <Tooltip title="Add a new product" arrow>
            <Add onClick={() => navigate("/dashboard/products/add")} />
          </Tooltip>
        </IconButton>
          <IconButton edge="end">
            <Tooltip title="Update a product" arrow>
              <EditIcon onClick={() => navigate("/dashboard/products/update")} />
            </Tooltip>
          </IconButton>
      )}

      {isRenderForAdminOnly(props.role) && (
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
  const [rowsPerPage] = React.useState(10);

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
                return (
                  <ProductTableItem key={product.code} product={product} />
                );
              })}
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

export default function Products(props: ProductsProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProductList = async () => {
    getProducts().then((products) => setProducts(products));
  };

  useEffect(() => {
    refreshProductList();
  }, []);

  return (
    <Container component="main" sx={{ mb: 4, mt: 4 }}>
      <ProductsHeader
        refreshProductList={refreshProductList}
        role={props.role}
      />
      <ProductsTable products={products} />
    </Container>
  );
}

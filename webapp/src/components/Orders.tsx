import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import NavBar from "./NavBar";
import OrderItem from "./OrderItem";

import { Order } from "../shared/shareddtypes";
import { getOrders } from "../api/api";
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, tableCellClasses, styled, TablePagination } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function Orders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 2));
    setPage(0);
  };  

  const refreshOrderList = async () => {
    setOrders(await getOrders());
  };

  useEffect(() => {
    refreshOrderList();
  });

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

  return(
    <React.Fragment>
      <NavBar />
      <br></br>
      <Typography align="center" variant="h4" color="black"> Your orders</Typography>
      <br></br>
    <TableContainer  component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="customized table">
        <TableHead>
          <TableRow hover>
            <StyledTableCell align="center">User</StyledTableCell>
            <StyledTableCell >Product</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">Shipping price</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
            <OrderItem orders={order} /> 
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        
      </Table>
      
    </TableContainer>
    <TablePagination
          component="div"
          count={orders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          //rowsPerPageOptions={[2, 5, 10, 15]}
        />
    </React.Fragment>
  );


  /*return (
    <React.Fragment>
      <NavBar />
      <Typography align="center" variant="h4" color="darkblue"> Your orders</Typography>   
      <Grid container alignItems="center" className="m-5" columns={4} >
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>User</span></Grid>
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>Products</span></Grid>
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>Total Price</span></Grid>         
        <Grid item xs alignItems="center"><span style={{fontSize: "20px",  fontWeight: "bold"}}>Shipping Price</span></Grid>
        {orders.map((order) => (
          <Grid item xs={5}>
            <OrderItem orders={order} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );*/
}

export default Orders;


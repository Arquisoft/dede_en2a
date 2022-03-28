import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
  Button,
  IconButton,
  Divider,
  Tooltip,
  TablePagination,
  styled,
  tableCellClasses,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { Autorenew } from "@mui/icons-material";

import { Order, User } from "../../../shared/shareddtypes";
import { getOrdersForUser, getUser } from "../../../api/api";

import FeaturedProducts from "../../FeaturedProducts";
import StatusMessage from "./StatusMessage";

type OrderTableItemProps = {
  order: Order;
};

type OrderTableProps = {
  orders: Order[];
};

function OrderHeader(props: any) {
  function AutorenewOrders() {
    return (
      <IconButton edge="end">
        <Tooltip title="Refresh orders" arrow>
          <Autorenew onClick={props.refreshOrderList}></Autorenew>
        </Tooltip>
      </IconButton>
    );
  }

  if (localStorage.getItem("role") !== null) {
    if (props.isOrder)
      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Typography component="h1" variant="h4" align="center">
            Your orders, {props.name}
          </Typography>
          <AutorenewOrders />
        </Stack>
      );
    else
      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Typography component="h1" variant="h4" align="center">
            No orders have been made
          </Typography>
          <AutorenewOrders />
        </Stack>
      );
  } else {
    return <Navigate to="/" />;
  }
}

function OrderTableItem(props: OrderTableItemProps): JSX.Element {
  let navigate = useNavigate();
  stateC = "all";

  return (
    <TableRow hover key={props.order.orderCode}>
      <TableCell align="center">{props.order.orderCode}</TableCell>
      <TableCell align="center">{props.order.subtotalPrice + " €"}</TableCell>
      <TableCell align="center">{props.order.shippingPrice + " €"}</TableCell>
      <TableCell align="center">{props.order.totalPrice + " €"}</TableCell>
      <TableCell align="center">
        <StatusMessage isOrderReceived={props.order.isOrderReceived} />
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="secondary"
          className="m-1"
          onClick={() => navigate("/order/" + props.order.orderCode)}
        >
          See details
        </Button>
      </TableCell>
    </TableRow>
  );
}

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

function OrderTable(props: OrderTableProps): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(5);

  let ordersN : Order[] = [];

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
    Math.min(rowsPerPage, props.orders.length - page * rowsPerPage);

  if (props.orders.length > 0)
    return (
      <React.Fragment>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Order</StyledTableCell>
                <StyledTableCell align="center">Subtotal</StyledTableCell>
                <StyledTableCell align="center">Shipping price</StyledTableCell>
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Show details</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.orders.filter((val) => {
                if(stateC == "received" && val.isOrderReceived == true){
                  ordersN.push(val);
                }else if(stateC == "shipping" && val.isOrderReceived == false){
                  ordersN.push(val);
                }else if(stateC == "all" || stateC == null){
                  ordersN = props.orders;
                }
              }) } 

              {ordersN.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order: Order) => {
                  return <OrderTableItem order={order} />;          
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
          count={ordersN.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </React.Fragment>
    );
  else
    return (
      <React.Fragment>
        <Divider sx={{ m: 2 }}>Just in case</Divider>
        <FeaturedProducts />
      </React.Fragment>
    );
}

const Filter = styled('div')({
  marginLeft: "1000px",
});


let stateC : String;

function Orders(props: any): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User>();
  

  const refreshOrderList = async () => {
    setOrders(await getOrdersForUser());
  };

  const refreshUser = async () => {
    setUser(await getUser(props.userEmail));
  };

  const [state, setState] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setState(event.target.value);
    stateC = event.target.value;
  };

  useEffect(() => {
    refreshOrderList();
    refreshUser();
  }, []);

  return (
    <Container component="main" sx={{ mb: 4, mt: 4 }}>
      <OrderHeader
        isOrder={orders.length > 0}
        refreshOrderList={refreshOrderList}
        name={user?.name}
      />
      <Filter>
       <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Show</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={state}
          onChange={handleChange}
          label="show"
        >
          <MenuItem value="all">
            <em>All</em>
          </MenuItem>
          <MenuItem value="received">Received</MenuItem>
          <MenuItem value="shipping">Shipping</MenuItem>
        </Select>
      </FormControl>
      </Filter>
      <OrderTable orders={orders} />
    </Container>
  );
}

export default Orders;

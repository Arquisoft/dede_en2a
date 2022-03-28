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
  LinearProgress,
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

const ALL = "all";
const RECEIVED = "received";
const SHIPPING = "shipping";

type OrderTableItemProps = {
  order: Order;
};

type OrderTableProps = {
  orders: Order[];
  state: string;
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

  if (props.isOrder)
    return (
      <Stack direction="column">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Typography component="h1" variant="h4" align="center">
            Your orders, {props.name}
          </Typography>
          <AutorenewOrders />
        </Stack>

        <FormControl variant="standard">
          <InputLabel id="select-order-status">Show</InputLabel>
          <Select
            labelId="select-order-status"
            id="select-order-status"
            value={props.state}
            onChange={props.handleChange}
            label="show"
          >
            <MenuItem value={ALL}>
              <em>All</em>
            </MenuItem>
            <MenuItem value={RECEIVED}>Received</MenuItem>
            <MenuItem value={SHIPPING}>Shipping</MenuItem>
          </Select>
        </FormControl>
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
}

function OrderTableItem(props: OrderTableItemProps): JSX.Element {
  let navigate = useNavigate();

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
          onClick={() => navigate("/dashboard/order/" + props.order.orderCode)}
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

  let ordersN: Order[] = [];

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
                if (props.state == RECEIVED && val.isOrderReceived == true) {
                  ordersN.push(val);
                } else if (
                  props.state == SHIPPING &&
                  val.isOrderReceived == false
                ) {
                  ordersN.push(val);
                } else if (props.state == ALL || props.state == null) {
                  ordersN = props.orders;
                }
              })}

              {ordersN
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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

function Orders(props: any): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState(ALL);

  const handleChange = (event: SelectChangeEvent) => {
    setState(event.target.value);
  };

  const refreshOrderList = async () => {
    setOrders(await getOrdersForUser());
  };

  const refreshUser = async () => {
    setUser(await getUser(props.userEmail));
  };

  useEffect(() => {
    setLoading(true); // we start with the loading process
    refreshUser();
    refreshOrderList().finally(() => setLoading(false)); // loading process must be finished
  }, []);

  return (
    <Container component="main" sx={{ mb: 4, mt: 4 }}>
      <LinearProgress hidden={!loading} />
      {!loading && (
        <React.Fragment>
          <OrderHeader
            isOrder={orders.length > 0}
            refreshOrderList={refreshOrderList}
            name={user?.name}
            state={state}
            handleChange={handleChange}
          />
          <OrderTable orders={orders} state={state} />
        </React.Fragment>
      )}
    </Container>
  );
}

export default Orders;

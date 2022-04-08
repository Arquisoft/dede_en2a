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
  Grid,
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
import { isRenderForAdminOnly } from "../../../helpers/RoleHelper";
import { getOrdersForUser, getUser } from "../../../api/api";

import FeaturedProducts from "../../home/FeaturedProducts";
import StatusMessage from "./StatusMessage";

const ALL = "all";
const RECEIVED = "received";
const SHIPPING = "shipping";

type OrdersProps = {
  webId: string | undefined;
  role: string;
};

type OrderTableItemProps = {
  order: Order;
};

type OrderTableProps = {
  orders: Order[];
  state: string;
};

function OrderFilter(props: any) {
  return (
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
  );
}

function AutorenewOrders(props: any) {
  return (
    <IconButton edge="end">
      <Tooltip title="Refresh orders" arrow>
        <Autorenew onClick={props.refreshOrderList}></Autorenew>
      </Tooltip>
    </IconButton>
  );
}

function OrderTitle(props: any) {
  return (
    <Grid container alignItems="center">
      <Grid item xs={11}>
        <Typography component="h1" variant="h4" align="center">
          {props.title}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <AutorenewOrders refreshOrderList={props.refreshOrderList} />
      </Grid>

      <OrderFilter state={props.state} handleChange={props.handleChange} />
    </Grid>
  );
}

function OrderHeader(props: any) {
  if (props.isOrder) {
    if (isRenderForAdminOnly(props.role)) {
      return (
        <OrderTitle
          state={props.state}
          handleChange={props.handleChange}
          title="Welcome back Admin!"
          refreshOrderList={props.refreshOrderList}
        />
      );
    } else
      return (
        <OrderTitle
          state={props.state}
          handleChange={props.handleChange}
          title={"Your orders, " + props.webId} // TODO: refactor this
          refreshOrderList={props.refreshOrderList}
        />
      );
  } else
    return (
      <Stack direction="row" spacing={1} justifyContent="center">
        <Typography component="h1" variant="h4" align="center">
          No orders have been made
        </Typography>
        <AutorenewOrders refreshOrderList={props.refreshOrderList} />
      </Stack>
    );
}

function OrderTableItem(props: OrderTableItemProps): JSX.Element {
  let navigate = useNavigate();

  return (
    <TableRow hover key={props.order.code}>
      <TableCell align="center" component="th" scope="row">
        {props.order.code}
      </TableCell>
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
          onClick={() => navigate("/dashboard/order/" + props.order.code)}
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
  let orders: Order[] = [];

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
              {props.orders.forEach((order) => {
                if (props.state === RECEIVED && order.isOrderReceived === true)
                  orders.push(order);
                else if (
                  props.state === SHIPPING &&
                  order.isOrderReceived === false
                ) {
                  orders.push(order);
                } else if (props.state === ALL || props.state === null) {
                  orders = props.orders;
                }
              })}
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order: Order) => {
                  return <OrderTableItem key={order.code} order={order} />;
                })}
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

function Orders(props: OrdersProps): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState(ALL);

  const handleChange = (event: SelectChangeEvent) => {
    setState(event.target.value);
  };

  const refreshOrderList = async () => {
    if (props.webId !== undefined)
      setOrders(await getOrdersForUser(props.webId, props.role));
  };

  const refreshUser = async () => {
    if (props.webId !== undefined) setUser(await getUser(props.webId));
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
            webId={user?.webId}
            role={user?.role}
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

import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";

import { getOrderByCode } from "../../../api/api";
import { Order, Product } from "../../../shared/shareddtypes";
import { checkImageExists } from "../../../helpers/ImageHelper";
import Divider from "@mui/material/Divider";
import StatusMessage from "./StatusMessage";

type OrderDetailsProps = {
  webId: string | undefined;
};

type OrderListProps = {
  order: Order | undefined;
};

type OrderListItemProps = {
  product: Product;
};

type ProductDets = {
  code: string;
};

function OrderListItem(props: OrderListItemProps): JSX.Element {
  const [product] = useState<Product>(props.product);

  const Img = styled("img")({
    display: "block",
    width: "30%",
  });

  if (typeof product === "undefined")
    return (
      <ListItem key={product} sx={{ py: 1, px: 0 }}>
        <Typography mr={4}> Product could not be found! </Typography>
      </ListItem>
    );
  else {
    return (
      <ListItem key={product.code} sx={{ py: 1, px: 0 }}>
        <Img
          alt="Image of the product"
          src={checkImageExists(product.image)}
          sx={{ width: "20%", p: 2, m: "auto" }}
        />
        <Typography mr={4}>{product.stock}</Typography>
        <ListItemText primary={product.name} secondary={product.description} />
        <Typography>{product.price}€</Typography>
      </ListItem>
    );
  }
}

function OrderList(props: OrderListProps): JSX.Element {
  if (typeof props.order === "undefined")
    return (
      <Typography variant="h6" className="m-2">
        Order not found, nothing to show :(
      </Typography>
    );
  else
    return (
      <List>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Date:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {new Date(props.order.date).toUTCString().substring(0, 16)}
          </Typography>
        </ListItem>

        <Divider />

        {props.order.products.map((product: Product) => (
          <OrderListItem product={product} />
        ))}
        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {props.order.subtotalPrice} €
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping costs:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {props.order.shippingPrice} €
          </Typography>
        </ListItem>

        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {props.order.totalPrice} €
          </Typography>
        </ListItem>

        <Divider />

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping address:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {props.order.address}
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Status:" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            <StatusMessage isOrderReceived={props.order.isOrderReceived} />
          </Typography>
        </ListItem>
      </List>
    );
}

export default function OrderDetails(props: OrderDetailsProps): JSX.Element {
  const { code } = useParams<keyof ProductDets>() as ProductDets;

  const [order, setOrder] = useState<Order>();

  const obtainOrder = async () => {
    if (props.webId !== undefined)
      setOrder(await getOrderByCode(props.webId, code));
  };

  useEffect(() => {
    obtainOrder();
  }, []);

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4, mt: 4 }}>
      <Typography component="h1" variant="h4" align="center">
        Order details
      </Typography>
      <OrderList order={order} />
      <Link to="/dashboard/orders" style={{ textDecoration: "none" }}>
        <Button variant="outlined" className="m-1">
          Go back
        </Button>
      </Link>
    </Container>
  );
}

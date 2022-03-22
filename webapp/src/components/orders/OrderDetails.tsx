import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";

import { getProduct, getOrder } from "../../api/api";
import { Order,Product } from "../../shared/shareddtypes";


type OrderListItemProps = {
  product: Product;
};

function OrderListItem(props: OrderListItemProps): JSX.Element {
  const [product, setProduct] = useState<Product>();

  const Img = styled("img")({
    display: "block",
    width: "30%",
  });

  const obtainProduct = async () => {
    setProduct(await getProduct(props.product.code));
  };

  useEffect(() => {
    obtainProduct();
  }, []);

  if (typeof product === "undefined")
    return (
      <ListItem key={product} sx={{ py: 1, px: 0 }}>
        <Typography mr={4}> Product could not be found! </Typography>
      </ListItem>
    );
  else {
    return (
      <ListItem key={product.code} sx={{ py: 1, px: 0 }}>
        <Img src={checkImageExists(product.image)} />
        <Typography mr={4}>{product.stock}</Typography>
        <ListItemText primary={product.name} secondary={product.description} />
        <Typography>{product.price}€</Typography>
      </ListItem>
    );
  }
}

function OrderList(props: any): JSX.Element {
  if (typeof props.order === "undefined")
    return (
      <Typography variant="h6" className="m-2">
        Order not found, nothing to show :(
      </Typography>
    );
  else
    return (
      <List>
        {props.order.products.map((product: Product) => (
          <OrderListItem product={product} />
        ))}
      </List>
    );
}

export default function OrderDetails(): JSX.Element {
  type ProductDets = {
    code: string;
  };

  const { code } = useParams<keyof ProductDets>() as ProductDets;

  const obtainOrder = async () => {
    setOrder(await getOrder(code));
  };

  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    obtainOrder();
  }, []);

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4, mt: 4 }}>
      <Typography component="h1" variant="h4" align="center">
        Order details
      </Typography>
      <OrderList order={order} />
      <Link to="/orders" style={{ textDecoration: "none" }}>
        <Button variant="outlined" className="m-1">
          Go back
        </Button>
      </Link>
    </Container>
  );
}
function checkImageExists(image: any): string | undefined {
  throw new Error("Function not implemented.");
}


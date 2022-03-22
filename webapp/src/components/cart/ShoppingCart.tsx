import { Link } from "react-router-dom";

import {
  Typography,
  Stack,
  Button,
  Container,
  Paper,
  styled,
  Divider,
} from "@mui/material";

import FeaturedProducts from "../FeaturedProducts";

import { CartItem, Product } from "../../shared/shareddtypes";
import ShoppingCartTable from "./ShoppingCartTable";

type ShoppingCartProps = {
  products: CartItem[];
  totalUnitsInCart: number;
  onIncrementUnit: (product: Product) => void;
  onDecrementUnit: (product: Product) => void;
};

export default function ShoppingCart(props: ShoppingCartProps): JSX.Element {
  const handleButton = (cartItem: CartItem) => {
    if (cartItem.amount >= cartItem.product.stock) return false;
    else return true;
  };

  const Img = styled("img")({
    display: "block",
    width: "25%",
  });

  if (props.totalUnitsInCart > 0)
    return (
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Shopping cart
          </Typography>
          <ShoppingCartTable
            products={props.products}
            totalUnitsInCart={props.totalUnitsInCart}
            onIncrementUnit={props.onIncrementUnit}
            onDecrementUnit={props.onDecrementUnit}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ mt: 2 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="outlined" className="m-1">
                Continue shopping
              </Button>
            </Link>

            <Button
              variant="contained"
              disabled={props.products.length === 0}
              component={Link}
              to="/checkout"
              className="m-1"
            >
              Proceed to checkout
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  else
    return (
      <Container component="main" sx={{ mb: 4, mt: 4 }}>
        <Typography component="h1" variant="h4" align="center">
          Shopping cart is empty 🤨
        </Typography>

        <Divider sx={{ m: 2 }}>Just in case</Divider>

        <FeaturedProducts />
      </Container>
    );
}

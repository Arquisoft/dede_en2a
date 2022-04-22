import { Link } from "react-router-dom";

import {
  Typography,
  Stack,
  Button,
  Container,
  Paper,
  Divider,
} from "@mui/material";

import FeaturedProducts from "../home/FeaturedProducts";

import { CartItem, Product } from "../../shared/shareddtypes";
import ShoppingCartTable from "./ShoppingCartTable";

type ShoppingCartProps = {
  productsInCart: CartItem[];
  totalUnitsInCart: number;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
};

export default function ShoppingCart(props: ShoppingCartProps): JSX.Element {
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
            productsInCart={props.productsInCart}
            totalUnitsInCart={props.totalUnitsInCart}
            addToCart={props.addToCart}
            removeFromCart={props.removeFromCart}
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

            <Link to="/checkout" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                disabled={props.productsInCart.length === 0} // TODO: check no user is logged in
                className="m-1"
              >
                Proceed to checkout
              </Button>
            </Link>
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

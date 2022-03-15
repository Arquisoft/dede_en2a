import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import ShoppingCart from "./ShoppingCart";

import { CartItem, Product } from "../shared/shareddtypes";

type ShoppingProps = {
  products: CartItem[];
  totalUnitsInCart: number;
  onIncrementUnit: (product: Product) => void;
  onDecrementUnit: (product: Product) => void;
};

function Shopping(props: ShoppingProps): JSX.Element {
  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Shopping cart
        </Typography>
        <ShoppingCart
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
}

export default Shopping;

import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import ShoppingCartTable from "./ShoppingCartTable";

import { CartItem, Product } from "../shared/shareddtypes";

type ShoppingProps = {
  products: CartItem[];
  totalUnitsInCart: number;
  onIncrementUnit: (product: Product) => void;
  onDecrementUnit: (product: Product) => void;
};

function ShoppingCart(props: ShoppingCartProps): JSX.Element {
  const handleButton = (cartItem: CartItem) => {
    if (cartItem.amount >= cartItem.product.stock) {
      return false;
    } else {
      return true;
    }
  };

  const Img = styled("img")({
    display: "block",
    width: "25%",
  });

  if (props.totalUnitsInCart > 0)
    return (
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Product </TableCell>
                <TableCell> Quantity </TableCell>
                <TableCell> Price per unit </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.products.map((cartItem: CartItem) => {
                if (cartItem.amount > 0)
                  return (
                    <TableRow key={cartItem.product.code}>
                      <TableCell>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={{ xs: 1, sm: 2, md: 4 }}
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Img
                            alt="Imagen del producto en el carrito"
                            src={require("../images/"
                              .concat(cartItem.product.code)
                              .concat(".png"))}
                          />
                          {cartItem.product.name}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-evenly"
                          alignItems="center"
                        >
                          <Button
                            onClick={() =>
                              props.onDecrementUnit(cartItem.product)
                            }
                            className="m-1"
                          >
                            -
                          </Button>
                          <Typography component="div">
                            {cartItem.amount}
                          </Typography>
                          <Button
                            onClick={() =>
                              props.onIncrementUnit(cartItem.product)
                            }
                            disabled={!handleButton(cartItem)}
                            className="m-1"
                          >
                            +
                          </Button>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography component="div">
                          {cartItem.product.price}€
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" className="m-2">
          Total Price -{" "}
          {
            calculateTotal(
              props.products,
              0
            ) /*There are no shipping costs yet here*/
          }
          €
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
}

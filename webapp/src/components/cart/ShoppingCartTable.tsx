import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import { calculateTotal } from "../../helpers/ShoppingCartHelper";
import { CartItem, Product } from "../../shared/shareddtypes";
import { checkImageExists } from "../../helpers/ImageHelper";

type ShoppingCartProps = {
  productsInCart: CartItem[];
  totalUnitsInCart: number;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Product </TableCell>
                <TableCell> Quantity </TableCell>
                <TableCell> Price per unit </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.productsInCart.map((cartItem: CartItem) => {
                if (cartItem.amount > 0)
                  return (
                    <TableRow key={cartItem.product.code}>
                      <TableCell>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          alignItems="center"
                        >
                          <Img
                            alt="Imagen del producto en el carrito"
                            src={checkImageExists(cartItem.product.image)}
                            sx={{ display: { xs: "none", md: "block" } }}
                          />
                          <Stack direction="column" sx={{ p: 1 }}>
                            <Typography variant="subtitle1">
                              {cartItem.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {cartItem.product.description}
                            </Typography>
                          </Stack>
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
                              props.removeFromCart(cartItem.product)
                            }
                            className="m-1"
                          >
                            -
                          </Button>
                          <Typography component="div">
                            {cartItem.amount}
                          </Typography>
                          <Button
                            onClick={() => props.addToCart(cartItem.product)}
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
        <Typography variant="h6" align="right" sx={{ mt: 1 }}>
          Total Price -{" "}
          {
            calculateTotal(props.productsInCart, 0) // There are no shipping costs yet here
          }
          €
        </Typography>
      </React.Fragment>
    );
  else
    return (
      <Typography variant="h6" className="m-2">
        Shopping cart is empty :(
      </Typography>
    );
}

export default ShoppingCart;

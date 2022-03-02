import Grid from "@mui/material/Grid";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { CartItem, Product } from "../shared/shareddtypes";

type ProductListProps = {
  cartItem: CartItem;
  onAdd: (product: Product) => void;
};

function ProductBox(props: ProductListProps): JSX.Element {
  function StockAlert(props: any): JSX.Element {
    if (props.stock <= props.amount) {
      // to prevent from some issues regarding no stock
      return <Chip label="No stock available!" color="error" />;
    } else if (props.stock - props.amount <= 10) {
      return <Chip label="Few units left!" color="warning" />;
    } else {
      return <Chip label="Stock available!" color="success" />;
    }
  }

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    width: "100%",
    height: "30vh",
  });

  return (
    <Grid container alignItems="center" direction="column" rowSpacing="5">
      <Grid item>
        <ButtonBase>
          <Img
            alt="Image of the product"
            src={require("../images/"
              .concat(props.cartItem.product.code)
              .concat(".jpg"))}
          />
        </ButtonBase>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          {props.cartItem.product.name}
        </Typography>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          {props.cartItem.product.price}€
        </Typography>
      </Grid>
      <Grid item xs>
        <StockAlert
          stock={props.cartItem.product.stock}
          amount={props.cartItem.amount}
        />
      </Grid>
      <Grid item xs>
        <Button
          variant="contained"
          disabled={props.cartItem.product.stock <= props.cartItem.amount}
          onClick={() => props.onAdd(props.cartItem.product)}
        >
          Add product
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProductBox;

import Grid from "@mui/material/Grid";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";


import { CartItem, Product } from "../shared/shareddtypes";

type ProductListProps = {
  product: Product;
  currentCartAmount: number;
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

  let navigate = useNavigate();

  return (
    <Grid container alignItems="center" direction="column" rowSpacing="5">
      <Grid item>
        <ButtonBase onClick={() => navigate("product/" + props.product.code )}>
          <Img
            alt="Image of the product"
            src={require("../images/"
              .concat(props.product.code)
              .concat(".jpg"))}
          />
        </ButtonBase>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          {props.product.name}
        </Typography>
      </Grid>
      <Grid item xs>
        <Typography gutterBottom variant="subtitle1" component="div">
          {props.product.price}€
        </Typography>
      </Grid>
      <Grid item xs>
        <StockAlert
          stock={props.product.stock}
          amount={props.currentCartAmount}
        />
      </Grid>
      <Grid item xs>
        <Button
          variant="contained"
          disabled={props.product.stock <= props.currentCartAmount}
          onClick={() => props.onAdd(props.product)}
        >
          Add product
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProductBox;

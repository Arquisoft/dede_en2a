import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import StockAlert from "./StockAlert";

import { Product } from "../shared/shareddtypes";

type ProductListProps = {
  product: Product;
  currentCartAmount: number;
  onAdd: (product: Product) => void;
};

export default function ProductBox(props: ProductListProps): JSX.Element {
  const Img = styled("img")({
    margin: "auto",
    display: "block",
    width: "100%",
    height: "30vh",
  });

  let navigate = useNavigate();

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      rowSpacing="5"
      sx={{ my: 2 }}
    >
      <Grid item>
        <ButtonBase onClick={() => navigate("/product/" + props.product.code)}>
          <Img
            alt="Image of the product"
            src={require("../images/"
              .concat(props.product.image))}
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
      <Button
        variant="contained"
        disabled={props.product.stock <= props.currentCartAmount}
        onClick={() => props.onAdd(props.product)}
        sx={{ m: 1 }}
      >
        Add product
      </Button>
    </Grid>
  );
}

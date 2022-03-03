import { useState } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";


import { Product } from "../shared/shareddtypes";

type ProductProps = {
  product: Product;
  onAdd: () => void;
};

function ProductBox(props: any): JSX.Element {
  const [stockOption, setStockOption] = useState<boolean>(true);

  function StockAlert(props: any): JSX.Element {
    if (props.stock === 0) {
      setStockOption(false);
      return <Chip label="No stock available!" color="error" />;
    } else if (props.stock <= 10) {
      setStockOption(true);
      return <Chip label="Few units left!" color="warning" />;
    } else {
      setStockOption(true);
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
        <ButtonBase onClick={() => navigate("product/" + props.product.code)}>
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
        <StockAlert stock={props.product.stock} />
      </Grid>
      <Grid item xs>
        <Button
          variant="contained"
          disabled={!stockOption}
          onClick={() => props.onAdd(props.product)}
        >
          Add product
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProductBox;

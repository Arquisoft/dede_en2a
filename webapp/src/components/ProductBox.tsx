import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import StockAlert from "./StockAlert";

import { Product } from "../shared/shareddtypes";

type ProductListProps = {
  product: Product;
  currentCartAmount: number;
  onAdd: (product: Product) => void;
};

export default function ProductBox(props: ProductListProps): JSX.Element {
  let navigate = useNavigate();

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={require("../images/"
            .concat(props.product.code)
            .concat(".png"))}
          alt={props.product.description}
          onClick={() => navigate("/product/" + props.product.code)}
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="subtitle1" component="div">
          {props.product.name}
        </Typography>

        <Typography variant="subtitle2" component="div">
          {props.product.description}
        </Typography>

        <Divider sx={{ m: 2 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" component="div">
            {props.product.price}€
          </Typography>
          <StockAlert
            stock={props.product.stock}
            amount={props.currentCartAmount}
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          disabled={props.product.stock <= props.currentCartAmount}
          onClick={() => props.onAdd(props.product)}
          sx={{ m: 1, width: "100%" }}
        >
          Add product
        </Button>
      </CardActions>
    </Card>
  );
}

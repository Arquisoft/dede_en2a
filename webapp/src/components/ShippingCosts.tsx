import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

import {
  showMapRoute,
  calculateShippingCosts,
  getCoordinatesFromAddress,
} from "../util/distanceCalculation";

export default function ShippingCosts(props: any): JSX.Element {
  const [address, setAddress] = React.useState("");
  const [map, setMap] = React.useState<string>();

  const shippingCosts = async (address: string) => {
    let destCoords: string = await getCoordinatesFromAddress(address);
    props.handleCostsCalculated(true);
    props.handleCosts(await calculateShippingCosts(destCoords));
    setMap(await showMapRoute(destCoords));
  };

  const calculateCosts = () => {
    shippingCosts(address);
  };

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    width: "100%",
    borderRadius: 10,
  });

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <TextField
        name="address"
        required
        fullWidth
        id="address"
        label="Address"
        onChange={(e) => setAddress(e.target.value)}
        autoFocus
      />
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={calculateCosts}
      >
        Calculate Shipping Costs
      </Button>
      {props.isCostsCalculated && (
        <Box component="div">
          <Divider sx={{ mt: 2, mb: 2 }}>DELIVERY</Divider>
          <Img src={map} alt="Image of the delivery process" />
          <Typography>The shipping costs are {props.costs}€</Typography>
        </Box>
      )}
    </React.Fragment>
  );
}

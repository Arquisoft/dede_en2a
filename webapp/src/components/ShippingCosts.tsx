import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import {
  showMapRoute,
  calculateShippingCosts,
  getCoordinatesFromAddress,
} from "../util/distanceCalculation";

export default function ShippingCosts(): JSX.Element {
  const [address, setAddress] = React.useState("");
  const [costs, setCosts] = React.useState<number>(0);
  const [map, setMap] = React.useState<string>();
  const [costsCalculated, setCostsCalculated] = React.useState<boolean>(false);

  const shippingCosts = async (address: string) => {
    let destCoords: string = await getCoordinatesFromAddress(address);
    setMap(await showMapRoute(destCoords));
    setCosts(await calculateShippingCosts(destCoords));
    setCostsCalculated(true);
  };

  const calculateCosts = () => {
    shippingCosts(address);
  };

  return (
    <React.Fragment>
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
      {costsCalculated && (
        <Box component="div">
          <p>The shipping costs are {costs} €</p>
          <img src={map}></img>
        </Box>
      )}
    </React.Fragment>
  );
}

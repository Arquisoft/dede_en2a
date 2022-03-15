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
} from "../helpers/ComputeDistanceHelper";
import { getAddressFromPod } from "../helpers/SolidHelper";

export default function ShippingCosts(props: any): JSX.Element {
  const [webId, setWebId] = React.useState("");
  const [map, setMap] = React.useState<string>();

  const calculateCosts = async () => {
    let street_address = await getAddressFromPod(webId); // we obtain the address from the solid pod
    shippingCosts(street_address); // we compute the address given the pod
  };

  const shippingCosts = async (street_address: string) => {
    let destCoords: string = await getCoordinatesFromAddress(street_address);
    props.handleCostsCalculated(true);
    props.handleCosts(await calculateShippingCosts(destCoords));
    setMap(await showMapRoute(destCoords));
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
        label="WebID"
        onChange={(e) => setWebId(e.target.value)}
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

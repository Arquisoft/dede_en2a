import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  Thing,
} from "@inrupt/solid-client";

import { VCARD } from "@inrupt/vocab-common-rdf";

import {
  showMapRoute,
  calculateShippingCosts,
  getCoordinatesFromAddress,
} from "../helpers/ComputeDistanceHelper";

export default function ShippingCosts(props: any): JSX.Element {
  const [webId, setWebId] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [map, setMap] = React.useState<string>();

  const solidPodAddress = async () => {
    let profileDocumentURI = webId.split("#")[0]; // we are just interested in the card
    let myDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI
    let profile = getThing(myDataset, webId); // we obtain the thing we are looking for from the dataset
    let street_address: string = getStringNoLocale(
      profile as Thing,
      VCARD.street_address
    ) as string; // we obtain the property we are looking for
    setAddress(street_address);
  };

  const shippingCosts = async () => {
    let destCoords: string = await getCoordinatesFromAddress(address);
    props.handleCostsCalculated(true);
    props.handleCosts(await calculateShippingCosts(destCoords));
    setMap(await showMapRoute(destCoords));
  };

  const calculateCosts = () => {
    solidPodAddress(); // we obtain the address from the solid pod
    shippingCosts(); // we compute the address given the pod
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

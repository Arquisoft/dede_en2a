import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  Thing,
} from "@inrupt/solid-client";

import { VCARD, FOAF } from "@inrupt/vocab-common-rdf";

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

  const solidPodName = async () => {
    let webId = "https://pod.inrupt.com/angelip2303/profile/card#me";
    let profileDocumentURI = webId.split("#")[0]; // we are just interested in the card
    let myDataset = await getSolidDataset(profileDocumentURI); // obtain the dataset from the URI
    let profile = getThing(myDataset, webId); // we obtain the thing we are looking for from the dataset
    let formattedName = getStringNoLocale(
      profile as Thing,
      VCARD.street_address
    ); // we obtain the property we are looking for
    console.log(formattedName);
  };

  const shippingCosts = async (address: string) => {
    let destCoords: string = await getCoordinatesFromAddress(address);
    setMap(await showMapRoute(destCoords));
    setCosts(await calculateShippingCosts(destCoords));
    setCostsCalculated(true);
  };

  const calculateCosts = () => {
    shippingCosts(address);
  };

  solidPodName();

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

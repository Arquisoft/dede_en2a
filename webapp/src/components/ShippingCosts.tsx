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

import { VCARD } from "@inrupt/vocab-common-rdf";

import {
  showMapRoute,
  calculateShippingCosts,
  getCoordinatesFromAddress,
} from "../util/distanceCalculation";

export default function ShippingCosts(): JSX.Element {
  const [webId, setWebId] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [costs, setCosts] = React.useState<number>(0);
  const [map, setMap] = React.useState<string>();
  const [costsCalculated, setCostsCalculated] = React.useState<boolean>(false);

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
    setMap(await showMapRoute(destCoords));
    setCosts(await calculateShippingCosts(destCoords));
    setCostsCalculated(true);
  };

  const calculateCosts = () => {
    solidPodAddress(); // we obtain the address from the solid pod
    shippingCosts(); // we compute the address given the pod
  };

  return (
    <React.Fragment>
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
      {costsCalculated && (
        <Box component="div">
          <p>The shipping costs are {costs} €</p>
          <img src={map}></img>
        </Box>
      )}
    </React.Fragment>
  );
}

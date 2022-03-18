import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import ApartmentIcon from "@mui/icons-material/Apartment";

import { User } from "../shared/shareddtypes";
import { getUser } from "../api/api";

import WebIdRadioGroup from "./WebIdRadioGroup";

import {
  showMapRoute,
  calculateShippingCosts,
  getCoordinatesFromAddress,
} from "../helpers/ComputeDistanceHelper";
import { getAddressesFromPod } from "../helpers/SolidHelper";

function WebIdTextField(props: any) {
  if (props.webId)
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Your WebId has been loaded from your account 😉
        </Typography>
      </React.Fragment>
    );
  else
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
          onChange={(e) => props.setWebId(e.target.value)}
          //autoFocus
        />
      </React.Fragment>
    );
}

export default function ShippingCosts(props: any): JSX.Element {
  const [webId, setWebId] = React.useState("");
  const [addresses, setAddress] = React.useState<string[]>([]);
  const [value, setValue] = React.useState<string>("");
  const [buttonMessage, setButtonMessage] = React.useState("Verify my address");
  const [user, setUser] = React.useState<User>();
  const [map, setMap] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  const refreshAddresses = async () => {
    let retrievedAddresses = await getAddressesFromPod(webId);
    retrievedAddresses.map((address) => addresses.push(address));
  };

  const refreshUser = async () => {
    setUser(await getUser(props.userEmail));
  };

  React.useEffect(() => {
    refreshUser();

    // We check if a user is logged in, if so we store the webId
    if (user) {
      setWebId(user.webId);
    }

    if (addresses.length > 0) setButtonMessage("Calculate shipping costs");
  }, []);

  const handleNext = () => {
    if (addresses.length > 0) return calculateCosts();
    else return refreshAddresses();
  };

  const calculateCosts = async () => {
    shippingCosts(value); // we compute the address given the pod
  };

  const shippingCosts = async (street_address: string) => {
    setLoading(true); // we start with the loading process

    let destCoords: string = await getCoordinatesFromAddress(street_address);
    props.handleCostsCalculated(true);
    props.handleCosts(await calculateShippingCosts(destCoords));

    showMapRoute(destCoords)
      .then((response) => setMap(response))
      .finally(() => setLoading(false)); // loading process must be finished
  };

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    width: "100%",
    borderRadius: 10,
  });

  return (
    <React.Fragment>
      <WebIdTextField webId={webId} setWebId={setWebId} />
      {addresses.length > 0 && (
        <WebIdRadioGroup
          value={value}
          setValue={setValue}
          radioItems={addresses}
          icon={<ApartmentIcon />}
          checkedIcon={<ApartmentIcon />}
        />
      )}
      <Button
        type="button"
        fullWidth
        variant="contained"
        disabled={addresses.length > 0 && !value}
        sx={{ mt: 3, mb: 2 }}
        onClick={handleNext}
      >
        {buttonMessage}
      </Button>
      {loading && <LinearProgress />}
      {props.isCostsCalculated && !loading && (
        <Box component="div">
          <Divider sx={{ mt: 2, mb: 2 }}>DELIVERY</Divider>
          <Img src={map} alt="Image of the delivery process" />
          <Typography>The shipping costs are {props.costs}€</Typography>
        </Box>
      )}
    </React.Fragment>
  );
}

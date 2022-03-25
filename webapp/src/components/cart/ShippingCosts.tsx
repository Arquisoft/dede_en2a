import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import ApartmentIcon from "@mui/icons-material/Apartment";

import { getUser } from "../../api/api";

import WebIdRadioGroup from "../WebIdRadioGroup";

import {
  showMapRoute,
  calculateShippingCosts,
  getCoordinatesFromAddress,
} from "../../helpers/ComputeDistanceHelper";
import { getAddressesFromPod } from "../../helpers/SolidHelper";

function WebIdStep(props: any) {
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>WebID</Divider>

      <Typography sx={{ pb: 2 }}>
        Please provide a valid WebID so we can retrieve your address from. Don't
        worry, your data is safe here. In case you have several addresses stored
        on it we will let you choose among them.
      </Typography>
      <TextField
        name="webId"
        id="webId"
        required
        fullWidth
        label="WebID"
        onChange={(e) => props.setWebId(e.target.value)}
        autoFocus
      />
    </React.Fragment>
  );
}

function StreetAddressesStep(props: any) {
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Street Address</Divider>

      <LinearProgress hidden={!props.loading} />
      {!props.loading && (
        <React.Fragment>
          <Typography sx={{ pb: 2 }}>
            Choose one of your valid addresses. We will only consider the one
            you chose as the valid one:
          </Typography>
          {props.addresses.length > 0 && (
            <WebIdRadioGroup
              value={props.address}
              setValue={props.setAddress}
              radioItems={props.addresses}
              icon={<ApartmentIcon />}
              checkedIcon={<ApartmentIcon />}
            />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function MapStep(props: any) {
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Delivery</Divider>

      <LinearProgress hidden={!props.loading} />
      {!props.loading && (
        <React.Fragment>
          <Card>
            <CardMedia
              component="img"
              image={props.map}
              alt="Image of the delivery process"
            />
            <CardContent>
              <Typography variant="h6">
                Shipping rates for {props.address}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                After computing some calculations we have obtained that the
                shipping costs are {props.costs}€
              </Typography>
            </CardContent>
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default function ShippingCosts(props: any): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0);
  const [webId, setWebId] = React.useState("");
  const [addresses, setAddresses] = React.useState<string[]>([]);
  const [address, setAddress] = React.useState("");
  const [map, setMap] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(false);

  // We have to get the user and addresses from the DB
  const refreshUser = async () => {
    return await getUser(props.userEmail);
  };

  const refreshAddresses = async (webId: string) => {
    setLoading(true); // we start with the loading process
    getAddressesFromPod(webId) // we retrieve the addresses from the pod
      .then(
        (
          response // then we iterate over the retrieved addresses and store them in the state
        ) =>
          response.forEach((address) => {
            // foreach address we check if it has already been stored
            if (!addresses.includes(address)) addresses.push(address); // in case it's not repeated => store it
          })
      )
      .finally(() => setLoading(false)); // loading process must be finished
  };

  // We manage the button for going back and forth
  const handleNext = () => {
    setActiveStep(activeStep + 1);
    stepHandler();
  };

  const stepHandler = async () => {
    // The webID has been provided
    if (activeStep === 0) refreshAddresses(webId);
    // An address has been provided
    if (activeStep === 1) shippingCosts();
  };

  const isContinue = () => {
    // We are at the first step: in case no webId has been provided
    if (activeStep === 0) return webId === "";
    // we are now at the second: in case no address has been choosen
    if (activeStep === 1) return address === "";
    // By default we will disable it
    return true;
  };

  const handleReset = () => {
    setActiveStep(0);

    // We reset all values to default
    setWebId("");
    setAddresses([]);
    setAddress("");
    setMap("");
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <WebIdStep setWebId={setWebId} />;
      case 1:
        return (
          <StreetAddressesStep
            address={address}
            setAddress={setAddress}
            addresses={addresses}
            loading={loading}
          />
        );
      case 2:
        return (
          <MapStep
            map={map}
            costs={props.costs}
            address={address}
            loading={loading}
          />
        );
    }
  };

  // Compute the shipping costs
  const shippingCosts = async () => {
    setLoading(true); // we start with the loading process

    let destCoords: string = await getCoordinatesFromAddress(address);
    props.handleCostsCalculated(true);
    props.handleCosts(await calculateShippingCosts(destCoords));

    showMapRoute(destCoords)
      .then((response) => setMap(response))
      .finally(() => setLoading(false)); // loading process must be finished
  };

  React.useEffect(() => {
    setLoadingPage(true); // we start with the loading process

    // for the first time the page renders we have to check if a user is logged in
    refreshUser()
      .then((user) => {
        if (user && user.webId) {
          setWebId(user.webId); // we store the obtained web id
          refreshAddresses(user.webId).then(
            () => setActiveStep(1) // we move to the second step
          ); // we have to load the addresses
        }
      })
      .finally(() => setLoadingPage(false)); // loading process must be finished
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mb: 4 }}>
      {!loadingPage && (
        <React.Fragment>
          {getStepContent(activeStep)}
          <Stack
            sx={{ py: 2 }}
            direction={{ xs: "column", sm: "row-reverse" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isContinue()}
            >
              Continue
            </Button>
            <Button hidden={activeStep === 0} onClick={handleReset}>
              Reset
            </Button>
          </Stack>
          <Divider />
        </React.Fragment>
      )}
    </Container>
  );
}

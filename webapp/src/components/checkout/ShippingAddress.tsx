import * as React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getAddressesFromPod } from "../../helpers/SolidHelper";
import { getUser } from "../../api/api";

import StreetAddress from "./address/StreetAddress";
import WebIdForm from "./address/WebIdForm";

export default function ShippingAddress(props: any): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0); // we have to tell which is the active step

  const [webId, setWebId] = React.useState("");
  const [addresses, setAddresses] = React.useState<string[]>([]);

  const [loadingItem, setLoadingItem] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(false);

  // We manage the button for going back and forth
  const handleNext = () => {
    setActiveStep(activeStep + 1);

    // The webID has been provided
    if (activeStep === 0) refreshAddresses(webId);
    // An address has been provided
    if (activeStep === 1) props.handleNext();
  };

  const isForward = () => {
    // We are at the first step: in case no webId has been provided
    if (activeStep === 0) return webId !== "";
    // we are now at the second: in case no address has been choosen
    if (activeStep === 1) return props.address !== "";
    // By default we will disable it
    return false;
  };

  const handleBack = () => {
    setActiveStep(0);

    // We reset all values to default
    setWebId("");
    setAddresses([]);
    props.setAddress("");
  };

  // Switch to provide the component for each active step
  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <WebIdForm setWebId={setWebId} />;
      case 1:
        return (
          <StreetAddress
            address={props.address}
            setAddress={props.setAddress}
            addresses={addresses}
            loading={loadingItem}
          />
        );
    }
  };

  // We have to get the user and addresses from the DB
  const refreshUser = async () => {
    return await getUser(props.userEmail);
  };

  const refreshAddresses = async (webId: string) => {
    setLoadingItem(true); // we start with the loading process
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
      .finally(() => setLoadingItem(false)); // loading process must be finished
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
    <React.Fragment>
      {!loadingPage && (
        <React.Fragment>
          {getStepContent(activeStep)}
          <Stack
            sx={{ pt: 2 }}
            direction={{ xs: "column", sm: "row-reverse" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              disabled={!isForward()}
              onClick={handleNext}
              variant="contained"
              className="m-1"
            >
              Next
            </Button>
            <Button onClick={handleBack} variant="outlined" className="m-1">
              Reset
            </Button>
          </Stack>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

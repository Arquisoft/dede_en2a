import * as React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getAddressesFromPod } from "../../helpers/SolidHelper";
import { getUser } from "../../api/api";
import { Address } from "../../shared/shareddtypes";

import StreetAddress from "./address/StreetAddress";

export default function ShippingAddress(props: any): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0); // we have to tell which is the active step
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loadingItem, setLoadingItem] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(false);
  const [stringAddress, setStringAddress] = React.useState<string>("");

  // We manage the button for going back and forth
  const handleNext = () => {
    setActiveStep(activeStep + 1);

    // An address has been provided
    if (activeStep === 1) props.handleNext();
  };

  const isForward = () => {
    return stringAddress !== "";
  };

  // We have to get the user and addresses from the DB
  const refreshUser = async () => {
    return await getUser(props.webId);
  };

  const refreshAddresses = async () => {
    setLoadingItem(true); // we start with the loading process
    getAddressesFromPod(props.webId) // we retrieve the addresses from the pod
      .then(
        (
          response // then we iterate over the retrieved addresses and store them in the state
        ) =>
          response.forEach((address) => {
            // foreach address we check if it has already been stored
            if (!addresses.some((e) => e.street === address.street))
              addresses.push(address); // in case it's not repeated => store it
          })
      )
      .finally(() => setLoadingItem(false)); // loading process must be finished
  };

  const handleAddress = (address: string) => {
    let aux = address.split("-");
    let newAddress: Address = {
      street: aux[0],
      postalCode: aux[1],
      locality: aux[2],
      region: aux[3],
    };
    setStringAddress(address);
    props.setAddress(newAddress);
  };

  React.useEffect(() => {
    setLoadingPage(true); // we start with the loading process

    // for the first time the page renders we have to check if a user is logged in
    refreshUser()
      .then((user) => {
        if (user) {
          refreshAddresses().then(
            () => setActiveStep(1) // we move to the second step
          ); // we have to load the addresses
        }
      })
      .finally(() => setLoadingPage(false)); // loading process must be finished
  }, [props.webId]);

  return (
    <React.Fragment>
      {!loadingPage && (
        <React.Fragment>
          <StreetAddress
            address={stringAddress}
            setAddress={handleAddress}
            addresses={addresses}
            loading={loadingItem}
          />

          <Stack
            sx={{ pt: 2 }}
            direction="row-reverse"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              disabled={!isForward()}
              onClick={handleNext}
              variant="contained"
              className="m-1"
              data-testid="next-button"
            >
              Next
            </Button>
          </Stack>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

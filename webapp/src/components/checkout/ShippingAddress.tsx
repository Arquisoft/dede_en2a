import * as React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { AlertColor } from "@mui/material/Alert";

import { getAddressesFromPod } from "../../helpers/SolidHelper";
import { getUser } from "../../api/api";
import { Address, NotificationType } from "../../shared/shareddtypes";

import StreetAddress from "./address/StreetAddress";
import NotificationAlert from "../misc/NotificationAlert";

export default function ShippingAddress(props: any): JSX.Element {
  const navigate = useNavigate();

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loadingItem, setLoadingItem] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(false);
  const [stringAddress, setStringAddress] = React.useState<string>("");

  // Notifications must be sent in order us to inform the user
  const [notificationStatus, setNotificationStatus] = React.useState(false);
  const [notification, setNotification] = React.useState<NotificationType>({
    severity: "success",
    message: "",
  });

  function sendNotification(severity: AlertColor, message: string) {
    setNotificationStatus(true);
    setNotification({
      severity: severity,
      message: message,
    });
  }

  // We manage the button for going back and forth
  const handleNext = () => {
    props.handleNext();
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
    getAddressesFromPod(props.webId)
      .then((elements) => {
        console.log(elements);
        if (elements.length === 0) {
          sendNotification(
            "error",
            "No address could be loaded from your POD. You are being redirected to the dashboard where you can add or edit them."
          );
          setTimeout(() => navigate("/dashboard/account"), 5000);
        } else setAddresses(elements);
      })
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
        if (user) refreshAddresses();
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

          <NotificationAlert
            notification={notification}
            notificationStatus={notificationStatus}
            setNotificationStatus={setNotificationStatus}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

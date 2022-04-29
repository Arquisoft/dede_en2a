import React from "react";

import {
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import {
  obtainShippingMethods,
  ShippingMethodType,
} from "../../../helpers/ComputeDistanceHelper";

function ShippingMethodRadioGroup(props: any) {
  const [loading, setLoading] = React.useState(false);
  const [shippingMethods, setShippingMethods] = React.useState<
    ShippingMethodType[]
  >([]);

  const handleChange = (title: string) => {
    props.setShippingMethod(title);
    props.handleNext(title);
  };

  const refreshShippingMethods = async () => {
    return await obtainShippingMethods(props.address);
  };

  React.useEffect(() => {
    setLoading(true); // we start with the loading process

    refreshShippingMethods()
      .then((shippingMethods) => setShippingMethods(shippingMethods))
      .finally(() => setLoading(false));
  }, []);

  return (
    <React.Fragment>
      <LinearProgress sx={{ display: loading ? "block" : "none" }} />
      {!loading && (
        <List>
          {shippingMethods.map(
            (method: { title: string; subtitle: string; price: string }) => (
              <ListItem key={method.title}>
                <IconButton
                  data-testid={method.title}
                  sx={{ mr: 2 }}
                  onClick={() => handleChange(method.title)}
                >
                  <LocalShippingIcon />
                </IconButton>

                <ListItemText
                  primary={method.title}
                  secondary={method.subtitle}
                />

                <Typography>{method.price}</Typography>
              </ListItem>
            )
          )}
        </List>
      )}
    </React.Fragment>
  );
}

export default function ShippingMethod(props: any) {
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Shipping method</Divider>
      <Typography sx={{ pb: 2 }}>
        Those are the shipping methods we have in our site; feel free to choose
        any of them:
      </Typography>

      <ShippingMethodRadioGroup
        address={props.address}
        value={props.shippingMethod}
        setShippingMethod={props.setShippingMethod}
        setCosts={props.setCosts}
        handleNext={props.handleNext}
      />
    </React.Fragment>
  );
}

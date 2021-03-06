import React from "react";
import { getRates } from "../../../api/carriersApi";
import { Address, CartItem, Rate } from "../../../shared/shareddtypes";

import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

type CarriersRatesGroupProps = {
  setValue: (price: number) => void;
  setCarrierSelected: (selected: boolean) => void;
  address: Address;
  rates: Rate[];
  price: number;
  icon: any;
  checkedIcon: any;
  setDays: (days: number) => void;
};

function CarriersRatesGroup(props: CarriersRatesGroupProps): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const aux = (event.target as HTMLInputElement).value
    props.setValue(parseFloat(aux.split('-')[0]));
    props.setCarrierSelected(true);
    props.setDays(parseFloat(aux.split('-')[1])/24);
    console.log(aux)
  };

  return (
    <Grid item xs={12}>
      <FormControl>
        <RadioGroup value={props.price} onChange={handleChange}>
          {props.rates.map((rate: Rate) => (
            <FormControlLabel
              control={
                <Radio icon={props.icon} checkedIcon={props.checkedIcon} />
              }
              value={rate.price+'-'+rate.time}
              label={
                <React.Fragment>
                  <Typography>
                    {rate.name + " - " + rate.price.toFixed(2) + " €"}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {rate.time + " hours estimated"}
                  </Typography>
                </React.Fragment>
              }
              key={rate.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}

type CarriersRatesProps = {
  setCarrierSelected: (selected: boolean) => void;
  setCosts: (costs: number) => void;
  address: Address;
  price: number;
  cart: CartItem[];
  setDays: (days: number) => void;
};

export default function CarriersRatesForm(
  props: CarriersRatesProps
): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [rates, setRates] = React.useState<Rate[]>([]);

  const refreshCarriersRates = async () => {
    let weights = 0;
    props.cart.forEach((item: CartItem) => {
      weights += item.product.weight * item.amount;
    });
    //Obtain the real weight and the postal code
    return await getRates(weights, props.address.postalCode);
  };

  React.useEffect(() => {
    setLoading(true); // we start with the loading process

    refreshCarriersRates().then((rates) => {
      setRates(rates);
    });

    setLoading(false);
  }, []);

  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Carriers Selection</Divider>

      <LinearProgress sx={{ display: loading ? "block" : "none" }} />
      {!loading && (
        <React.Fragment>
          <Typography sx={{ pb: 2 }}>
            Choose one of the carriers rates. This carrier will be used to send
            the package.
          </Typography>
          {rates.length > 0 && (
            <CarriersRatesGroup
              rates={rates}
              setCarrierSelected={props.setCarrierSelected}
              setValue={props.setCosts}
              price={props.price}
              address={props.address}
              icon={<LocalShippingIcon />}
              checkedIcon={<LocalShippingIcon />}
              setDays={props.setDays}
            />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

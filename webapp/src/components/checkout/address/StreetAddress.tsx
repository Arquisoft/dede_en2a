import * as React from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import ApartmentIcon from "@mui/icons-material/Apartment";
import { Address } from "../../../shared/shareddtypes";

function CustomRadioGroup(props: any) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Grid item xs={12}>
      <FormControl>
        <RadioGroup value={props.value} onChange={handleChange}>
          {props.radioItems.map((radioItem: Address) => (
            <FormControlLabel
              data-testid={`${radioItem.street}`}
              control={
                <Radio icon={props.icon} checkedIcon={props.checkedIcon} />
              }
              value={
                radioItem.street +
                "-" +
                radioItem.postalCode +
                "-" +
                radioItem.locality +
                "-" +
                radioItem.region
              }
              label={
                <React.Fragment>
                  <Typography>
                    {radioItem.street + " - " + radioItem.postalCode}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {radioItem.locality + " - " + radioItem.region}
                  </Typography>
                </React.Fragment>
              }
              key={radioItem.street + radioItem.postalCode}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}

function AddressesListing(props: any) {
  return (
    <React.Fragment>
      <Typography sx={{ pb: 2 }}>
        Choose one of your valid addresses. We will only consider the one you
        chose as the valid one:
      </Typography>
      <CustomRadioGroup
        value={props.address}
        setValue={props.setAddress}
        radioItems={props.addresses}
        icon={<ApartmentIcon />}
        checkedIcon={<ApartmentIcon />}
      />
    </React.Fragment>
  );
}

export default function StreetAddress(props: any) {
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Street Address</Divider>

      <LinearProgress sx={{ display: props.loading ? "block" : "none" }} />
      {!props.loading && (
        <AddressesListing
          address={props.address}
          setAddress={props.setAddress}
          addresses={props.addresses}
        />
      )}
    </React.Fragment>
  );
}

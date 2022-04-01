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

function CustomRadioGroup(props: any) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Grid item xs={12}>
      <FormControl>
        <RadioGroup value={props.value} onChange={handleChange}>
          {props.radioItems.map((radioItem: string) => (
            <FormControlLabel
              control={
                <Radio icon={props.icon} checkedIcon={props.checkedIcon} />
              }
              value={radioItem}
              label={
                <React.Fragment>
                  <Typography>{radioItem.split("-")[0]}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {radioItem.split("-")[1] + " - " + radioItem.split("-")[2]}
                  </Typography>
                </React.Fragment>
              }
              key={radioItem}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}

export default function StreetAddress(props: any) {
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
            <CustomRadioGroup
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

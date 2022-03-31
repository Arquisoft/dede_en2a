import * as React from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WebIdRadioGroup from "../../WebIdRadioGroup";

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

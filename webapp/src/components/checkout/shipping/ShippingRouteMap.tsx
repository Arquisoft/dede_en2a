import * as React from "react";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";

import {
  showMapRoute,
  getCoordinatesFromAddress,
} from "../../../helpers/ComputeDistanceHelper";

import { toStringAddress } from "../../../helpers/SolidHelper";

export default function ShippingRouteMap(props: any) {
  const [map, setMap] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Compute the shipping costs
  const refreshMap = async () => {
    setLoading(true); // we start with the loading process

    let destCoords: string = await getCoordinatesFromAddress(
      toStringAddress(props.address)
    );

    showMapRoute(destCoords)
      .then((response: string) => setMap(response))
      .finally(() => setLoading(false)); // loading process must be finished
  };

  React.useEffect(() => {
    refreshMap();
  }, []);

  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Delivery</Divider>

      <LinearProgress sx={{ display: loading ? "block" : "none" }} />
      {!loading && (
        <React.Fragment>
          <Card>
            <CardMedia
              component="img"
              image={map}
              alt="Image of the delivery process"
            />
            <CardContent>
              <Typography variant="h6">
                Shipping rates for {toStringAddress(props.address)}
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

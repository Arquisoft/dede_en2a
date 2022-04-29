import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Typography, LinearProgress, Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { getAddressesFromPod } from "../../../helpers/SolidHelper";
import AddAddressDialog from "./AddAddressDialog";
import EditAddressDialog from "./EditAddressDialog";

function MyAddresses(props: any) {
  const [loading, setLoading] = React.useState(false);
  const [addresses, setAddresses] = React.useState<
    Array<{
      street: string;
      region: string;
    }>
  >([]);

  React.useEffect(() => {
    setLoading(true);
    getAddressesFromPod(props.webId)
      .then((elements) =>
        elements.forEach((address) => {
          let element = {
            street: address.street,
            region:
              address.postalCode +
              ", " +
              address.locality +
              ", " +
              address.region,
          };

          // If the element to be inserted is not contained in the array
          if (!addresses.some((e) => e.street === element.street))
            addresses.push(element);
        })
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <React.Fragment>
      <Typography component="h2" variant="h5" sx={{ pb: 1 }}>
        Your addresses
      </Typography>

      <LinearProgress sx={{ display: loading ? "block" : "none" }} />
      {!loading && (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <Paper
                variant="outlined"
                component={Button}
                onClick={props.onClickAdd}
                sx={{ width: "100%", height: 200 }}
              >
                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <AddIcon fontSize="large" />
                  <Typography variant="h6">Add address</Typography>
                </Stack>
              </Paper>
            </Grid>
            {addresses.map((address) => (
              <Grid item xs={6} md={4}>
                <Paper variant="outlined">
                  <Stack
                    direction="column"
                    alignItems="space-around"
                    justifyContent="space-around"
                    height={200}
                  >
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="subtitle1">
                        {address.street}
                      </Typography>
                      <Typography color="text.secondary" variant="subtitle2">
                        {address.region}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="space-even"
                      justifyContent="center"
                    >
                      <Button onClick={props.onClickEdit}>Edit</Button>
                      <Button>Remove</Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </React.Fragment>
  );
}

export default function AccountDetails(props: any) {
  // We manage the add address dialog as intended
  const [addAddressDialog, setAddAddressDialog] = React.useState(false);

  const handleClickOpenAddAddressDialog = () => {
    setAddAddressDialog(true);
  };

  const handleCloseAddAddressDialog = () => {
    setAddAddressDialog(false);
  };

  // We manage the edit address dialog as intended
  const [editAddressDialog, setEditAddressDialog] = React.useState(false);

  const handleClickOpenEditAddressDialog = () => {
    setEditAddressDialog(true);
  };

  const handleCloseEditAddressDialog = () => {
    setEditAddressDialog(false);
  };

  return (
    <React.Fragment>
      <Paper sx={{ m: 2, p: 2 }}>
        <Stack direction="column">
          <MyAddresses
            webId={props.webId}
            onClickAdd={handleClickOpenAddAddressDialog}
            onClickEdit={handleClickOpenEditAddressDialog}
          />
        </Stack>
      </Paper>

      <AddAddressDialog
        open={addAddressDialog}
        handleOpen={handleClickOpenAddAddressDialog}
        handleClose={handleCloseAddAddressDialog}
      />

      <EditAddressDialog
        open={editAddressDialog}
        handleOpen={handleClickOpenEditAddressDialog}
        handleClose={handleCloseEditAddressDialog}
      />
    </React.Fragment>
  );
}

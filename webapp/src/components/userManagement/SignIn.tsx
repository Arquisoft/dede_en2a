import React from "react";

import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { login } from "@inrupt/solid-client-authn-browser";

export default function SignIn() {
  const [identityProvider, setIdentityProvider] = React.useState("");

  // We change the value of the identity provider to the one given by the user
  const handleChange = (event: SelectChangeEvent) => {
    setIdentityProvider(event.target.value as string);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // The default behaviour of the button is to resubmit.
    // This prevents the page from reloading.
    e.preventDefault();
    // Login will redirect the user away so that they can log in the OIDC issuer,
    // and back to the provided redirect URL (which should be controlled by your app).
    login({
      redirectUrl: window.location.origin, // we redirect to the home page
      oidcIssuer: identityProvider,
      clientName: "DEDE - Decentralized Delivery",
    });
  };

  return (
    <Stack component="main" maxWidth="xs" height="75vh" justifyContent="center">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 3, minWidth: 200 }}
        >
          <FormControl fullWidth>
            <InputLabel id="identity-provider-select-label">
              Identity provider
            </InputLabel>
            <Select
              labelId="identity-provider-select-label"
              id="identity-provider-select"
              value={identityProvider}
              label="Identity provider"
              onChange={handleChange}
            >
              <MenuItem value={"https://solidcommunity.net/"}>
                SOLID community
              </MenuItem>
              <MenuItem value={"https://inrupt.net/"}>Inrupt</MenuItem>
            </Select>
          </FormControl>

          <Button
            disabled={identityProvider === ""} // in case the identity provider is empty
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}

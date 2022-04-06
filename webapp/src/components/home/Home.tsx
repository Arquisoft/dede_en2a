import React from "react";

import Stack from "@mui/material/Stack";

import FeaturedProducts from "./FeaturedProducts";
import Hero from "./Hero";

import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";

export default function Home() {
  React.useEffect(() => {
    // We have to handle just-in-case we are redirected from a SOLID POD provider
    // After redirect, the current URL contains login information.
    // handleIncomingRedirect({
    //   restorePreviousSession: true,
    //   onError: errorHandle,
    // }).then((info) => {
    //   setWebId(info.webId);
    //   setResource(webId);
    // });
  }, []);

  return (
    <Stack alignItems="center">
      <Hero />
      <FeaturedProducts />
    </Stack>
  );
}

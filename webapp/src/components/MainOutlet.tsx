import * as React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./navigation/Footer";

export default function MainOutlet() {
  return (
    <React.Fragment>
      <Outlet />
      <Footer />
    </React.Fragment>
  );
}

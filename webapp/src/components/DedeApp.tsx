import * as React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";

export default function Dashboard(props: any) {
  return (
    <React.Fragment>
      <Outlet />
      <Footer />
    </React.Fragment>
  );
}

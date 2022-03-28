import * as React from "react";
import { Outlet } from "react-router-dom";

import DashboardSideBar from "./DashboardSideBar";

export default function Dashboard(props: any) {
  return (
    <React.Fragment>
      <Outlet />
      <DashboardSideBar />
    </React.Fragment>
  );
}

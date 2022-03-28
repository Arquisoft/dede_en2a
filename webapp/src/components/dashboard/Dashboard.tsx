import * as React from "react";
import { Outlet } from "react-router-dom";

import Grid from "@mui/material/Grid";

import DashboardSideBar from "./DashboardSideBar";

export default function Dashboard(props: any) {
  return (
    <React.Fragment>
      <Grid component="main" sx={{ mb: 10 }}>
        <Outlet />
      </Grid>
      <DashboardSideBar />
    </React.Fragment>
  );
}

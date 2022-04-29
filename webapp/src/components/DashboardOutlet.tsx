import * as React from "react";
import { Outlet } from "react-router-dom";

import Grid from "@mui/material/Grid";

import DashboardSideBar from "./dashboard/misc/DashboardSideBar";

type DashboardProps = {
  role: string;
};

export default function DashboardOutlet(props: DashboardProps) {
  return (
    <React.Fragment>
      <Grid component="main" sx={{ mb: 10 }}>
        <Outlet />
      </Grid>
      <DashboardSideBar role={props.role} />
    </React.Fragment>
  );
}

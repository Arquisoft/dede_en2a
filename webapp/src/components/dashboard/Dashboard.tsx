import Grid from "@mui/material/Grid";
import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import DashboardSideBar from "./DashboardSideBar";

export default function Dashboard(props: any) {
  if (localStorage.getItem("user.email") === null) return <Navigate to="/" />;
  return (
    <React.Fragment>
      <Grid component="main" sx={{ mb: 10 }}>
        <Outlet />
      </Grid>
      <DashboardSideBar />
    </React.Fragment>
  );
}

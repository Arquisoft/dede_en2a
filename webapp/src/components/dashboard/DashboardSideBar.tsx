import * as React from "react";
import { Link, Outlet } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";

import SettingsIcon from "@mui/icons-material/Settings";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function DashboardSideBar() {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels>
        <BottomNavigationAction
          component={Link}
          to="/dashboard"
          label="Dashboard"
          icon={<SettingsIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="orders"
          label="Orders"
          icon={<MoveToInboxIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="products"
          label="Products"
          icon={<LocalOfferIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

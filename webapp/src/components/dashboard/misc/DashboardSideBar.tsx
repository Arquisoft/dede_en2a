import { Link } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";

import SettingsIcon from "@mui/icons-material/Settings";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { isRenderForModeratorAtLeast } from "../../../helpers/RoleHelper";

type DashboardSideBarProps = {
  role: string;
};

export default function DashboardSideBar(props: DashboardSideBarProps) {
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
        {isRenderForModeratorAtLeast(props.role) && (
          <BottomNavigationAction
            component={Link}
            to="products"
            label="Products"
            icon={<LocalOfferIcon />}
          />
        )}
        <BottomNavigationAction
          component={Link}
          to="account"
          label="Account Details"
          icon={<ManageAccountsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

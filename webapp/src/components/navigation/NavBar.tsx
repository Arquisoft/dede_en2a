import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import MUISwitch from "../ThemeSlider";
import UserMenuButton from "./UserMenuButton";
import Drawer from "./Drawer";
import NavMenu from "./NavMenu";

type NavBarProps = {
  totalUnitsInCart: number;
  logCurrentUserOut: () => void;
  changeTheme: Function;
  initialState: boolean;
  userRole: string;
};

function Logo() {
  return (
    <Typography
      variant="h6"
      component={Link}
      to="/"
      color="inherit"
      sx={{
        flexGrow: 1,
        textDecoration: "none",
        ":hover": {
          color: "white",
        },
      }}
    >
      Dede
    </Typography>
  );
}

function ThemeModeSwitch(props: any) {
  return (
    <MUISwitch
      onChange={(e) => {
        props.changeTheme();
      }}
      checked={props.initialState}
    />
  );
}

function ShoppingCartButton(props: any) {
  return (
    <IconButton
      size="large"
      color="inherit"
      component={Link}
      to="cart"
      sx={{ mx: 1 }}
    >
      <Badge badgeContent={props.totalUnitsInCart} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}

export default function NavBar(props: NavBarProps): JSX.Element {
  return (
    <AppBar position="static">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1 }}
      >
        <Stack direction="row" alignItems="center">
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Drawer orientation="vertical" />
          </Box>
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, pl: 5 }}>
            <NavMenu orientation="row" />
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center">
          <ThemeModeSwitch
            changeTheme={props.changeTheme}
            initialState={props.initialState}
          />
          <ShoppingCartButton totalUnitsInCart={props.totalUnitsInCart} />
          <UserMenuButton logCurrentUserOut={props.logCurrentUserOut} />
        </Stack>
      </Stack>
    </AppBar>
  );
}

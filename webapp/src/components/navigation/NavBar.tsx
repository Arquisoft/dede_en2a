import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";

import MUISwitch from "../ThemeSlider";
import UserMenuButton from "./UserMenuButton";
import Drawer from "./Drawer";

type NavBarProps = {
  totalUnitsInCart: number;
  logCurrentUserOut: () => void;
  changeTheme: Function;
  initialState: boolean;
  userRole: string;
};

const menuList: {
  name: string;
  icon: any;
  link: string;
}[] = [
  {
    name: "Home",
    icon: <HomeIcon fontSize="small" />,
    link: "",
  },
  {
    name: "Shop",
    icon: <StoreIcon fontSize="small" />,
    link: "shop",
  },
  {
    name: "Cart",
    icon: <ShoppingCartIcon fontSize="small" />,
    link: "cart",
  },
];

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Drawer menuList={menuList} />
          <Logo />
          <ThemeModeSwitch
            changeTheme={props.changeTheme}
            initialState={props.initialState}
          />
          <ShoppingCartButton totalUnitsInCart={props.totalUnitsInCart} />
          <UserMenuButton logCurrentUserOut={props.logCurrentUserOut} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

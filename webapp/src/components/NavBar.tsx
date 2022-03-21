import * as React from "react";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import StoreIcon from "@mui/icons-material/Store";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { Grid } from "@mui/material";
import MUISwitch from "./ThemeSlider";

type LogOutFuncProps = {
  logCurrentUserOut: () => void;
  handleCloseUserMenu: () => void;
};

function LogOut(props: LogOutFuncProps): JSX.Element {
  const logOutUser = () => {
    localStorage.removeItem("token");
    props.logCurrentUserOut();
    props.handleCloseUserMenu();
  };

  return (
    <React.Fragment>
      {localStorage.getItem("token") !== null && (
        <MenuItem onClick={logOutUser}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Log-out</Typography>
        </MenuItem>
      )}
    </React.Fragment>
  );
}

function UserButton(props: any): JSX.Element {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (localStorage.getItem("token") !== null)
    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="User management options">
          <IconButton onClick={handleOpenUserMenu} size="large" color="inherit">
            <AccountCircle />
          </IconButton>
        </Tooltip>

        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem component={Link} to="/orders" onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <MoveToInboxIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Orders</Typography>
          </MenuItem>

          <LogOut
            logCurrentUserOut={props.logCurrentUserOut}
            handleCloseUserMenu={handleCloseUserMenu}
          />
        </Menu>
      </Box>
    );
  else
    return (
      <Link to="/sign-in" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="secondary" className="m-1">
          Sign-In
        </Button>
      </Link>
    );
}

type NavBarProps = {
  totalUnitsInCart: number;
  logCurrentUserOut: () => void;
  changeTheme: Function;
  initialState: boolean;
};

export default function NavBar(props: NavBarProps): JSX.Element {
  const [state, setState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      )
        return;

      setState(open);
    };

  const list = () => (
    <Grid
      container
      alignItems="center"
      direction="column"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <MenuList>
        <MenuItem component={Link} to="/">
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Home</Typography>
        </MenuItem>

        <MenuItem component={Link} to="shop">
          <ListItemIcon>
            <StoreIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Shop</Typography>
        </MenuItem>

        <MenuItem component={Link} to="cart">
          <ListItemIcon>
            <ShoppingCartIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Cart</Typography>
        </MenuItem>

        <MenuItem component={Link} to="addProduct">
          <ListItemIcon>
            <AddCircleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Add product</Typography>
        </MenuItem>
      </MenuList>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor="left"
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            {list()}
          </SwipeableDrawer>

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

          <MUISwitch
            onChange={(e) => {
              props.changeTheme();
            }}
            checked={props.initialState}
          />

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
          <UserButton logCurrentUserOut={props.logCurrentUserOut} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

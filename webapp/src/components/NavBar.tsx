import * as React from "react";

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
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

function UserButton(props: any): JSX.Element {
  if (props.isAuthenticated)
    return (
      <IconButton size="large" color="inherit" component={Link} to="/">
        <AccountCircle />
      </IconButton>
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

function NavBar(props: any): JSX.Element {
  const [auth, setAuth] = React.useState(true);
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

        <MenuItem component={Link} to="/cart">
          <ListItemIcon>
            <ShoppingCartIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Cart</Typography>
        </MenuItem>
      </MenuList>

      <UserButton isAuthenticated={props.isAuthenticated} />
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

          <IconButton size="large" color="inherit" component={Link} to="/cart">
            <Badge badgeContent={props.totalUnitsInCart} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <UserButton isAuthenticated={props.isAuthenticated} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;

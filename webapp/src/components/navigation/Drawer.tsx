import * as React from "react";
import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import Grid from "@mui/material/Grid";

import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";

type DrawerProps = {
  menuList: {
    name: string;
    icon: any;
    link: string;
  }[];
};

export default function Drawer(props: DrawerProps) {
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
        {props.menuList.map((menuItem) => (
          <MenuItem component={Link} to={menuItem.link}>
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <Typography variant="inherit">{menuItem.name}</Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Grid>
  );

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

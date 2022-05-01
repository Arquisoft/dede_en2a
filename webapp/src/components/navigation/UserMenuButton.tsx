import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import AccountCircle from "@mui/icons-material/AccountCircle";
import FaceIcon from "@mui/icons-material/Face";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { getNameFromPod } from "../../helpers/SolidHelper";

type LogOutFuncProps = {
  logCurrentUserOut: () => void;
  handleCloseUserMenu: () => void;
  webId: string;
};

function LogOut(props: LogOutFuncProps): JSX.Element {
  let navigate = useNavigate();

  const logOutUser = () => {
    props.logCurrentUserOut();
    props.handleCloseUserMenu();
    navigate("/");
  };

  return (
    <React.Fragment>
      {props.webId !== undefined && ( // If a user has been authenticated
        <React.Fragment>
          <MenuItem onClick={logOutUser}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Log-out</Typography>
          </MenuItem>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default function UserMenuButton(props: any): JSX.Element {
  const [name, setName] = React.useState("");
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    getNameFromPod(props.webId).then((name) => setName(name));
  }, [props.webId]);

  if (props.webId !== undefined)
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
          <Stack direction="row" sx={{ p: 2 }} spacing={1}>
            <FaceIcon fontSize="small" />
            <Typography>{name}</Typography>
          </Stack>

          <Divider />

          <MenuItem
            component={Link}
            to="/dashboard"
            onClick={handleCloseUserMenu}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Dashboard</Typography>
          </MenuItem>

          <LogOut
            logCurrentUserOut={props.logCurrentUserOut}
            handleCloseUserMenu={handleCloseUserMenu}
            webId={props.webId}
          />
        </Menu>
      </Box>
    );
  else
    return (
      <Link to="/sign-in" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="secondary">
          Sign-In
        </Button>
      </Link>
    );
}

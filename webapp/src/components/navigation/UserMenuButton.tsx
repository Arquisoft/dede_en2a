import AccountCircle from "@mui/icons-material/AccountCircle";
import FaceIcon from "@mui/icons-material/Face";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

type LogOutFuncProps = {
  logCurrentUserOut: () => void;
  handleCloseUserMenu: () => void;
};

function LogOut(props: LogOutFuncProps): JSX.Element {
  let navigate = useNavigate();

  const logOutUser = () => {
    localStorage.removeItem("token");
    props.logCurrentUserOut();
    props.handleCloseUserMenu();
    navigate("/");
  };

  return (
    <React.Fragment>
      {localStorage.getItem("token") !== null && (
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
          <MenuItem>
            <ListItemIcon>
              <FaceIcon fontSize="small" />
            </ListItemIcon>

            <TextField
              value={props.userName + "\n" + localStorage.getItem("user.email")}
              fullWidth
              multiline
              id="input-with-sx"
              variant="standard"
              InputProps={{ style: { fontSize: 10 } }}
            />
          </MenuItem>
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

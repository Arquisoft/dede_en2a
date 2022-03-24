import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type ShowByRolesProps = {
    userRole: string;
}

export default function ShowByRoles(props: ShowByRolesProps): JSX.Element {
    switch (props.userRole) {
      case "admin":
        return (
          <>
            <MenuItem component={Link} to="addProduct">
              <ListItemIcon>
                <AddCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Add product</Typography>
            </MenuItem>
            <MenuItem component={Link} to="deleteProduct">
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Delete product</Typography>
            </MenuItem>
          </>
        );
      case "manager":
        return (
          <>
            <MenuItem component={Link} to="addProduct">
              <ListItemIcon>
                <AddCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Add product</Typography>
            </MenuItem>
          </>
        );
      case "user":
      default:
        return <></>;
    }
  }
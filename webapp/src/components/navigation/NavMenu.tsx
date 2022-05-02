import { Link } from "react-router-dom";

import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";

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
  {
    name: "About",
    icon: <InfoIcon fontSize="small" />,
    link: "about",
  },
];

export default function NavMenu(props: any) {
  return (
    <ButtonGroup orientation={props.orientation}>
      {menuList.map((menuItem) => (
        <Button
          variant="text"
          component={Link}
          to={menuItem.link}
          startIcon={menuItem.icon}
          key={menuItem.name}
          sx={{ color: props.color }}
        >
          {menuItem.name}
        </Button>
      ))}
    </ButtonGroup>
  );
}

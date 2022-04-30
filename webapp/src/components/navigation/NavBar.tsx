import { Link } from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import ThemeSlider from "./ThemeSlider";
import UserMenuButton from "./UserMenuButton";
import Drawer from "./Drawer";
import NavMenu from "./NavMenu";

import { checkImageExistsLocally } from "../../helpers/ImageHelper";

type NavBarProps = {
  totalUnitsInCart: number;
  logCurrentUserOut: () => void;
  toggleColorMode: () => void;
  mode: "dark" | "light";
  webId: string;
};

function Logo() {
  const Img = styled("img")({
    display: "block",
    height: 45,
  });

  return (
    <Link to="/shop" color="inherit" style={{ textDecoration: "none" }}>
      <Img
        src={checkImageExistsLocally("dede_logo.svg")}
        srcSet={`${checkImageExistsLocally(
          "dede_logo_mobile.svg"
        )} 500w, ${checkImageExistsLocally("dede_logo.svg")}`}
        alt="DEDE - Fast service"
      />
    </Link>
  );
}

function ShoppingCartButton(props: any) {
  return (
    <IconButton size="large" color="inherit" component={Link} to="cart">
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
        <Stack direction="row" alignItems="center" spacing={0}>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <Drawer orientation="vertical" />
          </Box>
          <Logo />
          <Box sx={{ px: 1, display: { xs: "none", md: "flex" } }}>
            <NavMenu orientation="horizontal" color="white" />
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center">
          <ThemeSlider
            onChange={props.toggleColorMode}
            checked={props.mode === "dark"}
          />
          <ShoppingCartButton totalUnitsInCart={props.totalUnitsInCart} />
          <UserMenuButton
            logCurrentUserOut={props.logCurrentUserOut}
            webId={props.webId}
          />
        </Stack>
      </Stack>
    </AppBar>
  );
}

import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import FeaturedProducts from "./FeaturedProducts";

function Hero() {
  return (
    <Stack
      sx={{
        bgcolor: "background.paper",
        width: "100%",
        height: "91vh",
      }}
      component="main"
      justifyContent="center"
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome to DeDe
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          We are creating an app for you to order the products you want - as in
          any other site - with privacy in mind
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            component={Link}
            to="shop"
            sx={{ textAlign: "center" }}
          >
            Start shopping
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="sign-up"
            sx={{ textAlign: "center" }}
          >
            Create an account
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
}

export default function Home() {
  return (
    <Stack spacing={2} alignItems="center">
      <Hero />
      <FeaturedProducts />
    </Stack>
  );
}

import React from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { checkImageExistsLocally } from "../../helpers/ImageHelper";

export default function Hero() {
  return (
    <React.Fragment>
      <Stack
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${checkImageExistsLocally(
            "hero.jpg"
          )})`,
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
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
            color="white"
            gutterBottom
          >
            Welcome to DEDE
          </Typography>
          <Typography variant="h5" align="center" color="white" paragraph>
            We are creating an app for you to order the products you want - as
            in any other site - with privacy in mind
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
              id="shop"
              sx={{ textAlign: "center" }}
            >
              Start shopping
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="sign-in"
              sx={{ textAlign: "center" }}
            >
              Log to your POD
            </Button>
          </Stack>
        </Container>
      </Stack>
    </React.Fragment>
  );
}

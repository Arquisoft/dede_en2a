import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import StarIcon from "@mui/icons-material/StarBorder";

import { styled } from "@mui/material/styles";

import { checkImageExists } from "../helpers/ImageHelper";

export default function FeaturedProducts() {
  const tiers = [
    {
      code: "1235",
      title: "AMONGUS™ T-shirt",
      price: "12.95",
      image:"1236.png",
      buttonVariant: "outlined",
    },
    {
      code: "1234",
      title: "AMONG US™ T-shirt",
      subheader: "Most popular",
      price: "12.95",
      image:"1234.png",
      buttonVariant: "contained",
    },
    {
      code: "1237",
      title: "AMONG US T-shirt",
      price: "12.95",
      image:"1237.png",
      buttonVariant: "outlined",
    },
  ];

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    width: "100%",
  });

  let navigate = useNavigate();

  return (
    <Container maxWidth="md" component="main">
      <Typography
        gutterBottom
        component="h2"
        variant="h3"
        align="center"
        color="text.primary"
      >
        Our featured products
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary">
        These are the products we are most proud of. Feel free to check them
        out!
      </Typography>
      <Grid container spacing={3} alignItems="center" sx={{ mt: 2 }}>
        {tiers.map((tier) => (
          <Grid item key={tier.title} xs={12} md={4}>
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: "center" }}
                action={tier.title === "Pro" ? <StarIcon /> : null}
                subheaderTypographyProps={{
                  align: "center",
                }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Img
                  alt="Image of the product"
                  src={checkImageExists(tier.image)}
                />
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant as "outlined" | "contained"}
                  onClick={() => navigate("/product/" + tier.code)}
                >
                  Further details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

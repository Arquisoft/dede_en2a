import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CardHeader from "@mui/material/CardHeader";
import StarIcon from "@mui/icons-material/StarBorder";

function Pricing() {
  const tiers = [
    {
      title: "Free",
      price: "0",
      buttonText: "Sign up for free",
      buttonVariant: "outlined",
    },
    {
      title: "Pro",
      subheader: "Most popular",
      price: "15",
      buttonText: "Get started",
      buttonVariant: "contained",
    },
    {
      title: "Enterprise",
      price: "30",
      buttonText: "Contact us",
      buttonVariant: "outlined",
    },
  ];

  return (
    <Grid container spacing={3} alignItems="flex-end">
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  mb: 2,
                }}
              >
                <Typography component="h2" variant="h3" color="text.primary">
                  ${tier.price}
                </Typography>
                <Typography variant="h6" color="text.secondary"></Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant={tier.buttonVariant as "outlined" | "contained"}
              >
                {tier.buttonText}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function Hero() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 8,
        pb: 6,
      }}
      component="main"
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
          <Button variant="contained" component={Link} to="shop">
            Start shopping
          </Button>
          <Button variant="outlined" component={Link} to="sign-up">
            Create an account
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default function Home() {
  return (
    <Stack spacing={2}>
      <Hero />
      <Pricing />
    </Stack>
  );
}

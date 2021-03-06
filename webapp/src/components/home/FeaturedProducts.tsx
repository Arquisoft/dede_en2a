import StarIcon from "@mui/icons-material/StarBorder";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
import { checkImageExists } from "../../helpers/ImageHelper";

const tiers = [
  {
    code: "10",
    title: "AMONG US™ CryptoBro",
    price: "129.99",
    image: "10.png",
  },
  {
    code: "52",
    title: "AMONG US™ T-shirt",
    subheader: "The most popular among all",
    price: "12.95",
    image: "52.png",
  },
  {
    code: "29",
    title: "AMONG US™ Seat Covers",
    price: "99.99",
    image: "29.png",
  },
];

function FeaturedProductsHeader() {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

function FeaturedProduct(props: any) {
  let navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        title={props.tier.title}
        subheader={props.tier.subheader}
        titleTypographyProps={{ align: "center" }}
        subheaderTypographyProps={{
          align: "center",
        }}
        action={props.tier.title === "AMONG US™ T-shirt" ? <StarIcon /> : null}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[700],
        }}
      />
      <CardActionArea>
        <CardMedia
          data-testid={props.tier.code}
          component="img"
          height="250"
          width="100%"
          alt="Image of the product"
          src={checkImageExists(props.tier.image)}
          onClick={() => navigate("/product/" + props.tier.code)}
          sx={{ m: 0, p: 0, objectFit: "cover" }}
        />
      </CardActionArea>
    </Card>
  );
}

export default function FeaturedProducts() {
  return (
    <Stack sx={{ mt: 5 }}>
      <FeaturedProductsHeader />

      <Grid container spacing={3} alignItems="center" sx={{ p: 2 }}>
        {tiers.map((tier) => (
          <Grid item key={tier.title} xs={12} md={4}>
            <FeaturedProduct tier={tier} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

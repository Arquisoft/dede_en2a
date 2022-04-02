import Stack from "@mui/material/Stack";

import FeaturedProducts from "./home/FeaturedProducts";
import Hero from "./home/Hero";

export default function Home() {
  return (
    <Stack alignItems="center">
      <Hero />
      <FeaturedProducts />
    </Stack>
  );
}

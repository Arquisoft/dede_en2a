import Stack from "@mui/material/Stack";

import FeaturedProducts from "./FeaturedProducts";
import Hero from "./Hero";

export default function Home() {
  return (
    <Stack alignItems="center">
      <Hero />
      <FeaturedProducts />
    </Stack>
  );
}

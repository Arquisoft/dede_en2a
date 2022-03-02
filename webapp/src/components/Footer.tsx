import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Footer(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 2,
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Typography align="center">Made with </Typography>
        <FavoriteIcon color="error" />
        <Typography align="center"> in Asturias</Typography>
      </Stack>
    </Box>
  );
}

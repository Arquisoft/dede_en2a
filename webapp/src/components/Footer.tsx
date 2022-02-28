import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Footer() : JSX.Element {
    return (
        <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto'
        }}
      >
        <Container maxWidth="sm">
        <Typography align="center" >
                Made with <FavoriteIcon color="error" /> in Asturias
            </Typography>
        </Container>
      </Box>
    )
}
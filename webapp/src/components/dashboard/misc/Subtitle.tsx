import Typography from "@mui/material/Typography";

interface TitleProps {
  children?: React.ReactNode;
}

export default function Subtitle(props: TitleProps) {
  return (
    <Typography component="h2" variant="h2" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

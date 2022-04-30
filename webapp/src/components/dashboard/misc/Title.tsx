import Typography from "@mui/material/Typography";

interface TitleProps {
  children?: React.ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="subtitle1" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

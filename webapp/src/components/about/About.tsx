import React from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

export default function About() {
  const [loading, setLoading] = React.useState(true);

  const hideSkeleton = () => {
    setLoading(false);
  };

  React.useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <Stack>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Stack
        component="iframe"
        src="https://slides.com/sitoo/dedeen2a/embed"
        sx={{
          width: "100%",
          height: "75vh",
        }}
        title="DEDE EN_2a"
        onLoad={hideSkeleton}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
      />
    </Stack>
  );
}

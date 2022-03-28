import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Chart from "./Chart";
import Orders from "./orders/OrderList";

export default function DashboardContent(props: any) {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        container
        component="main"
        alignItems="center"
        justifyContent="center"
        rowSpacing={2}
        sx={{ mt: 2 }}
      >
        <Grid item xs={11}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>

        <Grid item xs={11}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Orders userEmail={props.userEmail} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

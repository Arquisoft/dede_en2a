import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Chart from "./Chart";
import Orders from "./orders/OrderList";

export default function DashboardContent(props: any) {
  return (
    <Container component="main">
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
    </Container>
  );
}

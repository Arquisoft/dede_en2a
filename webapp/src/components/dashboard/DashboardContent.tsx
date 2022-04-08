import React from "react";

import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Orders from "./orders/OrderList";
import LastMonthOrdersChart from "./charts/LastMonthOrdersChart";
import TotalOrdersChart from "./charts/TotalOrdersChart";
import UniqueBuyersChart from "./charts/UniqueBuyersChart";
import TotalReceivedOrdersChart from "./charts/TotalReceivedOrdersChart";

import {
  isRenderForModeratorAtLeast,
  isRenderForAdminOnly,
} from "../../helpers/RoleHelper";

type DashboardContentProps = {
  webId: string | undefined;
  role: string;
};

export default function DashboardContent(props: DashboardContentProps) {
  return (
    <Container component="main">
      <Grid
        container
        component="main"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        {isRenderForModeratorAtLeast(props.role) && (
          <Grid item xs={11}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 260,
              }}
            >
              <LastMonthOrdersChart />
            </Paper>
          </Grid>
        )}

        {isRenderForAdminOnly(props.role) && (
          <React.Fragment>
            <Grid item xs={4} md={3}>
              <Paper
                sx={{
                  p: { xs: 1, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  height: { xs: 160, md: 140 },
                }}
              >
                <TotalOrdersChart />
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper
                sx={{
                  p: { xs: 1, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  height: { xs: 160, md: 140 },
                }}
              >
                <TotalReceivedOrdersChart />
              </Paper>
            </Grid>

            <Grid item xs={3} md={4}>
              <Paper
                sx={{
                  p: { xs: 1, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  height: { xs: 160, md: 140 },
                }}
              >
                <UniqueBuyersChart />
              </Paper>
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={11}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Orders webId={props.webId} role={props.role} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

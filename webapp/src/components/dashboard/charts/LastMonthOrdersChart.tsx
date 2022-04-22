import React from "react";

import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";

import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";

import { getOrdersForUser } from "../../../api/api";
import { Order } from "../../../shared/shareddtypes";

import moment from "moment";

interface TitleProps {
  children?: React.ReactNode;
}

function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

// Generate Sales Data
function createData(date: Date, amount: number) {
  return { date, amount };
}

function indexOf(data: { date: Date; amount: number }[], date: Date) {
  for (let i = 0; i < data.length; i++)
    if (data[i].date.getDay() === date.getDay()) return i;
  return -1;
}

function dateFormatter(tickItem: Date) {
  return moment(tickItem).format("MMM Do YY");
}

export default function Chart(props: any) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{ date: Date; amount: number }[]>([]);

  function getData() {
    setLoading(true);

    let data: { date: Date; amount: number }[] = [];
    let now = new Date();
    getOrdersForUser(props.webId, props.role)
      .then((orders: Order[]) => {
        orders.forEach((order: Order) => {
          let date: Date = new Date(order.date);
          let amount = order.totalPrice;

          if (date && amount) {
            if (date.getMonth() + 1 >= now.getMonth()) {
              let index = indexOf(data, date);
              if (index > -1) {
                data[index].amount += amount;
                data[index].amount =
                  Math.round(Number(data[index].amount) * 100) / 100;
              } else data.push(createData(date, amount));
            }
          }
        });
      })
      .finally(() => setLoading(false));
    return data;
  }

  React.useEffect(() => {
    setData(getData());
  }, []);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Orders performed during the last month</Title>
      <LinearProgress hidden={!loading} />
      {!loading && (
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
              tickFormatter={dateFormatter}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            >
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: "middle",
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
              >
                Sales ($)
              </Label>
            </YAxis>
            <Tooltip
              labelFormatter={dateFormatter}
              contentStyle={{ color: theme.palette.primary.main }}
            />
            <Line dataKey="amount" fill={theme.palette.primary.main} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}

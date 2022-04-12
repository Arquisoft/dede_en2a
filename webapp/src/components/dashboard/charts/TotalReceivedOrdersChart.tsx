import React from "react";

import { getOrders } from "../../../api/api";
import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart() {
  const [data, setData] = React.useState<number>(0);

  React.useEffect(() => {
    getOrders().then((orders) =>
      orders.forEach((order) => {
        if (order.receivedDate < new Date()) setData(data + 1);
      })
    );
  }, []);

  return (
    <React.Fragment>
      <Title>Received orders</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

import React from "react";

import { getOrders } from "../../../api/api";
import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart() {
  const [data] = React.useState<string[]>([]);

  React.useEffect(() => {
    getOrders().then((orders) =>
      orders.forEach((order) => {
        if (!data.includes(order.userEmail)) data.push(order.userEmail);
      })
    );
  }, []);

  return (
    <React.Fragment>
      <Title>Unique buyers</Title>
      <Subtitle>{data.length}</Subtitle>
    </React.Fragment>
  );
}

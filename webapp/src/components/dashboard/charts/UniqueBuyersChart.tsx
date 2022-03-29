import React from "react";

import { getOrders } from "../../../api/api";
import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart() {
  const [data, setData] = React.useState(0);
  const [orderEmails] = React.useState<string[]>([]);

  React.useEffect(() => {
    getOrders()
      .then((orders) =>
        orders.forEach((order) => {
          if (!orderEmails.includes(order.userEmail)) {
            orderEmails.push(order.userEmail);
          }
        })
      )
      .finally(() => setData(orderEmails.length));
  }, []);

  return (
    <React.Fragment>
      <Title>Unique buyers</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

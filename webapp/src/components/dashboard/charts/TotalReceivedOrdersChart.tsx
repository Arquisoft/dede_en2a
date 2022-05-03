import React from "react";

import { getOrdersForUser } from "../../../api/api";
import Subtitle from "../misc/Subtitle";
import Title from "../misc/Title";

export default function Chart(props: any) {
  const [data, setData] = React.useState<number>(0);

  React.useEffect(() => {
    let receivedOrders = 0;
    getOrdersForUser(props.webId, props.role)
      .then((orders) =>
        orders.forEach((order) => {
          if (new Date().getTime() > new Date(order.receivedDate).getTime())
            receivedOrders++;
        })
      )
      .finally(() => setData(receivedOrders));
  }, []);

  return (
    <React.Fragment>
      <Title>Received orders</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

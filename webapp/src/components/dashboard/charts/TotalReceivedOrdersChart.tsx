import React from "react";

import { getOrdersForUser } from "../../../api/api";
import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart(props: any) {
  const [data, setData] = React.useState<number>(0);

  React.useEffect(() => {
    getOrdersForUser(props.webId, props.role).then((orders) =>
      orders.forEach((order) => {
        if (order.isOrderReceived) setData(data + 1);
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

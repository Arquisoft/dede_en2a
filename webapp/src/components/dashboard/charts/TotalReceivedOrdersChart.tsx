import React from "react";

import { getOrdersForUser } from "../../../api/api";
import Subtitle from "../misc/Subtitle";
import Title from "../misc/Title";

export default function Chart(props: any) {
  const [data, setData] = React.useState<number>(0);

  React.useEffect(() => {
    getOrdersForUser(props.webId, props.role).then((orders) =>
      orders.forEach((order) => {
        if (new Date(order.receivedDate).getTime() <= new Date().getTime())
          setData(data + 1);
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

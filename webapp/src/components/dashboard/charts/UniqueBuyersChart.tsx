import React from "react";

import { getOrdersForUser } from "../../../api/api";
import Subtitle from "../misc/Subtitle";
import Title from "../misc/Title";

export default function Chart(props: any) {
  const [data, setData] = React.useState(0);

  React.useEffect(() => {
    let clientIds: string[] = [];
    getOrdersForUser(props.webId, props.role)
      .then((orders) =>
        orders.forEach((order) => {
          if (!clientIds.includes(order.webId)) clientIds.push(order.webId);
        })
      )
      .finally(() => {
        setData(clientIds.length);
      });
  }, []);

  return (
    <React.Fragment>
      <Title>Unique buyers</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

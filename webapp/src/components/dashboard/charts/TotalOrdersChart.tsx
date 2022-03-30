import React from "react";

import { getOrders } from "../../../api/api";
import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart() {
  const [data, setData] = React.useState<number>(0);

  React.useEffect(() => {
    getOrders().then((orders) => setData(orders.length));
  }, []);

  return (
    <React.Fragment>
      <Title>Orders</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

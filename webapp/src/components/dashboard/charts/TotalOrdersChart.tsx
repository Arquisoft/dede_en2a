import React from "react";

import { getOrdersForUser } from "../../../api/api";
import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart(props: any) {
  const [data, setData] = React.useState<number>(0);

  React.useEffect(() => {
    getOrdersForUser(props.webId, props.role).then((orders) =>
      setData(orders.length)
    );
  }, []);

  return (
    <React.Fragment>
      <Title>Orders</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

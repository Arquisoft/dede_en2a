import React from "react";

import Subtitle from "../utils/Subtitle";
import Title from "../utils/Title";

export default function Chart(props: any) {
  const [data, setData] = React.useState(0);
  const [orderWebIDs] = React.useState<string[]>([]);

  React.useEffect(() => {
    // TODO: Refactor this
  }, []);

  return (
    <React.Fragment>
      <Title>Unique buyers</Title>
      <Subtitle>{data}</Subtitle>
    </React.Fragment>
  );
}

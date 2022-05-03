import { act, render, screen } from "@testing-library/react";
import * as api from "../../../api/api";
import LastMothOrdersChart from "../../../components/dashboard/charts/LastMonthOrdersChart";
import { testOrders } from "../../../helpers/TestHelper";

test("LastMonthOrdersChart renders", async () => {
  jest
    .spyOn(api, "getOrdersForUser")
    .mockImplementation(() => Promise.resolve(testOrders));

  await act(async () => {
    render(<LastMothOrdersChart webId={"https://webid.com"} role={"admin"} />);
  });

  //Check the title is rendered
  expect(
    screen.getByText("Orders performed during the last month")
  ).toBeInTheDocument();
});

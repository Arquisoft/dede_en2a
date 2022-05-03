import { act, render, screen } from "@testing-library/react";
import * as api from "../../../api/api";
import UniqueBuyersChart from "../../../components/dashboard/charts/UniqueBuyersChart";
import { testOrders } from "../../../helpers/TestHelper";

test("UniqueBuyersChart renders", async () => {
  jest
    .spyOn(api, "getOrdersForUser")
    .mockImplementation(() => Promise.resolve(testOrders));

  await act(async () => {
    render(<UniqueBuyersChart webId={"https://webid.com"} role={"admin"} />);
  });

  //Check the title is rendered
  expect(screen.getByText("Unique buyers")).toBeInTheDocument();

  //Check that there is only one unique buyer
  expect(screen.getByText("1")).toBeInTheDocument();
});

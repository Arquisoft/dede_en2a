import { act, fireEvent, screen, render } from "@testing-library/react";
import DowloadButton from "../../components/checkout/DownloadButton";

test("DowloadButton renders correctly", async () => {
  await act(async () => {
    render(<DowloadButton pdf={"testCode"} />);
  });

  //Check that the dowload button works
  expect(screen.getByText("Download PDF")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Download PDF"));
  expect(window.location.pathname).toBe("/");
});

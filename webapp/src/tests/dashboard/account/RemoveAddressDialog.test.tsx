import { setRef } from "@mui/material";
import { render, fireEvent, act, screen } from "@testing-library/react";
import RemoveAddressDialog from "../../../components/dashboard/account/RemoveAddressDialog";
import * as solidHelper from "../../../helpers/SolidHelper";

test("AddAddressDialog renders correctly", async () => {
  jest.spyOn(solidHelper, "deleteAddressFromPod").mockImplementation(() => {
    return Promise.resolve({} as any);
  });

  let setRefreshComponent = jest.fn();
  render(
    <RemoveAddressDialog
      open={true}
      webId={"https://test.webId.com"}
      url={"https://test.webId.com/test.ttl"}
      handleOpen={() => {}}
      handleClose={() => {}}
      sendNotification={() => {}}
      setRefreshComponent={setRefreshComponent}
    />
  );

  expect(
    screen.getByText(
      "Are you sure you want to delete this address from your POD?"
    )
  ).toBeInTheDocument();

  //Check that the yes button is rendered
  expect(screen.getByText("Yes")).toBeInTheDocument();

  //Click on the yes button
  await act(async () => {
    fireEvent.click(screen.getByText("Yes"));
  });

  //Check that setRefreshComponent has been called
  expect(setRefreshComponent).toHaveBeenCalled();

  jest.spyOn(solidHelper, "deleteAddressFromPod").mockImplementation(() => {
    return Promise.reject({} as any);
  });

  //Click on the yes button
  await act(async () => {
    fireEvent.click(screen.getByText("Yes"));
  });

  expect(setRefreshComponent).toHaveBeenCalledTimes(1);
});

test("Undefined url error", async () => {
  let sendNotification = jest.fn();
  render(
    <RemoveAddressDialog
      open={true}
      webId={"https://test.webId.com"}
      url={undefined}
      handleOpen={() => {}}
      handleClose={() => {}}
      sendNotification={sendNotification}
      setRefreshComponent={() => {}}
    />
  );

  //Check that the yes button is rendered
  expect(screen.getByText("Yes")).toBeInTheDocument();

  //Click on the yes button
  await act(async () => {
    fireEvent.click(screen.getByText("Yes"));
  });

  //Check that setRefreshComponent has been called
  expect(sendNotification).toHaveBeenCalled();
});

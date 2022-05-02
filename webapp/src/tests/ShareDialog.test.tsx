import { fireEvent, render, screen, act } from "@testing-library/react";
import ShareDialog from "../components/shop/dialogs/ShareDialog";
import * as api from "../api/api";

test("ShareDialog renders correctly", async () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => {},
    },
  });
  jest.spyOn(navigator.clipboard, "writeText");

  let handleClose = jest.fn();
  render(
    <ShareDialog open={true} handleOpen={() => {}} handleClose={handleClose} />
  );

  expect(
    screen.getByText("Share this item or save it for later use")
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "You can share this product with anyone you want with the following link!"
    )
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText("Copy to clipboard"));

  expect(handleClose).toHaveBeenCalled();
});

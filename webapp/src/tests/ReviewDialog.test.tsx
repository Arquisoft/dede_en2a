import { fireEvent, render, screen, act } from "@testing-library/react";
import ReviewDialog from "../components/shop/dialogs/ReviewDialog";
import { Product, Review } from "../shared/shareddtypes";
import * as api from "../api/api";

const testProduct: Product = {
  code: "01",
  name: "Test product 1",
  description: "Test product 1 description",
  price: 100,
  stock: 10,
  image: "",
  category: "Test category",
  weight: 1,
};

const review: Review = {
  webId: "https://test.web.id",
  productCode: "01",
  rating: 4,
  comment: "Test comment",
};

test("ReviewDialog renders correctly", async () => {
  jest
    .spyOn(api, "getReviewsByCodeAndWebId")
    .mockImplementation(() => Promise.resolve([]));

  jest.spyOn(api, "addReview").mockImplementation(() => Promise.resolve(true));

  await act(async () => {
    render(
      <ReviewDialog
        product={testProduct}
        initialValue={0}
        stars={3}
        webId="https://test.webid.com"
        open={true}
        handleOpen={() => {}}
        handleClose={() => {}}
        handleConfirm={() => {}}
      />
    );
  });

  expect(
    screen.getByText("In this dialog you can give us a review of the product!")
  ).toBeInTheDocument();

  await act(async () => {
    fireEvent.change(document.getElementsByName("comment")[0], {
      target: { value: "New comment" },
    });
  });

  await act(async () => {
    fireEvent.change(document.getElementsByName("rating")[0], {
      target: { value: 3 },
    });
  });

  //Click the confirm button
  await act(async () => {
    fireEvent.click(screen.getByText("Send your Review"));
  });

  //Check if the notification is shown
  expect(screen.getByText("Review added correctly!")).toBeInTheDocument();

  jest.spyOn(api, "addReview").mockImplementation(() => Promise.resolve(false));

  //Click the confirm button
  await act(async () => {
    fireEvent.click(screen.getByText("Send your Review"));
  });

  //Check if the notification is shown
  expect(
    screen.getByText("There was an error creating your review!")
  ).toBeInTheDocument();
});

test("ReviewDialog renders correctly for modify reviews", async () => {
  jest
    .spyOn(api, "getReviewsByCodeAndWebId")
    .mockImplementation(() => Promise.resolve([review]));

  jest
    .spyOn(api, "modifyReview")
    .mockImplementation(() => Promise.resolve(true));

  await act(async () => {
    render(
      <ReviewDialog
        product={testProduct}
        initialValue={0}
        stars={3}
        webId="https://test.webid.com"
        open={true}
        handleOpen={() => {}}
        handleClose={() => {}}
        handleConfirm={() => {}}
      />
    );
  });

  expect(
    screen.getByText("In this dialog you can give us a review of the product!")
  ).toBeInTheDocument();

  await act(async () => {
    fireEvent.change(document.getElementsByName("comment")[0], {
      target: { value: "New comment" },
    });
  });

  //Click the confirm button
  await act(async () => {
    fireEvent.click(screen.getByText("Send your Review"));
  });

  //Check if the notification is shown
  expect(screen.getByText("Review modified correctly!")).toBeInTheDocument();

  jest
    .spyOn(api, "modifyReview")
    .mockImplementation(() => Promise.resolve(false));

  //Click the confirm button
  await act(async () => {
    fireEvent.click(screen.getByText("Send your Review"));
  });

  //Check if the notification is shown
  expect(
    screen.getByText("There was an error modifying your review!")
  ).toBeInTheDocument();
});

test("ReviewDialog renders correctly with no webId", async () => {
  jest
    .spyOn(api, "getReviewsByCodeAndWebId")
    .mockImplementation(() => Promise.resolve([review]));

  await act(async () => {
    render(
      <ReviewDialog
        product={testProduct}
        initialValue={0}
        stars={3}
        webId=""
        open={true}
        handleOpen={() => {}}
        handleClose={() => {}}
        handleConfirm={() => {}}
      />
    );
  });

  await act(async () => {
    fireEvent.change(document.getElementsByName("comment")[0], {
      target: { value: "New comment" },
    });
  });

  //Click the confirm button
  await act(async () => {
    fireEvent.click(screen.getByText("Send your Review"));
  });

  //Check if the notification is shown
  expect(screen.getByText("You must log in first!")).toBeInTheDocument();
});

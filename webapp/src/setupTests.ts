// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as ShippingMethodHelper from "./helpers/ShippingMethodHelper";
window.URL.createObjectURL = jest.fn();
jest
  .spyOn(ShippingMethodHelper, "getPickUpPlacesNearby")
  .mockImplementation(
    (address: String, radiusMeters: number, maxResults: number) => {
      return Promise.resolve([]);
    }
  );

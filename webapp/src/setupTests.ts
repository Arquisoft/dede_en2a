// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as computeDistanceHelper from "./helpers/ComputeDistanceHelper";
window.URL.createObjectURL = jest.fn();
jest
  .spyOn(computeDistanceHelper, "getCoordinatesFromAddress")
  .mockImplementation((destAddress: String) => {
    return Promise.resolve("36.23423,-5.23423");
  });

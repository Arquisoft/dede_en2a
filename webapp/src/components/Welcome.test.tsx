import React from 'react'
import { render } from "@testing-library/react";
import Welcome from "./Welcome";

test('check that everything is rendering propertly', async () => {
  const message:string = "students";
  const { getByText } = render(<Welcome message={message}/>);
  expect(getByText('Hi, '+message)).toBeInTheDocument();
});
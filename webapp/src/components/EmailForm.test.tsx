import { render, fireEvent, act } from "@testing-library/react";
import EmailForm from "./EmailForm";
import {User} from './../shared/shareddtypes';
import * as api from './../api/api'

jest.mock('../api/api');

test('check register fail', async () => {
  jest.spyOn(api,'addUser').mockImplementation((user:User):Promise<boolean> => Promise.resolve(false))
  await act(async () => {    
    const {container, getByText} = render(<EmailForm OnUserListChange={()=>{}}/>)  
    const inputName = container.querySelector('input[name="username"]')!;
    const inputEmail = container.querySelector('input[name="email"]')!;
    fireEvent.change(inputName, { target: { value: "Pablo" } });
    fireEvent.change(inputEmail, { target: { value: "gonzalezgpablo@uniovi.es" } });
    const button = getByText("Accept");
    fireEvent.click(button);
  });
})

test('check register ok', async () => {
  
  jest.spyOn(api,'addUser').mockImplementation((user:User):Promise<boolean> => Promise.resolve(true))
  await act(async () => {    
    const {container, getByText} = render(<EmailForm OnUserListChange={()=>{}}/>)  
    const inputName = container.querySelector('input[name="username"]')!;
    const inputEmail = container.querySelector('input[name="email"]')!;
    fireEvent.change(inputName, { target: { value: "Pablo" } });
    fireEvent.change(inputEmail, { target: { value: "gonzalezgpablo@uniovi.es" } });
    const button = getByText("Accept");
    fireEvent.click(button);
  });
})

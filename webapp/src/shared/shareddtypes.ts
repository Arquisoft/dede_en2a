import type { AlertColor } from '@mui/material/Alert';

export type User = {
    name:string;
    surname:string;
    email:string;
    password:string;
  }

export type Product = {
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export type NotificationType = {
  severity: AlertColor,
  message: string;
}
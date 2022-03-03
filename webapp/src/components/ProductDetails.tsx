import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import { CartItem, Product } from "../shared/shareddtypes";

import {useParams} from "react-router-dom";

type ProductProps = {

};

function ProductDetails(props: ProductProps): JSX.Element {
  const {id} = useParams(); 
  return (<h1>Producto {id}</h1>)
}

export default ProductDetails;

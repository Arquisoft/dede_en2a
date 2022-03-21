import { useState } from "react";
import {
  Box,
  TextField,
} from "@mui/material";
import { Button } from "react-bootstrap";

import { createProduct } from "../api/api";

export default function UploadImage(props: any): JSX.Element {
  const [file, setFile] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  function handleChange(e: any) {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  }

  const handleSumbit = () => {
    createProduct(file, {
      code: code,
      name: name,
      description: description,
      price: Number(price),
      stock: Number(stock),
    });
  };

  return (
    <Box component="main" width="auto" height="auto">
      <Box>
        <div>
          <h1 style={{ margin: 8 }}>Upload an Image</h1>

          <TextField
            id="outlined-full-width"
            label="Image Upload"
            style={{ margin: 8 }}
            name="upload-photo"
            type="file"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={handleChange}
          />

          <TextField
            id="outlined-full-width"
            label="Product code"
            style={{ margin: 8 }}
            type="number"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            onChange={(event) => setCode(event.target.value)}
          />

          <TextField
            id="outlined-full-width"
            label="Product name"
            style={{ margin: 8 }}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            id="outlined-full-width"
            label="Product description"
            style={{ margin: 8 }}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            onChange={(event) => setDescription(event.target.value)}
          />

          <TextField
            id="outlined-full-width"
            label="Product price"
            style={{ margin: 8 }}
            fullWidth
            required
            margin="normal"
            type="number"
            variant="outlined"
            onChange={(event) => setPrice(event.target.value)}
          />

          <TextField
            id="outlined-full-width"
            label="Product stock"
            style={{ margin: 8 }}
            fullWidth
            type="number"
            required
            margin="normal"
            variant="outlined"
            onChange={(event) => setStock(event.target.value)}
          />
        </div>
      </Box>
      <Button onClick={handleSumbit}> Submit </Button>
    </Box>
  );
}

import { useState } from "react";
import { Box, Snackbar, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Button } from "react-bootstrap";

import { createProduct } from "../api/api";
import {
  checkNumericField,
  checkTextField,
} from "../helpers/CheckFieldsHelper";
import React from "react";
import { NotificationType } from "../shared/shareddtypes";

export default function UploadImage(props: any): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

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

  const emptyFields = () => {
    setCode("");
    setName("");
    setDescription("");
    setStock("");
    setPrice("");
  };

  const checkFields = () => {
    if (file !== "")
      if (checkNumericField(Number(code)))
        if (checkTextField(name))
          if (checkTextField(description))
            if (checkNumericField(Number(price)))
              if (checkNumericField(Number(stock))) handleSumbit();
              else sendErrorNotification("Incorret stock");
            else sendErrorNotification("Incorret price");
          else sendErrorNotification("Incorret description");
        else sendErrorNotification("Incorret name");
      else sendErrorNotification("Incorret code");
    else sendErrorNotification("Incorret file");
  };

  const handleSumbit = async () => {
    const created = await createProduct(file, {
      code: code,
      name: name,
      description: description,
      price: Number(price),
      stock: Number(stock),
    });
    if (created) emptyFields();
    else sendErrorNotification("That product code already exists, change it");
  };

  const sendErrorNotification = (msg: string) => {
    setNotificationStatus(true);
    setNotification({
      severity: "error",
      message: msg,
    });
  };

  return (
    <React.Fragment>
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
              value={code}
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
              value={name}
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
              value={description}
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
              value={price}
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
              value={stock}
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
        <Button onClick={checkFields}> Submit </Button>
      </Box>

      <Snackbar
        open={notificationStatus}
        autoHideDuration={3000}
        onClose={() => {
          setNotificationStatus(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

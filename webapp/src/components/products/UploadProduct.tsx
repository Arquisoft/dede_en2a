import React, { useState } from "react";
import { Box, Snackbar, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Button } from "react-bootstrap";

import { createProduct } from "../../api/api";
import {
  checkNumericField,
  checkTextField,
} from "../../helpers/CheckFieldsHelper";
import { NotificationType } from "../../shared/shareddtypes";

type UploadProductProps = {
  createShop: () => void;
};

export default function UploadImage(props: UploadProductProps): JSX.Element {
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
    if (file === "") return sendErrorNotification("Incorret file");
    if (!checkNumericField(Number(code)))
      return sendErrorNotification("Incorret code");
    if (!checkTextField(name)) return sendErrorNotification("Incorret name");
    if (!checkTextField(description))
      return sendErrorNotification("Incorret description");
    if (!checkNumericField(Number(price)))
      return sendErrorNotification("Incorret price");
    if (!checkNumericField(Number(stock)))
      return sendErrorNotification("Incorret stock");
    handleSumbit();
  };

  const handleSumbit = async () => {
    const created = await createProduct(file, {
      code: code,
      name: name,
      description: description,
      price: Number(price),
      stock: Number(stock),
    });
    if (created) {
      emptyFields();
      props.createShop();
    } else sendErrorNotification("That product code already exists, change it");
  };

  const sendErrorNotification = (msg: string) => {
    setNotificationStatus(true);
    setNotification({
      severity: "error",
      message: msg,
    });
    return false;
  };

  return (
    <React.Fragment>
      <Box component="main" width="auto" height="auto">
        <Box>
          <div>
            <h1 style={{ margin: 8 }}>Upload a product</h1>

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
              onChange={(event) => {
                if (parseInt(event.target.value) < 0) setPrice(0 + "");
                else setPrice(parseFloat(event.target.value).toString());
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
              onChange={(event) => {
                if (parseInt(event.target.value) < 0) setStock(0 + "");
                else setStock(parseInt(event.target.value).toString());
              }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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

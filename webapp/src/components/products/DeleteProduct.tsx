import React, { useState } from "react";
import { Box, MenuItem, Snackbar, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Button } from "react-bootstrap";
import { NotificationType, Product } from "../../shared/shareddtypes";

import { deleteProduct } from "../../api/api";
import ConfirmDialog from "./ConfirmDialog";

type DeleteProductProps = {
  products: Product[];
  createShop: () => void;
};

export default function DeleteProduct(props: DeleteProductProps): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(0);

  const products = props.products

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const p = await products.find((p) => p.code === event.target.value);
    if (p !== undefined) {
      setCode(p.code);
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price + "");
      setStock(p.stock + "");
    }
  };

  const handleDeleteProduct = async () => {
    if (code !== "") {
      openDialog();
    }else{
        setNotificationStatus(true);
      setNotification({
        severity: "error",
        message: "Select a product to delete",
      });
    }
  };

  const handleDeleteConfirmed = async () => {
    await deleteProduct(code);
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "Product deleted correctly",
    });
    props.createShop();
  }

  const openDialog = () => {
    setDialogOpen(dialogOpen + 1);
  };

  return (
    <React.Fragment>
      <Box component="main" width="auto" height="auto">
        <Box>
          <div>
            <h1 style={{ margin: 8 }}>Delete a product</h1>

            <TextField
              id="outlined-select-currency"
              select
              label="Select"
              fullWidth
              style={{ margin: 8 }}
              onChange={handleChange}
            >
              {products.map((product) => (
                <MenuItem key={product.code} value={product.code}>
                  {product.name + " (" + product.description + ")"}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              disabled
              value={code}
              id="outlined-full-width"
              label="Product code"
              style={{ margin: 8 }}
              type="number"
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              disabled
              value={name}
              id="outlined-full-width"
              label="Product name"
              style={{ margin: 8 }}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              disabled
              value={description}
              id="outlined-full-width"
              label="Product description"
              style={{ margin: 8 }}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              disabled
              value={price}
              id="outlined-full-width"
              label="Product price"
              style={{ margin: 8 }}
              fullWidth
              required
              margin="normal"
              type="number"
              variant="outlined"
            />

            <TextField
              disabled
              value={stock}
              id="outlined-full-width"
              label="Product stock"
              style={{ margin: 8 }}
              fullWidth
              type="number"
              required
              margin="normal"
              variant="outlined"
            />
          </div>
        </Box>
        <Button onClick={handleDeleteProduct}> Delete </Button>
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

      <ConfirmDialog show={dialogOpen}
                     titleText="Are you sure?"
                     contentText="Are you sure you really want to delete this product?"
                     handleConfirm={handleDeleteConfirmed} />

    </React.Fragment>
  );
}

import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Paper,
  Stack,
  styled,
  TextField,
  Grid,
  Typography,
} from "@mui/material";

import { deleteProduct } from "../../../api/api";
import { checkImageExists } from "../../../helpers/ImageHelper";
import { NotificationType, Product } from "../../../shared/shareddtypes";
import NotificationAlert from "../../misc/NotificationAlert";

const Img = styled("img")({
  display: "block",
  width: "100%",
  objectFit: "cover",
  marginTop: 8,
});

type DeleteProductProps = {
  products: Product[];
  webId: string;
  role: string;
  refreshShop: () => void;
};

export default function DeleteProduct(props: DeleteProductProps): JSX.Element {
  const [code, setCode] = useState("");
  const [value, setValue] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState("");
  const [notificationStatus, setNotificationStatus] = React.useState(false);
  const [notification, setNotification] = React.useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const products = props.products;

  const getProductsForAC = () => {
    const productList: any[] = [];
    products.forEach((product) => {
      productList.push({
        label: product.code + " - " + product.name,
        product: product,
      });
    });
    return productList;
  };

  const handleChange = (event: any, selected: any | null) => {
    if (selected != null) {
      setValue(selected);
      const p = products.find(
        (product) => product.code === selected.product.code
      );
      if (p !== undefined) {
        setCode(p.code);
        setName(p.name);
        setDescription(p.description);
        setCategory(p.category);
        setPrice(p.price.toString());
        setStock(p.stock.toString());
        setImage(checkImageExists(p.image));
        setWeight(p.weight.toString());
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (code !== "") {
      const deleted = await deleteProduct(props.webId, code);
      if (deleted) {
        setNotificationStatus(true);
        setNotification({
          severity: "success",
          message: "Product deleted correctly",
        });
        props.refreshShop();
        emptyFields();
      } else {
        setNotificationStatus(true);
        setNotification({
          severity: "error",
          message: "There was a problem while deleting",
        });
      }
    } else {
      setNotificationStatus(true);
      setNotification({
        severity: "error",
        message: "Select a product to delete",
      });
    }
  };

  const emptyFields = () => {
    setCode("");
    setValue(null);
    setName("");
    setDescription("");
    setCategory("");
    setStock("");
    setPrice("");
    setWeight("");
    setImage(checkImageExists("")); // We find the empty image: not-found
  };

  if (props.webId === "" || props.role === "user") return <Navigate to="/" />;
  else
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
          <Paper
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            elevation={1}
          >
            <Typography variant="h4" component="h1">
              Delete a product
            </Typography>

            <Autocomplete
              disablePortal
              id="outlined-select-currency"
              data-testid="select-product"
              fullWidth
              sx={{ p: 1 }}
              renderInput={(params) => (
                <TextField {...params} name="selection" label="Select" />
              )}
              options={getProductsForAC().sort((a, b) => {
                return a.product.category.localeCompare(b.product.category);
              })}
              value={value}
              onChange={handleChange}
              groupBy={(product) => product.product.category}
              isOptionEqualToValue={(a, b) => a.product.code === b.product.code}
            />

            <Typography variant="h6" component="h1">
              Information of the product to be deleted
            </Typography>

            <Grid container id="textInput" spacing={1} sx={{ p: 1 }}>
              <Grid item sm={6}>
                <TextField
                  disabled
                  value={code}
                  name="code"
                  id="outlined-full-width"
                  label="Product code"
                  type="number"
                  fullWidth
                  required
                  margin="dense"
                  variant="filled"
                />

                <TextField
                  disabled
                  value={name}
                  name="name"
                  id="outlined-full-width"
                  label="Product name"
                  fullWidth
                  required
                  margin="dense"
                  variant="filled"
                />

                <TextField
                  disabled
                  value={description}
                  name="description"
                  id="outlined-full-width"
                  label="Product description"
                  fullWidth
                  required
                  margin="dense"
                  variant="filled"
                />

                <TextField
                  disabled
                  value={category}
                  name="category"
                  id="outlined-full-width"
                  label="Product category"
                  fullWidth
                  required
                  margin="dense"
                  variant="filled"
                />

                <TextField
                  disabled
                  value={price}
                  name="price"
                  id="outlined-full-width"
                  label="Product price"
                  fullWidth
                  required
                  margin="dense"
                  type="number"
                  variant="filled"
                />
              </Grid>

              <Grid item sm={6}>
                <TextField
                  disabled
                  value={stock}
                  name="stock"
                  id="outlined-full-width"
                  label="Product stock"
                  fullWidth
                  type="number"
                  required
                  margin="dense"
                  variant="filled"
                />

                <TextField
                  disabled
                  value={weight}
                  id="outlined-full-width"
                  label="Product weight (kg)"
                  fullWidth
                  type="number"
                  required
                  margin="dense"
                  variant="filled"
                />

                <Img
                  height={191}
                  src={checkImageExists(
                    image === ""
                      ? "not-found.png"
                      : image.substring(new URL(image).origin.length)
                  )}
                />
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
              <Link to="/dashboard/products" style={{ textDecoration: "none" }}>
                <Button> Back </Button>
              </Link>

              <Button variant="contained" onClick={handleDeleteProduct}>
                Delete
              </Button>
            </Stack>
          </Paper>
        </Container>

        <NotificationAlert
          notification={notification}
          notificationStatus={notificationStatus}
          setNotificationStatus={setNotificationStatus}
        />
      </React.Fragment>
    );
}

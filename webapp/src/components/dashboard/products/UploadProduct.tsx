import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  styled,
  TextField
} from "@mui/material";

import { createProduct, getProducts, updateProduct } from "../../../api/api";
import {
  checkNumericField,
  checkTextField
} from "../../../helpers/CheckFieldsHelper";
import { checkImageExists } from "../../../helpers/ImageHelper";
import { NotificationType, Product } from "../../../shared/shareddtypes";

const DEF_IMAGE: string =
  process.env.REACT_APP_API_URI || "http://localhost:5000" + "/not-found.png";

type UploadProductProps = {
  isForUpdate: boolean;
  products: Product[];
  refreshShop: () => void;
  webId: string;
  role: string;
};

const Img = styled("img")({
  display: "block",
  width: "18vw",
  height: "18vw",
  objectFit: "cover",
});

export default function UploadProduct(props: UploadProductProps): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [file, setFile] = useState("");
  const [code, setCode] = useState("");
  const [minCode, setMinCode] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState<string>(DEF_IMAGE);

  const getCode = async () => {
    let products = await getProducts();
    let sortedProducts: Product[] = [];
    let topProduct: Product | undefined;
    if (products !== undefined) {
      sortedProducts = products.sort((a: Product, b: Product) => {
        return Number(b.code) - Number(a.code);
      });

      topProduct = sortedProducts.at(0);

      if (topProduct !== undefined) {
        setCode((Number(topProduct.code) + 1).toString());
        setMinCode(Number(topProduct.code) + 1);
      }
    }
  };

  useEffect(() => {
    getCode();
  }, []);

  const emptyFields = () => {
    if (!props.isForUpdate) {
      setImage(DEF_IMAGE);
      setFile("");
      getCode();
      setName("");
      setDescription("");
      setStock("");
      setPrice("");
      setCategory("");
      setWeight("");
    }
  };

  const checkFields = () => {
    if (!checkNumericField(Number(code)))
      return sendErrorNotification("Incorrect code");
    if (!checkTextField(name)) return sendErrorNotification("Incorrect name");
    if (!checkTextField(description))
      return sendErrorNotification("Incorrect description");
    if (!checkNumericField(Number(price)))
      return sendErrorNotification("Incorrect price");
    if (!checkNumericField(Number(stock)))
      return sendErrorNotification("Incorrect stock");
    if (!checkNumericField(Number(weight)))
      return sendErrorNotification("Incorrect weight");
    if (file === "" && !props.isForUpdate) 
      return sendErrorNotification("Incorrect file");
    handleSubmit();
  };

  const handleSubmit = async () => {
    let created;
    if (props.isForUpdate) {
      created = await updateProduct(props.webId, {
        code: code,
        name: name,
        description: description,
        price: Number(price),
        stock: Number(stock),
        category: category,
        image: code + ".png",
        weight: Number(weight),
      });
    } else {
      created = await createProduct(
        file,
        {
          code: code,
          name: name,
          description: description,
          price: Number(price),
          stock: Number(stock),
          category: category,
          weight: Number(weight),
        },
        props.webId
      );
    }
    if (created) {
      setNotificationStatus(true);
      setNotification({
        severity: "success",
        message:
          "Product " +
          (props.isForUpdate ? "updated " : "added ") +
          "correctly",
      });
      emptyFields();
      props.refreshShop();
    } else
      sendErrorNotification(
        "That product code already exists! You should change it"
      );
  };

  const sendErrorNotification = (msg: string) => {
    setNotificationStatus(true);
    setNotification({
      severity: "error",
      message: msg,
    });
    return false;
  };

  function handleChange(e: any) {
    let file = e.target.files[0];
    setFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result == null ? DEF_IMAGE : reader.result.toString());
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  function handleSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const p = props.products.find(
      (product) => product.code === event.target.value
    );
    if (p !== undefined) {
      setCode(p.code);
      setName(p.name);
      setDescription(p.description);
      setCategory(p.category);
      setPrice(p.price.toString());
      setStock(p.stock.toString());
      setImage(p.image);
    }
  }

  if (props.webId === "" || props.role === "user") return <Navigate to="/" />;
  else
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <h1 style={{ margin: 8 }}>
              {props.isForUpdate === false ? "Add product" : "Update product"}
            </h1>

            {props.isForUpdate ? (
              <TextField
                name="selection"
                data-testid="select-product"
                id="outlined-select-currency"
                select
                label="Select"
                fullWidth
                style={{ margin: 8 }}
                onChange={handleSelection}
              >
                {props.products.map((product: Product) => (
                  <MenuItem key={product.code} value={product.code}>
                    {product.code + " - " + product.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <></>
            )}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-evenly"
              alignItems="stretch"
            >
              <div id="textInput">
                {props.isForUpdate ? (
                  <></>
                ) : (
                  <TextField
                    value={code}
                    name="code"
                    id="outlined-full-width"
                    label="Product code"
                    style={{ margin: 8 }}
                    type="number"
                    fullWidth
                    required
                    disabled
                    margin="normal"
                    variant="outlined"
                  />
                )}

                <TextField
                  value={name}
                  name="name"
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
                  name="description"
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
                  value={category}
                  name="category"
                  select
                  id="outlined-full-width"
                  label="Product category"
                  style={{ margin: 8 }}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <MenuItem key="Clothes" value="Clothes">
                    Clothes
                  </MenuItem>
                  <MenuItem key="Decoration" value="Decoration">
                    Decoration
                  </MenuItem>
                  <MenuItem key="Electronics" value="Electronics">
                    Electronics
                  </MenuItem>
                  <MenuItem key="Miscellaneous" value="Miscellaneous">
                    Miscellaneous
                  </MenuItem>
                </TextField>

                <TextField
                  value={price}
                  name="price"
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
                  name="stock"
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

                <TextField
                  value={weight}
                  id="outlined-full-width"
                  label="Product weight (kg)"
                  style={{ margin: 8 }}
                  fullWidth
                  type="number"
                  required
                  margin="normal"
                  variant="outlined"
                  onChange={(event) => {
                    if (parseFloat(event.target.value) < 0.0) setWeight(0 + "");
                    else setWeight(parseFloat(event.target.value).toString());
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </div>

              <Box alignItems="center">
                {!props.isForUpdate ? (
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
                ) : (
                  <></>
                )}

                <Card style={{ margin: 8 }}>
                  {props.isForUpdate ? (
                    <Img src={checkImageExists(image)} />
                  ) : (
                    <Img src={image} />
                  )}
                </Card>
              </Box>
            </Stack>

            <Box textAlign="center">
              <Button onClick={checkFields}> Submit </Button>
            </Box>
          </Paper>
        </Container>

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

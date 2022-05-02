import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import {
  Alert,
  Autocomplete,
  Button,
  Container,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  styled,
  TextField,
  Typography,
  ListItemIcon,
  Grid,
} from "@mui/material";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import ChairIcon from "@mui/icons-material/Chair";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { createProduct, getProducts, updateProduct } from "../../../api/api";
import {
  checkNumericField,
  checkTextField,
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
  width: "100%",
  objectFit: "cover",
  marginTop: 8,
});

export default function UploadProduct(props: UploadProductProps): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [file, setFile] = useState("");
  const [code, setCode] = useState("");
  const [value, setValue] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState<string>(DEF_IMAGE);

  const getProductsForAC = () => {
    const productList: any[] = [];
    props.products.forEach((product) => {
      productList.push({
        label: product.code + " - " + product.name,
        product: product,
      });
    });
    return productList;
  };

  const getCode = async () => {
    let products = await getProducts();
    let sortedProducts: Product[] = [];
    let topProduct: Product | undefined;
    if (products !== undefined) {
      sortedProducts = products.sort((a: Product, b: Product) => {
        return Number(b.code) - Number(a.code);
      });

      topProduct = sortedProducts.at(0);

      if (topProduct !== undefined)
        setCode((Number(topProduct.code) + 1).toString());
    }
  };

  useEffect(() => {
    getCode();
  }, []);

  const emptyFields = () => {
    setImage(DEF_IMAGE);
    setFile("");
    setValue(null);
    getCode();
    setName("");
    setDescription("");
    setStock("");
    setPrice("");
    setCategory("");
    setWeight("");
  };

  const checkFields = () => {
    if (value === null && props.isForUpdate)
      return sendErrorNotification(
        "You have to choose a product for you to edit it :("
      );
    if (!checkTextField(name))
      return sendErrorNotification(
        name === ""
          ? "No name for the product has been provided. Check it!"
          : "Incorrect name. Please provide a valid one"
      );
    if (!checkTextField(description))
      return sendErrorNotification(
        description === ""
          ? "No description has been provided. Check it!"
          : "Incorrect description. Please provide a valid one"
      );
    if (category === "")
      return sendErrorNotification(
        "No category has been provided. This field is mandatory"
      );
    if (!checkNumericField(Number(price)))
      return sendErrorNotification(
        Number(price) <= 0
          ? "Price cannot be a number below 0. Please modify it"
          : "Incorrect price. Please provide a valid one"
      );
    if (!checkNumericField(Number(stock)))
      return sendErrorNotification(
        Number(stock) <= 0
          ? "Stock cannot be a number below 0. Please modify it"
          : "Incorrect stock. Please provide a valid one"
      );
    if (!checkNumericField(Number(weight)))
      return sendErrorNotification(
        Number(weight) <= 0
          ? "Weight cannot be a number below 0. Please modify it"
          : "Incorrect weight. Please provide a valid one"
      );
    if (file === "" && !props.isForUpdate)
      return sendErrorNotification(
        file === ""
          ? "No file has been provided. This field is mandatory"
          : "Incorrect file. Please provide a valid one"
      );
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

  const handleSelection = (event: any, selected: any | null) => {
    if (selected != null) {
      setValue(selected);
      const p = props.products.find(
        (product) => product.code === selected.product.code
      );
      if (p !== undefined) {
        setCode(p.code);
        setName(p.name);
        setDescription(p.description);
        setCategory(p.category);
        setPrice(p.price.toString());
        setStock(p.stock.toString());
        setWeight(p.weight.toString());
        setImage(p.image);
      }
    }
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
            <Typography variant="h4" component="h1" sx={{ my: 2 }}>
              {props.isForUpdate === false ? "Add product" : "Update product"}
            </Typography>

            <Grid container id="textInput" spacing={1} sx={{ p: 1 }}>
              <Grid item sm={6}>
                {props.isForUpdate ? (
                  <Autocomplete
                    disablePortal
                    id="outlined-select-currency"
                    data-testid="select-product"
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="selection"
                        label="Select a product to update"
                      />
                    )}
                    options={getProductsForAC().sort((a, b) => {
                      return a.product.category.localeCompare(
                        b.product.category
                      );
                    })}
                    value={value}
                    onChange={handleSelection}
                    groupBy={(product) => product.product.category}
                    isOptionEqualToValue={(a, b) =>
                      a.product.code === b.product.code
                    }
                  />
                ) : (
                  <TextField
                    value={code}
                    name="code"
                    id="outlined-full-width"
                    label="Code"
                    type="number"
                    fullWidth
                    required
                    variant="filled"
                    disabled
                  />
                )}

                <TextField
                  value={name}
                  name="name"
                  id="outlined-full-width"
                  label="Name of the product"
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  onChange={(event) => setName(event.target.value)}
                />

                <TextField
                  value={description}
                  name="description"
                  id="outlined-full-width"
                  label="Write a description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="dense"
                  onChange={(event) => setDescription(event.target.value)}
                />

                <TextField
                  value={category}
                  name="category"
                  select
                  id="outlined-full-width"
                  label="Category"
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <MenuItem key="Clothes" value="Clothes">
                    <Stack direction="row" alignItems="center">
                      <ListItemIcon>
                        <CheckroomIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      Clothes
                    </Stack>
                  </MenuItem>
                  <MenuItem key="Decoration" value="Decoration">
                    <Stack direction="row" alignItems="center">
                      <ListItemIcon>
                        <ChairIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      Decoration
                    </Stack>
                  </MenuItem>
                  <MenuItem key="Electronics" value="Electronics">
                    <Stack direction="row" alignItems="center">
                      <ListItemIcon>
                        <PhoneAndroidIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      Electronics
                    </Stack>
                  </MenuItem>
                  <MenuItem key="Miscellaneous" value="Miscellaneous">
                    <Stack direction="row" alignItems="center">
                      <ListItemIcon>
                        <AutoAwesomeIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      Miscellaneous
                    </Stack>
                  </MenuItem>
                </TextField>

                <TextField
                  value={price}
                  name="price"
                  id="outlined-full-width"
                  label="Price"
                  fullWidth
                  required
                  type="number"
                  variant="outlined"
                  margin="dense"
                  onChange={(event) => {
                    if (parseInt(event.target.value) < 0) setPrice(0 + "");
                    else setPrice(parseFloat(event.target.value).toString());
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>

              <Grid item sm={6}>
                <TextField
                  value={stock}
                  name="stock"
                  id="outlined-full-width"
                  label="Available stock"
                  fullWidth
                  type="number"
                  required
                  variant="outlined"
                  onChange={(event) => {
                    if (parseInt(event.target.value) < 0) setStock(0 + "");
                    else setStock(parseInt(event.target.value).toString());
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />

                <TextField
                  value={weight}
                  name="weight"
                  id="outlined-full-width"
                  label="Weight in kilograms"
                  fullWidth
                  type="number"
                  required
                  variant="outlined"
                  margin="dense"
                  onChange={(event) => {
                    if (parseFloat(event.target.value) < 0.0) setWeight(0 + "");
                    else setWeight(parseFloat(event.target.value).toString());
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />

                {!props.isForUpdate && (
                  <TextField
                    id="outlined-full-width"
                    label="Image of the product"
                    name="upload-photo"
                    type="file"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    margin="dense"
                    onChange={handleChange}
                  />
                )}

                {props.isForUpdate ? (
                  <Img height="260" src={checkImageExists(image)} />
                ) : (
                  <Img height="191" src={image} />
                )}
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
              <Link to="/dashboard/products" style={{ textDecoration: "none" }}>
                <Button> Back </Button>
              </Link>

              <Button variant="contained" onClick={checkFields}>
                Submit
              </Button>
            </Stack>
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

import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import * as Checker from "../helpers/CheckFieldsHelper";
import { getNameFromPod, getEmailsFromPod } from "../helpers/SolidHelper";

import * as Api from "../api/api";
import { User, NotificationType } from "../shared/shareddtypes";

type SignUpProps = {
  setCurrentUser: (user: User) => void;
};

export default function SignUp(props: SignUpProps) {
  const [webId, setWebId] = useState("");
  const [name, setName] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [redirect, setRedirect] = useState<Boolean>(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  const checkFields = async () => {
    // We check that the provided WebID is correct
    if (!Checker.checkTextField(webId))
      sendErrorNotification("A valid WebID must be provided");

    // We check that the passwords match
    if (!Checker.checkPasswords(password, repPassword))
      sendErrorNotification("Passwords must match");

    // We check that the password is correct
    if (Checker.checkPassword(password)) validateRetrievedFields();
    else
      sendErrorNotification(
        "Passwords must have: Length 6, lowercase, uppercase and digits"
      );
  };

  const validateRetrievedFields = async () => {
    // We store the retrieved name from the pod
    setName(await getNameFromPod(webId));

    // We store the retrieved emails from the pod
    setEmails(await getEmailsFromPod(webId));
    console.log(emails);
  };

  const signUp = async () => {
    const newUser: User = {
      name: await getNameFromPod(webId),
      email: "",
      password: password,
    };

    const correctSignUp = await Api.addUser(newUser);
    if (correctSignUp) {
      /*props.setCurrentUser(await Api.getUser(email));
      setRedirect(true);*/
      setNotificationStatus(true);
      setNotification({
        severity: "success",
        message: "Please check your email",
      });
    } else {
      sendErrorNotification("Use a different email or sign in.");
    }
  };

  const sendErrorNotification = (msg: string) => {
    setNotificationStatus(true);
    setNotification({
      severity: "error",
      message: msg,
    });
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="webId"
                  label="Web ID"
                  name="webId"
                  onChange={(e) => setWebId(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="repPassword"
                  label="Repeat password"
                  type="password"
                  id="repPassword"
                  onChange={(e) => setRepPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={checkFields}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/sign-in">
                  <Typography>{"Already have an account? Sign in"}</Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
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
      </Container>
    </React.Fragment>
  );
}

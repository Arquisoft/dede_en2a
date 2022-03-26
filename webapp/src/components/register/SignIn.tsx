import * as React from "react";
import { useState } from "react";

import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { Link, Navigate } from "react-router-dom";
import { User, NotificationType } from "../../shared/shareddtypes";
import * as Checker from "../../helpers/CheckFieldsHelper";

import { checkUser, getUser } from "../../api/api";

type SignInProps = {
  setCurrentUser: (user: User) => void;
};

export default function SignIn(props: SignInProps) {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirect, setRedirect] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const checkFields = () => {
    if (Checker.checkTextField(email))
      if (Checker.checkTextField(password)) signIn();
      else sendErrorNotification("Password is empty");
    else sendErrorNotification("Email is empty");
  };

  const signIn = async () => {
    const correctSingIn = await checkUser(email, password);
    if (correctSingIn) {
      props.setCurrentUser(await getUser(email));
      setRedirect(true);
    } else {
      sendErrorNotification("Invalid email or password");
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

  if (localStorage.getItem("user.email") === null) {
    return (
      <React.Fragment>
        <Container component="main" maxWidth="xs">
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
              Sign in
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={checkFields}
              >
                Sign In
              </Button>

              <Link to="/sign-up">
                <Typography>{"Don't have an account? Sign Up"}</Typography>
              </Link>
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
  } else {
    return <Navigate to="/" />;
  }
}

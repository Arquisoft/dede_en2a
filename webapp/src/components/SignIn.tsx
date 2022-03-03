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

import { Link } from "react-router-dom";
import { User, NotificationType } from "../shared/shareddtypes";

import { checkUser, getUser } from "../api/api";
import { tokenToString } from "typescript";
import { CollectionsOutlined } from "@mui/icons-material";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // we prevent the default behaviour
    const data: FormData = new FormData(event.currentTarget);
  };

  const signIn = async () => {
    const token = await checkUser(email, password);

    console.log(token);
    if (token) {
      const t: string = JSON.stringify(token);
      localStorage.setItem("token", t);
      window.location.href = "/";
      props.setCurrentUser(await getUser(email));
    } else {
      setNotificationStatus(true);
      setNotification({
        severity: "error",
        message: "Incorrect email or password",
      });
    }
  };

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
              onClick={signIn}
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
}

import { Alert, Snackbar } from "@mui/material";

export default function NotificationAlert(props: any) {
  return (
    <Snackbar
      open={props.notificationStatus}
      autoHideDuration={3000}
      onClose={() => {
        props.setNotificationStatus(false);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Alert severity={props.notification.severity} sx={{ width: "100%" }}>
        {props.notification.message}
      </Alert>
    </Snackbar>
  );
}

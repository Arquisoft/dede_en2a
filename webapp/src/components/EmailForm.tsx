import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';
import {addUser} from '../api/api';

type EmailFormProps = {
  OnUserListChange: () => void;
}

type NotificationType = {
  severity: AlertColor,
  message: string;
}

function EmailForm(props: EmailFormProps): JSX.Element {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({severity:'success',message:''});
  

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let result:boolean = await addUser({name,email});
    if (result){
      setNotificationStatus(true);
      setNotification({ 
        severity:'success',
        message:'You have been registered in the system!'
      });
      //Notify the change to the parent component
      props.OnUserListChange();
    }
    else{
      setNotificationStatus(true);
      setNotification({ 
        severity:'error',
        message:'There\'s been an error in the register proccess.'
      });
    }
  }

  return (
    <>
      <form name="register" onSubmit={handleSubmit}>
        <TextField
            required
            name="username"
            label="Name" 
            variant="outlined"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ my: 2 }}
          />
        <TextField
          required
          name="email"
          label="Email" 
          variant="outlined"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ my: 2 }}
        />
        <Button variant="contained" type="submit" sx={{ my: 2 }}>Accept</Button>
      </form>
      <Snackbar open={notificationStatus} autoHideDuration={3000} onClose={()=>{setNotificationStatus(false)}}>
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EmailForm;

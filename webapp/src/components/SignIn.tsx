import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import NavBar from './NavBar';
import Footer from './Footer';

import { Link } from 'react-router-dom';

export default function SignIn() {
    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // we prevent the default behaviour
        const data : FormData = new FormData(event.currentTarget);
    }

    return (
        <React.Fragment>
            <NavBar />

            <Container 
                component="main" 
                maxWidth="xs"
            >
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        
                        <Link to="/sign-up">
                            <Typography>
                                {"Don't have an account? Sign Up"}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </React.Fragment>
    );
}
import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import {getProducts} from '../api/api';

import { useNavigate } from "react-router-dom";


function NavBar(): JSX.Element{
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [state, setState] = React.useState(false);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const toggleDrawer = 
        (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
            )
                return;
        
            setState(open);
        };
    
      const list = () => (
        <Box
            onClick={ toggleDrawer(false) } 
            onKeyDown={ toggleDrawer(false) }
        >
            <MenuList>
                <MenuItem onClick={event =>  window.location.href='/'} >
                    <ListItemIcon>
                        <HomeIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Home</Typography>
                </MenuItem>

                <MenuItem onClick={event =>  window.location.href='cart'} >
                    <ListItemIcon>
                        <ShoppingCartIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Cart</Typography>
                </MenuItem>

                <MenuItem onClick={event =>  window.location.href='sign-in'} >
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Sign-in</Typography>
                </MenuItem>
            </MenuList>
        </Box>
      );

    return (      
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer
                        anchor='left'
                        open={state}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                    >
                        { list() }
                    </SwipeableDrawer>

                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ flexGrow: 1 }}
                    >
                        Dede
                    </Typography>

                    <IconButton
                        size="large"
                        aria-label=""
                        color="inherit"
                        href="/cart"
                    >
                        <Badge 
                            badgeContent={ getProducts.length } 
                            color="error"
                        >
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        href="/sign-in"
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
      );
}

export default NavBar;
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@material-ui/icons/AccountCircle';
import Button from '@mui/material/Button';
import { Link as RouterLink } from "react-router-dom";
import LogoutIcon from '@material-ui/icons/ExitToApp';


export default function Header({user, token ,setToken, setUser}) {

    const logout = (e) => {
        e.preventDefault();
        console.log(user, token);
        setUser({});
        setToken("");
        localStorage.clear();
        window.location="/";
        
    }

    return ( 
        <Box sx = {{ flexGrow: 1 } }>
        <AppBar position = "static">
        <Toolbar> { /*https://stackoverflow.com/questions/63216730/can-you-use-material-ui-link-with-react-router-dom-link*/ } 
        <Button variant = "contained" color = "primary" component = { RouterLink } to = "/"> Home</Button> 
        {localStorage.getItem('token') ? <Button variant = "contained" color = "primary" component = { RouterLink } to = "/addpost" >Add Post</Button>:""}
        {localStorage.getItem('token') ? <Button variant = "contained" color = "primary" component = { RouterLink } to = "/profile/">Profile</Button>:""}
        {!localStorage.getItem('token') ? <Button variant = "contained" color = "primary" component = { RouterLink } to = "/register" >Register</Button> :""}
        {!localStorage.getItem('token') ? <Button variant = "contained" endIcon={<LoginIcon />} color = "primary" component = { RouterLink } to = "/login" >Login</Button>:""}
        {localStorage.getItem('token') ? <Button variant = "contained" startIcon={<LogoutIcon />}  color = "secondary" component = { RouterLink } to = "/" onClick={logout}>Logout</Button> :""}
        
        </Toolbar>
        </AppBar> 
        </Box>
    )
}

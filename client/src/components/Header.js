import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@material-ui/icons/AccountCircle';
import Button from '@mui/material/Button';
import { Link as RouterLink } from "react-router-dom";
import LogoutIcon from '@material-ui/icons/ExitToApp';
import {useState, useEffect} from 'react';

export default function Header({user, token ,setToken, setUser}) {
    const [currentUser, setCurrentuser] = useState({});


    const logout = (e) => {
        e.preventDefault();
        console.log(user, token);
        setUser({});
        setToken("");
        localStorage.clear();
        window.location="/";
        
    }

    useEffect(() => {
        console.log("TOKEN CHANGED");
        
        const newUser = JSON.parse(localStorage.getItem('user'));
        console.log("#################"+newUser);
        setCurrentuser(newUser);
    }, [localStorage.getItem('token')])

  
    return ( 
        <Box sx = {{ flexGrow: 1 } }>
        <AppBar position = "static">
        <Toolbar> { /*https://stackoverflow.com/questions/63216730/can-you-use-material-ui-link-with-react-router-dom-link*/ } 
        <Button variant = "contained" color = "primary" component = { RouterLink } to = "/"> Home</Button> 
        {localStorage.getItem('token') ? <Button variant = "contained" color = "primary" component = { RouterLink } to = "/addpost" >Add Post</Button>:""}
        {localStorage.getItem('token') ? <Button variant = "contained" color = "primary" component = { RouterLink } to = {"/profile/"+JSON.parse(localStorage.getItem('user')).username}>Profile</Button>:""}
        {!localStorage.getItem('token') ? <Button variant = "contained" color = "primary" component = { RouterLink } to = "/register" >Register</Button> :""}
        {!localStorage.getItem('token') ? <Button variant = "contained" endIcon={<LoginIcon />} color = "primary" component = { RouterLink } to = "/login" >Login</Button>:""}
        {localStorage.getItem('token') ? <Button variant = "contained" startIcon={<LogoutIcon />}  color = "secondary" component = { RouterLink } to = "/" onClick={logout}>Logout</Button> :""}
        
        </Toolbar>
        </AppBar> 
        </Box>
    )
}

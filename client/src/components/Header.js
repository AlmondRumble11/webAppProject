import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@material-ui/icons/AccountCircle';
import Button from '@mui/material/Button';
import { Link as RouterLink } from "react-router-dom";
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { Alert, Collapse } from '@mui/material';
import {useState, useEffect} from 'react';
export default function Header({user, token ,setToken, setUser}) {
    const [open, setOpen] = useState(true); //logging out
    //clear values and log out the user
    const logout = (e) => {
        e.preventDefault();
        console.log(user, token);
        setUser({});
        setToken("");
        sessionStorage.clear();
        window.location="/";
        setOpen(false);
        
    }
  //https://smartdevpreneur.com/add-a-react-router-link-to-a-material-ui-alert-component/
  //collapse the alert
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 3000);
    }, [open]);

  
    return ( 
        
        <Box sx = {{ flexGrow: 1 } }>
        {!sessionStorage.getItem('token') ? <Collapse in={open}><Alert color="error"> Logged out</Alert></Collapse> : ""}
        <AppBar position = "static">
        <Toolbar> { /*https://stackoverflow.com/questions/63216730/can-you-use-material-ui-link-with-react-router-dom-link*/ } 
        <Button  variant = "text" color = "inherit" component = { RouterLink } to = "/"> Home</Button> 
        {sessionStorage.getItem('token') ? <Button variant = "text" color = "inherit" component = { RouterLink } to = "/addpost" >Add Post</Button>:""}
        {sessionStorage.getItem('token') ? <Button variant = "text" color = "inherit" component = { RouterLink } to = {"/profile/"+JSON.parse(sessionStorage.getItem('user')).username}>Profile</Button>:""}
        {!sessionStorage.getItem('token') ? <Button variant = "text" color = "inherit" component = { RouterLink } to = "/register" >Register</Button> :""}
        {!sessionStorage.getItem('token') ? <Button variant = "text" endIcon={<LoginIcon />} color = "inherit" component = { RouterLink } to = "/login" >Login</Button>:""}
        {sessionStorage.getItem('token') ? <Button variant = "text" startIcon={<LogoutIcon />}  color = "inherit" component = { RouterLink } to = "/" onClick={logout}>Logout</Button> :""}
        
        </Toolbar>
        </AppBar> 
        </Box>
    )
}

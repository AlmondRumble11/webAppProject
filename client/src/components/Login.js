import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material';



export default function Login({setToken ,user, token, setUser}) {
    let navigate = useNavigate(); //for navigation
    const [badvalue, setBadvalue] = useState(false);
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    
    const submit = (e) => {
        console.log("submit pressed");
        e.preventDefault();
        
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",

            },
            body: JSON.stringify({
                username: username,
                password: password
            }),

            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
          
                if(data.token){
                    setToken(data.token);
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem("user", Buffer.from(data.token.split(".")[1], "base64").toString());
                    //from lecture 11-fullstack
                    setUser(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()));
                    console.log(user);
                    console.log(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()));
                    //window.location="/";   
                    
            
                
                
                 //navigate to home screen
                 navigate('/', {replace:true});
            } else {
              //show the error message
              setBadvalue(true);
            }

        });
    }
    const registerPressed = (e) => {
        console.log("register pressed");
        e.preventDefault();
        window.location = "/register/";
}
    return (
        <div className="login">

            <h1>Login</h1>
            <form onSubmit={submit}>

                <label>
                    <p>Username</p>
                    <TextField label="Username" error={badvalue === true} helperText={badvalue === true  ? 'Incorrect email or password' : ' '} type="name" name="username" id="username" placeholder="Username" onChange={e => {setUsername(e.target.value); setBadvalue(false)}}/>
                </label>
                <label>
                    <p>Password</p>
                    <TextField label="Password" error={badvalue === true} helperText={badvalue === true  ? 'Incorrect email or password' : ' '}type="password" name="password"  id="password" placeholder="Password" onChange={e => {setPassword(e.target.value); setBadvalue(false)}}/>
                </label>
                <div>
                    <br></br>
                    <Button variant="contained" color="primary" type="submit"id="submit">Login</Button>
                </div>
            </form>
        <p>Don't have an account yet? Press here to register</p>
        <Button variant="contained" color="primary" type="submit" onClick={registerPressed}>Register</Button>
        
        </div>
    )
}

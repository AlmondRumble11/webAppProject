import { Button, TextField } from '@mui/material';
import React from 'react'
import { useState } from 'react';



export default function Register() {

    
    const [username, setUsername] = useState();
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [bio, setBio] = useState();
    const [badvalue, setBadvalue] = useState(false);


    const submit = (e) => {
        console.log("submit pressed");
        e.preventDefault();
      
   
        //register the user
        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            
            },
            body: JSON.stringify({
                email: email,
                name:name,
                username: username,
                password: password,
                bio: bio
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.success){
                console.log("fs");
                window.location = "/";
            }else{
                //show the error message
                setBadvalue(true);
            }
                
        }); 
                
           
    }

    return (
        <div className="login">
        <h1>Register</h1>
        <form onSubmit={submit}>
        
            <label>
                <h4>Email</h4>
                <TextField type="email" name="email"  label="Email" id="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
            </label>
            <label>
                <h4>Username</h4>
                <TextField type="username" label="Username" name="username" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            </label>
            <label>
                <h4>Name</h4>
                <TextField type="name" name="name" label="Name" id="name" placeholder="Name" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                <h4>Bio</h4>
                <TextField multiline type="textarea" label="Bio" name="bio" id="bio" className="textarea"  cols="50" rows="10"placeholder="Tell something about yourself" onChange={e => setBio(e.target.value)}/>
            </label>
            <label>
                <h4>Password</h4>
                <TextField type="password" label="Password" name="password" error={badvalue === true} helperText={badvalue === true  ? 'Not strong enough' : ' '} id="password" placeholder="Password" onChange={e => {setPassword(e.target.value); setBadvalue(false);}}/>
            </label>
            
            <div>
            <br></br>
                <Button  variant="contained" type="submit" value="primary" id="submit">Submit</Button>
            </div>
        </form>
    </div>
    )
}

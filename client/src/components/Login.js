import React from 'react';
import { useState } from 'react';





export default function Login({setToken , token, setUser}) {

    const [errorMessage, setErrorMessage] = useState('');
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
                    localStorage.setItem('token', data.token);
                 
                    //from lecture 11-fullstack
                    setUser(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()));
                    console.log(JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString()));
                    //window.location="/";   
                
            
                

                //window.location = "/";
            } else {
                //show the error message
                setErrorMessage(data.msg);
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
            <p className="error"> {errorMessage} </p>
            <h1>Login</h1>
            <form onSubmit={submit}>

                <label>
                    <p>Username</p>
                    <input type="string" name="username" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="string" name="password"  id="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit" id="submit">Login</button>
                </div>
            </form>
        <p>Don't have an account yet? Press here to register</p>
        <button onClick={registerPressed}>Register</button>
        
        </div>
    )
}

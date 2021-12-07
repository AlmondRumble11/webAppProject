import React from 'react'
import { useState } from 'react';
export default function Register() {

    
    const [username, setUsername] = useState();
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [bio, setBio] = useState();
    const [errorMessage, setErrorMessage] = useState('');
 


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
                setErrorMessage(data.msg);
            }
                
        }); 
                
           
    }

    return (
        <div className="login">
        <h1>Register</h1>
        <form onSubmit={submit}>
            <p className="error"> {errorMessage} </p>
            <label>
                <p>Email</p>
                <input type="text" name="email"  id="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
            </label>
            <label>
                <p>Username</p>
                <input type="text" name="username" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            </label>
            <label>
                <p>Name</p>
                <input type="text" name="name" id="name" placeholder="Name" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                <p>Bio</p>
                <textarea type="textarea" name="bio" id="bio" className="textarea"  cols="50" rows="10"placeholder="Tell something about yourself" onChange={e => setBio(e.target.value)}/>
            </label>
            <label>
                <p>Password</p>
                <input type="text" name="password"  id="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
            </label>
            <div>
                <button type="submit" id="submit">Submit</button>
            </div>
        </form>
    </div>
    )
}

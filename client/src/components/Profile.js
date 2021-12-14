import { TextField, Divider } from '@mui/material';
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';


export default function Profile() {

    //username from url and profile user
    const [profileUser, setProfileUser] = useState([]);
    const {username} = useParams();
    

    //getting the user
    useEffect(() => {
        //fetch user profile
        fetch('/api/profile/'+username)
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                //set the user of the profile page
                setProfileUser(data);
            
            });
    }, [username]);

    
    return (
        <div>
            <h1>Profile</h1>
            <Divider>Username</Divider>
            <div>
                <p>{profileUser.username}</p>
            </div>
            <Divider>Email</Divider>
            <div>
                <p>{profileUser.email}</p>
            </div>
         
            <Divider>Name</Divider>
            <div>
                <p>{profileUser.name}</p>
            </div>
            <Divider>Bio</Divider>
            <div>
                <TextField value={profileUser.bio} disabled></TextField>
            </div>
            <br></br>
            <Divider>Register date</Divider>
            <div >
                <p>{profileUser.registerdate}</p>
            </div>
            <Divider></Divider>
          
        </div>
    )
}

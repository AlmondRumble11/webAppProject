import { Button, Input, TextField } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'



export default function AddPost({user, token}) {
    let navigate = useNavigate(); //for navigation

    //use states for the content and title of the post
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [novalue, setNovalue] = useState(false); //https://stackoverflow.com/questions/49421792/how-to-use-material-uinext-textfield-error-props

    //getting the user 
    const userObject = JSON.parse(sessionStorage.getItem('user'));
  
    //submitting the new post
    const submit = (e) => {
        e.preventDefault();
        //console.log(content, title, userObject.username);

        //check for title 
        if(!title){
            setNovalue(true);
            console.log("no title");
        //check for content 
        }else if(!content){
            setNovalue(true);
            console.log("no content");
        //all good--> submit the post to db
        }else{

            //add to posts
           let newsubmit = async function(){  fetch("/api/addpost", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "authorization": "Bearer " + sessionStorage.getItem('token'),

                },
                body: JSON.stringify({
                    userID: userObject.id,
                    username: userObject.username,
                    title: title,
                    content: content
                }),

                mode: "cors"
            }).then(response => response.json())
            .then(data => {
                //add to user
               fetch("/api/update/user", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "authorization": "Bearer " + sessionStorage.getItem('token'),
    
                    },
                    body: JSON.stringify({
                        userID: userObject.id,
                        username: userObject.username,
                        title: title,
                        content: content
                    }),
    
                    mode: "cors"
                }).then(response => response.json()).then( data=> {
                    //navigate to home screen
                    navigate('/', {replace:true});
                });
                
                
            });
            }
        newsubmit();
        }
    }

    return (
       
        <div>
           
            <h1>Create a new post</h1>
        
            <div>
            <label>
                <h3>Title</h3>
                <Input  type="text" error={novalue === true} label="title" name="title" id="title" placeholder="Enter title" onChange={e => setTitle(e.target.value)}/>
            </label>
            </div>
            <div>
            <label>
                <h3>Content</h3>
                <TextField error={novalue === true} helperText={novalue === true  ? 'Add content and title' : ' '} multiline label="Content" className="textarea" id="textarea"  rows={10} placeholder="Write your post here" onChange={e => {setContent(e.target.value);
                setNovalue(false);}}></TextField>
            </label>
            </div>
            <br></br>
            <Button onClick={submit} color="primary" type="submit" id="submit">Submit</Button>
        </div>
    )
}

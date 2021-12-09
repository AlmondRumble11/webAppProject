import React from 'react'
import { useState } from 'react';
import FlashMessage from 'react-flash-message'
import { useNavigate } from 'react-router-dom'



export default function AddPost({user, token}) {
    let navigate = useNavigate();

    const [message, setMessage] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

     //getting the user 
     const userObject = JSON.parse(localStorage.getItem('user'));
    // console.log(userObject);

    const submit = (e) => {
        e.preventDefault();
        console.log(content, title, userObject.username);
        if(!title){
            setMessage('Add title to your post');
            console.log("no title");
            
        }else if(!content){
            setMessage('Add content to your post');
            console.log("no content");
        }else{

           let newsubmit = async function(){  fetch("/api/addpost", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem('token'),

                },
                body: JSON.stringify({
                    userID: userObject.id,
                    username: userObject.username,
                    title: title,
                    content, content
                }),

                mode: "cors"
            }).then(response => response.json())
            .then(data => {
                setMessage(data.msg);
               fetch("/api/update/user", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "authorization": "Bearer " + localStorage.getItem('token'),
    
                    },
                    body: JSON.stringify({
                        userID: userObject.id,
                        username: userObject.username,
                        title: title,
                        content, content
                    }),
    
                    mode: "cors"
                }).then(response => response.json()).then( data=> {
                    setMessage(data.msg);
                    navigate('/', {replace:true});
                });
                
                
            });
            }
        newsubmit();
        }
    }
    /* https://stackoverflow.com/questions/60637063/displaying-flash-message-in-react for flashmessages*/ 
    return (
       
        <div>
           
           
            <h1>Create a new post</h1>
        
            <div>
            <label>
                <p>Title</p>
                <input type="text" name="title" id="title" placeholder="Enter title" onChange={e => setTitle(e.target.value)}/>
            </label>
            </div>
            <div>
            <label>
                <p>Content</p>
                <textarea className="textarea" id="textarea" cols="50" rows="10" placeholder="Write your post here" onChange={e => setContent(e.target.value)}></textarea>
            </label>
            </div>
            <button onClick={submit} id="submit">Submit</button>
        </div>
    )
}

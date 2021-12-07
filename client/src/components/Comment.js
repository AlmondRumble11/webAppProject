import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

export default function SinglePost({username, content, date}) {
   


    console.log("####################################################################");

    useEffect(()=> {


    }, []);


    const addLike = (e) => {
     
        e.preventDefault();
 
      
    }
    const addDislike = (e) => {
        e.preventDefault();


        
    }
        
    
    return (
        <div>
           <li style={{ listStyleType: "none" }}>
           
           <Link to={`/profile/${username}`} data={username} token={null}>Posted by:{username}</Link>
           
  
           <p> Last modified: {date}</p>
          
           <textarea value={content} disabled></textarea>
           <br></br>
           <div>
            <p>Vote count: 10100</p>
            {sessionStorage.getItem('token') ? <Button onClick={addLike} variant = "contained" color = "secondary" id="like" >Like</Button>:""}
            {sessionStorage.getItem('token') ? <Button onClick={addDislike} variant = "contained" color = "primary" id="dislike" >dislike</Button> :""}  
           </div>
           
          
        </li>
        </div>
    )
}
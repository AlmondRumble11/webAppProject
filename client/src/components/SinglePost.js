import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

export default function SinglePost({post, token, user}) {
   
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVotes] = useState(0);
    const [posts, setPosts] = useState({});
    const [sessionToken, setSessionToken] = useState({});
    //console.log(post);

 
    useEffect(()=> {
        //console.log("username is:"+user.username);
        setPosts(post);
        //console.log("!!!!!!!!!!!!!!"+posts.title);
        /*for(let i=0; i<post.votes.lenght;i++){
            
            //check if user has given a vote
            if(post.votes[0]===user.username){
                
                //check what the vote is
            
                if(post.votes[1]=== 1){
                   setUserVotes(1);
                }else{
                    setUserVotes(-1);
                }
            }
        }*/

    }, [userVote]);

    const addLike = (e) => {
        //console.log("####################username is:"+user.username);
        e.preventDefault();
        console.log("LIKE");
        fetch("/api/post/votes", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + token,
            
            },
            body: JSON.stringify({
                _id: post._id,
                username: user.username,
                vote: 1
                
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
           // console.log(data);
            setUserVotes(true);
            console.log("VOTE IS:"+userVote);
          
        }); 
      
    }
    const addDislike = (e) => {
        e.preventDefault();
        //console.log("DISLIKE");
        //console.log("####################username is:"+user.username);
        fetch("/api/post/votes", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + token,
            
            },
            body: JSON.stringify({
                _id: post._id,
                username: user.username,
                vote: -1
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            setUserVotes(false);
            console.log("VOTE IS:"+userVote);
                
        }); 

        
    }
    console.log(post._id);
    return (
        <li style={{ listStyleType: "none" }}>
           
         
           
            <Link to={{pathname:`/post/${post._id}`, query:{token : token, user: user} }} ><h3>{post.title}</h3></Link>
            <label>Posted by:  </label>
            <Link to={`/profile/${post.username}`} data={post.username} token={null}>{post.username}</Link>
           <p>Vote count: 10100</p>
           {localStorage.getItem('token') ? <Button onClick={addLike} variant = "contained" color = "secondary" id="like" >Like</Button>:""}
           {localStorage.getItem('token') ? <Button onClick={addDislike} variant = "contained" color = "primary" id="dislike" >dislike</Button> :""}
           <br></br>
           
          
        </li>
    )
}



import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
export default function SinglePost({post, token, user}) {
   
   
    const [downvotes, setDownvotes] = useState(0);
    const [upvotes, setUpvotes] = useState(0);
    const [posts, setPosts] = useState({});
    const [voteChanged, setVoteChanged] = useState(0);
  

    //for votes
    useEffect(()=>{
        fetch('/api/post/'+post._id).
        then(res => res.json()).
        then(data => {
           // console.log(data);
            setUpvotes(data.upvotes.length);
            setDownvotes( data.downvotes.length);
            
        });
    },[voteChanged]);

     //like the post was pressed
     const  addLike = (e) => { 
        e.preventDefault();
        console.log("like pressed");
        //add like to db
        let likepost  = async function() {
            fetch('/api/post/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: post._id,
                userID: JSON.parse(sessionStorage.getItem('user')).id,
                vote : 1
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            if(voteChanged === 1){
                setVoteChanged(2);
            }else{
                setVoteChanged(1);
            }
           
        }); 
        }
        likepost();
    }
     //save the post was pressed
     const addDislike = (e) => {
        e.preventDefault();
        console.log("dislike pressed");
        //add disike to db
        let dislikepost = async function() {
            fetch('/api/post/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),

            },
            body: JSON.stringify({
                _id: post._id,
                userID: JSON.parse(sessionStorage.getItem('user')).id,
                vote : -1
            }),
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            if(voteChanged == 2){
                setVoteChanged(1);
            }else{
                setVoteChanged(2);
            }
           
        });   
    }
    dislikepost(); 
    }
 
    return (
        <Link to={{pathname:`/post/${post._id}`, query:{token : token, user: user} }}style={{ textDecoration: 'none' }} >
            <li style={{ listStyleType: "none" }} id={"li-"+post._id}>
                <h3>{post.title}</h3>
                <Button onClick={addLike} variant = "text" color = "success"  startIcon={<ArrowUpwardIcon/>} disabled={!sessionStorage.getItem('token')}>{upvotes}</Button>
                <Button onClick={addDislike} variant = "text" color = "error" startIcon={<ArrowDownwardIcon/>} disabled={!sessionStorage.getItem('token')}>{downvotes}</Button> 
                <br></br>
            </li>
        </Link>
    )
}



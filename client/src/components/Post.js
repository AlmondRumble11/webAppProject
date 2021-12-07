import { Button } from '@mui/material';
import React from 'react'
import { useState, useEffect} from 'react';
import { useParams } from 'react-router';
import Comment from './Comment'
import {Link} from 'react-router-dom'

export default function Post() {
    
    //get id of the post from the url
    const {id} = useParams();
    //current post
    const [currentPost, setCurrentpost] = useState({}); 
    const [sessionToken, setSessiontoken] = useState(""); 
    const [postComments, setPostcomments] = useState([]);
    const [usercomment, setUsercomment] = useState("");
    const [commentID, setCommentID] = useState("");
   

    //get post info from db
    useEffect(()=>{

  
        setSessiontoken(localStorage.getItem("token"));

        fetch('/api/post/'+id).
        then(res => res.json()).
        then(data => {
            console.log(data);
            //setting the current post
            setCurrentpost(data);
            //setPostcomments(data.comments);
    
            /*if(data.comments !== undefined){
                console.log("these are the comments:"+currentPost.comments);
                setPostcomments(currentPost.comments);
            }else{
                console.log("no comments");
                console.log(currentPost.comments);
                setPostcomments([]);
            }*/
            

            //get list
            const commentList = document.getElementById('commentlist');

            //get all of the comments
            fetch('/api/post/comments/'+data._id
            ).then(res => res.json()).then(data=>{
                console.log(data);
                setPostcomments(data);
            //add comments to list
                // console.log("THIS MANY COMMENTS:"+currentPost.comments.length);
                /*for(let i=0;i<data.length;i++){
                        
                    //new list item
                    const newComment = document.createElement('li');
               
                    const content = document.createElement('label');
                    const poster = document.createElement('label');
                    
                    if(sessionToken){
                        const like = document.createElement('button');
                        const dislike = document.createElement('button');
                        like.innerHTML = 'Like';
                        dislike.innerHTML = 'Dislike';
                        newComment.appendChild(like);
                        newComment.appendChild(dislike);
                    }
                 

                    content.innerHTML = data[i].content;
                    poster.innerHTML = data[i].username;
                    newComment.appendChild(content);
                    newComment.appendChild(poster);
                    commentList.appendChild(newComment);
                }*/
            });

      
        });
      
    },[]);


    //when add comment btn is pressed
    const addComment = (e) => {
        e.preventDefault();
        console.log("ADDING A COMMENT");

        
        //getting the user 
        const user = JSON.parse(localStorage.getItem('user'));
       
        //add to comment db
       fetch("/api/addcomment", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization":"Bearer "+localStorage.getItem('token')
               

            },
            body: JSON.stringify({
                userID: user.id,
                username: user.username,
                postID: currentPost._id,
                content: usercomment,
            }),

            mode: "cors"
        }).then(response => response.json()).
        then(data => {

            console.log("########################################################");
             //add to comment posts
            fetch("/api/post/comment", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "authorization":"Bearer "+localStorage.getItem('token')
                

                },
                body: JSON.stringify({
                    userID: user.id,
                    username: user.username,
                    postID: currentPost._id,
                    content: usercomment,
                }),

                mode: "cors"
            })
            .then(response => response.json())
            .then(data => {
                setCommentID(data.msg);
          

                fetch("/api/user/comment", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "authorization":"Bearer "+localStorage.getItem('token')
                    
    
                    },
                    body: JSON.stringify({
                        userID: user.id,
                        postID: currentPost._id,
                        commentID : commentID
                    }),
    
                    mode: "cors"
                }).then(res => res.json()).then(data=>{
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

                });
            });
            
        });

        //clear the comment area
        const area = document.getElementById("commentarea");
        area.value="";
        /*console.log(postComments);
        setPostcomments(currentPost.comments);
        console.log(currentPost.comments);
        console.log(postComments);*/
    }
    var listItems = [];
    console.log(postComments);
    if(postComments){
        listItems =  postComments.map((item) => 
        //https://www.robinwieruch.de/react-update-item-in-list
        //if item.clicked = true then change textDecoration to line-through. using className to change decoration did not work in the tests but worked on the webpage
        <Comment key={item._id} username={item.username} content={item.content}  date={item.date}/>
      
        //<li>{item.username}</li>
    
    );

    }
    return (
        <div>
           
            <div>
                <h1>{currentPost.title}</h1>
                <label>Posted by:</label>
                <Link to={`/profile/${currentPost.username}`} data={currentPost.username} token={null}>{currentPost.username}</Link>
                <br></br>
                <label>Last edited: {currentPost.date}</label>
            </div>
            <div>
                <textarea  cols="50" rows="10" id="textarea" value={currentPost.content} disabled></textarea> 
            </div>
            <div>
                {sessionToken ? <p>Want to comment the post? Add your comment below.</p>:""}
                {sessionToken ? <textarea type="text" cols="50" rows="5" id="commentarea" placeholder="Add a comment" onChange={e => setUsercomment(e.target.value)}></textarea> :""}
                <br></br>
                {sessionToken ? <Button onClick={addComment} variant = "contained" color = "primary" id="addcomment">Add Comment</Button>:""}
            </div>
            <h1>Comments</h1>
          
            <ul id="commentlist">
                {listItems}
            </ul>
        </div>
    )
}

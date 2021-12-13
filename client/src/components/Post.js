import { Button, List, TextField, Input } from '@mui/material';
import React from 'react'
import { useState, useEffect} from 'react';
import { useParams } from 'react-router';
import Comment from './Comment'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function Post() {
    
    let navigate = useNavigate();

    //get id of the post from the url
    const {id} = useParams();
    //values
    const [currentPost, setCurrentpost] = useState({}); 
    const [sessionToken, setSessiontoken] = useState(""); 
    const [postComments, setPostcomments] = useState([]);
    const [usercomment, setUsercomment] = useState("");
    const [commentID, setCommentID] = useState("");
    const [newTitle, setNewtitle] = useState("");
    const [content, setContent] = useState("");
    const [currentUser, setCurrentuser] = useState({}); 
    const [owner, setOwner] = useState(false); 
    const [editPressed, setEditPressed] = useState(true); 
    const [loaded, setLoaded] = useState(false); 
    const [comment, setComment]=useState([]);
    const [downvotes, setDownvotes] = useState(0);
    const [upvotes, setUpvotes] = useState(0);
    const [voteChanged, setVoteChanged] = useState(0);

    //get post info from db
    useEffect(()=>{
        setSessiontoken(sessionStorage.getItem("token"));
        fetch('/api/post/'+id).
        then(res => res.json()).
        then(data => {
            console.log(data);
            //setting the current post
            setCurrentpost(data);
            setUpvotes(data.upvotes.length);
            setDownvotes( data.downvotes.length);

           
          
            //check if the current user is the owner of the post
            if(sessionStorage.getItem('user')){
                setCurrentuser(sessionStorage.getItem('user'));
                if((JSON.parse(sessionStorage.getItem('user')).admin)){
                    setOwner(true);
                }
                else if(JSON.parse(sessionStorage.getItem('user')).id === data.userID){
                    console.log(JSON.parse(sessionStorage.getItem('user')).id, data.userID);
                    setOwner(true);
                    console.log("is owner");
                }else{
                    console.log("not owner");
                }
            }else{
                setCurrentuser(null);
            }
          
            //get all of the comments
            fetch('/api/post/comments/'+data._id
            ).then(res => res.json()).then(data=>{
               // console.log(data);
                setPostcomments(data);
                setLoaded(false);
          
            });

      
        });
      
    },[loaded]);

    //for changing the vote
    useEffect(()=>{
        console.log('vote changed'+ id);
        fetch('/api/post/'+id).
        then(res => res.json()).
        then(data => {
            //console.log(data);

            setUpvotes(data.upvotes.length);
            setDownvotes( data.downvotes.length);
            
        });
    },[voteChanged]);

    //when add comment btn is pressed
    const addComment = (e) => {
        e.preventDefault();
        console.log("ADDING A COMMENT");        
        //getting the user 
        const user = JSON.parse(sessionStorage.getItem('user'));
       
        //add to comment db
       fetch("/api/addcomment", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization":"Bearer "+sessionStorage.getItem('token')
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

             //add to comment posts
            fetch("/api/post/comment", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "authorization":"Bearer "+sessionStorage.getItem('token')
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
                //console.log(data.mst)

                //add comment to users comments
                fetch("/api/user/comment", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "authorization":"Bearer "+sessionStorage.getItem('token')
                    
    
                    },
                    body: JSON.stringify({
                        userID: user.id,
                        postID: currentPost._id,
                        commentID : data.msg
                    }),
    
                    mode: "cors"
                }).then(res => res.json()).then(data=>{
                    console.log(data);

                });
            });
            
        });

        //clear the comment area
        const area = document.getElementById("commentarea");
        area.value="";
        //loading is done
        setLoaded(true);
    }


    //edit was pressed
    const edit = (e) => {
        e.preventDefault();
        console.log("edit pressed");

        //activate save and remove btn and remove the edit btn
        setEditPressed(false);
        const editbtn = document.getElementById("edit");
        editbtn.remove();

        const content = document.getElementById('textarea');
        content.value = currentPost.content;
        setContent(currentPost.content);
        setNewtitle(currentPost.title);
        
    }

    //remove the post was pressed
    const remove = (e) => {
        e.preventDefault();
        console.log("remove pressed");

        //remove post from the user
        fetch("/api/remove/post", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
                userID: currentPost.userID,
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            navigate('/', {replace:true});
            
        }); 
        
      
    }

    //save the post was pressed
    const save = (e) => {
        e.preventDefault();
        console.log("save pressed");
    

        //add new post values to db 
        fetch("/api/update/post/content", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
                content: content,
                title: newTitle
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            //navigate to home screen
            navigate('/', {replace:true});
        });  
    }
     //like the post was pressed
     const  likepost = (e) => { 
        e.preventDefault();
        console.log("like pressed");

        let addpostlike = async function() {
            fetch('/api/post/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
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
        addpostlike();
    }
     //dislike the post was pressed
     const dislikepost = (e) => {
        e.preventDefault();
        console.log("dislike pressed");
        //add post dislike to db
        let adddislike = async function() {
            fetch('/api/post/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
                userID: JSON.parse(sessionStorage.getItem('user')).id,
                vote : -1
          
            }),
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            //for the vote count
            if(voteChanged == 2){
                setVoteChanged(1);
            }else{
                setVoteChanged(2);
            }
        }); 
    }
    adddislike();
}
    return (
        <div>
            <form>
           {!editPressed ? <h4>Add new title to post </h4>:""}
           {!editPressed ? <Input type="text" onChange={e => setNewtitle(e.target.value)} placeholder={currentPost.title}></Input> :""}
            <div>
               {editPressed ?  <h1 id="header">{currentPost.title}</h1>:""}
                <label>Posted by:</label>
                <Link to={`/profile/${currentPost.username}`} data={currentPost.username} token={null}>{currentPost.username}</Link>
                <br></br>
                <label>Last edited: {currentPost.date}</label>
            </div>
            <div>
            <br></br>
                <TextField multiline  cols="50" rows="10" id="textarea" placeholder={currentPost.content} disabled={editPressed} onChange={e => setContent(e.target.value)}></TextField> 
            </div>
            </form>
            <div>
               

                <Button onClick={likepost} variant = "text" color = "success" id="like" startIcon={<ArrowUpwardIcon/>} disabled={!sessionStorage.getItem('token')}>{upvotes}</Button>
               <Button onClick={dislikepost} variant = "text" color = "error" id="dislike"startIcon={<ArrowDownwardIcon/>} disabled={!sessionStorage.getItem('token')}>{downvotes}</Button>
            </div>
            <br></br>
            <div>
            {owner ? <Button onClick={edit} variant = "contained" color = "primary" id="edit">Edit</Button>:""}
                <br></br>
                {!editPressed ? <Button onClick={save} variant = "contained" color = "success" id="save" >Save</Button>:""}
                {!editPressed ? <Button onClick={remove} variant = "contained" color = "error" id="remove">Remove</Button>:""}
            </div>
            <div>
                {sessionToken ? <p>Want to comment the post? Add your comment below.</p>:""}
                {sessionToken ? <TextField label="Comment" type="text" multiline  rows="10" id="commentarea" placeholder="Add a comment" onChange={e => setUsercomment(e.target.value)}></TextField> :""}
                <br></br>
                {sessionToken ? <Button onClick={addComment} variant = "contained" color = "primary" id="addcomment">Add Comment</Button>:""}
            
            </div>
            <h1>Comments</h1>
          
            <List id="commentlist">
            {postComments.map((item) =>   
                <Comment key={item._id} item={item} username={item.username} content={item.content}  date={item.date}/>
            )};
            </List>
        </div>
    )
}

import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
export default function Comments({item, username, content, date}) {
   
    //values
    const [currUser, setCurrUser] = useState({}); 
    const [commentOwner, setCommentOwner] = useState(false); 
    const [commentEdit, setCommentEdit] = useState(true); 
    const [currComment, setCurrComment] = useState({}); 
    const [commentContent, setCommentContent] = useState("");
    const [downvotes, setDownvotes] = useState(0);
    const [upvotes, setUpvotes] = useState(0);
    const [voteChanged, setVoteChanged] = useState(0);

    useEffect(()=>{
        //set comment content in case user edits but does not change anything
        setCommentContent(content);
        //setting current comment
        setCurrComment(item);
   
        //check if the curr user is the owner of the comment
        if(sessionStorage.getItem('user')){
            setCurrUser(JSON.parse(sessionStorage.getItem('user'))); // add current user as logged in user

            //check if user is admin
            if(JSON.parse(sessionStorage.getItem('user')).admin === true){
                setCommentOwner(true);
            }
            //check if user is commeted ownser
            else if(JSON.parse(sessionStorage.getItem('user')).id === item.userID){
                //console.log(JSON.parse(sessionStorage.getItem('user')).id,item.userID);
                setCommentOwner(true);
                console.log("is owner");
            }else{
                setCommentOwner(false);
                console.log("not owner");
            }
        //not logged in --> canot give votes
        }else{
            setCurrUser(null);
        }

    },[]);

    //getting new vote counts for comments after user gives vote
    useEffect(()=>{
        //console.log('vote changed'+ item._id);

        fetch('/api/comment/'+item._id)
        .then(res => res.json())
        .then(data => {
        //    console.log(data);
            //setting up like/dislike
            setUpvotes(data.upvotes.length);
            setDownvotes( data.downvotes.length);
            
        });
    },[voteChanged]);

    //adding a like to comment
    const addLike = (e) => {
        e.preventDefault();
        console.log("like pressed");
        //add new vote to db
        let addlike = async function() {
            fetch('/api/comment/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: item._id,
                userID: JSON.parse(sessionStorage.getItem('user')).id,
                vote : 1
          
            }),
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            //to load new vote
            if(voteChanged === 1){
                setVoteChanged(2);
            }else{
                setVoteChanged(1);
            }
        }); 
        }

        addlike();
    }
    //adding a dislike to comment
    const addDislike = (e) => {
        e.preventDefault();
        console.log("dislike pressed");
        //add new vote to db
        let adddislike = async function() {
            fetch('/api/comment/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id:  item._id,
                userID: JSON.parse(sessionStorage.getItem('user')).id,
                vote : -1
            }),
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            //console.log(data);
            //to load new vote
            if(voteChanged === 2){
                setVoteChanged(1);
            }else{
                setVoteChanged(2);
            }
        });  
        }
    adddislike();
    }
    //saving edited comment
    const save = (e) => {
        e.preventDefault();   
        console.log("save pressed:"+item._id);
        console.log(commentContent);

        //add new comment values to db 
        fetch("/api/update/comment", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: item._id,
                content: commentContent
            }),
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        }); 
       //reload the page (and buttons)
       window.location.reload(false);
    }

    //remove comment
    const remove = (e) => {
        e.preventDefault();
        //console.log("remove pressed:"+item._id);
         //add new comment values to db 
         fetch("/api/remove/comment", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + sessionStorage.getItem('token'),
            },
            body: JSON.stringify({
                _id: item._id,
                userID: currUser.id,
                postID: currComment.postID
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
     
        }); 
        //reload the page (and buttons)
       window.location.reload(false);
    }

    //edit was pressed
    const edit = (e) => {
        e.preventDefault();
        //console.log("edit pressed:"+item._id);

        //add original comment to comment field
        const commentField = document.getElementById("textarea-comment-"+item._id);
        commentField.value = content;

        //activate save and remove btn and remove the edit btn
        setCommentEdit(false);
        const commentedit = document.getElementById("comment-edit-"+item._id);
        commentedit.remove();

   
        
    }
    
    return (
        <div>
           <li style={{ listStyleType: "none"}}>
      
           <div >
          
           <Button onClick={addLike} variant = "text" disabled={!sessionStorage.getItem('token')} color = "success" id={"comment-like-"+item._id} startIcon={<ArrowUpwardIcon/>}></Button>   
           <label>{upvotes}</label> 
            <br></br>
            <Button onClick={addDislike} variant = "text" disabled={!sessionStorage.getItem('token')} color = "error" id={"comment-dislike-"+item._id} startIcon={<ArrowDownwardIcon/>}></Button>
            <label>{downvotes}</label>
            
            </div>
            
            
    
            
           
            <TextField sx={{backgroundColor:'white', }} placeholder={content} cols="50" rows="10" id={"textarea-comment-"+item._id} disabled={commentEdit} onChange={e => setCommentContent(e.target.value)}/>
    
            <br></br>

            <label>Posted by:</label>
            <Link to={`/profile/${username}`} data={username} token={null}>{username}</Link>
            <p> Last modified: {date}</p>
            <div>
                    {commentOwner  ? <Button onClick={edit} variant = "contained" color = "primary" id={"comment-edit-"+item._id}>Edit</Button>:""}
                    {!commentEdit ? <Button onClick={save} variant = "contained" color = "success" id={"comment-save-"+item._id} >Save</Button>:""}
                    {!commentEdit ? <Button onClick={remove} variant = "contained" color = "error" id={"comment-remove-"+item._id}>Remove</Button>:""}
            </div>
            
            <br></br>
       
            </li>
        </div>
    )
}
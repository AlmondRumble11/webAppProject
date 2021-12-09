import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

export default function Comments({item, username, content, date}) {
   

    const [currUser, setCurrUser] = useState({}); 
    const [commentOwner, setCommentOwner] = useState(false); 
    const [commentEdit, setCommentEdit] = useState(true); 
    const [currComment, setCurrComment] = useState({}); 
    const [commentContent, setCommentContent] = useState("");

    useEffect(()=>{

        //getting the current user
        console.log(JSON.parse(localStorage.getItem('user')).id);
        setCurrUser(JSON.parse(localStorage.getItem('user')));
        console.log(currUser);
        
        //set comment content in case user edits but does not change anything
        setCommentContent(content);

        //setting current comment
        console.log(item._id);
        setCurrComment(item);
        console.log(currComment._id);
        
        //check if the curr user is the owner of the comment
        if(localStorage.getItem('user')){
            console.log(JSON.parse(localStorage.getItem('user')).id,item.userID);
            if(JSON.parse(localStorage.getItem('user')).id === item.userID){
                setCommentOwner(true);
                console.log("is owner");
            }else{
                setCommentOwner(false);
                console.log("not owner");
            }
        }

    },[])


    const addLike = (e) => {
     
        e.preventDefault();
        console.log("like pressed:"+item._id);
      
    }
    const addDislike = (e) => {
        e.preventDefault();
        console.log("dislike pressed:"+item._id);

        
    }
    
    const save = (e) => {
        e.preventDefault();   
        console.log("save pressed:"+item._id);
        console.log(commentContent);

        //add new comment values to db 
        fetch("/api/update/comment", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('token'),
            
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
    const remove = (e) => {
        e.preventDefault();
        console.log("remove pressed:"+item._id);
        console.log( item._id,
            currUser.id,
            currComment.postID)
        

         //add new comment values to db 
         fetch("/api/remove/comment", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('token'),
            
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
        console.log("edit pressed:"+item._id);

        //add original comment to comment field
        const commentField = document.getElementById("textarea-comment-"+item._id);
        commentField.value = content

        //activate save and remove btn and remove the edit btn
        setCommentEdit(false);
        const commentedit = document.getElementById("comment-edit-"+item._id);
        commentedit.remove();

   
        
    }
    
    return (
        <div>
           <li style={{ listStyleType: "none" }}>
           
           <Link to={`/profile/${username}`} data={username} token={null}>Posted by:{username}</Link>
           
  
           <p> Last modified: {date}</p>
          
           <textarea placeholder={content} cols="50" rows="10" id={"textarea-comment-"+item._id} disabled={commentEdit} onChange={e => setCommentContent(e.target.value)}></textarea>
           <div>
                {commentOwner  ? <Button onClick={edit} variant = "contained" color = "primary" id={"comment-edit-"+item._id}>Edit</Button>:""}
                {!commentEdit ? <Button onClick={save} variant = "contained" color = "primary" id={"comment-save-"+item._id} >Save</Button>:""}
                {!commentEdit ? <Button onClick={remove} variant = "contained" color = "secondary" id={"comment-remove-"+item._id}>Remove</Button>:""}
           </div>
          
           <br></br>
           <div>
            <p>Vote count: 10100</p>
            {localStorage.getItem('token') ? <Button onClick={addLike} variant = "contained" color = "secondary" id={"comment-like-"+item._id} >Like</Button>:""}
            {localStorage.getItem('token') ? <Button onClick={addDislike} variant = "contained" color = "primary" id={"comment-dislike-"+item._id} >dislike</Button> :""}  
           </div>
          
        </li>
        </div>
    )
}
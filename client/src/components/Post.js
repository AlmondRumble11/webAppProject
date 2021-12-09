import { Button } from '@mui/material';
import React from 'react'
import { useState, useEffect} from 'react';
import { useParams } from 'react-router';
import Comment from './Comment'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


export default function Post() {
    
    let navigate = useNavigate();

    //get id of the post from the url
    const {id} = useParams();
    //current post
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
    //get post info from db
    useEffect(()=>{

    
  
        setSessiontoken(localStorage.getItem("token"));

        fetch('/api/post/'+id).
        then(res => res.json()).
        then(data => {
            console.log(data);
            //setting the current post
            setCurrentpost(data);
        
            

            
            //getting current user
            setCurrentuser(localStorage.getItem('user'));
            console.log("CURRENT USER IS:\n"+JSON.parse(localStorage.getItem('user')).id);
           
          
              //check if the current user is the owner of the post
            if(localStorage.getItem('user')){
                console.log(JSON.parse(localStorage.getItem('user')).id, data.userID);
                if(JSON.parse(localStorage.getItem('user')).id === data.userID){
                    setOwner(true);
                    console.log("is owner");
                }else{
                    console.log("not owner");
                }
            }
          
  

            //setPostcomments(data.comments);
    
            /*if(data.comments !== undefined){
                console.log("these are the comments:"+currentPost.comments);
                setPostcomments(currentPost.comments);
            }else{
                console.log("no comments");
                console.log(currentPost.comments);
                setPostcomments([]);
            }*/
            

  

            //get all of the comments
            fetch('/api/post/comments/'+data._id
            ).then(res => res.json()).then(data=>{
               // console.log(data);
                setPostcomments(data);
                setLoaded(false);
          
            });

      
        });
      
    },[loaded]);

    



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
                console.log(data.mst)

                //add comment to users comments
                fetch("/api/user/comment", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "authorization":"Bearer "+localStorage.getItem('token')
                    
    
                    },
                    body: JSON.stringify({
                        userID: user.id,
                        postID: currentPost._id,
                        commentID : data.msg
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
        setLoaded(true);
    }
    var listItems = [];
 
    if(postComments ){

        listItems =  postComments.map((item) => 
        
        //https://www.robinwieruch.de/react-update-item-in-list
        //if item.clicked = true then change textDecoration to line-through. using className to change decoration did not work in the tests but worked on the webpage
        <Comment key={item._id} item={item} username={item.username} content={item.content}  date={item.date}/>
      
        //<li>{item.username}</li>
        
        );
       
      
        
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
                "authorization": "Bearer " + localStorage.getItem('token'),
            
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
                "authorization": "Bearer " + localStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
                content: content,
                title: newTitle
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            window.location = "/";
        }); 


        
    }
     //save the post was pressed
     const  likepost = (e) => { 
        e.preventDefault();
        console.log("like pressed");

        let addpostlike = async function() {
            fetch('/api/post/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
                userID: JSON.parse(localStorage.getItem('user')).id,
                vote : 1
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
           
        }); 
        
        }

        addpostlike();
    }


     //save the post was pressed
     const dislikepost = (e) => {
        e.preventDefault();
        console.log("dislike pressed");
        
        let adddislike = async function() {
            fetch('/api/post/votes', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('token'),
            
            },
            body: JSON.stringify({
                _id: currentPost._id,
                userID: JSON.parse(localStorage.getItem('user')).id,
                vote : -1
          
            }),
        
            mode: "cors"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
           
        }); 
        
        
    }
    adddislike();
}


    return (
        <div>
            <form>
           {!editPressed ? <h4>Add new title to post </h4>:""}
           {!editPressed ? <input type="text" onChange={e => setNewtitle(e.target.value)} placeholder={currentPost.title}></input> :""}
            <div>
               {editPressed ?  <h1 id="header">{currentPost.title}</h1>:""}
                <label>Posted by:</label>
                <Link to={`/profile/${currentPost.username}`} data={currentPost.username} token={null}>{currentPost.username}</Link>
                <br></br>
                <label>Last edited: {currentPost.date}</label>
            </div>
            <div>
                <textarea  cols="50" rows="10" id="textarea" placeholder={currentPost.content} disabled={editPressed} onChange={e => setContent(e.target.value)}></textarea> 
            </div>
            </form>
            <div>
               
                <p>VOTE COUNT</p>
                {sessionToken ? <Button onClick={likepost} variant = "contained" color = "primary" id="like" >Like</Button>:""}
                {sessionToken ? <Button onClick={dislikepost} variant = "contained" color = "secondary" id="dislike">Dislike</Button>:""}
            </div>
            <div>
                {sessionToken ? <p>Want to comment the post? Add your comment below.</p>:""}
                {sessionToken ? <textarea type="text" cols="50" rows="5" id="commentarea" placeholder="Add a comment" onChange={e => setUsercomment(e.target.value)}></textarea> :""}
                <br></br>
                {sessionToken ? <Button onClick={addComment} variant = "contained" color = "primary" id="addcomment">Add Comment</Button>:""}
                {owner ? <Button onClick={edit} variant = "contained" color = "primary" id="edit">Edit</Button>:""}
                {!editPressed ? <Button onClick={save} variant = "contained" color = "primary" id="save" >Save</Button>:""}
                {!editPressed ? <Button onClick={remove} variant = "contained" color = "secondary" id="remove">Remove</Button>:""}
            </div>
            <h1>Comments</h1>
          
            <ul id="commentlist">
                {listItems}
            </ul>
        </div>
    )
}

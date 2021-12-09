import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';


export default function Profile({token, user}) {

    const [profileUser, setProfileUser] = useState([]);
    const {username} = useParams();
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    //getting the user
    useEffect(() => {

       
        console.log("#######################"+username);
        if(!token){
        //fetch all a profile
        fetch('/api/profile/'+username)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProfileUser(data);
                setPosts(data.posts);
                setComments(data.comments);
              
                
            });
       }else{
        setProfileUser(localStorage.getItem('user'));
       }

    }, []);
    var commentList  = []
    if(comments){
        commentList =  comments.map((item) => 
       
        //https://www.robinwieruch.de/react-update-item-in-list
        //if item.clicked = true then change textDecoration to line-through. using className to change decoration did not work in the tests but worked on the webpage
        //<Comment key={item._id} username={item.username} content={item.content}  date={item.date}/>
      
        <p>{item}</p>
    
    );}
    var postList  = []
    if(posts){
        postList =  posts.map((item) => 
        
        //https://www.robinwieruch.de/react-update-item-in-list
        //if item.clicked = true then change textDecoration to line-through. using className to change decoration did not work in the tests but worked on the webpage
        //<Comment key={item._id} username={item.username} content={item.content}  date={item.date}/>
        <p>{item}</p>
       
    
    );}
    console.log(user, token);
    return (
        <div>
            <h1>Profile</h1>
            <p>Username: {profileUser.username}</p>
            <p>Email: {profileUser.email}</p>
            <p>Name: {profileUser.name}</p>
            <p>Bio: {profileUser.bio}</p>
            <p>Register date: {profileUser.registerdate}</p>
            <h2>Posts</h2>
            <ul>{postList}</ul>
            <ul></ul>
            <h2>Comments</h2>
            <ul>{commentList}</ul>
            <ul></ul>
          
            

        </div>
    )
}

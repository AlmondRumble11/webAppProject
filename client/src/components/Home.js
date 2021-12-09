import React from 'react'
import { useState, useEffect } from 'react';
import SinglePost from './SinglePost'


export default function Home({token , user}) {

    const [post, setPost] = useState([]);
    const [shownPosts, setShownPosts] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [loading, setloading] = useState(true);
    const [hasPosts, sethasPosts] = useState(false);
    let newPosts = []
    //getting all of the posts
    useEffect(() => {

        //fetch all posts
        fetch('api/posts')
            .then(res => res.json())
            .then(data => {

                if(data){
                console.log(data);
                setPost(data);
                setShownPosts(data.slice(0,10));
                console.log(shownPosts);
                setMaxCount(data.length);
                setCurrentCount(10);
                console.log(data.length);

                console.log("posts are:"+post);
                setloading(false);
            }
            });
           
           
    }, []);

    const showMore = (e) => {
        e.preventDefault();

        //check for more posts
        if(maxCount > currentCount){
            
            //update count
            let newCount = currentCount + 10;
            setCurrentCount(newCount);

            //get more posts
            setShownPosts(post.slice(0,newCount));
        }else{
             //does not have more posts
                const btn = document.getElementById("morePosts");
                btn.setAttribute('disabled', 'true');
        }

    }
    console.log("!!!!"+shownPosts+"!!!!");
    if(shownPosts){
      
        newPosts = shownPosts.map((post) => (

            <SinglePost key={post.id} post={post} token={token} user={user} />
          ));
    }
    console.log(newPosts.length);
    //console.log("posts are:"+post);
    return loading ? (<h1>Still loading</h1>) :( 
    <div>
        <h1>All posts</h1>
        <ul>{newPosts}</ul>
        <button onClick={showMore} id="morePosts">Show more posts</button>
        
    </div>
    )
    
}
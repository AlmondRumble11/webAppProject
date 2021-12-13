import React from 'react'
import { useState,useEffect  } from 'react';
import SinglePost from './SinglePost'
import { Button, TextField, List } from '@mui/material';
import { useFormControl } from '@mui/material/FormControl';


export default function Home({token , user}) {


    //values
    const [post, setPost] = useState({});
    const [filtered, setFiltered] = useState({});
    const [shownPosts, setShownPosts] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [loading, setloading] = useState(true); //https://www.youtube.com/watch?v=k2Zk5cbiZhg
    const [searchValue, setSearchValue] = useState("");
    const [perpage] = useState(10);
    const [page, setPage] = useState(1);
    const [lastpost, setLast] = useState(0);
    const [firstpost, setFirst] = useState(0);
    const [showNext, setShowNext] = useState(true);
    const [showPrev, setShowPrev] = useState(true);

  
    //getting all of the posts
    useEffect(() => {

        //fetch all posts
        fetch('api/posts')
            .then(res => res.json())
            .then(data => {

                if(data){
                
                    //console.log(data);
                    //set values
                    setPost(data);
                    setFiltered(data);
                    setLast(10);
                    setFirst(0);
                    setPage(1);
                    setMaxCount(data.length);
                    setShownPosts(data.slice(0,10));
                    setCurrentCount(10);
                    setloading(false);
                    setShowPrev(false);
                   
                    if(data.length < 10){
                        setShowNext(false);
                    }
                }
            });
            
    }, []);


    //search filter 
    //https://upmostly.com/tutorials/react-filter-filtering-arrays-in-react-with-examples
    useEffect(() => {
        console.log('SEARCH');
        if(!loading){
            //filter post titles with search term
            const titles = post.filter(post => post.title.includes(searchValue));
          
            //add to list to be shown and set values
            setFiltered(titles);
            setCurrentCount(titles.length);
            setShownPosts(titles.slice(0,perpage));
            setPage(1);
            setMaxCount(titles.length);
            setFirst(0);
            setLast(perpage);

            //check that over 10 values
            if(titles.length > perpage){
                setShowNext(true);
                setShowPrev(false);
            }else{
                setShowNext(false);
            }
        }
    }, [searchValue]);

    //prev btn
    const goPrev = (e) => {
        e.preventDefault();
        //next btn to be working
        setShowNext(true);
        //not on the first page
        if(page > 1 ){
            setPage(page - 1); //set new page
            //check if next prev page is new page
            if((page-1)  <= 1){
                //lock prev and filter posts
                setShowPrev(false);
                setShownPosts(filtered.slice(lastpost - perpage-perpage, lastpost-perpage));
                //set new indexes
                setFirst(lastpost-perpage-perpage); //might not be needed
                setLast(lastpost - perpage);
            }else{
                //filter posts
                setShowNext(true);
                setShownPosts(filtered.slice(lastpost - perpage-perpage, lastpost-perpage));
                //set new indexes
                setFirst(lastpost - perpage -perpage);//might not be needed
                setLast(lastpost- perpage);
            }
        //on first page
        }else{
            setShowPrev(false);
            
        }
    }
    //next btn pressed
    const goNext = (e) => {
        e.preventDefault();
        //set prev to be working
        setShowPrev(true);

        //if has more posts
        if((page * perpage) < maxCount ){
            setPage(page + 1); //set new page
     
            //check if all post are shown 
            if(((page+1) * perpage) >= maxCount){
                //set values and filter posts
                setShowNext(false);
                setShownPosts(filtered.slice(lastpost, lastpost+perpage));
                setFirst(lastpost);
                setLast(lastpost+perpage);
            }else{
                //set values and filter posts
                setShowPrev(true);
                setShownPosts(filtered.slice(lastpost, lastpost + perpage));
                setFirst(lastpost);
                setLast(lastpost + perpage);    
            }
        }else{
            setShowNext(false);
        }
    }
    return loading ? (<h1>Still loading</h1>) :( 
    <div>
    
        <br></br>
        <div>
            <TextField fullWidth type="search" label="Search" id="search" placeholder='Search for post title' value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
        </div>
        <div>
    
        <h1>All posts</h1>
        <List>
                {shownPosts.map((post) => (
                    <SinglePost key={post.id} post={post} token={token} user={user} />
                    
                ))}
        </List>
         <Button onClick={goPrev} id="prevPage" variant = "text" disabled={!showPrev} color = "primary">Previous Page</Button>
        <label>{page}   </label>
        <Button onClick={goNext} id="nextPage" variant = "text" disabled={!showNext} color = "primary">Next Page</Button> 
       
        </div>
    </div>
    )
    
}
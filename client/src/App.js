
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Post from './components/Post';
import AddPost from './components/AddPost';
import Profile from './components/Profile';
import Home from '../src/components/Home';
import {useState, useEffect} from 'react';
import Header from "./components/Header";
import { Alert, Collapse } from '@mui/material';


function App() {

  //values
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(true);


  //set the user if logged in
  useEffect(() => {
  
    if(token){
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }, [])

  //https://smartdevpreneur.com/add-a-react-router-link-to-a-material-ui-alert-component/
  //collapse the alert
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }, [open]);
  
  return (
    <Router>
    <div className="App">
    {token ? <Collapse in={open}><Alert timeout={2000}> Logged in as {user.username}</Alert></Collapse> : ""}
    
    <Routes>
        <Route path="/login" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <Login setToken={setToken} setUser={setUser} token={token}/> </>}/>
        <Route path="/" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <Home user={user} token={token}/> </>}/>
        <Route  path="/register" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <Register /> </>}/> 
        <Route  path="/post/:id" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <Post/> </>}/> 
        <Route  path="/addpost" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <AddPost user={user} token={token}/> </>}/>
        <Route  path="/profile/:username" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <Profile user={user} token={null}/> </>}/>
        <Route  path="/profile/" element={<> <Header user={user} token={token} setToken={setToken} setUser={setUser}/> <Profile user={user} token={token}/> </>}/>
      </Routes>
      </div>
    </Router>
    
  );
}

export default App;

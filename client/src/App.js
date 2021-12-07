
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
import FlashMessage from 'react-flash-message';

function App() {

  const [token, setToken] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log("user is:"+user.username);
    console.log("token is:"+token);
    if(token){
      localStorage.setItem("user", JSON.stringify(user));
  
    
    }
  }, [token, user])
  
  return (
    <Router>
    <div className="App">
    <h2>{token ? `Logged in as ${user.username}!` : ""}</h2>
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

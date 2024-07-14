import {React,useState} from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/bg.avif";
import "../styles/Login.css"
import Navbar from "../components/Navbar";

import { useHistory } from "react-router-dom";

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data,setData]=useState('');
  let history=useHistory();
  function handleLogin(e){
    e.preventDefault();
    if (email.length==0 || password.length==0){
        alert("Invalid Credentials");
    }
    else{
        fetch('/login',{
            method : 'POST' ,
            headers : {
              'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body : new URLSearchParams({
              'uname' : email,
              'pass' : password,
              
            })
          })
          .then(response => response.json())
          .then(data=>{setData(data)
          console.log(data)})
          .catch(error => console.error(error));
         
          let d={'uid':data['uid'],'userName':data['userName']};
          if(data){
            history.push("/codeanalyzer",{mstate:data});
          }
          
          
         
          
         

    }
  }
  
  return (
    <div>
      <Navbar/>
    
    <div className="container" style={{ backgroundImage: `url(${BannerImage})` }}>
    <div className="login-container" >
      <br/>
      <br/>
      <br/>
      

      <h2 style={{fontSize:"20px"}}>VBA MACRO DOCUMENTATION AND TRANSFORMATION TOOL</h2>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" onClick={handleLogin}>Login</button>

      </form>
      <h4 style={{color:"white"}}>Developed by Karthikeyan.A.S. 715521104022 <br/> B.E.CSE, PSG iTech</h4>
      
    </div>
    <h3></h3>
    <h3></h3>
    <h3></h3>
      </div>
      <br/>
      <br/>
      <br/>
      
    </div>
    
  );
}

export default Home;
import {React,useState} from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/bg.avif";
import "../styles/Analyze.css"
import Navbar from "../components/Navbar";
import flow from "../assets/flowchart.jpeg";
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { useHistory } from "react-router-dom";


function CodeAnalyze(){
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [data,setData]=useState('');
  const [adata,setadata]=useState();
  const loc=useLocation();
  const st=loc.state.mstate;
  const uid=st['uid'];
  const history=useHistory();
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const handleDownload = () => {
    window.open('http://localhost:5000/getfile', '_blank');
  };
  async function pastAnalysis(){
    await fetch('/prev',{
      method : 'POST' ,
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body : new URLSearchParams({
      
       'uid':uid
        
      })
    })
    .then(response => response.json())
    .then(data=>{
      setadata(data); 
      console.log(data);
      history.push('/prevrec',{mstate:data,uid:uid});
    });
  }
  const analyze = (event) => {
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("uid",uid);
    fetch("/upload",
    {
        method: "POST",
        headers: {
            

        },
        body: formData
    }
).then((res) => res.json()).then((data) => { setData(data) });
  console.log(data);
  setText1(data['codereceive']);
  setText2(data["codewithdoc"]);
  setText3(data['logic']);
  };
  
    return(
        <div>
        <div><Navbar/></div>
        <div className="App">
        <div className="file-uploader">
           <h2>Upload XLSM File To Analyze</h2>
          <input type="file" onChange={handleFileChange} />
          <br/>
          <br/>
          {file && <p>File: {file.name}</p>}
          <input type="submit" onClick={analyze} value={"Analyze the Code"} className="submit-button"/>
        </div>
        <div className="text-areas">
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Extracted Code"
            
          />
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Code with Documentation"
          />
          <textarea
            value={text3}
            onChange={(e) => setText3(e.target.value)}
            placeholder="Functional Logic Explanation"
          />
        
     
    </div>
    <button onClick={handleDownload} className="submit-button">Download Process Flow Diagram</button>
    <button onClick={pastAnalysis} className="submit-button">View Past Analysis</button>
    </div>
    </div>
    );

}

export default CodeAnalyze;
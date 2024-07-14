import {React,useState} from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import Navbar from "../components/Navbar";
import "../styles/pastanalysis.css"
function PastAnalysis(){
    const location=useLocation();
    const st=location.state.mstate;
    const uid=location.state.uid;
    const uname=location.state.uname;
    const d=st['req'];
    console.log(st);
    console.log(d);
    function report(id){
        
        window.open(`http://localhost:5000/getreport?param1=${id}`);
        
    }
    return(
       <>
       <Navbar/>
       <br/>
       <br/>
       <br/>
       <br/>
       <center><h1>Previous Analysis</h1></center>
       <br/>
       <br/>

        <center>
           <table>
               <thead>
                   <td> S No </td>
                   <td> Analysis ID </td>
                   <td> Download Report </td>
                  
                  
               </thead>
               <tbody>
                    
                    {d && d.map((item,index) =>(
                        <tr>
                        <td>{index+1}</td>
                        <td>{item.id}</td>
                        <td><button className='btn'onClick={()=>report(item.id)}>DOWNLOAD REPORT</button></td>
                        
                        </tr>


                    ))
                    

                    }

               </tbody>
          </table>
                <br/>
                <br/>
            
           
          </center>

       </>
    );
}

export default PastAnalysis;
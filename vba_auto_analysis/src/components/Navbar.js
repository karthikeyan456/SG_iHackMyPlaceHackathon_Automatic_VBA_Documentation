import React, { useState } from "react";

import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  //const [selectedOption, setSelectedOption] = useState('option1');
 // const handleOptionChange = (event) => {
   // setSelectedOption(event.target.value);
  //};

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
          <h1 style={{color:"white",fontSize:"15px"}}> VBA MACRO DOCUMENTATION AND TRANSFORMATION TOOL</h1>
      </div>
      <div className="rightSide">
       
        
        

        <button onClick={toggleNavbar}>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
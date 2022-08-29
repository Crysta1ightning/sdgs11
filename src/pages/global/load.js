import React from "react";
import "./load.css";

function Load() {
  return (
    <div className="LoadPage">
      <div className="loading-spinner">
        <img src={require('../../images/永續清華logo.png')} alt="SDGS icon"></img> 
      </div>
    </div>
  );
}

export default Load
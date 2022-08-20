import React from 'react';
import './auth.css';
import Navbar from '../../navbar';
// import jwtDecode from 'jwt-decode'
// import { useEffect, useState } from 'react'
// import { useNavigate } from "react-router-dom";

function PrefacePage() {
	return (
		<div className='AuthPage'>
			<div className='decoration-box'>
                <Navbar/> 
                <h1>前言</h1>
            </div>
			<footer>
				Author: Magnus & David
			</footer>
		</div>
	)
}

export default PrefacePage
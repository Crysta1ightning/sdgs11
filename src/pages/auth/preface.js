import React from 'react';
import './auth.css';
import Navbar from '../global/navbar';
// import jwtDecode from 'jwt-decode'
// import { useEffect, useState } from 'react'

function PrefacePage() {
	return (
		<div className='AuthPage'>
			<div className='decoration-box'>
                <Navbar/> 
                <h1>前言</h1>
            </div>
		</div>
	)
}

export default PrefacePage
import React from 'react';
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import './auth.css';
import Navbar from '../../navbar';

function VerifyMailPage() {
    const {token} = useParams();
    const [valid, setValid] = useState(true);

    const verifyToken = useCallback(async () => {
        if (token) {
            const url = `https://sdgs12.herokuapp.com/api/verify/${token}`
            console.log(url);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await response.json();
            if(data.status === 'ok') return;
        }
        setValid(false);  
    }, [token]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken])

	return (
        <div className='AuthPage'>
            <div className='decoration-box'>
                <Navbar/> 
                <h1>Email 驗證</h1>
            </div>
            <div className="container">
                {valid? (
                    <div>
                        <h3>Your Email Has Been Verified Successfully</h3>
                        <p>Go to Login Page <button onClick={() => {window.location.href = '/login'}}>Here</button></p>
                    </div>
                ) : (
                    <div>
                        <h3>Invalid or Expired URL</h3>
                        <p>If you have any problem with this, please contact us via <a href = "mailto: nthutestsdgs@gmail.com">nthutestsdgs@gmail</a></p>
                    </div>
                )}
            </div>
        </div>
	)
}

export default VerifyMailPage;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'
import './auth.css';
import Load from '../global/load';
import Invalid from '../global/invalid';

function VerifyMailPage() {
    const {token} = useParams();
    const [loading, setLoading] = useState(true);
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
            if(data.status === 'ok') {
                setLoading(false);
                return;
            }
        }
        setValid(false);  
        setLoading(false);
    }, [token]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken])

    if(loading) return <Load/>;
    if(!valid) return <Invalid/>;
	return (
        <div className='AuthPage'>
            <div className='header'>
                <h1>驗證信箱</h1>
            </div>
            <div className="container">
                <div>
                    <h3>信箱已被成功驗證</h3>
                    <button onClick={() => {window.location.replace('/login')}}>登入</button>
                </div>
            </div>
        </div>
	)
}

export default VerifyMailPage;
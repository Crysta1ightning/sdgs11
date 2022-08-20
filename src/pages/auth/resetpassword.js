import React from 'react';
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import './auth.css';
import Navbar from '../../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const {token} = useParams();
    const [valid, setValid] = useState(true);

    const verifyToken = useCallback(async () => {
        if (token) {
            const url = `https://dashboard.heroku.com/apps/sdgs12/api/verify/${token}`
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

    async function resetPassword(event){
		event.preventDefault();
        console.log(token);
        console.log(password);
		const response = await fetch('https://dashboard.heroku.com/apps/sdgs12/api/resetPassword', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token,
                password,
			}),
		})
        const data = await response.json();
        if(data.error) {
            alert(data.error);
            setValid(false);
        } else {
            alert('Password Reset Successfully');
            window.location.href = '/login';
        }
	}

	return (
        <div className='AuthPage'>
            <div className='decoration-box'>
                <Navbar/> 
                <h1>忘記密碼</h1>
            </div>
            <div className="container">
                {valid? (
                    <div>
                        <h1>忘記密碼</h1>
                        <form onSubmit={resetPassword}>
                            <div className='box'>
                                <FontAwesomeIcon className="gradient" icon={solid("lock")}/>
                                <input 
                                    className='inp'
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="new-password"
                                    autoComplete="new-password"
                                    placeholder='輸入密碼'>
                                </input>
                            </div>
                            <input className='submit-button' type="submit" value="更新密碼"></input>
                        </form>
                        <footer>
                            Author: David
                        </footer>
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

export default ResetPasswordPage;
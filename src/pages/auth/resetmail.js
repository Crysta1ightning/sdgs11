import React, { useEffect, useCallback } from 'react';
import { useState } from 'react'
import './auth.css';
import BackKey from '../global/backkey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

function ResetMailPage() {
	const [email, setEmail] = useState('')
	const [countdown, setCountdown] = useState(60);
    const [resend, setResend] = useState(true);

	async function resetMail(event){
		event.preventDefault()
		const response = await fetch('https://sdgs12.herokuapp.com/api/resetMail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
			}),
		})
        const data = await response.json()
        if(data.error) alert(data.error);
        else {
			alert('Mail Sent Successfully\nYou Might Need to Check Spam Inbox if not Found');
			setResend(false);
			setCountdown(60);
		}

	}

	const tick = useCallback(() => {
		if(countdown !== 1) {
			const newCountdown = countdown-1;
			setCountdown(newCountdown);
		} else {
			setResend(true);
		}
	}, [countdown])

	useEffect ( () => {
		let interval;
		if(!resend) interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [tick, resend]
	)


	return (
		<div className='AuthPage'>
            <div className='decoration-box'>
                <BackKey/> 
                <h1>忘記密碼</h1>
            </div>
            <div className="container">
                <form onSubmit={resetMail}>
                    <div className='box'>
                        <FontAwesomeIcon className="gradient" icon={solid("envelope")}/>
                        <input 
                            className='inp'
                            type="email"
                            required
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            id="new-email"
                            autoComplete="new-email"
                            placeholder="輸入Email">
                        </input>
                    </div>
                    {resend? <input className='submit-button' type="submit" value="重設密碼"></input> :　<p>Send again in {countdown}s</p>}
                </form>
            </div>
		</div>
	)
}

export default ResetMailPage
import React from 'react';
import './auth.css';
import { useState } from 'react'
import Navbar from '../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

function RegisterPage() {
	const [newEmail, setNewEmail] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [studentID, setStudentID] = useState('')

	async function register(event){
		event.preventDefault();
		const response = await fetch('https://sdgs12.herokuapp.com/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				newEmail,
				newPassword,
				studentID,
			}),
		})

		const data = await response.json();
		if(data.status === 'ok1' || data.status === 'ok2') {
			if(data.status === 'ok1') {
				console.log(studentID + " Register Successfully");
			}else {
				console.log( "Register Successfully");
			}
			alert('Register Successfully');
			setNewEmail('');
			setNewPassword('');
			setStudentID('');
		}else {
			if(data.error) alert(data.error);
			else alert("Register Fail");
		}
	}

	return (
		<div className='AuthPage'>
			<div className='decoration-box'>
				<h1>立即註冊</h1>
			</div>
			<Navbar/> 
			<div className="container">
				<img src={require("../images/永續清華logo.png")} alt="nthu sdgs logo"></img>
				<form onSubmit={register}>
					<div className='box' style={{marginTop:"4%"}}>
						<FontAwesomeIcon className="gradient" icon={solid("user")}/>
						<input 
							className='inp'
							type="email"
							required
							value={newEmail} 
							onChange={(e) => setNewEmail(e.target.value)}
							id="new-email"
							autoComplete="new-email"
							placeholder="輸入Email">	
						</input>
					</div>
					<div className='box'>
						<FontAwesomeIcon className="gradient" icon={solid("lock")}/>
						<input 
							className='inp'
							type="password"
							required
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							id="new-password"
							autoComplete="new-password"
							placeholder='輸入密碼'>
						</input>
					</div>
					<div className='box'>
						<FontAwesomeIcon className='gradient' icon={solid("graduation-cap")}/>
						<input 
							className='inp'
							type="text"
							value={studentID}
							onChange={(e) => setStudentID(e.target.value)}
							placeholder="學號(非必填):">
						</input>
					</div>
					<input className='submit-button' type="submit" value="註冊帳號"></input>
				</form>
				<div className='parent'>
					<h2>已經註冊了?</h2>
					<button onClick={() => {window.location.href = '/login'}}>
						登入帳號
					</button>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage
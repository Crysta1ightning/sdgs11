import React from 'react';
import './auth.css';
import { useState } from 'react'

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
			<h1>建立帳號</h1>
			<form onSubmit={register}>
				<div className='box'>
					<label>Email: </label>
					<input 
						type="email"
						required
						value={newEmail} 
						onChange={(e) => setNewEmail(e.target.value)}
						id="new-email"
						autoComplete="new-email">
					</input>
				</div>
				<div className='box'>
					<label>密碼: </label>
					<input 
						type="password"
						required
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						id="new-password"
						autoComplete="new-password">
					</input>
				</div>
				<div className='box'>
					<label>學號(非必填): </label>
					<input 
						type="text"
						value={studentID}
						onChange={(e) => setStudentID(e.target.value)}>
					</input>
				</div>
				<div className='box'>
					<input className='submit-button' type="submit" value="Register"></input>
				</div>
			</form>
			<button onClick={() => {window.location.href = '/login'}}>Login</button>
			<footer>
				Author: Magnus & David
			</footer>
		</div>
	)
}

export default RegisterPage
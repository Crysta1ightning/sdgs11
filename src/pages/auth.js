import React from 'react';
import './auth.css';
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function AuthPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [studentID, setStudentID] = useState('')
	const [signIn, setSignIn] = useState(false);
	const [user, setUser] = useState({});

	async function getUser() {
		console.log("Get User Data");
        const req = await fetch ('https://sdgs12.herokuapp.com/api/user', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        const data = await req.json();
        if(data.status === 'ok') setUser(data.user);
        else alert(data.error);
    }

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const user = jwtDecode(token);
			console.log(user);
			if(!user){
			  alert("Token Invalid")
			  localStorage.removeItem('token');  
			}else{
			  console.log("You are a logged in User");
			  setSignIn(true);
			  getUser();
			}
		}
	}, [])

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

	async function login(event){
		event.preventDefault()
		const response = await fetch('https://sdgs12.herokuapp.com/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()
		if(data.user) {
			localStorage.setItem('token', data.user);
			console.log(data.user);
			console.log('Login Successfully');
			setEmail('');
			setPassword('');
			alert('Login Successfully');
			navigate('/all');
			// window.location.href = '/all';
		} else {
			alert('Login Fail');
		}
	}

	function logout(event){
		event.preventDefault();
		console.log("User Logout");
		localStorage.removeItem('token');  
		setSignIn(false);
	}

	return (
		<div className='AuthPage'>
			<h1>登入|建立帳號</h1>
			{!signIn ? (
				<div>
					<h2>登入</h2>
					<form onSubmit={login}>
						<div className='box'>
							<label>Email:</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								id="current-email"
								autoComplete="current-email">
							</input>
						</div>
						<div className='box'>
							<label>密碼: </label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								id="current-password"
								autoComplete="current-password">
							</input>
						</div>
						<div className='box'>
							<input className='submit-button' type="submit" value="Login"></input>
						</div>
					</form>
				</div>
				) : (
				<div>
					<h2>登出</h2>
					<h3>目前帳號: {user.email} {user.studentID ? <>學號: {user.studentID}</> : ""}</h3>
					<form onSubmit={logout}>
						<input type="submit" value="Logout"></input>
					</form>
				</div>
				)
			} 
			
			<h2>建立帳號</h2>
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
			<footer>
				Author: Magnus & David
			</footer>
		</div>
	)
}

export default AuthPage
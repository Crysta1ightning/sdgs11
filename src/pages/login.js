import React from 'react';
import './auth.css';
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
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
			<h1>登入</h1>
			{!signIn ? (
				<div>
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
					<h3>目前帳號: {user.email} {user.studentID ? <>學號: {user.studentID}</> : ""}</h3>
					<form onSubmit={logout}>
						<input type="submit" value="Logout"></input>
					</form>
				</div>
				)
			} 
			<button onClick={() => {window.location.href = '/register'}}>Register</button>
			<footer>
				Author: Magnus & David
			</footer>
		</div>
	)
}

export default LoginPage
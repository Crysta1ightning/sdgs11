import React from 'react';
import './auth.css';
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Navbar from '../../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


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
			alert(data.error);
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
			{!signIn ? (
				<div>
					<div className='decoration-box'>
						<Navbar/> 
						<h1>立即登入</h1>
					</div>
					<div className="container">
						<img src={require("../../images/永續清華logo.png")} alt="nthu sdgs logo"></img>
						<form onSubmit={login}>
							<div className="box first">
								<FontAwesomeIcon className="gradient" icon={solid("envelope")}/>
								<input
									className='inp'
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									id="current-email"
									autoComplete="current-email"
									placeholder="輸入Email">
								</input>
							</div>
							<div className="box">
								<FontAwesomeIcon className="gradient" icon={solid("lock")}/>
								<input
									className='inp'
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									id="current-password"
									autoComplete="current-password"
									placeholder="輸入密碼">
								</input>
							</div>
							<input className='submit-button' type="submit" value="登入帳號"></input>
						</form>
						<div>
							<button onClick={() => {window.location.href = '/resetmail'}}>忘記密碼?</button>
						</div>
						<div className='parent'>
							<h2>還沒註冊過?</h2>
							<button onClick={() => {window.location.href = '/register'}}>
								註冊帳號
							</button>
						</div>
					</div>
				</div>
				) : (
				<div>
					<div className='decoration-box'>
						<Navbar/> 
						<h1>會員資料</h1>
					</div>
					<div className="container">
						<img src={require("../../images/永續清華logo.png")} alt="nthu sdgs logo"></img>
						<form onSubmit={logout}>
							<div>
								<h3>帳號: {user.email} <br/>{user.studentID ? <>學號: {user.studentID}</> : ""}</h3>
								<input className="submit-button" type="submit" value="登出"></input>
							</div>
						</form>
					</div>
				</div>
				)
			} 
		</div>
	)
}

export default LoginPage
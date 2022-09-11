import React, { useEffect, useState } from 'react';
import './auth.css';
import jwtDecode from 'jwt-decode'
import Navbar from '../global/navbar';
import Load from '../global/load';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


function LoginPage() {
	const [loading, setLoading] = useState(true);
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
		setLoading(false);
    }

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const user = jwtDecode(token);
			console.log(user);
			if(!user){
			  alert("Token Invalid")
			  localStorage.removeItem('token');  
			  setLoading(false);
			}else{
			  setSignIn(true);
			  getUser();
			}
		} else {
			setLoading(false);
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
			setEmail('');
			setPassword('');
			alert('Login Successfully');
			window.location.replace('/all');
		} else {
			alert(data.error);
		}
	}

	function logout(event){
		event.preventDefault();
		console.log("User Logout");
		localStorage.removeItem('token');  
		setSignIn(false);
		window.location.href = '/login';
	}
	
	if(loading) return <Load/>;
	return (
		<div className='AuthPage'>
			{!signIn ? (
				<div>
					<div className='header'>
						<h1>登入</h1>
					</div>
					<Navbar/> 
					<div className="container">
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
							<button onClick={() => {window.location.href='/resetmail'}}>忘記密碼?</button>
						</div>
						<div className='options'>
							<h2>還沒註冊過?</h2>
							<button onClick={() => {window.location.href='/register'}}>
								註冊帳號
							</button>
						</div>
					</div>
				</div>
				) : (
				<div>
					<div className='header'>
						<h1>登出</h1>
					</div>
					<Navbar/> 
					<div className="container">
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
import React, { useEffect, useState } from 'react';
import './profile.css';
import jwtDecode from 'jwt-decode'
import Navbar from '../global/navbar';
import Load from '../global/load';


function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const [signIn, setSignIn] = useState(false);
	const [user, setUser] = useState({});
	const [userImg, setUserImg] = useState();
	const [backgroundImg, setBackgroundImg] = useState();

	
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
			  setBackgroundImg(require('../../images/spot/image-not-found.jpg'));
			  setUserImg(require('../../images/user/image-not-found.png'));
			  setLoading(false); 
			}else{
			  setSignIn(true);
			  getUser();
			  setBackgroundImg(require('../../images/spot/旺宏館.jpg'));
			  setUserImg(require('../../images/user/avatar.png'));
			}
		} else {
			setBackgroundImg(require('../../images/spot/image-not-found.jpg'));
			setUserImg(require('../../images/user/image-not-found.png'));
			setLoading(false);
		}
	}, [])

	if(loading) return <Load/>;
	return (
		<div className='ProfilePage'>
			{signIn ? (
				<div>
					<div className='header'>
						<h1>會員資料</h1>
					</div>
					<Navbar/>
					<div className="container">
						<div className='bgimg-container'>
							<img src={backgroundImg} alt="圖片"></img>
						</div>
						<div className='userimg-container'>
							<img src={userImg} alt="圖片"></img>
						</div>
						<h1 className='name'>{user.username}</h1>
						<div className='box-left'>
							<h2>完成的路徑</h2>
							<h3>0</h3>
						</div>
						<div className='box-right'>
							<h2>走過的地點</h2>
							<h3>0</h3>
						</div>
						<div className='info'>
							<h4>帳號: {user.email}</h4>
							{user.studentID &&<h4>學號: {user.studentID}</h4>}
						</div>
					</div>
				</div>
				) : (
				<div>
					<div className='header'>
						<h1>會員資料</h1>
					</div>
					<Navbar/>
					<div className="container">
						<div className='bgimg-container'>
							<img src={backgroundImg} alt="圖片"></img>
						</div>
						<div className='userimg-container'>
							<img src={userImg} alt="圖片"></img>
						</div>
						<h1 className='name'>使用者名稱</h1>
						<div className='box-left'>
							<h2>完成的路徑</h2>
							<h3>0</h3>
						</div>
						<div className='box-right'>
							<h2>走過的地點</h2>
							<h3>0</h3>
						</div>
					</div>
				</div>
				)
			} 
		</div>
	)
}

export default ProfilePage
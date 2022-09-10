import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

function Navbar(){
    const [active, setActive] = useState(false);
    const [signIn, setSignIn] = useState(false);
    const token = localStorage.getItem('token');
    useEffect(() => {
		if (token) {
			const user = jwtDecode(token);
			console.log(user);
			if(!user){
			  localStorage.removeItem('token');  
			}else{
			  console.log("You are a logged in User");
			  setSignIn(true);
			}
		}
	}, [token])

    return (
        <div className="Navbar">
            <div className='navbar-header'>
                <div className="menu-btn" style={active? {'visibility':"hidden"} : {"visibility": 'visible'}} onClick={() => {setActive(true)}}><FontAwesomeIcon icon={solid('bars')} /></div>
            </div>
            <div className={active ? "side-bar active": "side-bar"}>
                <div className="close-btn" onClick={() => {setActive(false)}}><FontAwesomeIcon icon={solid("times")}/></div>
                <div className="menu">
                    <div className="item">
                        <button onClick={() => {window.location.href = '/all'}}>
                            <FontAwesomeIcon icon={solid("globe")}></FontAwesomeIcon>
                            <h1>地點總覽</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/path'}}>
                            <FontAwesomeIcon icon={solid("shoe-prints")}></FontAwesomeIcon>
                            <h1>路徑導覽</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/login'}}>
                            <FontAwesomeIcon icon={solid("user")}></FontAwesomeIcon>
                            <h1>會員資料</h1>
                        </button>
                    </div>
                    {/* <div className="item">
                        <button onClick={() => {window.location.href = '/about'}}>
                            <FontAwesomeIcon icon={solid("compass")}></FontAwesomeIcon>
                            <h1>使用指南</h1>
                        </button>
                    </div> */}
                    <div className="item">
                        <button onClick={() => {window.location.href = '/about'}}>
                            <FontAwesomeIcon icon={solid("info-circle")}></FontAwesomeIcon>
                            <h1>關於計畫</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/contact'}}>
                            <FontAwesomeIcon icon={solid("address-book")}></FontAwesomeIcon>
                            <h1>聯絡我們</h1>
                        </button>
                    </div>
                </div>
                {signIn? 
                    <div className='login-btn' onClick={() => window.location.href = '/login'}>登出</div>
                    :
                    <div className='login-btn' onClick={() => window.location.href = '/login'}>登入</div>
                }
                <div className='footer'>Copyright © 2022 NTHU<br/>All rights reserved</div>
            </div>
        </div>
    );   
}

export default Navbar;
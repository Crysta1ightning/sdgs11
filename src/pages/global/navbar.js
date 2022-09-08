import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import React, { useState } from 'react'

function Navbar(){
    const [active, setActive] = useState(false);
    return (
        <div className="Navbar">
            {/* <div className="menu-btn" style={{visibility: `${active? "visible": "hidden"}`}}><FontAwesomeIcon icon={solid('bars')} /></div> */}
            <div className="menu-btn" style={active? {'visibility':"hidden"} : {"visibility": 'visible'}} onClick={() => {setActive(true)}}><FontAwesomeIcon icon={solid('bars')} /></div>
            <div className={active ? "side-bar active": "side-bar"}>
                <div className="close-btn" onClick={() => {setActive(false)}}><FontAwesomeIcon icon={solid("times")}/></div>
                <div className="menu">
                    <div className="item">
                        <button onClick={() => {window.location.href = '/all'}}>
                            <i><FontAwesomeIcon icon={solid("globe")}></FontAwesomeIcon></i>
                            <h1>地點總覽</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/path'}}>
                            <i><FontAwesomeIcon icon={solid("shoe-prints")}></FontAwesomeIcon></i>
                            <h1>路徑導覽</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/login'}}>
                            <i><FontAwesomeIcon icon={solid("user")}></FontAwesomeIcon></i>
                            <h1>會員資料</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/about'}}>
                            <i><FontAwesomeIcon icon={solid("compass")}></FontAwesomeIcon></i>
                            <h1>使用指南</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/'}}>
                            <i><FontAwesomeIcon icon={solid("info-circle")}></FontAwesomeIcon></i>
                            <h1>關於計畫</h1>
                        </button>
                    </div>
                    <div className="item">
                        <button onClick={() => {window.location.href = '/contact'}}>
                            <i><FontAwesomeIcon icon={solid("address-book")}></FontAwesomeIcon></i>
                            <h1>聯絡我們</h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );   
}

export default Navbar;
import React, { useEffect, useState } from 'react';
import Navbar from '../global/navbar';
import './contact.css';
// import GoogleMapReact from 'google-map-react';

function ContactPage() {
	// disappearable shadow
	const [active, setActive] = useState(false);
	useEffect(() => {
		if(typeof(window) === 'undefined') return;
		window.addEventListener('scroll', pop);
		
		return () => window.removeEventListener('scroll', pop);
	},[]);

	const pop = () => {
		if(typeof(window) === 'undefined') return;
		if (window.pageYOffset > 0) {
			setActive(true);
		}        
		if (window.pageYOffset === 0) {
			setActive(false);
		}
	}

	const contactList = [
		{name: "永續步道", title: "", description: "NTHU Sustainability Trail", gmail: "nthutestsdgs@gmail.com", active: true},
		{name: "區創中心", title: "贊助計畫", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "吳岱蔚", title: "全端網頁製作", gmail: "0830david@gmail.com", active: false},
		{name: "呂庭羽", title: "前端網頁製作", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "宋宇然", title: "UI/UX設計", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "陳佑祥", title: "Google MAP API串接", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "鈞寶", title: "內容提供", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "黃怡禎", title: "內容提供", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "范庭維", title: "內容提供", gmail: "nthutestsdgs@gmail.com", active: false},
		{name: "婉華", title: "協助計畫", gmail: "nthutestsdgs@gmail.com", active: false},
	]
	
	const [activeList, setActiveList] = useState([
		true, false, false, false, false, false, false, false, false, false
	])
	function setIdActive(id) {
		let temp = [...activeList];
		temp[id] = true;
		setActiveList(temp);
	}

	return (
		<div className='ContactPage'>
			<div className={active? 'header header-shadow': 'header'}>
                <h1>聯絡我們</h1>
            </div>
			<Navbar/>
			<div className='contacts'>
				
				{activeList.map((active, id) => {
					let contact = contactList[id];
					return (
						<div key={id}>
						{active?
							<div key={id}>
								<h1>{contact.name}</h1>
								<p>{contact.title}</p>
								<p>{contact.description}</p>
								{contact.gmail && <p>{contact.gmail}</p>}
								{contact.linkedin && <p>{contact.linkedin}</p>}
								{contact.facebook && <p>{contact.facebook}</p>}
							</div>
							:
							<div key={id}>
								<h1>{contact.name}</h1>
								<p>{contact.title}</p>
								
								<div onClick={() => {
									setIdActive(id);
								}}>ACTIVE</div>
							</div>
						}
						</div>
					)
				})}
			</div>
			
		</div>
	)
}

export default ContactPage
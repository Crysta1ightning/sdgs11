import React, { useEffect, useState } from 'react';
import Navbar from '../global/navbar';
import './contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"

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
		if (window.scrollY > 0) {
			setActive(true);
		}        
		if (window.scrollY === 0) {
			setActive(false);
		}
	}

	const contactList = [
		{
			name: "永續步道", title: "計劃本身", description: "NTHU Sustainability Trail",
			gmail: "nthutestsdgs@gmail.com",
			linkedin: "",
			active: true
		},
		{
			name: "區創中心", title: "贊助計畫", description: "Regional Innovation Center",
			gmail: "ric@gapp.nthu.edu.tw",
			linkedin: "",
			active: false
		},
		{
			name: "吳岱蔚", title: "全端網頁製作", description: "資訊工程學系 大三",
			gmail: "0830david@gmail.com", 
			linkedin: "https://www.linkedin.com/in/%E5%B2%B1%E8%94%9A-%E5%90%B3-crystal123",
			linkedinName: "吳岱蔚",
			active: false
		},
		{
			name: "呂庭羽", title: "前端網頁製作", description: "計量財務金融學系 大三",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
		{
			name: "宋宇然", title: "UI/UX設計", description: "經濟學系 大二",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
		{
			name: "陳佑祥", title: "地圖API串接", description: "科技管理學院學士班 大三",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
		{
			name: "鈞寶", title: "內容提供", description: "XX學系 大二",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
		{
			name: "黃怡禎", title: "內容提供", description: "XX學系 大二",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
		{
			name: "范庭維", title: "內容提供", description: "XX學系 大二",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
		{
			name: "婉華", title: "協助計畫", description: "某某單位",
			gmail: "LorenIspum@gmail.com",
			linkedin: "",
			active: false
		},
	]
	
	const [activeList, setActiveList] = useState([
		false, false, false, false, false, false, false, false, false, false
	])
	function setIdActive(id, to) {
		let temp = [...activeList];
		temp[id] = to;
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
						<div className={active? 'contact contact-active': 'contact'} key={id}>
							{active?
								<div key={id}>
									<h1 className='name'>{contact.name}</h1>
									<h2 className='title'>{contact.title}</h2>
									<p className='description'>{contact.description}</p>
									<div className='icons'>
										{contact.gmail && 
											<div className='gmail'>
												<FontAwesomeIcon icon={solid("square-envelope")}/>
												<a href={'mailto: ' + contact.gmail}>{contact.gmail}</a>
											</div>
										}
										{contact.linkedin && 
											<div className='linkedin'>
												<FontAwesomeIcon icon={faLinkedin}/>
												<a href={contact.linkedin} rel="noopener noreferrer" target='_blank'>{contact.linkedinName}</a>
											</div>
										}
									</div>
									<div className='angle' onClick={() => {
										setIdActive(id, false);
									}}><FontAwesomeIcon icon={solid("angle-up")}/></div>
								</div>
								:
								<div key={id} onClick={() => {
									setIdActive(id, true);
								}}>
									<h1 className='name'>{contact.name}</h1>
									<h2 className='title'>{contact.title}</h2>
									{contact.gmail && <div className='gmail'><FontAwesomeIcon icon={solid("square-envelope")}/></div>}
									{contact.linkedin && <div className='linkedin'><FontAwesomeIcon icon={faLinkedin}/></div>}
									<div className='angle' onClick={() => {
										setIdActive(id, false);
									}}><FontAwesomeIcon icon={solid("angle-down")}/></div>
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
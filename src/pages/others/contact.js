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
			name: "永續步道", title: "", description: "NTHU Sustainability Trail",
			gmail: "nthutestsdgs@gmail.com",
		},
		{
			name: "區創中心", title: "", description: "國立清華大學教育館222A辦公室",
			gmail: "ric@gapp.nthu.edu.tw",
			phone: "(+886) 3-571-5131 #33316, #33317"
		},
		{
			name: "吳岱蔚", title: "全端網頁製作", description: "資訊工程學系 大三",
			gmail: "0830david@gmail.com", 
			linkedin: "https://www.linkedin.com/in/%E5%B2%B1%E8%94%9A-%E5%90%B3-crystal123",
			linkedinName: "吳岱蔚",
		},
		{
			name: "呂庭羽", title: "前端網頁製作", description: "計量財務金融學系 大三",
			gmail: "lutinyu@gmail.com",
		},
		{
			name: "宋宇然", title: "UI/UX設計", description: "經濟學系 大二",
			gmail: "a0966033399@gmail.com",
		},
		{
			name: "陳佑祥", title: "地圖API串接", description: "科技管理學院學士班 大三",
			gmail: "bob020416@gmail.com",
		},
		{
			name: "侯鈞寶", title: "內容編輯", description: "材料科學工程學系 大二",
			gmail: "arth347133@gmail.com",
		},
		{
			name: "黃怡禎", title: "內容編輯", description: "材料科學工程學系 大二",
			gmail: "appie4818@gmail.com",
		},
		{
			name: "范庭維", title: "內容編輯", description: "材料科學工程學系 大二",
			gmail: "isabell911119@gmail.com",
		},
	]
	
	const [activeList, setActiveList] = useState([
		false, false, false, false, false, false, false, false, false
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
				<h1 className='cat'>此專案</h1>
				<div className={activeList[0]? 'contact contact-active': 'contact'} key={0}>
					{activeList[0]?
						<div key={0}>
							<h1 className='name'>{contactList[0].name}</h1>
							<h2 className='title'>{contactList[0].title}</h2>
							<p className='description'>{contactList[0].description}</p>
							<div className='icons'>
								{contactList[0].gmail && 
									<div className='gmail'>
										<FontAwesomeIcon icon={solid("square-envelope")}/>
										<a href={'mailto: ' + contactList[0].gmail}>{contactList[0].gmail}</a>
									</div>
								}
							</div>
							<div className='angle' onClick={() => {
								setIdActive(0, false);
							}}><FontAwesomeIcon icon={solid("angle-up")}/></div>
						</div>
						:
						<div key={0} onClick={() => {
								setIdActive(0, true);
							}}>
							<h1 className='name'>{contactList[0].name}</h1>
							<h2 className='title'>{contactList[0].title}</h2>
							{contactList[0].gmail && <div className='gmail'><FontAwesomeIcon icon={solid("square-envelope")}/></div>}
							{contactList[0].linkedin && <div className='linkedin'><FontAwesomeIcon icon={faLinkedin}/></div>}
							<div className='angle' onClick={() => {
								setIdActive(0, false);
							}}><FontAwesomeIcon icon={solid("angle-down")}/></div>
						</div>
					}
				</div>
				<h1 className='cat'>負責單位</h1>
				<div className={activeList[1]? 'contact contact-active': 'contact'} key={1}>
					{activeList[1]?
						<div key={1}>
							<h1 className='name'>{contactList[1].name}</h1>
							<h2 className='title'>{contactList[1].title}</h2>
							<p className='description'>{contactList[1].description}</p>
							<div className='icons'>
								{contactList[1].gmail && 
									<div className='gmail'>
										<FontAwesomeIcon icon={solid("square-envelope")}/>
										<a href={'mailto: ' + contactList[1].gmail}>{contactList[1].gmail}</a>
									</div>
								}
								{contactList[1].phone && 
									<div className='phone'>
										<FontAwesomeIcon icon={solid("square-phone")}/>
										<p>{contactList[1].phone}</p>
									</div>
								}
							</div>
							<div className='angle' onClick={() => {
								setIdActive(1, false);
							}}><FontAwesomeIcon icon={solid("angle-up")}/></div>
						</div>
						:
						<div key={1} onClick={() => {
								setIdActive(1, true);
							}}>
							<h1 className='name'>{contactList[1].name}</h1>
							<h2 className='title'>{contactList[1].title}</h2>
							{contactList[1].gmail && <div className='gmail'><FontAwesomeIcon icon={solid("square-envelope")}/></div>}
							{contactList[1].phone && <div className='phone'><FontAwesomeIcon icon={solid("square-phone")}/></div>}
							<div className='angle' onClick={() => {
								setIdActive(1, false);
							}}><FontAwesomeIcon icon={solid("angle-down")}/></div>
						</div>
					}
				</div>
				<h1 className='cat'>製作團隊</h1>
				{activeList.map((active, id) => {
					if(id < 2) return <></>;
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
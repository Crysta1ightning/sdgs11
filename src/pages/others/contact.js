import React, { useEffect, useState } from 'react';
import Navbar from '../global/navbar';
import './contact.css';
// import GoogleMapReact from 'google-map-react';

function ContactPage() {
	//disappearable shadow
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
	return (
		<div className='ContactPage'>
			<div className={active? 'header header-shadow': 'header'}>
                <h1>聯絡我們</h1>
            </div>
			<Navbar/>
		</div>
	)
}

export default ContactPage
import React from 'react';
import BackKey from '../global/backkey';
import { useParams } from "react-router-dom";
function SpotPage() {
	const { spotID } = useParams();
	async function claim(){
		console.log("Claim: " + spotID);
		if(!localStorage.getItem('token')){
			console.log("User Not Logged In, Redirect to Auth");
			alert("Login before claiming");
			window.location.href = '/login';
			return;
		}
		// fetch API to post a new spot
		const response = await fetch('https://sdgs12.herokuapp.com/api/claim', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			},
			body: JSON.stringify({
				spotID: spotID,
			}),
        })
		const data = await response.json();
		if(data.status === 'fail'){
			console.log("Failed to Claim");
			return;
		}
	}

	return (
		<div className='Spot'>
			<BackKey/>
			Spot Page
			<button onClick={() => {claim()}}>CLAIM</button>
		</div>
	)
}

export default SpotPage
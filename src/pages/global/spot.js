import BackKey from '../global/backkey';
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import './spot.css'
function SpotPage() {
	const { spotID } = useParams();
	const [valid, setValid] = useState(true);
	const [spot, setSpot] = useState({});
	const [userX, setUserX] = useState(0);
    const [userY, setUserY] = useState(0);

	const setFinished = useCallback(async () => {
		console.log("Set Finished");
		if(!localStorage.getItem('token')){
			console.log("User Not Logged In, No Need to Set Finished");
			return;
		}
		// fetch API for finished Spots
		const response = await fetch('https://sdgs12.herokuapp.com/api/spotFinished', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			},
			body: JSON.stringify({
				spotID,
			}),
		});
		const data = await response.json();
		if(data.status === 'fail') {
			console.log("Failed to Set Finished");
            return;
		}
		console.log(data);
		setSpot(prev => ({
            ...prev,
            finished: data.finishedData ? true : false
        }));
	}, [spotID])

	const getSpot = useCallback(async () => {
		// Part I: Get Path
        const response = await fetch('https://sdgs12.herokuapp.com/api/spot', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				spotID,
			}),
        })
		const data = await response.json();
		if(data.status === 'fail'){
			setValid(false);
			console.log("Failed to Get Spot");
			return;
		}
		setSpot(data.spotData);
		setUserX(70);
		setUserY(70);
		setFinished();
    }, [spotID, setFinished]);

	useEffect(() => {
        getSpot();
    }, [getSpot]);

	useEffect(() => {
        console.log("Set New Distance");
		const newDistance = Math.round(Math.sqrt(Math.pow(userX-spot.x, 2) + Math.pow(userY-spot.y, 2)));
		setSpot(prev => ({
            ...prev,
            distance: newDistance
        }));
    }, [userX, userY, spot.x, spot.y]);

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
		setSpot(prev => ({
            ...prev,
            finished: true
        }));
		
	}

	return (
		<div className='SpotPage'>
			{valid? 
				<div>
					<div>
						<BackKey/>
						<h1>{spot.name}{spot.finished? "✅": ""}</h1>
					</div>
					<p>{spot.description}</p>
					{(spot.distance <= 50 && !spot.finished) ? 
						<button onClick={() => {claim(spot.spotID)}}>CLAIM</button> 
						:
						<p>Distance: {spot.distance}m</p>
					} 
					<p>x: {spot.x} y: {spot.y}</p>
					<div>
						<h3>User X: {userX}, User Y: {userY}</h3>
						<button onClick={() => {setUserX(userX+10)}}>User X+</button>
						<button onClick={() => {setUserX(userX-10)}}>User X-</button>
						<button onClick={() => {setUserY(userY+10)}}>User Y+</button>
						<button onClick={() => {setUserY(userY-10)}}>User Y-</button>
					</div>
				</div>
			: (
				<div>
                    <h3>Invalid or Expired URL</h3>
                    <p>If you have any problem with this, please contact us via <a href = "mailto: nthutestsdgs@gmail.com">nthutestsdgs@gmail</a></p>
                </div>
			)}
		</div>
	)
}

export default SpotPage
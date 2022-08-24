import BackKey from '../global/backkey';
import Load from '../global/load';
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import './spot.css'
import '../global/header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

function SpotPage() {
	const { spotID } = useParams();
	const { from } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(true);
	const [spot, setSpot] = useState({});
	const [userX, setUserX] = useState(0);
    const [userY, setUserY] = useState(0);
	const [truncateText, setTruncateText] = useState('');
	const [text, setText] = useState('');
	const [truncate, setTruncate] = useState(true);
	const imgList = [
        {src: require('../../images/spot/大門.png')},
        {src: require('../../images/spot/永續路徑.png')},
        {src: require('../../images/spot/台達館.png')},
        {src: require('../../images/spot/工一.png')},
        {src: require('../../images/spot/台積館.png')},
    ];

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
		var id = -1;
		setText(data.spotData.description.split('\\n').map(
			(str) => {
				id++;
				if(id === 0) return <p key={id}>&emsp;&emsp;{str}</p>
				else return <p key={id}><br/><br/>&emsp;&emsp;{str}</p>
			}
		));
		id = -1;
		setTruncateText(data.spotData.description.substring(0, 120).split('\\n').map(
			(str) => {
				id++;
				if(id === 0) return <p key={id}>&emsp;&emsp;{str}</p>
				else return <p key={id}><br/><br/>&emsp;&emsp;{str}</p>
			}
		));
		setSpot(data.spotData);
		setUserX(70);
		setUserY(70);
		await setFinished();
		setLoading(false);
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

	if(loading) return <Load/>
	return (
		<div className='SpotPage'>
			{valid? 
				<div>
					<div className='header'>
						<BackKey from={from}/>
						{/* <h1>建築介紹</h1> */}

					</div>
					<div className='container'>
						<img src={imgList[0].src} alt="圖片"></img>
					</div>
					<div>
						<div className='title'>
							<h1>{spot.name}{spot.finished? 
								<div className='check'><FontAwesomeIcon icon={regular('check-square')} /></div>
								: 
								<div className='check'><FontAwesomeIcon icon={regular('square')} /></div>}
							</h1>
							<h2>距離: {spot.distance}m</h2>
							{/* <img src={require('../../images/sdgsIcon/4.png')} alt="SDGS icon"></img>  */}
						</div>
						<div className='description'>
							{spot.description && spot.description.length>120?
								(<>{truncate? 
									<div>{truncateText}<p>...</p><button onClick={() => {setTruncate(false)}}>顯示更多</button></div> 
									: 
									<div>{text}<button onClick={() => {setTruncate(true)}}>顯示較少</button></div>
								}</>) 
								:
								<div>{text}</div>
							}
						</div>
						{(spot.distance <= 50 && !spot.finished) ? 
							<button className='claim' onClick={() => {claim(spot.spotID)}}>領取地點</button> 
							:
							<button className='claim' onClick={() => {claim(spot.spotID)}}>領取地點</button> 
						}
						{/* <div className='controller'>
							<h3>User X: {userX}, User Y: {userY}</h3>
							<button onClick={() => {setUserX(userX+10)}}>User X+</button>
							<button onClick={() => {setUserX(userX-10)}}>User X-</button>
							<button onClick={() => {setUserY(userY+10)}}>User Y+</button>
							<button onClick={() => {setUserY(userY-10)}}>User Y-</button>
						</div> */}
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
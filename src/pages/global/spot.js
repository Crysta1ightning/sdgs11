import BackKey from '../global/backkey';
import Load from '../global/load';
import Invalid from './invalid';
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import './spot.css'

function SpotPage() {
	const { spotID } = useParams();
	const { from } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(true);
	const [spot, setSpot] = useState({lat: 0, lng: 0});
	const [userLat, setUserLat] = useState(0);
	const [userLng, setUserLng] = useState(0);
	const [truncateText, setTruncateText] = useState('');
	const [text, setText] = useState('');
	const [truncate, setTruncate] = useState(true);
	const [img, setImg] = useState();
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: "AIzaSyAWGySAUlZ2lcu2S9zt5B852RD6ghn3th8",
	})

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
		setText(data.spotData.description.split('\\n').map(
			(str, id) => {
				if(id === 0) return <p key={id}>&emsp;&emsp;{str}</p>
				else return <p key={id}><br/><br/>&emsp;&emsp;{str}</p>
			}
		));
		if(data.spotData.description.substring(0, 135).includes('\\n')) {
			if(data.spotData.description.substring(0, 135).split('\\n')[0].length > 120) {
				setTruncateText(<p>&emsp;&emsp;{data.spotData.description.substring(0, 135).split('\\n')[0]}</p>);
				console.log(1);
			} else {
				console.log(2);
				setTruncateText(data.spotData.description.substring(0, 100).split('\\n').map(
					(str, id) => {
						if(id === 0) return <p key={id}>&emsp;&emsp;{str}</p>
						else return <p key={id}><br/><br/>&emsp;&emsp;{str}</p>
					}
				))
			}
		} else {
			console.log(3);
			setTruncateText(data.spotData.description.substring(0, 135).split('\\n').map(
				(str, id) => {
					if(id === 0) return <p key={id}>&emsp;&emsp;{str}</p>
					else return <p key={id}><br/><br/>&emsp;&emsp;{str}</p>
				}
			));
		}
		setSpot(data.spotData);
		try {
			setImg(require('../../images/spot/'+data.spotData.name+'.jpg'));
		} catch (err) {
			setImg(require('../../images/spot/image-not-found.jpg'));
		}

		await setFinished();
    }, [spotID, setFinished]);

	useEffect(() => {
        getSpot();
    }, [getSpot]);

	useEffect(() => {
		if(navigator.geolocation){
			if(userLat === 0) return;
			function error() {
				alert('無法取得你的位置');
				setSpot(prev => ({
					...prev,
					distance: "?"
				}));
				setLoading(false);
			}
			async function success(position) {
				if(spot.lat === 0) return;
				const service = new window.google.maps.DistanceMatrixService();
				await service.getDistanceMatrix({
					origins: [{lat: userLat, lng: userLng}],
					destinations: [{lat: spot.lat, lng: spot.lng}],
					travelMode: 'WALKING', // 交通方式：BICYCLING(自行車)、DRIVING(開車，預設)、TRANSIT(大眾運輸)、WALKING(走路)
					unitSystem: window.google.maps.UnitSystem.METRIC, // 單位 METRIC(公里，預設)、IMPERIAL(哩)
					avoidHighways: true, // 是否避開高速公路
					avoidTolls: true // 是否避開收費路線
				}, callback);  
				function callback(response, status){
					setSpot(prev => ({
						...prev,
						distance: response.rows[0].elements[0].distance.value
					}));
					console.log(response.rows[0].elements[0].distance.value);
				}
				setLoading(false);
			}
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			setSpot(prev => ({
				...prev,
				distance: "?"
			}));
			setLoading(false);
		}
    }, [userLat, userLng, spot.lat, spot.lng]);

	
	const getUserLatLng = useCallback(() => {
		// Dummy Fetch
		navigator.geolocation.getCurrentPosition(()=>{}, ()=>{}, {});
		const success = (position) => {
			setUserLat(position.coords.latitude);
			setUserLng(position.coords.longitude);
		}
		const fail = () => {};
		navigator.geolocation.getCurrentPosition(
			success, fail, {
				enableHighAccuracy: true, 
				timeout:10000
			}
		);
	}, [])

	useEffect (() => {
		let interval;
		getUserLatLng();
		interval = setInterval(getUserLatLng, 1000);
		return () => clearInterval(interval);
	}, [getUserLatLng])

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

	if(loading || !isLoaded) return <Load/>;
	if(!valid) return <Invalid/>
	return (
		<div className='SpotPage'>
			<>
				<div className='header'>
					<h1>建築介紹</h1>
				</div>
				<BackKey from={from}/>
				<div className='container'>
					<img src={img} alt="圖片"></img>
				</div>
				<div className='title'>
					<h1>{spot.name}</h1>
					<h2>距離: {
						spot.distance === '?' ? 
						'?'
						: 
						<>{spot.distance >= 1000 ?
							<>{Math.round(spot.distance/100)/10}公里</> 
							:
							<>{spot.distance}公尺</>}
						</>}
					</h2>
					{/* <img src={require('../../images/sdgsIcon/4.png')} alt="SDGS icon"></img>  */}
				</div>
				<div className='description'>
					{spot.description && spot.description.length>135?
						(<>{truncate? 
							<>{truncateText}<p>...</p><button onClick={() => {setTruncate(false)}}>顯示更多</button></> 
							: 
							<>{text}<button onClick={() => {setTruncate(true)}}>顯示較少</button></>
						}</>) 
						:
						<>{text}</>
					}
				</div>
				{spot.finished?
					<button className='claim'>已領取</button>
					:
					<>{spot.distance <= 50? 
						<button className='claim active' onClick={() => {claim(spot.spotID)}}>領取地點</button> 
						:
						<button className='claim inactive'>再靠近一點點</button> 
					}</>
				}
			</>
		</div>
	)
}

export default SpotPage
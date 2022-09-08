import React, { useState, useCallback, useEffect } from 'react'
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import './pathmap.css';
import BackKey from '../global/backkey';
import Load from '../global/load';

function PathMap() {
	const { pathID } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(true);
	// const [debug, setDebug] = useState(true);
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: "AIzaSyAWGySAUlZ2lcu2S9zt5B852RD6ghn3th8",
	})
	// const [map, setMap] = useState(null);
	const containerStyle = {
		width: '100vw',
		height: '100%'
	};  
	const [center, setCenter] = useState({
		lat: 24.795417173319372,
		lng: 120.99469045958209
	});
	const [positions, setPostitions] = useState([]);
	const [directions, setDirections] = useState(false);
	const [snake, setSnake] = useState({
		active: false,
		id: -1,
		name: "",
		lat: 0,
		lng: 0,
	})
	const [userLat, setUserLat] = useState(0);
	const [userLng, setUserLng] = useState(0);

	const onLoad = useCallback( async () => {
		if(pathID === '0') {
			// Part I: Get Spots
			const response = await fetch('https://sdgs12.herokuapp.com/api/all', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			if(data.status === 'fail'){
				setValid(false);
				setLoading(false);
				console.log("Failed to get spots");
				return;
			};
			const spotData = data.spotData;
			setPostitions(spotData);
			var avgLat = 0;
			var avgLng = 0;
			for(var i in spotData) {
				avgLat += spotData[i].lat;
				avgLng += spotData[i].lng;
			}
			avgLat /= spotData.length;
			avgLng /= spotData.length;
			setCenter({
				lat: avgLat,
				lng: avgLng
			})
		} else {
			// Part I: Get Path
			const response = await fetch('https://sdgs12.herokuapp.com/api/path', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					pathID,
				}),
			})
			const data = await response.json();
			if(data.status === 'fail'){
				setValid(false);
				setLoading(false);
				console.log("Failed to Get Path");
				return;
			}

			const pathData = data.pathData;
			console.log("hi" + pathData);
			// setPathName(pathData.name);

			const spotPath = data.spotPath;
			console.log(spotPath);

			// Part II: Get Spots
			var spotIDList = [];
			for(i in spotPath){
				spotIDList.push(spotPath[i].spotID);
			};
			console.log(spotIDList);

			const response2 = await fetch('https://sdgs12.herokuapp.com/api/spotAll', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					spotIDList,
				}),
			})
			const data2 = await response2.json();
			if(data2.status === 'fail'){
				console.log("Failed to Get Spots");
				setValid(false);
				setLoading(false);
				return;
			}
			const spotData = data2.spotData;
			console.log("SpotData: " + spotData[0].lat);
			setPostitions(spotData);
			avgLat = 0;
			avgLng = 0;
			for(i in spotData) {
				avgLat += spotData[i].lat;
				avgLng += spotData[i].lng;
			}
			avgLat /= spotData.length;
			avgLng /= spotData.length;
			setCenter({
				lat: avgLat,
				lng: avgLng
			})

			// Part III: SET PATH
			const google = window.google;
			const directionsService = new google.maps.DirectionsService();
			var waypoints = [];
			for (i=0; i<spotData.length; i++) {
				if(i === 0 || i === spotData.length-1){
					continue;
				}
				waypoints.push({
					location: {lat: spotData[i].lat, lng: spotData[i].lng},
					// location: spotData[i].name,
					// stopover: false
				})
			}
			var request = {
				origin: {lat: spotData[0].lat, lng:spotData[0].lng},
				destination: {lat: spotData[spotData.length-1].lat, lng:spotData[spotData.length-1].lng},
				waypoints: waypoints,
				travelMode: 'WALKING',
				optimizeWaypoints: true
			};

			directionsService.route(request, function (result, status) {
				if (status === 'OK') {
					// directionsDisplay.setDirections(result);
					setDirections(result);
				} else {
					console.log(status);
				}
			});
		}
		setLoading(false);
	}, [pathID])
	
	useEffect(() => {
		onLoad();
	}, [onLoad])

	const getUserLatLng = useCallback(() => {
		// Dummy Fetch
		navigator.geolocation.getCurrentPosition(()=>{}, ()=>{}, {});
		const success = (position) => {
			setUserLat(position.coords.latitude);
			setUserLng(position.coords.longitude);
			// if(debug === false) {
			// 	setUserLat(position.coords.latitude);
			// 	setUserLng(position.coords.longitude);
			// }else {
			// 	setUserLat(u => u-0.00004);
			// 	setUserLng(u => u-0.00004);
			// }
			// setUserLat(24.79581727332000);
			// setUserLng(120.99469045958209);
		}
		const fail = () => {};
		navigator.geolocation.getCurrentPosition(
			success, fail, {
				enableHighAccuracy: true, 
				timeout:10000
			}
		);
	// }, [debug])
	}, []) 

	useEffect (() => {
		let interval;
		interval = setInterval(getUserLatLng, 1000);
		return () => clearInterval(interval);
	}, [getUserLatLng])

	if(loading || !isLoaded) return <Load/>;
	return(
		<div className='PathMap'>
			{true? (
				<>
					{/* <h1>{pathID}</h1> */}
					<div className='backkeybox'>
						<BackKey from={pathID}/>
					</div>
					{/* <div className='debugbox'>
						<button onClick={() => {
							if(!debug){
								setUserLat(24.79581727332000);
								setUserLng(120.99469045958209);	
							}
							setDebug(!debug);
						}}>Debug: {debug? "on" : "off"}</button>
					</div> */}
					{snake.id !== -1?
						<div className={snake.active? 'centerbox centerbox-active': 'centerbox centerbox-inactive'}>
						<div onClick={() => {
							setCenter({
								lat: userLat,
								lng: userLng,
							})
							}}><FontAwesomeIcon icon={solid('location-crosshairs')} /></div>
						</div>
						:
						<div className='centerbox'>
						<div onClick={() => {
							setCenter({
								lat: userLat,
								lng: userLng,
							})
							}}><FontAwesomeIcon icon={solid('location-crosshairs')} /></div>
						</div>
					}
					<div className='map'>
						<GoogleMap
							options={{
								fullscreenControl: false,
								// panControl: true,
								zoomControl: false,
								mapTypeControl: false,
								scaleControl: false,
								streetViewControl: false,
								// overviewMapControl: true,
								// rotateControl: true
							}}
							mapContainerStyle={containerStyle}
							// defaultCenter={center}
							// defaultZoom={15}
							clickableIcons={false}
							center={center}
							zoom={15.5}
						>
							{directions && 
							<DirectionsRenderer 
								directions={directions}
								options={{
									suppressInfoWindows: true,	
									suppressMarkers: true,
									preserveViewport: true
								}}
							/>}
							{positions.map((spot, index) => {
								return (
								<Marker
									key={spot.spotID}
									// https://developers.google.com/maps/documentation/javascript/markers#maps_marker_simple-javascript
									onClick={() => {
										setSnake({id: spot.spotID, name: positions[index].name, active:true, lat:spot.lat, lng:spot.lng})}
									}
									position={{lat:spot.lat, lng:spot.lng}}
									icon={{
										path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
										fillColor: "#6B9080",
										fillOpacity: 0.8,
										scale: 2,
										strokeColor: "white",
										strokeWeight: 2,
									}}
								/>
								)
							})}
							<Marker
								position={{lat: userLat, lng: userLng}}
								// position={{lat: 24.79581727332000, lng: 120.99469045958209}}
								icon={{
									path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
									fillColor: "#365145",
									fillOpacity: 0.9,
									scale: 2,
									strokeColor: "white",
									strokeWeight: 2,
								}}
								zIndex={999}
							/>
							
						</GoogleMap>
					</div>
					{snake.id !== -1?
						<div className={snake.active? 'snake' : 'snake hide'}>
							<div className='title'>{snake.name}</div>
							<div className='detail' onClick={() => {window.location.href='/spot/' + snake.id + '/' + (parseInt(pathID, 10)+100)}}>導覽</div>
							<div className='navigate' onClick={() => {window.location.href='https://maps.google.com/?q='+snake.lat+','+snake.lng}}>導航</div>
							<div className='cancel' onClick={() => {
								setSnake({id: snake.id, name: snake.name, active:false, lat:snake.lat, lng:snake.lng});
							}}><FontAwesomeIcon icon={solid('x')} /></div>
						</div> 
						:
						<></>
					}

				</>
			) : (
				<div>
                    <h3>Invalid or Expired URL</h3>
                    <p>If you have any problem with this, please contact us via <a href = "mailto: nthutestsdgs@gmail.com">nthutestsdgs@gmail</a></p>
                </div>
			)}
		</div>
  	)

}



export default PathMap
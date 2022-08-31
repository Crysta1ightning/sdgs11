import { React, useState, useCallback, useEffect } from 'react'
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import './pathmap.css';
import BackKey from '../global/backkey';
import Load from '../global/load';

function MyComponent() {
	const { pathID } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(true);
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: "AIzaSyAWGySAUlZ2lcu2S9zt5B852RD6ghn3th8",
	})
	const containerStyle = {
		width: '100%',
		height: '100%'
	};  
	const [center, setCenter] = useState({
		lat: 24.795417173319372,
		lng: 120.99469045958209
	});
	const [positions, setPostitions] = useState([]);
	const [directions, setDirections] = useState(false);
	// const [duration, setDuration] = useState([]);
	// const [distance, setDistance] = useState([]);
	const [snake, setSnake] = useState({
		active: false,
		id: 0,
		name: ""
	})

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
					// console.log(result.routes[0].legs[0].steps);
					// directionsDisplay.setDirections(result);
					setDirections(result);
				} else {
					console.log(status);
				}
			});
		}
		setLoading(false);


		// let destinations = [];
		// for (i in spotData) {
		// 	destinations.push({lat: spotData[i].lat, lng: spotData[i].lng});
		// }
		// if(navigator.geolocation){
		// 	function error() {
		// 	  alert('無法取得你的位置');
		// 	}
		// 	function success(position) {
		// 		let originPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		// 		const service = new google.maps.DistanceMatrixService();
		// 		service.getDistanceMatrix({
		// 			origins: [originPosition],
		// 			destinations: destinations,
		// 			travelMode: 'WALKING', // 交通方式：BICYCLING(自行車)、DRIVING(開車，預設)、TRANSIT(大眾運輸)、WALKING(走路)
		// 			unitSystem: google.maps.UnitSystem.METRIC, // 單位 METRIC(公里，預設)、IMPERIAL(哩)
		// 			avoidHighways: true, // 是否避開高速公路
		// 			avoidTolls: true // 是否避開收費路線
		// 		}, callback);  
		// 		var tempduration = [];
		// 		var tempdistance = [];
		// 	  	function callback(response, status){
		// 			for(let i = 0; i < spotData.length; i++){
		// 		  		tempduration.push(response.rows[0].elements[i].duration.text);
		// 				tempdistance.push(response.rows[0].elements[i].distance.text);
		// 			}
		// 			setDuration(tempduration);
		// 			setDistance(tempdistance);
		// 	  	}
		// 	}
		// 	navigator.geolocation.getCurrentPosition(success, error);
		// } else {
		// 	alert('sorry')
		// }
	}, [pathID])
	
	useEffect(() => {
		onLoad();
	}, [onLoad])

	if(loading || !isLoaded) return <Load/>;
	return(
		<div className='PathMap'>
			{valid? (
				<>
					{/* <h1>{pathID}</h1> */}
					<div className='backkeybox'>
						<BackKey from={pathID}/>
					</div>
					
					<div className='map'>
						<GoogleMap
							options={{disableDefaultUI: true}}
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
										setSnake({id: spot.spotID, name: positions[index].name, active:true})}
									}
									position={{lat:spot.lat, lng:spot.lng}}
								/>
								)
							})}
							
						</GoogleMap>
					</div>
					{snake.active && 
					<div className='snake'>
						<div className='goto' onClick={() => {window.location.href='/spot/' + snake.id + '/' + (parseInt(pathID, 10)+100)}}>看看{snake.name}</div>
						<div className='cancel' onClick={() => {setSnake({...{active: false}})}}><FontAwesomeIcon icon={solid('x')} /></div>
					</div>}
				</>
			) : (
				<div>
                    <h3>Invalid or Expired URL</h3>
                    <p>If you have any problem with this, please contact us via <a href = "mailto: nthutestsdgs@gmail.com">nthutestsdgs@gmail</a></p>
                </div>
			)}
		</div>
		/* <div>Duration:{duration}</div>
		<div>Distance:{distance}</div> */
  	)

}



export default MyComponent
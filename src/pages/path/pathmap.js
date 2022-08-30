import { React, useState, useCallback, useEffect } from 'react'
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useParams } from "react-router-dom";
import './pathmap.css';
import BackKey from '../global/backkey';

function MyComponent() {
	const { pathID } = useParams();
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
	const [directions, setDirections] = useState();
	// const [duration, setDuration] = useState([]);
	// const [distance, setDistance] = useState([]);
	const [snake, setSnake] = useState({
		active: false,
		id: 0,
	})

	useEffect(() => {
		const arr = [
			{spotID:0, name:'旺宏館',lat:24.795417173319372,lng:120.99469045958209},
			{spotID:1, name:'成功湖',lat:24.793429,lng:120.994480},
			{spotID:2, name:'荷塘',lat:24.790670, lng:120.992392},
			{spotID:3, name:'奕園',lat:24.788057,lng:120.990741},
			{spotID:4, name:'綠能大樓－李存敏館',lat:24.790936, lng:120.991469},
			{spotID:5, name:'清華實驗室',lat:24.786139,  lng:120.989577},
			{spotID:6, name:'創新育成中心',lat:24.786412, lng:120.989103},
			{spotID:7, name:'台積館',lat:24.786749, lng:120.988344},
			{spotID:8, name:'蝴蝶園',lat:24.790530,  lng:120.988455},
			{spotID:9, name:'相思湖',lat:24.791497, lng:120.989957},
			{spotID:10, name:'梅園',lat:24.792494, lng:120.990043},
			{spotID:11, name:'校友體育館',lat:24.795108,lng:120.989808}
		]
		setPostitions(arr);
		var avgLat = 0;
		var avgLng = 0;
		for(var i in arr) {
			avgLat += arr[i].lat;
			avgLng += arr[i].lng;
		}
		avgLat /= arr.length;
		avgLng /= arr.length;
		setCenter({
			lat: avgLat,
			lng: avgLng
		})

	}, [])

	const onLoad = useCallback( () => {
		if(pathID === '0') return;
		const google = window.google;
		const directionsService = new google.maps.DirectionsService();
		var waypoints = [];
		for (var i=0; i<positions.length; i++) {
			if(i === 0 || i === positions.length-1){
				continue;
			}
			waypoints.push({
				location: {lat: positions[i].lat, lng: positions[i].lng},
				// location: positions[i].name,
				// stopover: false
			})
		}
		var request = {
			origin: {lat:24.795417173319372,lng:120.99469045958209},
			destination: positions[positions.length-1].name,
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


		// let destinations = [];
		// for (i in positions) {
		// 	destinations.push({lat: positions[i].lat, lng: positions[i].lng});
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
		// 			for(let i = 0; i < positions.length; i++){
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
	}, [positions, pathID])

	function showBox (e) {
		console.log("clicked Lat: " + e.latLng.lat() + "Lng: " + e.latLng.lng());
	}

  	if(!isLoaded) return <div>Loading...</div>
	return(
		<div className='PathMap'>
			{/* <h1>{pathID}</h1> */}
			<BackKey from={pathID}/>
			<div className='map'>
				<GoogleMap
					options={{disableDefaultUI: true}}
					mapContainerStyle={containerStyle}
					// defaultCenter={center}
					// defaultZoom={15}
					clickableIcons={false}
					center={center}
					zoom={15.5}
					onLoad={onLoad}
					onClick={(e) => {showBox(e)}}
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
					{positions.map((spot) => {
						return (
						<Marker
							key={spot.spotID}
							// https://developers.google.com/maps/documentation/javascript/markers#maps_marker_simple-javascript
							onClick={() => {setSnake({id: spot.spotID, active:true})}}
							position={{lat:spot.lat, lng:spot.lng}}
						/>
						)
					})}
					
				</GoogleMap>
			</div>
			{snake.active && 
			<div className='snake' onClick={() => {window.location.href='/spot/' + snake.id + '/' + (parseInt(pathID, 10)+100)}}>
				<div className='goto'>看看{positions[snake.id].name}</div>
				<div className='cancel' onClick={() => {setSnake({...{active: false}})}}>X</div>
			</div>}
		</div>
	
		/* <div>Duration:{duration}</div>
		<div>Distance:{distance}</div> */
  	)
	
}



export default MyComponent